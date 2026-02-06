import { CosmereItem } from "@system/documents/item";
import { MODULE_ID } from "@module/constants";
import { CosmereActor } from "@system/documents/actor";

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
    const updates = item.effects.map(effect => ({ _id: effect.id, disabled: !effect.disabled }));
    await item.updateEmbeddedDocuments("ActiveEffect", updates);
}
export async function giveActorItem(actor: CosmereActor, itemUUID: string): Promise<CosmereItem | undefined>{
    const itemDocument = fromUuidSync(itemUUID);
    if (!(itemDocument instanceof CosmereItem)) {
        throw new Error(`UUID ${itemUUID} does not reference a valid CosmereItem`);
    }
    const item = await CosmereItem.create((itemDocument.toObject()), { parent: actor });
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