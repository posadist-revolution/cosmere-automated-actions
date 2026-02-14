import { Attribute, Skill } from '@system/types/cosmere';
import { CosmereItem } from '@system/documents/item';
import { CosmereActor, CosmereActorRollData } from '@system/documents/actor';
import { AdvantageMode } from '@system/types/roll';
import { RollConfigurationDialog } from '@system/applications/dialogs/roll-configuration';
import { RollMode } from './types';
import { Nullable } from '../types/utils';
export type D20RollData<ActorRollData extends CosmereActorRollData = CosmereActorRollData> = {
    [K in keyof ActorRollData]: ActorRollData[K];
} & {
    mod: number;
    skill: {
        id: Nullable<Skill>;
        rank: number;
        mod: number;
        attribute: Nullable<Attribute>;
    };
    attribute: number;
    context: string;
    source: CosmereItem | CosmereActor | null;
};
export interface D20RollOptions extends Partial<foundry.dice.terms.RollTerm.EvaluationOptions> {
    rollMode?: RollMode;
    /**
     * The value of d20 result which represents an opportunity
     * @default 20
     */
    opportunity?: number;
    /**
     * The value of d20 result which represent an complication
     * @default 1
     */
    complication?: number;
    /**
     * Value against which the result of this roll should be compared
     */
    targetValue?: number;
    /**
     * Whether or not to include a plot die in the roll
     */
    plotDie?: boolean;
    /**
     * What advantage modifier to apply to the d20 roll
     * @default AdvantageMode.None
     */
    advantageMode?: AdvantageMode;
    /**
     * What advantage modifer to apply to the plot die roll
     */
    advantageModePlot?: AdvantageMode;
    /**
     * The attribute that is used for the roll by default
     */
    defaultAttribute?: Attribute;
    data?: D20RollData;
}
export declare class D20Roll extends foundry.dice.Roll<D20RollData> {
    protected parts: string;
    options: D20RollOptions & {
        configured: boolean;
    };
    constructor(parts: string, data: D20RollData, options?: D20RollOptions);
    /**
     * Does this roll start with a d20?
     */
    get validD20Roll(): boolean;
    /**
     * Whether or not to include a plot die in the roll
     */
    get hasPlotDie(): boolean;
    /**
     * Whether or not the d20 roll has advantage
     */
    get hasAdvantage(): boolean;
    /**
     * Whether or not the d20 roll has disadvantage
     */
    get hasDisadvantage(): boolean;
    /**
     * Whether or not the plot die roll has advantage
     */
    get hasPlotAdvantage(): boolean;
    /**
     * Whether or not the plot die roll has disadvantage
     */
    get hasPlotDisadvantage(): boolean;
    /**
     * How many complications were rolled?
     */
    get complicationsCount(): number;
    /**
     * How many opportunities were rolled?
     */
    get opportunitiesCount(): number;
    /**
     * Whether a complication was rolled (either on the plot die, or on the d20)
     */
    get rolledComplication(): boolean;
    /**
     * Whether an opporunity was rolled (either on the plot die, or on the d20)
     */
    get rolledOpportunity(): boolean;
    /**
     * Was an opporunity rolled on the d20?
     * Returns undefined if the roll isn't yet evaluated
     */
    get hasRolledOpportunity(): boolean | undefined;
    /**
     * Was a complication rolled on the d20?
     * Returns undefined if the roll isn't yet evaluated
     */
    get hasRolledComplication(): boolean | undefined;
    configureDialog(data: RollConfigurationDialog.Data): Promise<D20Roll | null>;
    toMessage<Create extends boolean | null | undefined = undefined>(messageData?: Roll.MessageData | null, options?: Roll.ToMessageOptions<Create>): Promise<Roll.ToMessageReturn<Create>>;
    getHTML(): Promise<string | undefined>;
    /**
     * Recalculates the roll total from the current (potentially modified) terms.
     * @returns {number} The new total of the roll.
     */
    resetTotal(): number;
    private configureModifiers;
}
