import { giveActorItem } from "../../../utils/helpers";

export async function illumination(item, actor){
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Illumination" },
        content: "<p>What would you like to lightweave?</p>",
        buttons: [
            {
                label: "Simple Illusion",
                action: "simple-illusion",
                callback: () => {
                    console.log("simple illusion, currently no functionality");
                }
            },
            {
                label: "Complex Illusion",
                action: "complex-illusion",
                callback: async () => {
                    //adds "Dismiss Complex Illusion" item to actor
                    const dismissComplexIllusionUUID = "Compendium.cosmere-automated-actions.caaactions.Item.EZqaHREQyTkBiRIb";
                    const dismissComplexIllusion = await giveActorItem(actor, dismissComplexIllusionUUID);
                }
            },
            {
                label: "Disguise Yourself",
                action: "disguise-yourself",
                callback: async () => {
                    //adds "Dismiss Disguise" item to actor
                    const dismissDisguiseUUID = "Compendium.cosmere-automated-actions.caaactions.Item.3SdIMgwufXgAfQmM";
                    const dismissDisguise = await giveActorItem(actor, dismissDisguiseUUID);
                }
            }
        ]
    })

}

export function dismissComplexIllusion(item){
    item.delete();
}
export function dismissDisguise(item){
    item.delete();
}

export function complexIllusionRound(item, actor){
    //Subtracts 1 investiture from actor every combat round
    const actorInv = actor.system.resources.inv.value;
    if(actorInv < 1){
        dismissComplexIllusion(item);
        return;
    }
    const newInv = actorInv - 1;
    actor.update({ 'system.resources.inv.value': newInv });
}