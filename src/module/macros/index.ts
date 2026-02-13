import { CosmereActiveEffect, CosmereActor, CosmereItem } from "@src/declarations/cosmere-rpg/documents"
import { macrosMap,startTurnItemMap, startTurnEffectMap, endTurnItemMap, endTurnEffectMap } from './maps'

export type MacroDefinition = {
    macros?: [string, (item: CosmereItem, actor: CosmereActor) => Promise<void>][];
    startTurnItem?: [string, (item: CosmereItem, turn: Combat.HistoryData) => Promise<void>];
    startTurnEffect?: [string, (effect: CosmereActiveEffect, turn: Combat.HistoryData) => Promise<void>];
    endTurnItem?: [string, (item: CosmereItem, turn: Combat.HistoryData) => Promise<void>];
    endTurnEffect?: [string, (effect: CosmereActiveEffect, turn: Combat.HistoryData) => Promise<void>];
}

export function registerMacroDefinition(def: MacroDefinition){
    if(def.macros){
        for(const macro of def.macros!){
            macrosMap.set(macro[0], macro[1]);
        }
    }
    if(def.startTurnItem){
        startTurnItemMap.set(def.startTurnItem[0], def.startTurnItem[1])
    }
    if(def.endTurnItem){
        endTurnItemMap.set(def.endTurnItem[0], def.endTurnItem[1])
    }
    if(def.startTurnEffect){
        startTurnEffectMap.set(def.startTurnEffect[0], def.startTurnEffect[1])
    }
    if(def.endTurnEffect){
        endTurnEffectMap.set(def.endTurnEffect[0], def.endTurnEffect[1])
    }
}