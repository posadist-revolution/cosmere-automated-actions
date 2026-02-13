import { MacroDefinition } from "../..";
import { progression, characterRegrowthEffectStartTurn, cancelCharacterRegrowth, characterRegrowthExpendInvestiture } from "./progression";

    // ["injury-regrowth", injuryRegrowth],
    // ["cancel-character-regrowth", cancelCharacterRegrowth],
    // ["cancel-regrowth-infusion", cancelCharacterRegrowth],
    // ["from-the-brink", fromTheBrink],

export const progressionDefinition: MacroDefinition = {
    macros: [
        ["progression", progression],
        ["cancel-regrowth-infusion", cancelCharacterRegrowth]
    ],
    startTurnItem: ["cancel-regrowth-infusion", characterRegrowthExpendInvestiture],
    startTurnEffect: ["regrowth-infusion", characterRegrowthEffectStartTurn],
}

export const injuryRegrowthDefinition: MacroDefinition = {
    macros: []
}