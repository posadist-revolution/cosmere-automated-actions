import { PRG } from "./talent-ids";
import { MacroDefinition, registerMacroDefinition } from "../..";
import { progression, plantGrowth, characterRegrowth, characterRegrowthEffectStartTurn, cancelCharacterRegrowth } from "./progression";
import { injuryRegrowth } from "./injury-regrowth";
import { fromTheBrink } from "./from-the-brink";
import { log } from "@module/utils/helpers";

const progressionDefinition: MacroDefinition = {
    macros: [
        {id: PRG.PRG_ITEM, funcSignature: progression},
        {id: PRG.PLANT_GROWTH, funcSignature: plantGrowth},
        {id: PRG.CHARACTER_REGROWTH, funcSignature: characterRegrowth},
        {id: PRG.CANCEL_REGROWTH_INFUSION, funcSignature: cancelCharacterRegrowth}
    ],
    // Regrowth heals at the start of each of the target's turns, not when the action is used
    replaceSystemRoll: [PRG.CHARACTER_REGROWTH],
    startTurnEffect: {id: PRG.REGROWTH_INFUSION, funcSignature: characterRegrowthEffectStartTurn},
}

const injuryRegrowthDefinition: MacroDefinition = {
    macros: [
        {id: PRG.INJURY_REGROWTH, funcSignature: injuryRegrowth}
    ]
}

const fromTheBrinkDefinition: MacroDefinition = {
    macros: [
        {id: PRG.FROM_THE_BRINK, funcSignature: fromTheBrink}
    ]
}

export function registerProgressionDefinitions(){
    log("CAA | Registering Progression Macros");
    registerMacroDefinition(progressionDefinition);
    registerMacroDefinition(injuryRegrowthDefinition);
    registerMacroDefinition(fromTheBrinkDefinition);
}