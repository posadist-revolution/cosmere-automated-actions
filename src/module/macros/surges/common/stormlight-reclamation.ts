export async function stormlightReclamation(item, actor) {
	//create popup to ask "how much stormlight do you reclaim"
	await foundry.applications.api.DialogV2.prompt({ //In foundry version 13 potentially replace with .input for cleaner macro?
    	window: { title: "How much stormlight do you reclaim?" },
		content: '<input name="value" type="number" min="1" max="99" step="1" autofocus>',
    	ok: {
	      	label: "Submit",
      		callback: (event, button, dialog) => {
				var newValue = actor.system.resources.inv.value + button.form.elements.value.valueAsNumber;
				if (newValue > actor.system.resources.inv.max.value){ newValue = actor.system.resources.inv.max.value};
				actor.update({ 'system.resources.inv.value': newValue });
			}
    	}
	});
}