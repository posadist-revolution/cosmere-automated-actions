import { CosmereItem, CosmereActor } from "@system/documents";

export async function stormlightReclamation(item: CosmereItem, actor: CosmereActor) {
	//create popup to ask "how much stormlight do you reclaim"
	let maxInvToReclaim = actor.system.resources.inv.max.value - actor.system.resources.inv.value;
	let promptConfig: foundry.applications.api.DialogV2.PromptConfig = {
    	window: { title: "How much stormlight do you reclaim?" },
		content: `<input name="value" type="number" min="1" max="${maxInvToReclaim}" step="1" autofocus>`,
    	ok: {
	      	label: "Submit",
      		callback: (event, button, dialog) => {
				//@ts-ignore
				var newValue = actor.system.resources.inv.value + button.form?.elements.namedItem("value")?.valueAsNumber;
				if (newValue > actor.system.resources.inv.max.value){ newValue = actor.system.resources.inv.max.value};
				actor.update({ 'system.resources.inv.value': newValue });
			}
    	}
	}
	//In foundry version 13 potentially replace with .input for cleaner macro?
	await foundry.applications.api.DialogV2.prompt(promptConfig);
}