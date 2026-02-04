export async function disquiet(item, actor){
    const target = game.user.targets.first();
    let newValue = 0
    const startFocus = target.actor.system.resources.foc.value
    let dialogWindow = await foundry.applications.api.DialogV2.wait({
    window: { title: "Disquiet" },
    content: "<p>Do you know one of the target's goal?</p>",
    buttons: [
    {
        label: "Yes (Remove 1d4 focus from target)",
        action: "advantage",
        callback: async () => {
            let r = await new Roll("1d4").evaluate()
            await r.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: actor }),
                flavor: `${target.actor.name} loses focus`,
            })
            newValue = startFocus - r.total
            if(newValue < 0){
                newValue = 0
            }
            await target.actor.update({"system.resources.foc.value": newValue})
        }
    },
    {
        label: "No (Remove 1 focus from target",
        action: "standard",
        default: true,
        callback: async () => {
            newValue = startFocus - 1
            if(newValue < 0){
                newValue = 0
            }
            await target.actor.update({"system.resources.foc.value": newValue})                
        }
    }]
})
    dialogWindow;
}