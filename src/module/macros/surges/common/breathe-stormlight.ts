import { getModuleSetting, SETTINGS } from "@src/module/utils/settings";
import { CosmereItem, CosmereActor, LootItem } from "@system/documents";

export async function breatheStormlight(item: CosmereItem, actor: CosmereActor){
  //Sets investiture value to max
  // console.log(`Current investiture is ${actor.system.resources.inv.value} out of ${actor.system.resources.inv.max.value}`);
  let invToRefill = 0;
  if(getModuleSetting(SETTINGS.SPHERE_DUNNING)){
    //@ts-ignore
	  let actSpheres = actor.items.filter(i=> i.type === "loot" && i.system.price.currency === "spheres" && i.system.quantity > 0);
    actSpheres = actSpheres.filter(i=> i.name.toLowerCase().includes("mark") || i.name.toLowerCase().includes("broam"));
    // console.log(actSpheres);
    invToRefill = actor.system.resources.inv.max.value - actor.system.resources.inv.value;
    while (invToRefill > 0){
      if(!(await drainRandomSphere(actSpheres, actor))){
        break;
      }
      invToRefill--;
      //@ts-ignore
      actSpheres = actor.items.filter(i=> i.type === "loot" && i.system.price.currency === "spheres" && i.system.quantity > 0);
      actSpheres = actSpheres.filter(i=> i.name.toLowerCase().includes("mark") || i.name.toLowerCase().includes("broam"));
    }
    if(invToRefill > 0){
      ui.notifications?.warn(`${actor.name} doesn't have enough spheres to refill ${invToRefill} investiture!`);
    }
  }
  const actorInvMax = actor.system.resources.inv.max.value;
  const actorInvResult = actorInvMax - invToRefill;
  actor.update({ 'system.resources.inv.value': actorInvResult } as any);
  //TODO: Make sure this works with new system breathe stormlight
}

async function drainRandomSphere(actSpheres: CosmereItem[], actor: CosmereActor){
  let sphereItemList: LootItem[] = [];
  let totalNumSpheres = 0;
  for(const sphereItem of actSpheres){
    //@ts-ignore
    totalNumSpheres += sphereItem.system.quantity;
  }
  if(totalNumSpheres <= 0){
    return false;
  }
  let sphereNumberToDrainFrom = Math.floor(Math.random() * totalNumSpheres);
  // console.log(`Draining from sphere #${sphereNumberToDrainFrom}`);
  totalNumSpheres = 0;
  let sphereIndexToDrainFrom = 0;
  for(const sphereItem of actSpheres){
    //@ts-ignore
    totalNumSpheres += sphereItem.system.quantity
    if(totalNumSpheres >= sphereNumberToDrainFrom){
      sphereIndexToDrainFrom = actSpheres.indexOf(sphereItem);
      break;
    }
  }
  //determine the new quantity and update loot object
  //@ts-ignore
  let newQuant = actSpheres[sphereIndexToDrainFrom].system.quantity - 1;
  //@ts-ignore
  await actSpheres[sphereIndexToDrainFrom].update({'system.quantity': newQuant});

  //find a matching dun sphere object or make one if it doens't exist
  //@ts-ignore
  let dunSphere = actor.items.filter(k=> k.type === "loot" && k.system.price.currency === "dun" && k.name.includes(actSpheres[sphereIndexToDrainFrom].name));
  // console.log(dunSphere);
  if (dunSphere.length<1) {
    let tempSphere = actSpheres[sphereIndexToDrainFrom].toObject();
    tempSphere.name += " (Dun)";
    tempSphere.system.price.currency = "dun";
    tempSphere.system.quantity = 0;
    await actor.createEmbeddedDocuments("Item",[tempSphere]);
    //@ts-ignore
    dunSphere = actor.items.filter(k=> k.type === "loot" && k.system.price.currency === "dun" && k.name.includes(actSpheres[sphereIndexToDrainFrom].name));
  }
  // update dun sphere quantity
  //@ts-ignore
  let dunQuant = Number(dunSphere[0].system.quantity) + 1;
  //@ts-ignore
  await dunSphere[0].update({'system.quantity': dunQuant});
  return true;
}