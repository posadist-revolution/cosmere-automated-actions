import { CosmereItem, CosmereActor, CosmereActiveEffect } from "@system/documents";
import { getFirstTarget, giveActorItem, log } from "@module/utils/helpers";
import { GRV } from "./talent-ids";
import { getSurgeTalents, expendInvestiture, useCanceled, getInfusionInvestiture } from "../helpers/surge-helpers";
import { MODULE_ID } from "@src/module/constants";

//#region Effect Create Data
const gravitationInfusionFriendlyEffectDefaultCreateData: ActiveEffect.CreateData = {
    name:`Basic lashing`,
    img: "icons/magic/earth/projectile-stone-ball-blue.webp",
    disabled: false,
    duration: {
        "rounds": 1, //infusedInvestiture,
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
    description: "Basic Lashing",
    // origin: cancelGravitationCaster.uuid,
    sort: 0,
    flags: {
        [MODULE_ID]: {
            // infusion_inv_remaining: infusedInvestiture,
            start_turn_id: GRV.GRAVITATION_INFUSION,
        }
    },
    changes: [
        // {
        //     key: "system.movement.fly.rate.bonus",
        //     mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        //     value: "25"
        // }
    ]
};

const gravitationInfusionNonfriendlyEffectDefaultCreateData: ActiveEffect.CreateData = {
    name:`Basic lashing`,
    img: "icons/magic/earth/projectile-stone-ball-blue.webp",
    disabled: false,
    duration: {
        "rounds": 1, //infusedInvestiture,
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
    description: "Basic Lashing",
    // origin: cancelGravitationCaster.uuid,
    sort: 0,
    flags: {
        [MODULE_ID]: {
            // infusion_inv_remaining: infusedInvestiture,
            start_turn_id: GRV.GRAVITATION_INFUSION,
        }
    }
};
//#endregion

// MACROS
//#region Macro Functions

export async function gravitation(item: CosmereItem, actor: CosmereActor){
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Gravitation" },
        content: "<p>Which would you like to target?</p>",
        buttons:
        [{
            label: "Ally",
            action: "ally",
            callback: async () => {applyFriendlyGravitationInfusion(item, actor)}
        },
        {
            label: "Enemy",
            action: "Enemy",
            callback: async () => {
                const target = getFirstTarget();
                if(!target){
                    ui.notifications?.warn("Needs target");
                    useCanceled(item, actor);
                    return;
                }
                //Perform a gravitation test against physical defense
                let roll = await actor.rollSkill("grv");
                //If roll fails, return
                if(roll.total < target.actor?.system.defenses.phy.value!){
                    return;
                }
                // Adds "Dismiss Lashing" to user
                // Nothing else happens RAW, because more than 1 investiture cannot be infused into enemies
            }
        },
        {
            label: "Object",
            action: "object",
            callback: async () => {
                const dismissLashingUUID = "Compendium.cosmere-automated-actions.caaactions.Item.TcddNgIyb1GGZGXn";
                const dismissLashing = await giveActorItem(actor, dismissLashingUUID);
                dismissLashing?.setFlag("cosmere-automated-actions", "target", "item");
                dismissLashing?.setFlag("cosmere-automated-actions", "caster", actor.uuid);
            }
        },
        {

            label: "Self",
            action: "self",
            callback: async () => {applySelfGravitationInfusion(item, actor)}
        }
    ]
    })
}

export async function cancelGravitationInfusion(cancelItem: CosmereItem, actor: CosmereActor){
    //finds items from target and caster and deletes it
    for(const effectUuid of cancelItem.getFlag(MODULE_ID, "effectsUuids")){
        const effectToDelete = await fromUuid(effectUuid) as CosmereActiveEffect;
        effectToDelete.delete();
    }
    cancelItem.delete();
}
//#endregion

// START TURN EFFECTS
//#region Start Turn Effects

export async function gravitationTurnStart(cancelItem: CosmereItem, actor: CosmereActor, turn: Combat.HistoryData){
    for(const effectUuid of cancelItem.getFlag(MODULE_ID, "effectsUuids")){
        if(effectUuid.includes(actor.uuid)){
            selfGravitationTurnStart(cancelItem, actor, turn);
        }
        else{
            characterGravitationExpendInvestiture(cancelItem, actor, turn);
        }
    }
}

async function selfGravitationTurnStart(cancelItem: CosmereItem, actor: CosmereActor, turn: Combat.HistoryData){
    //TODO: Check if this is a boss turn before decrementing remaining investiture
    let currInv = actor.system.resources.inv.value;

    if(currInv == 0){
        cancelGravitationInfusion(cancelItem, actor);
    }
    else{
        //TODO: Prompt if actor wants to continue infusion
        actor.update({ 'system.resources.inv.value': currInv-1 } as any);
    }
}

