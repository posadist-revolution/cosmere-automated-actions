import { getFirstTarget } from "../../../utils/helpers";

export async function fromTheBrink(){
    const target = getFirstTarget()
    //If user isn't dead, throws error
    if (target.actor.system.resources.hea.value > 0){
        ui.notifications.warn("Attempting to revive a healthy character!");
        return;
    }
    //Sets user to unconcious, removes dead condition, sets health to 0
    target.actor.toggleStatusEffect("unconscious", {active: true});
    target.actor.toggleStatusEffect("dead", {active: false});
    target.actor.update({"system.resources.hea.value": 0});
}
