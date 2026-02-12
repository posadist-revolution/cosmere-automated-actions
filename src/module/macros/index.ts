import { CosmereActiveEffect, CosmereActor, CosmereItem } from "@src/declarations/cosmere-rpg/documents"

export type MacroDefinition = {
    macros?: [string, (item: CosmereItem, actor: CosmereActor) => Promise<void>][];
    startTurnItem?: [string, (item: CosmereItem, turn: Combat.HistoryData) => Promise<void>];
    startTurnEffect?: [string, (effect: CosmereActiveEffect, turn: Combat.HistoryData) => Promise<void>];
    endTurnItem?: [string, (item: CosmereItem, turn: Combat.HistoryData) => Promise<void>];
    endTurnEffect?: [string, (effect: CosmereActiveEffect, turn: Combat.HistoryData) => Promise<void>];
}