import { ActionCostType } from "@src/declarations/cosmere-rpg/types/cosmere";

export interface CommonItemData {
    id: string;
    type: string;
    description: {
        value: string;
        chat: string;
        short: string;
    };
    activation: {
        type: string;
        cost: {
            value: number;
            type: ActionCostType;
        };
        consume: [
            {
                type: any;
                value: {
                    min: number;
                    max: number;
                    actual: number;
                };
                resource: any;
            },
        ];
        flavor: string;
        plotDie: boolean;
        opportunity: any;
        complication: any;
        uses: any;
        attribute: any;
    };
    damage: any;
    modality: any;
    ancestry: any;
    events: any;
    relationships: any;
}
