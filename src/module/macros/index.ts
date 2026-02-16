import { CosmereActiveEffect, CosmereActor, CosmereItem } from "@src/declarations/cosmere-rpg/documents"
import { macrosMap,startTurnItemMap, startTurnEffectMap, endTurnItemMap, endTurnEffectMap, invFromZeroMap, invToZeroMap } from './maps'

export type MacroFunc = ((item: CosmereItem, actor: CosmereActor) => Promise<void>);
export type TurnChangeItemFunc = ((item: CosmereItem, actor: CosmereActor, turn: Combat.HistoryData) => Promise<void>);
export type TurnChangeEffectFunc = ((effect: CosmereActiveEffect, turn: Combat.HistoryData) => Promise<void>);
export type InvestitureChangeFunc = ((actor: CosmereActor) => Promise<void>);

export type MacroDefinition = {
    macros?: {id: string, funcSignature: MacroFunc}[];
    startTurnItem?: {id: string, funcSignature: TurnChangeItemFunc};
    startTurnEffect?: {id: string, funcSignature: TurnChangeEffectFunc};
    endTurnItem?: {id: string, funcSignature: TurnChangeItemFunc};
    endTurnEffect?: {id: string, funcSignature: TurnChangeEffectFunc};
    investitureFromZero?: {id: string, funcSignature: InvestitureChangeFunc};
    investitureToZero?: {id: string, funcSignature: InvestitureChangeFunc};
}

export function registerMacroDefinition(def: MacroDefinition){
    if(def.macros){
        for(const macro of def.macros!){
            macrosMap.set(macro.id, macro.funcSignature);
        }
    }
    if(def.startTurnItem){
        startTurnItemMap.set(def.startTurnItem.id, def.startTurnItem.funcSignature);
    }
    if(def.endTurnItem){
        endTurnItemMap.set(def.endTurnItem.id, def.endTurnItem.funcSignature);
    }
    if(def.startTurnEffect){
        startTurnEffectMap.set(def.startTurnEffect.id, def.startTurnEffect.funcSignature);
    }
    if(def.endTurnEffect){
        endTurnEffectMap.set(def.endTurnEffect.id, def.endTurnEffect.funcSignature);
    }
    if(def.investitureFromZero){
        invFromZeroMap.set(def.investitureFromZero.id, def.investitureFromZero.funcSignature);
    }
    if(def.investitureToZero){
        invToZeroMap.set(def.investitureToZero.id, def.investitureToZero.funcSignature);
    }
}