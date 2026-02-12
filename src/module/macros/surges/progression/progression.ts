import { CosmereActiveEffect, CosmereActor, CosmereItem } from "@system/documents";
import { getFirstTarget, getFlags, giveActorItem } from "../../../utils/helpers";
import { MODULE_ID } from "@src/module/constants";

interface SizeInterface {
    width: number,
    height: number,
    "texture.scaleX": number,
    "texture.scaleY": number
}

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
    //grabs target and caster from item flags
    const flags = getFlags(item);
    if(!flags){
        // TODO: We failed to get the flags on this item
        return;
    }
    const targetUUID = flags.target;
    const casterUUID = flags.caster;
    const targetActor = await fromUuid(targetUUID) as CosmereActor;
    const casterActor = await fromUuid(casterUUID) as CosmereActor;
    if((!targetActor) || (!casterActor)){
        // TODO: We couldn't handle resolving the target or caster UUID
        return;
    }

    //finds items from target and caster and deletes it
    const targetItem = (await targetActor.items.getName("Cancel Regrowth Infusion")) as CosmereItem;
    const targetInfusionItem = (await targetActor.items.getName("Regrowth Infusion")) as CosmereItem;
    const casterItem = (await casterActor.items.getName("Cancel Regrowth Infusion")) as CosmereItem;
    targetItem.delete();
    targetInfusionItem.delete();
    casterItem.delete();
}

export async function characterRegrowthRound(item: CosmereItem){
    //grabs target and caster from item flags
    const flags = getFlags(item);
    if(!flags){
        // TODO: We failed to get the flags on this item
        return;
    }
    const targetUUID = flags.target;
    const casterUUID = flags.caster;
    const targetActor = await fromUuid(targetUUID) as CosmereActor;
    const casterActor = await fromUuid(casterUUID) as CosmereActor;
    if((!targetActor) || (!casterActor)){
        // TODO: We couldn't handle resolving the target or caster UUID
        return;
    }

    //drain stormlight from caster, ends effect if there isn't enough stormlight left
    const casterInv = casterActor.system.resources.inv.value;
    if(casterInv < 1){
        cancelCharacterRegrowth(item, targetActor);
        return
    }
    const newInv = casterInv - 1;
    await casterActor.update({ 'system.resources.inv.value': newInv } as any);

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

async function applyPlantGrowthInfusion(item: CosmereItem, actor: CosmereActor){
    const target = getFirstTarget();
    const actorProgressionRank = actor.system.skills.prg.rank;
    const sizes: Record<string, SizeInterface> = {
        small: { width: 1, height: 1, "texture.scaleX": 0.75, "texture.scaleY": 0.75 },
        medium: { width: 1, height: 1, "texture.scaleX": 1, "texture.scaleY": 1 },
        large: { width: 2, height: 2, "texture.scaleX": 1, "texture.scaleY": 1 },
        huge: { width: 3, height: 3, "texture.scaleX": 1, "texture.scaleY": 1 },
        gargantuan: { width: 4, height: 4, "texture.scaleX": 1, "texture.scaleY": 1 },
    };
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
    //Adds "Cancel Regrowth Infusion" item to target
    const cancelRegrowthTargetUUID = "Compendium.cosmere-automated-actions.caaactions.Item.5SzzMlt3QUMTwXoF";
    const cancelRegrowthTarget = (await giveActorItem(target.actor!, cancelRegrowthTargetUUID))!;
    if(cancelRegrowthTarget){
        cancelRegrowthTarget.setFlag(MODULE_ID, "target", target.actor?.uuid!);
        cancelRegrowthTarget.setFlag(MODULE_ID, "caster", caster.uuid);

    }
    //Adds "Cancel Regrowth" item to caster
    const cancelRegrowthCasterUUID = "Compendium.cosmere-automated-actions.caaactions.Item.LNAzM5dFOJ4fqqdL";
    const cancelRegrowthCaster = await giveActorItem(actor, cancelRegrowthCasterUUID)
    if(cancelRegrowthCaster) {
        cancelRegrowthCaster.setFlag(MODULE_ID, "target", target.actor?.uuid!);
        cancelRegrowthCaster.setFlag(MODULE_ID, "caster", caster.uuid);

    }
    //Adds "Regrowth Infusion" item to target
    const regrowthInfusionUUID = "Compendium.cosmere-automated-actions.caaactions.Item.OnyFplC4STyvuGRe";
    const regrowthInfusion = await giveActorItem(target.actor!, regrowthInfusionUUID);
    if(regrowthInfusion) {
        regrowthInfusion.setFlag(MODULE_ID, "target", target.actor?.uuid!);
        regrowthInfusion.setFlag(MODULE_ID, "caster", caster.uuid);
        regrowthInfusion.setFlag(MODULE_ID, "infusion_inv_remaining", infusedInvestiture);
        let regrowthEffect = regrowthInfusion.effects.get("l4azK3bv7GZcsZIv") as CosmereActiveEffect;
        let regrowthUpdateData: ActiveEffect.UpdateData = {
            duration: {
                "rounds": infusedInvestiture,
            }
        }
        regrowthEffect.update(regrowthUpdateData);
        regrowthEffect.updateDuration();
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