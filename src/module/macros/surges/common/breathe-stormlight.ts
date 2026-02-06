import { CosmereItem, CosmereActor } from "@system/documents";

export function breatheStormlight(item: CosmereItem, actor: CosmereActor){
  //Sets investiture value to max
  const actorInvMax = actor.system.resources.inv.max.value;
  actor.update({ 'system.resources.inv.value': actorInvMax });
}