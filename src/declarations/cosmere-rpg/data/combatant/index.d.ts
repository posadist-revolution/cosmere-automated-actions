import { CombatantDataModel } from './combatant';
export declare const config: {
    base: typeof CombatantDataModel;
};
export { CombatantDataModel } from './combatant';
declare module "@league-of-foundry-developers/foundry-vtt-types/configuration" {
    interface DataModelConfig {
        Combatant: typeof config;
    }
}
