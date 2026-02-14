import { PRG } from "./talent-ids";
import { MacroDefinition, registerMacroDefinition } from "../..";
import { progression, characterRegrowthEffectStartTurn, cancelCharacterRegrowth, characterRegrowthExpendInvestiture } from "./progression";
import { injuryRegrowth } from "./injury-regrowth";
import { fromTheBrink } from "./from-the-brink";

    // ["injury-regrowth", injuryRegrowth],
    // ["cancel-character-regrowth", cancelCharacterRegrowth],
    // ["cancel-regrowth-infusion", cancelCharacterRegrowth],
    // ["from-the-brink", fromTheBrink],

const progressionDefinition: MacroDefinition = {
    macros: [
        [PRG.PRG_ITEM, progression],
        [PRG.CANCEL_REGROWTH_INFUSION, cancelCharacterRegrowth]
    ],
    startTurnItem: [PRG.CANCEL_REGROWTH_INFUSION, characterRegrowthExpendInvestiture],
    startTurnEffect: [PRG.REGROWTH_INFUSION, characterRegrowthEffectStartTurn],
}

const injuryRegrowthDefinition: MacroDefinition = {
    macros: [
        [PRG.INJURY_REGROWTH, injuryRegrowth]
    ]
}

const fromTheBrinkDefinition: MacroDefinition = {
    macros: [
        [PRG.FROM_THE_BRINK, fromTheBrink]
    ]
}

export function registerProgressionDefinitions(){
    console.log("CAA | Registering Progression Macros");
    registerMacroDefinition(progressionDefinition);
    registerMacroDefinition(injuryRegrowthDefinition);
    registerMacroDefinition(fromTheBrinkDefinition);
}