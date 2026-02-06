import { MODULE_ID } from "../constants"

export const settings = [
    {
    },
]

export const SETTINGS = {
	USE_AUTOMATIONS: 'useAutomations',
    SPHERE_DUNNING: 'sphereDunning',
    AUTOMATE_CONDITIONS: 'automateConditions',
    DECREMENT_EXHAUSTION: 'decrementExhaustion'
} as const;

type ModuleSettingsConfig = {
    [key in `${typeof MODULE_ID}.${typeof SETTINGS.USE_AUTOMATIONS}`]: boolean;
} & {
    [key in `${typeof MODULE_ID}.${typeof SETTINGS.SPHERE_DUNNING}`]: boolean;
} & {
    [key in `${typeof MODULE_ID}.${typeof SETTINGS.AUTOMATE_CONDITIONS}`]: boolean;
} & {
    [key in `${typeof MODULE_ID}.${typeof SETTINGS.DECREMENT_EXHAUSTION}`]: boolean;};

type ModuleSettingsKey = (typeof SETTINGS)[keyof typeof SETTINGS];

export function getModuleSetting<
    T extends string | boolean | number = string | boolean | number,
>(settingKey: ModuleSettingsKey) {
	return game.settings!.get(MODULE_ID, settingKey) as T;
}

export function setModuleSetting<
    TKey extends ModuleSettingsKey,
    TValue extends ModuleSettingsConfig[`${typeof MODULE_ID}.${TKey}`],
>(settingKey: TKey, value: TValue){
	return game.settings!.set(MODULE_ID, settingKey, value as any);
}

export function registerModuleSettings(){
    const toggleOptions = [
        {
            name: "Use Automations",
            id: SETTINGS.USE_AUTOMATIONS,
            hint: "Toggles CAA automations on or off across all sheets",
            scope: "world",
            default: true,
            requiresReload: false,
        },
        {
            name: "Track Dun Spheres",
            id: SETTINGS.SPHERE_DUNNING,
            hint: "Automatically Dun and Infuse spheres as they are used",
            scope: "world",
            default: true,
            requiresReload: false
        },
        {
            name: "Let conditions modify rolls",
            id: SETTINGS.AUTOMATE_CONDITIONS,
            hint: "Let conditions like Exhausted apply a modifier to relevant rolls",
            scope: "world",
            default: true,
            requiresReload: false
        },
        {
            name: "Automatically Decrement Exhaustion",
            id: SETTINGS.DECREMENT_EXHAUSTION,
            hint: "Remove one stack of exhaustion on long rest",
            scope: "world",
            default: true,
            requiresReload: false
        }
    ]

    toggleOptions.forEach(option => {
		game.settings!.register(MODULE_ID, option.id, {
            // TODO: Add localization
            // name: game.i18n?.localize(`cosmere-advanced-encounters.settings.${option.name}.name`),
            // hint: game.i18n?.localize(`cosmere-advanced-encounters.settings.${option.name}.hint`),
            name: option.name,
            hint: option.hint,
			type: Boolean,
			config: true,
			scope: option.scope as "world" | "client" | undefined,
			default: option.default,
            requiresReload: option.requiresReload,
		});
    });
}

declare module '@league-of-foundry-developers/foundry-vtt-types/configuration' {
    interface SettingConfig extends ModuleSettingsConfig {}
}