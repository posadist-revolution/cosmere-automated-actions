import { PRG } from "./talent-ids";
import { MacroDefinition, registerMacroDefinition } from "../..";
import { progression, characterRegrowthEffectStartTurn, cancelCharacterRegrowth, characterRegrowthExpendInvestiture } from "./progression";
import { injuryRegrowth } from "./injury-regrowth";
import { fromTheBrink } from "./from-the-brink";
import { log } from "@module/utils/helpers";

const progressionDefinition: MacroDefinition = {
    macros: [
        {id: PRG.PRG_ITEM, funcSignature: progression},
        {id: PRG.CANCEL_REGROWTH_INFUSION, funcSignature: cancelCharacterRegrowth}
    ],
    startTurnItem: {id: PRG.CANCEL_REGROWTH_INFUSION, funcSignature: characterRegrowthExpendInvestiture},
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