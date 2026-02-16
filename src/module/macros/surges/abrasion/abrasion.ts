import { MODULE_ID, MODULE_NAME } from "@src/module/constants";
import { giveActorItem } from "@src/module/utils/helpers";
import { CosmereItem, CosmereActor, CosmereActiveEffect } from "@src/declarations/cosmere-rpg/documents";
import { getInfusionInvestiture, getSurgeTalents, useCanceled } from "../helpers/surge-helpers";
import { ABR } from "./talent-ids";

//#region Effect Create Data
const abrasionInfusionEffectDefaultCreateData: ActiveEffect.CreateData = {
    name:`Abrasion Infusion`,
    img: "icons/magic/control/debuff-energy-snare-blue.webp",
    disabled: false,
    duration: {
        "rounds": 1,
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
    description: "Abrasion Infusion",
    sort: 0,
    transfer: true,
    flags: {
        [MODULE_ID]: {
            start_turn_id: ABR.ABRASION_INFUSION
        }
    }
};
//#endregion

// MACROS
//#region Macro Functions
export async function abrasion(item: CosmereItem, actor: CosmereActor){
    //TODO: Don't let actors with the Smooth Operator talent infuse themselves
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Abrasion" },
        content: "<p>What would you like to infuse?</p>",
        buttons:
        [{
            label: "Object or Surface",
            action: "object",
            callback: async () => {applyAbrasionInfusion(item, actor)}
        },
        {
            label: "Self",
            action: "self",
            callback: async () => {applySelfAbrasionInfusion(item, actor)}
        }]
    })
};

export async function cancelSelfAbrasion(item: CosmereItem, actor: CosmereActor){
    //finds items from target and caster and deletes it
    for(const effectUuid of item.getFlag(MODULE_ID, "effectsUuids")){
        const effectToDelete = await fromUuid(effectUuid) as CosmereActiveEffect;
        effectToDelete.delete();
    }
    actor.items.getName("Skate")?.delete();
    item.delete();
}

export async function selfAbrasionTurnStart(cancelItem: CosmereItem, actor: CosmereActor, turn: Combat.HistoryData){
    //TODO: Check if this is a boss turn before decrementing remaining investiture
    let currInv = actor.system.resources.inv.value;

    if(currInv == 0){
        cancelSelfAbrasion(cancelItem, actor);
    }
    else{
        //TODO: Prompt if actor wants to continue infusion
        actor.update({ 'system.resources.inv.value': currInv-1 } as any);
    }
}
//#endregion

// INVESTITURE CHANGE EFFECTS
//#region Inv Change Effects
export async function selfAbrasionWhenInvested(actor: CosmereActor){
    let abrasionTalents = getSurgeTalents(actor, "abr");
    let frictionlessMotion = false;
    for(const talent of abrasionTalents){
        // TODO: Talents that need handling:
        // Frictionless Motion
        // Slick combatant?
        if(talent.system.id == ABR.FRICTIONLESS_MOTION){
            frictionlessMotion = true;
        }
    }
    const skateUUID = "Compendium.cosmere-automated-actions.caaactions.Item.b39iL8GICQx7fUr3";
    const skate = await giveActorItem(actor, skateUUID)
    if(skate){
        // We only get here if we have smooth operator, so make that change here
        skate.update({
            //@ts-ignore
            system: {
                activation: {
                    consume:[{
                        value: {
                            actual: skate.system.activation.consume[0].value.actual - 1,
                            min: skate.system.activation.consume[0].value.min - 1,
                            max: skate.system.activation.consume[0].value.max - 1
                        }
                    }]
                }
            }
        });
    }

    let abrasionInfusionEffectCreateData = selfAbrasionEffectCreateData(frictionlessMotion);

    // If actor is always infused with abrasion when invested, we don't need to do anything on turn start,
    // but we do need to do something when we run out of investiture
    abrasionInfusionEffectCreateData.flags = {
        [MODULE_ID]: {
            no_inv_id: ABR.SMOOTH_OPERATOR
        }
    };

    const abrasionInfusionEffect = await ActiveEffect.create(abrasionInfusionEffectCreateData, {parent: actor});
}

export async function selfAbrasionCancelInvEmpty(actor: CosmereActor){
    actor.effects.getName("Abrasion Infusion")?.delete();
    actor.items.getName("Skate")?.delete();
}
//#endregion

// HELPERS
//#region Helpers
async function applyAbrasionInfusion(item: CosmereItem, actor: CosmereActor){
    //TODO
}
async function applySelfAbrasionInfusion(item: CosmereItem, actor: CosmereActor){

    //Adds "Skate" item to caster
    const skateUUID = "Compendium.cosmere-automated-actions.caaactions.Item.b39iL8GICQx7fUr3";
    const cancelSelfAbrasionCasterUUID = "Compendium.cosmere-automated-actions.caaactions.Item.l4azK3bv7GZcsZIv";
    const cancelSelfAbrasionCaster = await giveActorItem(actor, cancelSelfAbrasionCasterUUID);
    const skate = await giveActorItem(actor, skateUUID)
    let abrasionTalents = getSurgeTalents(actor, "abr");
    let frictionlessMotion = false;
    for(const talent of abrasionTalents){
        // TODO: Talents that need handling:
        // Smooth Operator
        // Frictionless Motion
        // Slick combatant?

        if(talent.system.id == ABR.SMOOTH_OPERATOR && skate){
            skate.system.activation.consume[0].value.actual -= 1;
        }
        else if(talent.system.id == ABR.FRICTIONLESS_MOTION){
            frictionlessMotion = true;
        }
    }
    let abrasionInfusionEffectCreateData = selfAbrasionEffectCreateData(frictionlessMotion);

    if(cancelSelfAbrasionCaster) {
        abrasionInfusionEffectCreateData.origin = cancelSelfAbrasionCasterUUID;

        const abrasionInfusionEffect = await ActiveEffect.create(abrasionInfusionEffectCreateData, {parent: cancelSelfAbrasionCaster});
        cancelSelfAbrasionCaster.setFlag(MODULE_ID, "effectsUuids", [abrasionInfusionEffect?.uuid!]);
    }
}

function selfAbrasionEffectCreateData(frictionlessMotion: boolean): ActiveEffect.CreateData{
    var abrasionInfusionEffectCreateData: ActiveEffect.CreateData = foundry.utils.deepClone(abrasionInfusionEffectDefaultCreateData);
    if(frictionlessMotion){
        abrasionInfusionEffectCreateData.changes = [
            {
                key: "system.movement.walk.rate.bonus",
                mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                value: "10"
            }
        ];
    }
    return abrasionInfusionEffectCreateData;
}
//#endregion