async function characterGravitationExpendInvestiture(item: CosmereItem, actor: CosmereActor, turn: Combat.HistoryData){
    //TODO: Check if this is a boss turn before decrementing remaining investiture
    const effectsUUIDs = item.flags[MODULE_ID]?.effectsUuids
    for(const effectUUID of effectsUUIDs!){
        let effect = await fromUuid(effectUUID) as CosmereActiveEffect;

        if(!await expendInvestiture(effect, turn.round!)){
            cancelGravitationInfusion(item, actor);
        }
    }
}

//#endregion

// INVESTITURE CHANGE EFFECTS
//#region Inv Change Effects

export async function selfGravitationWhenInvested(actor: CosmereActor){
    let gravitationInfusionEffectCreateData = await getFriendlyGravitationEffectCreateData(actor);

    // If actor is always infused with abrasion when invested, we don't need to do anything on turn start,
    // but we do need to do something when we run out of investiture
    gravitationInfusionEffectCreateData.flags = {
        [MODULE_ID]: {
            no_inv_id: GRV.MASTER_OF_THE_SKIES
        }
    };

    const gravitationInfusionEffect = await ActiveEffect.create(gravitationInfusionEffectCreateData, {parent: actor});
}

export async function selfGravitationCancelInvEmpty(actor: CosmereActor){
    actor.effects.getName("Basic lashing")?.delete();
}
//#endregion

// HELPERS
//#region Helpers
async function applyFriendlyGravitationInfusion(item: CosmereItem, actor: CosmereActor){
    const target = getFirstTarget();
    if(!target){
        ui.notifications?.warn("Needs target");
        useCanceled(item, actor);
        return;
    }
    const caster = actor
    if(!target){
        ui.notifications?.warn("Needs target");
        useCanceled(item, actor);
        return;
    }
    let infusedInvestiture = await getInfusionInvestiture(item, actor);

    //Adds "Cancel Gravitation" item to caster
    const cancelGravitationCasterUUID = "Compendium.cosmere-automated-actions.caaactions.Item.TcddNgIyb1GGZGXn";
    const cancelGravitationCaster = await giveActorItem(actor, cancelGravitationCasterUUID)
    if(cancelGravitationCaster) {
        cancelGravitationCaster?.update({
            name: `Dismiss Lashing (${target.name})`
        })
        cancelGravitationCaster.setFlag(MODULE_ID, "target", target.actor?.uuid!);
        cancelGravitationCaster.setFlag(MODULE_ID, "caster", caster.uuid);

        //Adds "Gravitation Infusion" item to target
        var gravitationInfusionEffectCreateData = await getFriendlyGravitationEffectCreateData(actor, cancelGravitationCaster, infusedInvestiture);

        const gravitationInfusionEffect = await ActiveEffect.create(gravitationInfusionEffectCreateData, {parent: target.actor});
        cancelGravitationCaster.setFlag(MODULE_ID, "effectsUuids", [gravitationInfusionEffect?.uuid!]);
    }
}

async function applySelfGravitationInfusion(item: CosmereItem, actor: CosmereActor){

    const cancelSelfGravitationCasterUUID = "Compendium.cosmere-automated-actions.caaactions.Item.TcddNgIyb1GGZGXn";
    const cancelSelfGravitationCaster = await giveActorItem(actor, cancelSelfGravitationCasterUUID);
    cancelSelfGravitationCaster?.update({
        name: `Dismiss Lashing (self)`
    })

    //Adds "Gravitation Infusion" item to self
    var gravitationInfusionEffectCreateData = await getFriendlyGravitationEffectCreateData(actor, cancelSelfGravitationCaster);

    if(cancelSelfGravitationCaster) {
        const gravitationInfusionEffect = await ActiveEffect.create(gravitationInfusionEffectCreateData, {parent: cancelSelfGravitationCaster});
        cancelSelfGravitationCaster.setFlag(MODULE_ID, "effectsUuids", [gravitationInfusionEffect?.uuid!]);

    }
}

function getGravitationRate(actor: CosmereActor){
    for(const talent of getSurgeTalents(actor, GRV.GRV_ITEM)){
        if(talent.system.id == GRV.FLYING_ACE){
            return 40;
        }
    }
    return 25;
}

async function getFriendlyGravitationEffectCreateData(actor: CosmereActor, item?: CosmereItem, infusedInvestiture: number = 1){

    var gravitationInfusionEffectCreateData = foundry.utils.deepClone(gravitationInfusionFriendlyEffectDefaultCreateData);

    //@ts-ignore
    gravitationInfusionEffectCreateData.flags[MODULE_ID].infusion_inv_remaining = infusedInvestiture;
    log("Creating gravitation effect, grav rate: " + getGravitationRate(actor).toString())
    gravitationInfusionEffectCreateData.changes = [
        {
            key: "system.movement.fly.rate.override",
            mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
            value: getGravitationRate(actor).toString()
        },
        {
            key: "system.movement.fly.rate.useOverride",
            mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
            value: "true"
        }
    ];
    if(item){
        gravitationInfusionEffectCreateData.origin = item.uuid;
    }

    return gravitationInfusionEffectCreateData;
}
//#endregion