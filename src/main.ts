// System Imports
import { HOOKS } from "@system/constants/hooks.js";
import { CosmereItem, CosmereActor, CosmereCombat } from "@system/documents";
import { D20Roll } from "@system/dice";

// Module Imports
import { getModuleSetting, registerModuleSettings, SETTINGS } from "@module/utils/settings.js";
import { nameToId } from "@module/utils/helpers.js";
import { applyRollConditions, decrementExhausted } from "@module/automations/conditions.js";
import { COSMERE_AUTOMATED_ACTIONS } from "@module/config";
import { macrosMap, startTurnItemMap, startTurnEffectMap, endTurnEffectMap, endTurnItemMap } from "./module/macros/maps";
import { MODULE_ID } from "./module/constants";

declare global{
    interface CONFIG {
        COSMERE: any;
        COSMERE_AUTOMATED_ACTIONS: typeof COSMERE_AUTOMATED_ACTIONS;
    }

    var cosmereAutomatedActions: {
		macrosMap: typeof macrosMap,
        startTurnItemMap: typeof startTurnItemMap,
        startTurnEffectMap: typeof startTurnEffectMap,
        endTurnItemMap: typeof endTurnItemMap,
        endTurnEffectMap: typeof endTurnEffectMap,
    };
}

Hooks.once('init', () => {
	globalThis.cosmereAutomatedActions = {
		macrosMap,
        startTurnItemMap,
        startTurnEffectMap,
        endTurnItemMap,
        endTurnEffectMap
	}

	registerModuleSettings();
});

//Automates item actions
Hooks.on(HOOKS.USE_ITEM, (item, _options) => {
	if(!getModuleSetting(SETTINGS.USE_AUTOMATIONS)){
		return;
	};
    //Gets item ID, checks if item has an associated macro, and then calls it
    const actor = item.actor;
    var itemId = item.system.id;
	if(!macrosMap.has(itemId)){itemId = nameToId(item.name)};
    const macro = globalThis.cosmereAutomatedActions.macrosMap.get(itemId);
    if(macro) macro(item,actor);
})

//Adds conditions to attack rolls
//Potentially replace after Roll Refactor
Hooks.on(HOOKS.ATTACK_ROLL, (roll: D20Roll, item: CosmereItem, _options: unknown) => {
	if(!getModuleSetting(SETTINGS.AUTOMATE_CONDITIONS)){
		return;
	};
    const actor = item.actor as CosmereActor;
    console.log("CAA | Applying Roll Conditions");
    applyRollConditions(roll, actor);
});

//Adds conditions to skill rolls
//Potentially replace after Roll Refactor
Hooks.on(HOOKS.SKILL_ROLL, (roll: D20Roll, actor: CosmereActor, _options: unknown) => {
	if(!getModuleSetting(SETTINGS.AUTOMATE_CONDITIONS)){
		return;
	};
    console.log("CAA | Applying Roll Conditions");
    applyRollConditions(roll, actor);
});

//Automatically remove one level of exhaustion after long rest
Hooks.on(HOOKS.REST, (actor, length) => {
	if(!getModuleSetting(SETTINGS.DECREMENT_EXHAUSTION)){
		return;
	};
	if(actor.effects.get("condexhausted000") && length === "long"){
		decrementExhausted(actor);
	};
});

function shouldCheckTurnStart(cosmereCombat: CosmereCombat, prior: Combat.HistoryData, current: Combat.HistoryData){
    return (getModuleSetting(SETTINGS.USE_AUTOMATIONS) && current.turn != null && game.user?.isActiveGM)
}
//Turn start hooks
Hooks.on('combatTurnChange', (
    cosmereCombat,
    prior,
    current
) => {
	if(!shouldCheckTurnStart(cosmereCombat, prior, current)){
		return;
	};
    //loops through combatants checking each item for start-turn behavior
    let combatant = cosmereCombat.turns[current.turn!];
    console.log(`Checking ${combatant.name} for start-turn items`);
    combatant.actor.items.forEach((item)=>{
        var itemId = item.system.id;
	    if(!startTurnItemMap.has(itemId)){itemId = nameToId(item.name)};
        const startTurnItemFunc = startTurnItemMap.get(itemId);
        if(startTurnItemFunc){
            console.log(`Calling start turn func for ${itemId}`)
            startTurnItemFunc(item, combatant.actor);
        };
    });

    //Checking activeEffects
    console.log(`Checking ${combatant.name} for start-turn effects`);
    combatant.actor.effects.forEach((effect)=>{
        if(!effect.flags[MODULE_ID]){
            return;
        }
        var effectId = effect.flags[MODULE_ID]?.start_turn_id!;
	    if(!startTurnEffectMap.has(effectId)){effectId = nameToId(effect.name)};
        const startTurnEffectFunc = startTurnEffectMap.get(effectId);
        if(startTurnEffectFunc){
            console.log(`Calling start turn func for ${effectId}`)
            startTurnEffectFunc(effect, combatant.actor);
        };
    });
});

function shouldCheckTurnEnd(cosmereCombat: CosmereCombat, prior: Combat.HistoryData, current: Combat.HistoryData){
    return (getModuleSetting(SETTINGS.USE_AUTOMATIONS) && prior.turn != null && game.user?.isActiveGM)
}
//Turn end hooks
Hooks.on('combatTurnChange', (
    cosmereCombat,
    prior,
    current
) => {
    if(!shouldCheckTurnEnd(cosmereCombat, prior, current)){
        return;
    }
    //loops through combatants checking each item for end-turn behavior
    //Checking items
    let combatant = cosmereCombat.turns[prior.turn!];
    console.log(`Checking ${combatant.name} for end-turn items`);
    combatant.actor.items.forEach((item)=>{
        var itemId = item.system.id;
	    if(!endTurnItemMap.has(itemId)){itemId = nameToId(item.name)};
        const endTurnItemFunc = endTurnItemMap.get(itemId);
        if(endTurnItemFunc){
            console.log(`Calling end turn func for ${itemId}`)
            endTurnItemFunc(item, combatant.actor);
        };
    });

    //Checking activeEffects
    console.log(`Checking ${combatant.name} for end-turn effects`);
    console.log(combatant.actor);
    combatant.actor.effects.forEach((effect)=>{
        if(!effect.flags[MODULE_ID]){
            return;
        }
        var effectId = effect.flags[MODULE_ID]?.end_turn_id!;
        console.log(`Effect: ${effect.id}`)
	    if(!endTurnEffectMap.has(effectId)){effectId = nameToId(effect.name)};
        const endTurnEffectFunc = endTurnEffectMap.get(effectId);
        if(endTurnEffectFunc){
            console.log(`Calling end turn func for ${effectId}`)
            endTurnEffectFunc(effect, combatant.actor);
        };
    });


});

Hooks.on

function shouldCheckRoundChange(cosmereCombat: CosmereCombat, prior: Combat.HistoryData, current: Combat.HistoryData){
    return (getModuleSetting(SETTINGS.USE_AUTOMATIONS) && game.user?.isActiveGM && prior.round! < current.round!)
}
//Round end hooks
Hooks.on('combatTurnChange', (
    cosmereCombat: CosmereCombat,
    prior,
    current,
) => {
    if(!shouldCheckRoundChange(cosmereCombat, prior, current)){
        return;
    }

});