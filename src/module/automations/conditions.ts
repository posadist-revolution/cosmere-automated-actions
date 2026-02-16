import { D20Roll } from "@system/dice";
import { CosmereActiveEffect } from "@system/documents";
import { CosmereActor } from "@system/documents/actor";
import { log } from "../utils/helpers";

export function applyRollConditions(roll: D20Roll, actor: CosmereActor){
    if(actor.effects.contents.length === 0){
        log("CAA | No effects found");
        return;
    };
    //checks each effect of actor against list of conditions
    actor.effects.forEach(effect => {
        switch(effect.id){
            case"condexhausted000":
                //THIS WILL NEED TO BE UPDATED AFTER UPCOMING ROLL REFACTOR
                //Applies exhausted modifier equal to each roll
                const newOperator = new foundry.dice.terms.OperatorTerm({operator: "-"});
                const newTerm = new foundry.dice.terms.NumericTerm({number: effect.system.stacks as number});
                roll.terms.push(newOperator, newTerm);
            break
            case"condafflicted000":
                //No need to automate as part of a roll
            break
            case"condempowered000":
                //Currently non functional
            break
            case"condfocused00000":
                //No need to automate as part of roll
            break
            case"condrestrained00":
                //Currently non functional
            break
            case"condsurprised000":
                //No need to automate as part of roll
            break
            case"conddetermined00":
                //Not sure how to automate this one yet
            break
            case"condenhanced0000":
                //No need to automate as part of roll, system automates already
            break
            case"condimmobilized0":
                //No need to automate as part of roll
            break
            case"condslowed000000":
                //No need to automate as part of roll
            break
            case"condunconscious0":
                //No need to automate as part of roll
            break
            case"conddisoriented0":
                //Currently non functional
            break
            case"condprone0000000":
                //No need to automate as part of roll
            break
            case"condstunned00000":
                //No need to automate as part of roll
            break
            case"conddead00000000":
                //No need to automate as part of roll
            break
        }
    });
    roll.resetFormula();
}

export async function decrementExhausted(actor: CosmereActor){
    const effect = actor.effects.get("condexhausted000")!;
    const newStacks = effect.stacks - 1;
        if (newStacks > 0) {
            // Update the effect
            let updateData = {
                system: {
                    stacks: newStacks
                }
            }
            await effect.update(updateData as unknown as ActiveEffect.UpdateData);
            // await effect.update({ 'system.stacks': newStacks });
        } else {
            await actor.toggleStatusEffect("exhausted");
        }
}