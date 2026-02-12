import { CosmereItem, CosmereActor, CosmereActiveEffect } from "@system/documents";
import { MODULE_ID } from "@module/constants";

//Module Functions
export function IsModuleActive(moduleId: string) {
	return game.modules?.get(moduleId)?.active;
}

export function nameToId(str: string) {
    return str.toLowerCase().split(' ').join('-');
}

//Actor Functions
export function getFirstTarget(): foundry.canvas.placeables.Token | undefined{
    return game.user?.targets.first();
}
export function getAllTargets(): foundry.canvas.placeables.tokens.UserTargets | undefined {
    return game.user?.targets
}

//Item Functions
export async function activateAllItemEffects(item: CosmereItem){
    const updates = item.effects.map((effect: CosmereActiveEffect) => ({ _id: effect.id, disabled: !effect.disabled }));
    await item.updateEmbeddedDocuments("ActiveEffect", updates);
}
export async function giveActorItem(actor: CosmereActor, itemUUID: string): Promise<CosmereItem | undefined>{
    // const cosmereItemClass = getDocumentClass('Item') as unknown as typeof CosmereItem;
    const itemId = await fromUuid(itemUUID);
    console.log(itemId);
    // @ts-ignore
    const item = await Item.create((itemId.toObject()), { parent: actor }) as CosmereItem | undefined;
    if(item){
        return item;
    }
    return undefined;
}
export function getFlags(item: CosmereItem){
    const cosmereFlags = item.flags[MODULE_ID];
    // const worldFlags = item.flags["world"];
    // if(cosmereFlags){
        return cosmereFlags;
    // } else {
    //     return worldFlags;
    // }
}