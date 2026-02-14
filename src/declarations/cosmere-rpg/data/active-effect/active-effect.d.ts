import type { CosmereActiveEffect } from '@system/documents/active-effect';

interface ActiveEffectData {
    /**
     * Whether the effect can stack be stacked.
     */
    isStackable: boolean;
    /**
     * The number of stacked instances of this effect. Used for stackable effects.
     */
    stacks?: number;
}
export declare class ActiveEffectDataModel extends foundry.abstract.TypeDataModel<ActiveEffectData, CosmereActiveEffect>{
}