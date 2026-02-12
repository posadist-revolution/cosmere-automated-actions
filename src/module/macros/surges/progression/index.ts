import { MacroDefinition } from "../..";
import { progression, characterRegrowthEndTurn, characterRegrowthStartTurn, cancelCharacterRegrowth } from "./progression";

    // ["injury-regrowth", injuryRegrowth],
    // ["cancel-character-regrowth", cancelCharacterRegrowth],
    // ["cancel-regrowth-infusion", cancelCharacterRegrowth],
    // ["from-the-brink", fromTheBrink],

export const progressionDefinition: MacroDefinition = {
    macros: [
        ["progression", progression],
        ["cancel-regrowth-infusion", cancelCharacterRegrowth]
    ],
    startTurnEffect: ["regrowth-infusion", characterRegrowthStartTurn],
    endTurnEffect: ["regrowth-infusion", characterRegrowthEndTurn],
}

export const injuryRegrowthDefinition: MacroDefinition = {
    macros: []
}