import { CosmereActor } from '@system/documents/actor';
import { ActiveEffectDataModel } from '@system/data/active-effect';

export declare class CosmereActiveEffect<out SubType extends ActiveEffect.SubType = ActiveEffect.SubType> extends ActiveEffect<SubType> {
    system: ActiveEffectDataModel;
    /**
     * The number of stacked instances of this effect. Used for stackable effects.
     * Shorthand for `system.stacks`.
     */
    get stacks(): number;
    /**
     * Whether this effect is a system defined status effect.
     */
    get isStatusEffect(): boolean;
    /**
     * Whether this effect is a system defined condition.
     * This is an alias for `isStatusEffect`.
     */
    get isCondition(): boolean;
    /**
     * Whether this effect is stackable.
     * Shorthand for `system.isStackable`.
     */
    get isStackable(): boolean | undefined;
}
declare module '@league-of-foundry-developers/foundry-vtt-types/configuration' {
    interface ConfiguredActiveEffect<SubType extends ActiveEffect.SubType> {
        document: CosmereActiveEffect<SubType>;
    }
}
