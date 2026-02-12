// System Imports
import { HOOKS } from "@system/constants/hooks.js";
import { CosmereItem, CosmereActor, CosmereCombat } from "@system/documents";
import { D20Roll } from "@system/dice";

// Module Imports
import { macrosMap, roundIncrimentMap } from "@module/macros/index.js";
import { getModuleSetting, registerModuleSettings, SETTINGS } from "@module/utils/settings.js";
import { nameToId } from "@module/utils/helpers.js";
import { applyRollConditions, decrementExhausted } from "@module/automations/conditions.js";
import { COSMERE_AUTOMATED_ACTIONS } from "@module/config";

declare global{
    interface CONFIG {
        COSMERE: any;
        COSMERE_AUTOMATED_ACTIONS: typeof COSMERE_AUTOMATED_ACTIONS;
    }

    var cosmereAutomatedActions: {
		macrosMap: typeof macrosMap,
        roundIncrimentMap: typeof roundIncrimentMap,
    };
}

Hooks.once('init', () => {
	globalThis.cosmereAutomatedActions = {
		macrosMap,
        roundIncrimentMap,
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
    return (getModuleSetting(SETTINGS.USE_AUTOMATIONS) && current.turn && game.user?.isActiveGM)
}
//Automated items that incriment during combat
Hooks.on('combatTurnChange', (
    cosmereCombat,
    prior,
    current
) => {
	if(!shouldCheckTurnStart(cosmereCombat, prior, current)){
		return;
	};
    //loops through combatants checking each item for a round incrimenting item
    let combatant = cosmereCombat.turns[current.turn!];
    console.log(`Checking ${combatant.name} for round-incrementing items`);
    combatant.actor.items.forEach((item)=>{
        var itemId = item.system.id;
	    if(!macrosMap.has(itemId)){itemId = nameToId(item.name)};
        const roundIncriment = globalThis.cosmereAutomatedActions.roundIncrimentMap.get(itemId);
        if(roundIncriment){
            console.log(`Calling round increment for ${itemId}`)
            roundIncriment(item, combatant.actor);
        };
    });
});

function shouldCheckRoundStart(cosmereCombat: CosmereCombat, prior: Combat.HistoryData, current: Combat.HistoryData){
    return (getModuleSetting(SETTINGS.USE_AUTOMATIONS) && game.user?.isActiveGM && prior.round! < current.round!)
}
//Round end hooks
Hooks.on('combatTurnChange', (
    cosmereCombat: CosmereCombat,
    prior,
    current,
) => {
    if(!shouldCheckRoundStart(cosmereCombat, prior, current)){
        return;
    }
    // Remove effects which have expired here

});