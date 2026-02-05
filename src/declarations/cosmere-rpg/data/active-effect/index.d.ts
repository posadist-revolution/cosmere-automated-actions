import { ActiveEffectDataModel } from './active-effect';
export declare const config: {
    base: typeof ActiveEffectDataModel;
};
export { ActiveEffectDataModel } from './active-effect';
declare module "@league-of-foundry-developers/foundry-vtt-types/configuration" {
    interface DataModelConfig {
        ActiveEffect: typeof config;
    }
}
