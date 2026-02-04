import { macros, roundIncriment } from "./module/macros/index.js";
import { getModuleSetting, registerModuleSettings, SETTINGS } from "./module/utils/settings.js";
import { nameToId } from "./module/utils/helpers.js";
import { MODULE_ID } from "./module/utils/constants.js";
import { applyRollConditions, decrementExhausted } from "./module/automations/conditions.js";
import { HOOKS } from "./declarations/cosmere-rpg/constants/hooks.js";
import { CosmereItem } from "./declarations/cosmere-rpg/documents/item.js";
import { COSMERE_AUTOMATED_ACTIONS } from "./module/config.js";
import { CosmereActor } from "./declarations/cosmere-rpg/documents/actor.js";

declare global{
    interface CONFIG {
        COSMERE_AUTOMATED_ACTIONS: typeof COSMERE_AUTOMATED_ACTIONS;
    }

    // NOTE: Must use var to affect globalThis
    // eslint-disable-next-line no-var
    var cosmereAutomatedActions: {
		macros: any,
        roundIncriment: any,
    };
}

Hooks.once('init', () => {
	cosmereAutomatedActions = {
		macros,
        roundIncriment,
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
	if(itemId = "new-action"){itemId = nameToId(item.name)};
    const macro = cosmereAutomatedActions.macros[itemId];
    if(macro) macro(item,actor);
})

//Adds conditions to attack rolls
//Potentially replace after Roll Refactor
Hooks.on(HOOKS.ATTACK_ROLL, (roll: Roll, item: CosmereItem, _options: unknown) => {
	if(!getModuleSetting(SETTINGS.AUTOMATE_CONDITIONS)){
		return;
	};
    const actor = item.actor as CosmereActor;
    console.log("CAA | Applying Roll Conditions");
    applyRollConditions(roll, actor);
});

//Adds conditions to skill rolls
//Potentially replace after Roll Refactor
Hooks.on(HOOKS.SKILL_ROLL, (roll: Roll, actor: CosmereActor, _options: unknown) => {
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

//Automated items that incriment during combat
Hooks.on('combatTurnChange', (cosmereCombat) => {
	if(!getModuleSetting(SETTINGS.USE_AUTOMATIONS)){
		return;
	};
    //loops through combatants checking each item for a round incrimenting item
    cosmereCombat.turns.forEach((combatant)=>{
        combatant.actor.items.forEach((item)=>{
            var itemId = item.system.id;
	        if(itemId = "new-action"){itemId = nameToId(item.name)};
            const roundIncriment = cosmereAutomatedActions.roundIncriment[itemId];
            if(roundIncriment){
                roundIncriment(item, combatant.actor);
            };
        });
    });
});