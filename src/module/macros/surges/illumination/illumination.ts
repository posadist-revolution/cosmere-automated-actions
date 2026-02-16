import { CosmereItem, CosmereActor } from "@system/documents";
import { giveActorItem } from "../../../utils/helpers";
import { log } from "@module/utils/helpers";

export async function illumination(item: CosmereItem, actor: CosmereActor){
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Illumination" },
        content: "<p>What would you like to lightweave?</p>",
        buttons: [
            {
                label: "Simple Illusion",
                action: "simple-illusion",
                callback: () => {
                    log("simple illusion, currently no functionality");
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

export function dismissComplexIllusion(item: CosmereItem, actor: CosmereActor){
    item.delete();
}
export function dismissDisguise(item: CosmereItem, actor: CosmereActor){
    item.delete();
}

export function complexIllusionRound(item: CosmereItem, actor: CosmereActor, turn: Combat.HistoryData){
    //Subtracts 1 investiture from actor every combat round
    const actorInv = actor.system.resources.inv.value;
    if(actorInv < 1){
        dismissComplexIllusion(item, actor);
        return;
    }
    const newInv = actorInv - 1;
    actor.update({ 'system.resources.inv.value': newInv } as any);
}