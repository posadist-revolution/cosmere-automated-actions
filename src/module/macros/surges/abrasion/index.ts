import { ABR } from "./talent-ids";
import { MacroDefinition, registerMacroDefinition } from "../..";
import { abrasion, cancelSelfAbrasion, selfAbrasionCancelInvEmpty, selfAbrasionTurnStart, selfAbrasionWhenInvested } from "./abrasion";
import { log } from "@src/module/utils/helpers";

const abrasionDefinition: MacroDefinition = {
    macros: [
        {id: ABR.ABR_ITEM, funcSignature: abrasion},
        {id: ABR.CANCEL_SELF_ABRASION, funcSignature: cancelSelfAbrasion}
    ],
    startTurnItem: {id: ABR.CANCEL_SELF_ABRASION, funcSignature: selfAbrasionTurnStart},
    investitureFromZero: {id: ABR.SMOOTH_OPERATOR, funcSignature: selfAbrasionWhenInvested},
    investitureToZero: {id: ABR.SMOOTH_OPERATOR, funcSignature: selfAbrasionCancelInvEmpty}
}

export function registerAbrasionDefinitions(){
    log("CAA | Registering Abrasion Macros");
    registerMacroDefinition(abrasionDefinition);
}