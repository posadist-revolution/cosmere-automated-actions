import { CosmereActiveEffect, CosmereActor, CosmereItem } from "@system/documents";
import { getFirstTarget, giveActorItem } from "../../../utils/helpers";
import { MODULE_ID } from "@src/module/constants";
import { sizes } from "../helpers/surge-helpers";
import { startTurnEffectMap, endTurnEffectMap } from "@src/module/macros/maps";


export async function progression(item: CosmereItem, actor: CosmereActor){
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Progression" },
        content: "<p>Which skill would you like to use?</p>",
        buttons:
        [{
            label: "Plant Growth",
            action: "plant growth",
            callback: async () => {applyPlantGrowthInfusion(item, actor)}
        },
        {
            label: "Character Regrowth",
            action: "character regrowth",
            callback: async () => {applyRegrowthInfusion(item, actor)}
        }]
    })
};

export async function cancelCharacterRegrowth(item: CosmereItem, actor: CosmereActor){
    //finds items from target and caster and deletes it
    for(const effectUuid of item.getFlag(MODULE_ID, "effectsUuids")){
        const effectToDelete = await fromUuid(effectUuid) as CosmereActiveEffect;
        effectToDelete.delete();
    }
    item.delete();
}

export async function characterRegrowthStartTurn(effect: CosmereActiveEffect, turn: Combat.HistoryData){
    const casterCancelItemUUID = effect.origin;
    const targetActor = effect.parent as CosmereActor;
    const casterCancelItem = await fromUuid(casterCancelItemUUID) as CosmereItem;
    const casterActor = casterCancelItem.parent as CosmereActor;
    if((!targetActor) || (!casterActor)){
        // TODO: We couldn't handle resolving the target or caster UUID
        return;
    }

    //heals target
    const rollData = casterActor.getRollData();
    let r = await new Roll("@scalar.power.prg.die", rollData).evaluate();
    await r.toMessage({
        content: `${casterActor.name} heals ${targetActor.name}`,
    })
    const targetHealth = targetActor.system.resources.hea.value;
    const newHealth = targetHealth + r.total;
    await targetActor.update({ 'system.resources.hea.value': newHealth } as any);
}

export async function characterRegrowthEndTurn(effect: CosmereActiveEffect, turn: Combat.HistoryData){
    //TODO: Check if this is a boss turn before decrementing remaining investiture
    let investitureRemaining = effect.getFlag(MODULE_ID, "infusion_inv_remaining");
    let casterCancelItemUUID = effect.origin;
    const casterCancelItem = await fromUuid(casterCancelItemUUID) as CosmereItem;
    const casterActor = casterCancelItem.parent as CosmereActor;
    let hasExtendedRegrowth = false;
    console.log("Removing investiture from regrowth infusion");
    console.log(`Investiture remaining: ${investitureRemaining}`);
    for(const talent of casterActor.talents){
        if(talent.system.id.includes("extended") && talent.system.id.includes("regrowth")){
            hasExtendedRegrowth = true;
        }
    }
    let newInvRemaining = investitureRemaining;
    if(hasExtendedRegrowth){
        let roundsSinceEffectCreated = turn.round! - effect.duration.startRound!;
        if(roundsSinceEffectCreated % casterActor.system.skills.prg.rank == casterActor.system.skills.prg.rank - 1){
            newInvRemaining--;
        }
    }
    else{
        newInvRemaining--;
    }

    if(newInvRemaining == 0){
        const casterCancelItem = await fromUuid(effect.origin) as CosmereItem;
        cancelCharacterRegrowth(casterCancelItem, casterActor);
    }
    else if(newInvRemaining != investitureRemaining){
        effect.update({
            name: `Regrowth Infusion (${newInvRemaining} inv left)`,
            flags:{
                [MODULE_ID]:{
                    infusion_inv_remaining: newInvRemaining
                }
            }
        })
    }
}

async function applyPlantGrowthInfusion(item: CosmereItem, actor: CosmereActor){
    const target = getFirstTarget();
    const actorProgressionRank = actor.system.skills.prg.rank;
    //Creates array of buttons based on actor progression rank
    let plantGrowthButtons = [];
    switch (actorProgressionRank){
        default:
        case 5:
            plantGrowthButtons.unshift({
                label: "Gargantuan",
                action: "gargantuan"
            });
        case 4:
            plantGrowthButtons.unshift({
                label: "Huge",
                action: "huge"
            });
        case 3:
            plantGrowthButtons.unshift({
                label: "Large",
                action: "large"
            });
        case 2:
            plantGrowthButtons.unshift({
                label: "Medium",
                action: "medium"
            });
        case 1:
            plantGrowthButtons.unshift({
                label: "Small",
                action: "small"
            });
        break;
    }
    const plantGrowthDialog = await foundry.applications.api.DialogV2.wait({
        window:{ title: "Plant Growth"},
        content: "How large would you like to grow the plant?",
        buttons: plantGrowthButtons
    })
    // Changes size of targeted token to the output of plantGrowthDialog
    if(target && plantGrowthDialog){
        await target.document.update(sizes[plantGrowthDialog]);
    };
}

async function applyRegrowthInfusion(item: CosmereItem, actor: CosmereActor){
    const target = getFirstTarget();
    const caster = actor
    if(!target){
        ui.notifications?.warn("Needs target");
        useCanceled(item, actor);
        return;
    }
    let infusedInvestiture = await getInfusionInvestiture(item, actor);

    //Adds "Cancel Regrowth" item to caster
    const cancelRegrowthCasterUUID = "Compendium.cosmere-automated-actions.caaactions.Item.LNAzM5dFOJ4fqqdL";
    const cancelRegrowthCaster = await giveActorItem(actor, cancelRegrowthCasterUUID)
    if(cancelRegrowthCaster) {
        cancelRegrowthCaster.setFlag(MODULE_ID, "target", target.actor?.uuid!);
        cancelRegrowthCaster.setFlag(MODULE_ID, "caster", caster.uuid);

        //Adds "Regrowth Infusion" item to target
        const regrowthInfusionEffectCreateData: ActiveEffect.CreateData = {
            name:`Regrowth Infusion (${infusedInvestiture} inv left)`,
            img: "icons/magic/life/cross-beam-green.webp",
            disabled: false,
            duration: {
                "rounds": infusedInvestiture,
                "startTime": null,
                "seconds": null,
                "combat": null,
                "turns": null,
                "startRound": null,
                "startTurn": null
            },
            type: "base",
            //@ts-ignore
            system: {
                "isStackable": false,
                "stacks": null
            },
            description: "Regrowth Infusion",
            origin: cancelRegrowthCaster.uuid,
            sort: 0,
            flags: {
                [MODULE_ID]: {
                    infusion_inv_remaining: infusedInvestiture,
                    start_turn_id: "regrowth-infusion",
                    end_turn_id: "regrowth-infusion"
                }
            }
        };
        const regrowthInfusionEffect = await ActiveEffect.create(regrowthInfusionEffectCreateData, {parent: target.actor});
        cancelRegrowthCaster.setFlag(MODULE_ID, "effectsUuids", [regrowthInfusionEffect?.uuid!]);
    }
}

async function useCanceled(item: CosmereItem, actor: CosmereActor){
    let currentInv = actor.system.resources.inv.value;
    const newInv = currentInv + 1;
    actor.update({ 'system.resources.inv.value': newInv } as any);
}

async function getInfusionInvestiture(item: CosmereItem, actor: CosmereActor){
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