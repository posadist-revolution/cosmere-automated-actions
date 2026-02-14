import { GRV } from "./talent-ids";
import { MacroDefinition, registerMacroDefinition } from "../..";
import { gravitation, cancelGravitationInfusion, gravitationTurnStart, selfGravitationWhenInvested, selfGravitationCancelInvEmpty } from "./gravitation";

const gravitationDefinition: MacroDefinition = {
    macros: [
        [GRV.GRV_ITEM, gravitation],
        [GRV.CANCEL_GRAVITATION_INFUSION, cancelGravitationInfusion]
    ],
    startTurnItem: [GRV.CANCEL_GRAVITATION_INFUSION, gravitationTurnStart],
    investitureFromZero: [GRV.MASTER_OF_THE_SKIES, selfGravitationWhenInvested],
    investitureToZero: [GRV.MASTER_OF_THE_SKIES, selfGravitationCancelInvEmpty]

}

export function registerGravitationDefinitions(){
    console.log("CAA | Registering Gravitation Macros");
    registerMacroDefinition(gravitationDefinition);
}