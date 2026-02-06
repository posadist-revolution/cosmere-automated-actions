import { DamageType, Skill, Attribute } from '@system/types/cosmere';
import { CosmereItem } from '@system/documents/item';
import { CosmereActor, CosmereActorRollData } from '@system/documents/actor';
import { AdvantageMode } from '@system/types/roll';
export type DamageRollData<ActorRollData extends CosmereActorRollData = CosmereActorRollData> = {
    [K in keyof ActorRollData]: ActorRollData[K];
} & {
    mod?: number;
    skill?: {
        id: Skill;
        rank: number;
        mod: number;
        attribute: Attribute;
    };
    attribute?: number;
    damage?: {
        total: DamageRoll;
        unmodded: DamageRoll;
        dice: DamageRoll;
    };
    source: CosmereItem | CosmereActor;
};
export interface DamageRollOptions extends Partial<foundry.dice.terms.RollTerm.EvaluationOptions> {
    /**
     * The type of damage being rolled
     */
    damageType?: DamageType;
    /**
     * The damage modifier to apply on hit
     */
    mod?: number;
    /**
     * What advantage modifier to apply to the damage roll
     * @default AdvantageMode.None
     */
    advantageMode?: AdvantageMode;
    /**
     * Where did this damage come from?
     */
    damageSourceName?: string;
    /**
     * Nested Roll item for graze damage
     */
    graze?: DamageRoll;
    /**
     * Indicates if the damage should be a critical
     */
    critical?: boolean;
}
export declare class DamageRoll extends foundry.dice.Roll<DamageRollData> {
    options: DamageRollOptions & {
        configured: boolean;
    };
    readonly isDamage = true;
    constructor(formula: string, data: DamageRollData, options: DamageRollOptions);
    get damageType(): DamageType | undefined;
    get mod(): number | undefined;
    get damageSourceName(): string | undefined;
    get graze(): DamageRoll | undefined;
    set graze(roll: DamageRoll);
    get hasMod(): boolean;
    /**
     * Whether or not the damage roll has advantage
     */
    get hasAdvantage(): boolean;
    /**
     * Whether or not the damage roll has disadvantage
     */
    get hasDisadvantage(): boolean;
    /**
     * Whether or not the damage roll is a critical hit
     */
    get isCritical(): boolean;
    get hasDice(): boolean;
    getTooltip(): Promise<string>;
    removeTermSafely(conditional: (value: foundry.dice.terms.RollTerm, index: number, obj: foundry.dice.terms.RollTerm[]) => boolean): void;
    filterTermsSafely(condition: (value: foundry.dice.terms.RollTerm, index: number, obj: foundry.dice.terms.RollTerm[]) => boolean): void;
    replaceDieResults(sourceDicePool: foundry.dice.terms.DiceTerm[]): void;
    private cleanUpTerms;
    private configureModifiers;
}
