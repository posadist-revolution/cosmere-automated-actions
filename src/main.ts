// System Imports
import { HOOKS } from "@system/constants/hooks.js";
import { CosmereItem, CosmereActor, CosmereCombat } from "@system/documents";
import { D20Roll } from "@system/dice";

// Module Imports
import { getModuleSetting, registerModuleSettings, SETTINGS } from "@module/utils/settings.js";
import { nameToId, log } from "@module/utils/helpers.js";
import { applyRollConditions, decrementExhausted } from "@module/automations/conditions.js";
import { COSMERE_AUTOMATED_ACTIONS } from "@module/config";
import { macrosMap, startTurnItemMap, startTurnEffectMap, endTurnEffectMap, endTurnItemMap, invFromZeroMap, invToZeroMap } from "./module/macros/maps";
import { MODULE_ID } from "./module/constants";
import { registerAllMacros } from "./module/macros/registration-helpers";

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

    const DEBUG = false;
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
    registerAllMacros();
});

//Automates item actions
Hooks.on(HOOKS.USE_ITEM, (item, _options) => {
	if(!getModuleSetting(SETTINGS.USE_AUTOMATIONS)){
		return;
	};
    //Gets item ID, checks if item has an associated macro, and then calls it
    const actor = item.actor;
    var itemId = item.system.id;
    log("Checking item usage: ");
    log(item);
	if(!macrosMap.has(itemId)){itemId = nameToId(item.name)};
    const macro = globalThis.cosmereAutomatedActions.macrosMap.get(itemId);
    if(macro && actor) macro(item, actor);
})

//Adds conditions to attack rolls
//Potentially replace after Roll Refactor
Hooks.on(HOOKS.ATTACK_ROLL, (roll: D20Roll, item: CosmereItem, _options: unknown) => {
	if(!getModuleSetting(SETTINGS.AUTOMATE_CONDITIONS)){
		return;
	};
    const actor = item.actor as CosmereActor;
    log("CAA | Applying Roll Conditions");
    applyRollConditions(roll, actor);
});

//Adds conditions to skill rolls
//Potentially replace after Roll Refactor
Hooks.on(HOOKS.SKILL_ROLL, (roll: D20Roll, actor: CosmereActor, _options: unknown) => {
	if(!getModuleSetting(SETTINGS.AUTOMATE_CONDITIONS)){
		return;
	};
    log("CAA | Applying Roll Conditions");
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
    // TODO: Performance improvements by creating a new boolean flag on actor, which updates to "true" when we add a thing which needs checking every turn,
    // and resets to false when we check a turn start and don't do anything. We need a different flag per turn event category, and to change the
    // startTurnItemFunc return type
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
    log(`Checking ${combatant.name} for start-turn items`);
    combatant.actor.items.forEach((item)=>{
        var itemId = item.system.id;
	    if(!startTurnItemMap.has(itemId)){itemId = nameToId(item.name)};
        const startTurnItemFunc = startTurnItemMap.get(itemId);
        if(startTurnItemFunc){
            log(`Calling start turn func for ${itemId}`)
            startTurnItemFunc(item, combatant.actor, current);
        };
    });

    //Checking activeEffects
    log(`Checking ${combatant.name} for start-turn effects`);
    combatant.actor.effects.forEach((effect)=>{
        if(!effect.flags[MODULE_ID]){
            return;
        }
        var effectId = effect.flags[MODULE_ID]?.start_turn_id!;
	    if(!startTurnEffectMap.has(effectId)){effectId = nameToId(effect.name)};
        const startTurnEffectFunc = startTurnEffectMap.get(effectId);
        if(startTurnEffectFunc){
            log(`Calling start turn func for ${effectId}`)
            startTurnEffectFunc(effect, current);
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
    log(`Checking ${combatant.name} for end-turn items`);
    combatant.actor.items.forEach((item)=>{
        var itemId = item.system.id;
	    if(!endTurnItemMap.has(itemId)){itemId = nameToId(item.name)};
        const endTurnItemFunc = endTurnItemMap.get(itemId);
        if(endTurnItemFunc){
            log(`Calling end turn func for ${itemId}`)
            endTurnItemFunc(item, combatant.actor, prior);
        };
    });

    //Checking activeEffects
    log(`Checking ${combatant.name} for end-turn effects`);
    log(combatant.actor);
    combatant.actor.effects.forEach((effect)=>{
        if(!effect.flags[MODULE_ID]){
            return;
        }
        var effectId = effect.flags[MODULE_ID]?.end_turn_id!;
	    if(!endTurnEffectMap.has(effectId)){effectId = nameToId(effect.name)};
        const endTurnEffectFunc = endTurnEffectMap.get(effectId);
        if(endTurnEffectFunc){
            log(`Calling end turn func for ${effectId}`)
            endTurnEffectFunc(effect, prior);
        };
    });


});

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

// Investiture change hooks
function shouldCheckInvChanged(actor: CosmereActor, changed: Actor.UpdateData){
    return foundry.utils.hasProperty(changed, 'system.resources.inv.value');
}

function shouldCheckInvToZero(actor: CosmereActor, changed: Actor.UpdateData){
    if(changed.system.resources.inv.value == 0){
        return true;
    }
    return false;
}

function shouldCheckInvFromZero(actor: CosmereActor, changed: Actor.UpdateData){
    if(actor.system.resources.inv.value == 0){
        return true;
    }
    return false;
}

Hooks.on('preUpdateActor', (
    actor: CosmereActor,
    changed: Actor.UpdateData
) => {
    if(!shouldCheckInvChanged(actor, changed)){
        return;
    }
    log("Checking from an investiture change");
    if(shouldCheckInvToZero(actor, changed)){
        log("Checking for an action to take on hitting 0 inv");
        for(const effect of actor.effects){
            const noInvFunc = invToZeroMap.get(effect.flags[MODULE_ID]?.no_inv_id!);
            if(noInvFunc){
                noInvFunc(actor);
            }
        }
    }
    else if (shouldCheckInvFromZero(actor, changed)){
        log("Checking for an action to take gaining inv");
        // Handle going from 0 investiture to some investiture
        for(const talent of actor.talents){
            const gainInvFunc = invFromZeroMap.get(talent.system.id);
            if(gainInvFunc){
                gainInvFunc(actor);
            }
        }

    }
})