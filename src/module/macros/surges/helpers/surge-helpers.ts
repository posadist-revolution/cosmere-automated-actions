import { MODULE_ID } from "@src/module/constants";
import { CosmereItem, CosmereActor, CosmereActiveEffect } from "@src/declarations/cosmere-rpg/documents";

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

export async function useCanceled(item: CosmereItem, actor: CosmereActor){
    let currentInv = actor.system.resources.inv.value;
    const newInv = currentInv + 1;
    actor.update({ 'system.resources.inv.value': newInv } as any);
}

export async function getInfusionInvestiture(item: CosmereItem, actor: CosmereActor){
    // Available investiture is current + 1
    let availableInv = actor.system.resources.inv.value + 1;
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
    actor.update({ 'system.resources.inv.value': newInv } as any);
    return infusedInvestiture;
}

//
export async function expendInvestiture(effect: CosmereActiveEffect, round: number, skillRank: number = 1, extended?: boolean): Promise<boolean>{
    let investitureRemaining = effect.getFlag(MODULE_ID, "infusion_inv_remaining");
    let newInvRemaining = investitureRemaining;
    if(extended){
        let roundsSinceEffectCreated = round - effect.duration.startRound!;
        if(roundsSinceEffectCreated % skillRank == 0 && round > effect.duration.startRound!){
            newInvRemaining--;
        }
    }
    else{
        newInvRemaining--;
    }

    if(newInvRemaining == 0){
        return false;
    }
    else if(newInvRemaining != investitureRemaining){
        let nameString = effect.name.replace(`(${investitureRemaining} inv left)`, `(${newInvRemaining} inv left)`);
        await effect.update({
            name: nameString,
            flags:{
                [MODULE_ID]:{
                    infusion_inv_remaining: newInvRemaining
                }
            }
        });
    }
    return true;
}

export function getSurgeTalents(actor: CosmereActor, surgePower: string): CosmereItem[]{
    //@ts-ignore
    return actor.items.filter(i=> i.type === "talent" && i.system.power == surgePower);
}