import { actorHealth, actorHealthMax, actorRecoveryDie } from "../utils"

export async function recover(){
    if(actorHealth < actorHealthMax){
    let newHealth = actorHealth += new Roll("1" + actorRecoveryDie).toMessage()
        if(newHealth > actorHealthMax){
            newHealth = actorHealthMax
        }
    actorHealth = newHealth
    }
}