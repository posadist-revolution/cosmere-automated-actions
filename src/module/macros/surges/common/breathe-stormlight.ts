
export function breatheStormlight(item, actor){
  //Sets investiture value to max
  const actorInvMax = actor.system.resources.inv.max.value;
  actor.update({ 'system.resources.inv.value': actorInvMax });
}