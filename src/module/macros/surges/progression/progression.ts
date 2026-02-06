import { getFirstTarget, getFlags, giveActorItem } from "../../../utils/helpers";

export async function progression(item, actor){
    const target = getFirstTarget();
    const actorProgressionRank = actor.system.skills.prg.rank;
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Progression" },
        content: "<p>Which skill would you like to use?</p>",
        buttons:
        [{
            label: "Plant Growth",
            action: "plant growth",
            callback: async () => {
                const sizes = {
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
                if(target){
                    await target.document.update(sizes[plantGrowthDialog]);
                };
            }
        },
        {
            label: "Character Regrowth",
            action: "character regrowth",
            callback: async () => {
                const caster = actor
                if(!target){
                    ui.notifications.warn("Needs target");
                    return;
                }
                //Adds "Cancel Regrowth Infusion" item to target
                const cancelRegrowthInfusionUUID = "Compendium.cosmere-automated-actions.caaactions.Item.5SzzMlt3QUMTwXoF";
                const cancelRegrowthInfusion = await giveActorItem(actor, cancelRegrowthInfusionUUID);
                cancelRegrowthInfusion.setFlag("cosmere-automated-actions", "target", target.actor.uuid);
                cancelRegrowthInfusion.setFlag("cosmere-automated-actions", "caster", caster.uuid);
                //Adds "Cancel Regrowth" item to caster
                const cancelCharacterRegrowthUUID = "Compendium.cosmere-automated-actions.caaactions.Item.LNAzM5dFOJ4fqqdL";
                const cancelCharacterRegrowth = await giveActorItem(target.actor, cancelCharacterRegrowthUUID)
                cancelCharacterRegrowth.setFlag("cosmere-automated-actions", "target", target.actor.uuid);
                cancelCharacterRegrowth.setFlag("cosmere-automated-actions", "caster", caster.uuid);
            }
        }]
    })
};

export async function cancelCharacterRegrowth(item, actor){
    //grabs target and caster from item flags
    const flags = getFlags(item);
    const targetUUID = flags.target;
    const casterUUID = flags.caster;
    const targetActor = await fromUuid(targetUUID);
    const casterActor = await fromUuid(casterUUID);
    //finds items from target and caster and deletes it
    const targetItem = await targetActor.items.getName("Cancel Character Regrowth");
    const casterItem = await casterActor.items.getName("Cancel Regrowth Infusion");
    targetItem.delete();
    casterItem.delete();
}

export async function characterRegrowthRound(item){
    //grabs target and caster from item flags
    const flags = getFlags(item);
    const targetUUID = flags.target;
    const casterUUID = flags.caster;
    const targetActor = await fromUuid(targetUUID);
    const casterActor = await fromUuid(casterUUID);

    //drain stormlight from caster, ends effect if there isn't enough stormlight left
    const casterInv = casterActor.system.resources.inv.value;
    if(casterInv < 1){
        cancelCharacterRegrowth(item, target);
        return
    }
    const newInv = casterInv - 1;
    casterActor.update({ 'system.resources.inv.value': newInv });

    //heals target
    const rollData = casterActor.getRollData();
    let r = await new Roll("@scalar.power.prg.die", rollData).evaluate();
    await r.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: casterActor }),
        flavor: `${casterActor.name} heals ${targetActor.name} a little`,
    })
    const targetHealth = targetActor.system.resources.hea.value;
    const newHealth = targetHealth + r.total;
    targetActor.update({ 'system.resources.hea.value': newHealth });
}