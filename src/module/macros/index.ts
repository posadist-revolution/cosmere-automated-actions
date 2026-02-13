import { CosmereActiveEffect, CosmereActor, CosmereItem } from "@src/declarations/cosmere-rpg/documents"
import { macrosMap,startTurnItemMap, startTurnEffectMap, endTurnItemMap, endTurnEffectMap } from './maps'

export type MacroFunc = ((item: CosmereItem, actor: CosmereActor) => Promise<void>);
export type TurnChangeItemFunc = ((item: CosmereItem, actor: CosmereActor, turn: Combat.HistoryData) => Promise<void>);
export type TurnChangeEffectFunc = ((effect: CosmereActiveEffect, turn: Combat.HistoryData) => Promise<void>);


export type MacroDefinition = {
    macros?: [string, MacroFunc][];
    startTurnItem?: [string, TurnChangeItemFunc];
    startTurnEffect?: [string, TurnChangeEffectFunc];
    endTurnItem?: [string, TurnChangeItemFunc];
    endTurnEffect?: [string, TurnChangeEffectFunc];
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