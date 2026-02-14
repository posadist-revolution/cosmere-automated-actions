import { ABR } from "./talent-ids";
import { MacroDefinition, registerMacroDefinition } from "../..";
import { abrasion, cancelSelfAbrasion, selfAbrasionCancelInvEmpty, selfAbrasionTurnStart, selfAbrasionWhenInvested } from "./abrasion";

const abrasionDefinition: MacroDefinition = {
    macros: [
        [ABR.ABR_ITEM, abrasion],
        [ABR.CANCEL_SELF_ABRASION, cancelSelfAbrasion]
    ],
    startTurnItem: [ABR.CANCEL_SELF_ABRASION, selfAbrasionTurnStart],
    investitureFromZero: [ABR.SMOOTH_OPERATOR, selfAbrasionWhenInvested],
    investitureToZero: [ABR.SMOOTH_OPERATOR, selfAbrasionCancelInvEmpty]
}

export function registerAbrasionDefinitions(){
    console.log("CAA | Registering Abrasion Macros");
    registerMacroDefinition(abrasionDefinition);
}