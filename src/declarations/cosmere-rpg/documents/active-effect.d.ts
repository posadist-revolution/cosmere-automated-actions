import { CosmereActor } from '@system/documents/actor';
import { SimpleMerge } from '../types/utils';
export declare class CosmereActiveEffect<out SubType extends ActiveEffect.SubType = ActiveEffect.SubType> extends ActiveEffect<SubType> {
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
    get isStackable(): foundry.data.fields.BooleanField.InitializedType<SimpleMerge<foundry.data.fields.BooleanField.DefaultOptions, {
        readonly required: true;
        readonly initial: false;
    }>>;
    _preCreate(data: ActiveEffect.CreateData, options: ActiveEffect.Database.PreCreateOptions, user: User): Promise<boolean | void>;
    _preUpdate(data: ActiveEffect.UpdateData, options: ActiveEffect.Database.PreUpdateOptions, user: User): Promise<boolean | void>;
    _onUpdate(changed: ActiveEffect.UpdateData, options: ActiveEffect.Database.OnUpdateOperation, userId: string): void;
    apply(actor: CosmereActor, change: ActiveEffect.ChangeData): import("@league-of-foundry-developers/foundry-vtt-types/utils").AnyMutableObject;
}
declare module '@league-of-foundry-developers/foundry-vtt-types/configuration' {
    interface ConfiguredActiveEffect<SubType extends ActiveEffect.SubType> {
        document: CosmereActiveEffect<SubType>;
    }
}
