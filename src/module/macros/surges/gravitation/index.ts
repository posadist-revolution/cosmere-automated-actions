import { GRV } from "./talent-ids";
import { MacroDefinition, registerMacroDefinition } from "../..";
import { gravitation, cancelGravitationInfusion, gravitationTurnStart, selfGravitationWhenInvested, selfGravitationCancelInvEmpty } from "./gravitation";
import { log } from "@module/utils/helpers";

const gravitationDefinition: MacroDefinition = {
    macros: [
        {id: GRV.GRV_ITEM, funcSignature: gravitation},
        {id: GRV.CANCEL_GRAVITATION_INFUSION, funcSignature: cancelGravitationInfusion}
    ],
    startTurnItem: {id: GRV.CANCEL_GRAVITATION_INFUSION, funcSignature: gravitationTurnStart},
    investitureFromZero: {id: GRV.MASTER_OF_THE_SKIES, funcSignature: selfGravitationWhenInvested},
    investitureToZero: {id: GRV.MASTER_OF_THE_SKIES, funcSignature: selfGravitationCancelInvEmpty}

}

export function registerGravitationDefinitions(){
    log("CAA | Registering Gravitation Macros");
    registerMacroDefinition(gravitationDefinition);
}