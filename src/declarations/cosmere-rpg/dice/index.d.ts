import { Attribute } from '@system/types/cosmere';
import './modifiers';
import { D20Roll, D20RollOptions, D20RollData } from './d20-roll';
import { DamageRoll, DamageRollOptions, DamageRollData } from './damage-roll';
export * from './d20-roll';
export * from './damage-roll';
export * from './plot-die';
export interface D20RollConfigration extends D20RollOptions {
    /**
     * The dice roll component parts, excluding the initial d20
     * @default []
     */
    parts?: string[];
    /**
     * Data that will be used when parsing this roll
     * @default {}
     */
    data: D20RollData;
    /**
     * Whether or not to show the roll configuration dialog
     * @default true
     */
    configurable?: boolean;
    /**
     * Should a chat message be created for this roll?
     * @default true
     */
    chatMessage?: boolean;
    /**
     * HTML template used to display the roll configuration dialog
     */
    template?: string;
    /**
     * Title of the roll configuration dialog
     */
    title: string;
    /**
     * The attribute that is used for the roll by default
     */
    defaultAttribute?: Attribute;
    messageData?: object;
}
export interface DamageRollConfiguration extends DamageRollOptions {
    /**
     * The damage formula to use for this roll
     */
    formula: string;
    /**
     * Data that will be used when parsing this roll
     */
    data: DamageRollData;
}
export declare function d20Roll(config: D20RollConfigration): Promise<D20Roll | null>;
export declare function damageRoll(config: DamageRollConfiguration): Promise<DamageRoll>;
