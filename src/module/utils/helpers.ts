import { CosmereItem, CosmereActor, CosmereActiveEffect, CosmereDocument } from "@system/documents";
import { MODULE_ID } from "@module/constants";

const DEBUG = false;

const enum MODULE_QUERY {
    giveActorItemGM = `${MODULE_ID}.giveActorItemGM`,
    giveActorEffectGM = `${MODULE_ID}.giveActorEffectGM`,
    deleteUuidGM = `${MODULE_ID}.deleteUuidGM`,
}

//Module Functions
export function IsModuleActive(moduleId: string) {
	return game.modules?.get(moduleId)?.active;
}

export function nameToId(str: string) {
    return str.toLowerCase().split(' ').join('-');
}

export function registerQueries(){
    CONFIG.queries[MODULE_QUERY.giveActorEffectGM] = giveActorEffectGM;
    CONFIG.queries[MODULE_QUERY.giveActorItemGM] = giveActorItemGM;
    CONFIG.queries[MODULE_QUERY.deleteUuidGM] = deleteUuidGM;
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
declare interface giveActorItemGMData {
    actorUUID: string,
    itemUUID: string
}

export async function deleteItemAndDescendants(item: CosmereItem){
    // In 3.x the use hook passes the embedded action, flags live on the owning item
    const rootItem = item.root ?? item;
    await deleteDescendantUuids(rootItem.getFlag(MODULE_ID, "descendantUuids") ?? []);
    await rootItem.delete();
}

async function deleteDescendantUuids(descendantUuids: string[]){
    for(const uuid of descendantUuids){
        const documentToDelete = await fromUuid(uuid) as CosmereDocument | null;
        // Already removed (expired, or deleted by hand)
        if(!documentToDelete){
            continue;
        }
        if(documentToDelete.canUserModify(game.user!, "delete")){
            await documentToDelete.delete();
        }
        else{
            await game.users?.activeGM?.query(MODULE_QUERY.deleteUuidGM, uuid);
        }
    }
}
async function deleteUuidGM(uuid: string){
    const documentToDelete = await fromUuid(uuid) as CosmereDocument | null;
    await documentToDelete?.delete();
}
export async function giveActorItem(actor: CosmereActor, itemUUID: string): Promise<CosmereItem | undefined>{
    if(actor.canUserModify(game.user!, "update")){

        const itemSource = await fromUuid(itemUUID) as CosmereItem;
        const item = await Item.create(itemSource.toObject(), {parent: actor}) as CosmereItem | undefined;
        if(item){
            return item;
        }
        return undefined;
    }
    else{
        let data: giveActorItemGMData = {
            actorUUID: actor.uuid,
            itemUUID: itemUUID
        }
        const createdItemUUID = await game.users?.activeGM?.query(MODULE_QUERY.giveActorItemGM, data) as string;
        const item = await fromUuid(createdItemUUID) as CosmereItem | undefined;
        if(item){
            return item;
        }
        return undefined;
    }
}
declare interface giveActorEffectGMData {
    parentUUID: string,
    effectData: ActiveEffect.CreateData
}
async function giveActorItemGM(data: giveActorItemGMData){
    //TODO: Prompt GM to confirm this item is valid
    log("Giving actor item from GM!");
    const itemSource = await fromUuid(data.itemUUID) as CosmereItem;
    const actor = await fromUuid(data.actorUUID) as CosmereActor;
    const item = await Item.create(itemSource.toObject(), {parent: actor});
    if(item){
        return item.uuid;
    }
    return undefined;
}
export async function giveActorEffect(parent: CosmereActor | CosmereItem, effectCreateData: ActiveEffect.CreateData){
    if(parent.canUserModify(game.user!, "update")){
        const effect = await ActiveEffect.create(effectCreateData, {parent: parent});
        return effect;
    }
    else{
        let data: giveActorEffectGMData = {
            parentUUID: parent.uuid,
            effectData: effectCreateData
        }
        let createdEffectUUID = await game.users?.activeGM?.query(MODULE_QUERY.giveActorEffectGM, data) as string;
        const effect = await fromUuid(createdEffectUUID);
        return effect;
    }
}
async function giveActorEffectGM(data: giveActorEffectGMData){
    //TODO: Prompt GM to confirm this activeEffect is valid
    log("Giving actor effect from GM!");
    const effectCreateData = data.effectData;
    const parent = await fromUuid(data.parentUUID) as CosmereActor | CosmereItem;
    const effect = await ActiveEffect.create(effectCreateData, {parent: parent});
    if(effect){
        return effect.uuid;
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

export function log(message: any, ...optionalParams: any[]){
    if(DEBUG){
        console.log(message, ...optionalParams);
    }
}

export function promptGMForUpdate(){

}

declare module "@league-of-foundry-developers/foundry-vtt-types/configuration" {
    namespace CONFIG {
        interface Queries {
            [MODULE_QUERY.deleteUuidGM]: (data: string) => Promise<void>,
            [MODULE_QUERY.giveActorEffectGM]: (data: giveActorEffectGMData) => Promise<string | void>,
            [MODULE_QUERY.giveActorItemGM]: (data: giveActorItemGMData) => Promise<string | void>,
        }
    }
}