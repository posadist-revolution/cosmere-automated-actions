import { getFirstTarget, giveActorItem } from "../../../utils/helpers";

export async function gravitation(item, actor){
    const target = getFirstTarget();
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Gravitation" },
        content: "<p>Which would you like to target?</p>",
        buttons:
        [{
            label: "Character",
            action: "character",
            callback: async () => {
                if(!target){
                    ui.notifications.warn("Needs target");
                    return;
                }
                //If target is an enemy, perform a gravitation test against physical defense
                if(target.document.disposition === -1){
                    let roll = await actor.rollSkill("grv");
                    //If roll fails, return
                    if(roll.total < target.actor.system.defenses.phy.value){
                        return;
                    }
                }
                // Adds "Dismiss Lashing" to user
                const dismissLashingUUID = "Compendium.cosmere-automated-actions.caaactions.Item.TcddNgIyb1GGZGXn";
                const dismissLashing = await giveActorItem(actor, dismissLashingUUID);
                dismissLashing.setFlag("cosmere-automated-actions", "target", target.actor.uuid);
                dismissLashing.setFlag("cosmere-automated-actions", "caster", actor.uuid);
            }
        },
        {
            label: "Object",
            action: "object",
            callback: async () => {
                const dismissLashingUUID = "Compendium.cosmere-automated-actions.caaactions.Item.TcddNgIyb1GGZGXn";
                const dismissLashing = await giveActorItem(actor, dismissLashingUUID);
                dismissLashing.setFlag("cosmere-automated-actions", "target", "item");
                dismissLashing.setFlag("cosmere-automated-actions", "caster", actor.uuid);
            }
        }]
    })
}
export function dismissLashing(item){
    item.delete();
}

export async function gravitationRound(item){
    //subtract investiture form caster, if can't afford delete it
    const actor = item.actor;
    const actorInv = actor.system.resources.inv.value;
        if(actorInv < 1){
            dismissLashing(item);
            return
        }
        const newInv = actorInv - 1;
        await actor.update({ 'system.resources.inv.value': newInv });
}