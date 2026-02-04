import { CosmereItem } from "@src/declarations/cosmere-rpg/documents/item";
import { MODULE_ID } from "./constants";

//Module Functions
export function IsModuleActive(moduleId: string) {
	return game.modules?.get(moduleId)?.active;
}

export function nameToId(str: string) {
    return str.toLowerCase().split(' ').join('-');
}

//Actor Functions
export function getFirstTarget(){
    return game.user?.targets.first();
}
export function getAllTargets(){
    return game.user?.targets
}

//Item Functions
export async function activateAllItemEffects(item: CosmereItem){
    const updates = item.effects.map(effect => ({ _id: effect.id, disabled: !effect.disabled }));
    await item.updateEmbeddedDocuments("ActiveEffect", updates);
}
export async function giveActorItem(actor: CosmereActor, itemUUID: string){
    const itemDocument = fromUuidSync(itemUUID);
    if (!(itemDocument instanceof Item)) {
        throw new Error(`UUID ${itemUUID} does not reference a valid Item`);
    }
    //TODO: Type Nonsense
    const item = await Item.create((itemDocument.toObject()), { parent: actor as unknown as Actor });
    return item;
}
export function getFlags(item: CosmereItem){
    const cosmereFlags = item.flags[MODULE_ID];
    const worldFlags = item.flags["world"];
    if(cosmereFlags){
        return cosmereFlags;
    } else {
        return worldFlags;
    }
}