import { MacroFunc } from "../index.js"

export var macrosMap: Map<string, MacroFunc> = new Map<string, MacroFunc>([]);

// Action ids whose system damage/healing roll is replaced by the module's macro
export var replaceSystemRollIds: Set<string> = new Set<string>([]);
