import { MODULE_ID, SYSTEM_ID } from "@src/module/constants";
import { CosmereItem, CosmereActor, CosmereActiveEffect, MESSAGE_TYPES } from "@src/declarations/cosmere-rpg/documents";

export const SurgeScalingTable = [
    {
        size: "small",
    },
    {
        size: "medium",
    },
    {
        size: "large",
    },
    {
        size: "huge",
    },
    {
        size: "gargantuan",
    }
]

export interface SizeInterface {
    width: number,
    height: number,
    "texture.scaleX": number,
    "texture.scaleY": number
}

export const sizes: Record<string, SizeInterface> = {
    small: { width: 1, height: 1, "texture.scaleX": 0.75, "texture.scaleY": 0.75 },
    medium: { width: 1, height: 1, "texture.scaleX": 1, "texture.scaleY": 1 },
    large: { width: 2, height: 2, "texture.scaleX": 1, "texture.scaleY": 1 },
    huge: { width: 3, height: 3, "texture.scaleX": 1, "texture.scaleY": 1 },
    gargantuan: { width: 4, height: 4, "texture.scaleX": 1, "texture.scaleY": 1 },
};

// Refunds the investiture spent when the action was used
export async function useCanceled(item: CosmereItem, actor: CosmereActor, refund: number = 1){
    let currentInv = actor.system.resources.inv.value;
    const newInv = currentInv + refund;
    await actor.update({ 'system.resources.inv.value': newInv } as any);
}

// Investiture the system already took when the action was used (3.x actions with consumption configured)
export function getConsumedInvestiture(options?: CosmereItem.UseOptions): number {
    return (options?.consumeResponse ?? [])
        .filter(consumption => consumption.type === "resource" && consumption.resource === "inv")
        .reduce((total, consumption) => total + consumption.value.actual, 0);
}

export async function getInfusionInvestiture(item: CosmereItem, actor: CosmereActor, alreadySpent: number = 1){
    // Available investiture includes what the action already spent
    let availableInv = actor.system.resources.inv.value + alreadySpent;
    let promptConfig: foundry.applications.api.DialogV2.PromptConfig = {
        window: { title: "How much inv to infuse?" },
        content: `<input name="infusion" type="range" min="1" max="${availableInv}" step="1" autofocus>`,
        ok: {
            label: "Submit",
            // @ts-ignore
            callback: (event, button, dialog) => button.form?.elements.infusion.valueAsNumber
        }
    }
    let infusedInvestiture = await foundry.applications.api.DialogV2.prompt(promptConfig) as number;
    let newInv = availableInv - infusedInvestiture;
    await actor.update({ 'system.resources.inv.value': newInv } as any);
    return infusedInvestiture;
}

//
// Returns false when the infusion is over (out of investiture, or the effect is already gone)
export async function expendEffectInvestiture(effect: CosmereActiveEffect | null, round: number, skillRank: number = 1, extended?: boolean): Promise<boolean>{
    if(!effect){
        return false;
    }
    // Infusions created before start_round was tracked fall back to core's duration data
    const startRound = effect.getFlag(MODULE_ID, "start_round") ?? effect.duration.startRound ?? 0;
    // Never expend on the round the infusion was created, or twice in one round
    // (boss turns, re-activating a combatant, or stepping the tracker back and forth)
    if(round <= startRound || effect.getFlag(MODULE_ID, "last_drain_round") === round){
        return true;
    }
    if(extended && (round - startRound) % skillRank != 0){
        return true;
    }
    return await spendEffectInvestiture(effect, round);
}

// Spends one investiture from an infusion. Returns false when it has run out
export async function spendEffectInvestiture(effect: CosmereActiveEffect, round: number): Promise<boolean>{
    const investitureRemaining = effect.getFlag(MODULE_ID, "infusion_inv_remaining");
    const newInvRemaining = investitureRemaining - 1;
    await expendEffectInvestitureMessage(effect);
    if(newInvRemaining <= 0){
        return false;
    }
    const nameString = effect.name.replace(`(${investitureRemaining} inv left)`, `(${newInvRemaining} inv left)`);
    await effect.update({
        name: nameString,
        flags:{
            [MODULE_ID]:{
                infusion_inv_remaining: newInvRemaining,
                last_drain_round: round
            }
        }
    });
    return true;
}
async function expendEffectInvestitureMessage(effect: CosmereActiveEffect){

    var actor: CosmereActor;
    let origin = await fromUuid(effect.origin);
    if(!origin){
        actor = effect.parent as CosmereActor;
    }
    else if(origin instanceof (CONFIG.Actor.documentClass as any)){
        actor = origin as CosmereActor;
    }
    else if(origin.parent instanceof (CONFIG.Actor.documentClass as any)){
        actor = origin.parent as CosmereActor;
    }
    else{
        // Could not find the actor who created this effect, something is wrong
        return;
    }
    const messageConfig = {
        user: game.user?.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        rolls: [] as foundry.dice.Roll[],
        flags: {} as Record<string, unknown>,
    };
    messageConfig.flags[SYSTEM_ID] = {
        message: {
            type: MESSAGE_TYPES.ACTION,
            description: `<p>Expending investiture from ${effect.name} on ${effect.parent?.name}</p>`
        }
    }
    await ChatMessage.create(messageConfig);
}

export function getSurgeTalents(actor: CosmereActor, surgePower: string): CosmereItem[]{
    //@ts-ignore
    return actor.talents.filter(i => i.system.power == surgePower);
}

export function getAbilityDescription(itemDescription: string, abilityString: string){
    let paragraphs = itemDescription.split("</p>");
    for(var paragraph of paragraphs){
        if(paragraph.includes(abilityString)){
            return (paragraph + "</p>");
        }
    }
    return "";
}