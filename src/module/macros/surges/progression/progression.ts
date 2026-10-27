import { CosmereActiveEffect, CosmereActor, CosmereItem, MESSAGE_TYPES } from "@system/documents";
import { deleteItemAndDescendants, getFirstTarget, giveActorEffect, giveActorItem, log } from "../../../utils/helpers";
import { MODULE_ID, SYSTEM_ID } from "@src/module/constants";
import { spendEffectInvestiture, getSurgeTalents, sizes, getInfusionInvestiture, getConsumedInvestiture, useCanceled, getAbilityDescription } from "../helpers/surge-helpers";
import { PRG } from "./talent-ids";
import { renderSystemTemplate, SYSTEM_TEMPLATES } from "@src/module/utils/system-templates";
import { DamageRollConfiguration } from "@src/declarations/cosmere-rpg/dice";
import { DamageType } from "@src/declarations/cosmere-rpg/types/cosmere";
import { damageRoll } from "@src/module/system-clones/dice";

//#region Macro Functions
export async function progression(item: CosmereItem, actor: CosmereActor){
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Progression" },
        content: "<p>Which skill would you like to use?</p>",
        buttons:
        [{
            label: "Plant Growth",
            action: "plant growth",
            callback: async () => {applyPlantGrowthInfusion(item, actor)}
        },
        {
            label: "Character Regrowth",
            action: "character regrowth",
            callback: async () => {applyRegrowthInfusion(item, actor)}
        }]
    })
};

// 3.x Stormlight Handbook actions, one per Progression skill
export async function plantGrowth(item: CosmereItem, actor: CosmereActor){
    await applyPlantGrowthInfusion(item, actor);
}

export async function characterRegrowth(item: CosmereItem, actor: CosmereActor, options?: CosmereItem.UseOptions){
    await applyRegrowthInfusion(item, actor, getConsumedInvestiture(options));
}

export async function cancelCharacterRegrowth(item: CosmereItem, actor: CosmereActor){
    await deleteItemAndDescendants(item);
}
//#endregion

//#region Start Turn Effects

export async function characterRegrowthEffectStartTurn(effect: CosmereActiveEffect, turn: Combat.HistoryData){
    const casterCancelItemUUID = effect.origin;
    const targetActor = effect.parent as CosmereActor;
    const casterCancelItem = await fromUuid(casterCancelItemUUID) as CosmereItem | null;
    const casterActor = casterCancelItem?.parent as CosmereActor | undefined;
    if(!targetActor){
        return;
    }
    if(!casterActor){
        // The caster's cancel item is gone, so the infusion has ended
        await effect.delete();
        return;
    }
    // Only heal once per round, even if this turn start fires again (stepping the tracker back and forth)
    if(effect.getFlag(MODULE_ID, "last_heal_round") === turn.round){
        return;
    }
    const healsDone = (effect.getFlag(MODULE_ID, "heals_done") ?? 0) + 1;
    await effect.update({
        flags: {
            [MODULE_ID]: {
                last_heal_round: turn.round!,
                heals_done: healsDone
            }
        }
    });

    //heals target
    let progressionTalents = getSurgeTalents(casterActor, "prg");
    let swiftRegeneration = false;
    let rollFormula = "@scalar.power.prg.die";
    for(const talent of progressionTalents){
        if(talent.system.id == PRG.RELIABLE_PROGRESSION){
            let progressionRank = casterActor.system.skills.prg.rank;
            rollFormula = `{@scalar.power.prg.die, ${progressionRank}}kh`;
        }
        else if(talent.system.id == PRG.SWIFT_REGENERATION){
            swiftRegeneration = true;
        }
    }
    if(swiftRegeneration){
        rollFormula += ` + ${casterActor.system.skills.prg.mod.value}`;
    }
    //TODO: Add effects from Swift Healer and Applied Medicine
    const sectionHTML = await renderSystemTemplate(SYSTEM_TEMPLATES.CHAT_CARD_DESCRIPTION, {
        title: effect.name,
        img: effect.img,
        description: effect.description,
    });
    const messageConfig = {
        user: game.user?.id,
        speaker: ChatMessage.getSpeaker({ actor: casterActor }),
        rolls: [] as foundry.dice.Roll[],
        flags: {} as Record<string, unknown>,
    };

    messageConfig.flags[SYSTEM_ID] = {
        message: {
            type: MESSAGE_TYPES.ACTION,
            description: sectionHTML,
        },
    };

    const rollData = casterActor.getRollData();
    const damageRollConfig: DamageRollConfiguration = {
        formula: rollFormula,
        data: rollData,
        damageType: DamageType.Healing,
        damageSourceName: effect.name,
    }
    let r = await damageRoll(damageRollConfig);
    messageConfig.rolls.push(r as unknown as foundry.dice.Roll);
    // await r.toMessage(messageConfig);
    await ChatMessage.create(messageConfig);
    await targetActor.applyHealing(r.total!);

    // Investiture is spent with each heal (every n heals with Extended Regrowth, n = Progression rank)
    // rather than on the caster's turn, so the number of heals doesn't depend on turn order
    const healsPerInvestiture = hasProgressionTalent(casterActor, PRG.EXTENDED_REGROWTH) ? casterActor.system.skills.prg.rank : 1;
    if(healsDone % healsPerInvestiture == 0 && !await spendEffectInvestiture(effect, turn.round!)){
        await cancelCharacterRegrowth(casterCancelItem!, casterActor);
    }
}
//#endregion

//#region Helpers
function hasProgressionTalent(actor: CosmereActor, talentId: string){
    return getSurgeTalents(actor, "prg").some(talent => talent.system.id == talentId);
}

async function applyPlantGrowthInfusion(item: CosmereItem, actor: CosmereActor){
    const target = getFirstTarget();
    const actorProgressionRank = actor.system.skills.prg.rank;
    //Creates array of buttons based on actor progression rank
    let plantGrowthButtons = [];
    switch (actorProgressionRank){
        default:
        case 5:
            plantGrowthButtons.unshift({
                label: "Gargantuan",
                action: "gargantuan"
            });
        case 4:
            plantGrowthButtons.unshift({
                label: "Huge",
                action: "huge"
            });
        case 3:
            plantGrowthButtons.unshift({
                label: "Large",
                action: "large"
            });
        case 2:
            plantGrowthButtons.unshift({
                label: "Medium",
                action: "medium"
            });
        case 1:
            plantGrowthButtons.unshift({
                label: "Small",
                action: "small"
            });
        break;
    }
    const plantGrowthDialog = await foundry.applications.api.DialogV2.wait({
        window:{ title: "Plant Growth"},
        content: "How large would you like to grow the plant?",
        buttons: plantGrowthButtons
    })
    // Changes size of targeted token to the output of plantGrowthDialog
    if(target && plantGrowthDialog){
        await target.document.update(sizes[plantGrowthDialog]);
    };
}

// consumedInvestiture is what a 3.x Character Regrowth action already spent;
// legacy Progression actions only spend 1 up front, and the rest is prompted for here
async function applyRegrowthInfusion(item: CosmereItem, actor: CosmereActor, consumedInvestiture?: number){
    const target = getFirstTarget();
    const alreadySpent = consumedInvestiture ?? 1;
    if(!target){
        ui.notifications?.warn("Needs target");
        await useCanceled(item, actor, alreadySpent);
        return;
    }
    else if(!target.actor){
        ui.notifications?.warn("Needs target with an actor");
        await useCanceled(item, actor, alreadySpent);
        return;
    }
    // Only prompt if the action didn't already ask how much to infuse (e.g. consumption was skipped)
    let infusedInvestiture = consumedInvestiture || await getInfusionInvestiture(item, actor, alreadySpent);
    // With Extended Regrowth, investiture is only expended every n rounds (n = Progression rank)
    const roundsPerInvestiture = hasProgressionTalent(actor, PRG.EXTENDED_REGROWTH) ? actor.system.skills.prg.rank : 1;

    //Adds "Cancel Regrowth" item to caster
    const cancelRegrowthCasterUUID = "Compendium.cosmere-automated-actions.caaactions.Item.LNAzM5dFOJ4fqqdL";
    const cancelRegrowthCaster = await giveActorItem(actor, cancelRegrowthCasterUUID)
    if(cancelRegrowthCaster) {
        //Adds "Regrowth Infusion" item to target
        const regrowthInfusionEffectCreateData: ActiveEffect.CreateData = {
            name:`Character Regrowth (${infusedInvestiture} inv left)`,
            img: "icons/magic/life/cross-beam-green.webp",
            disabled: false,
            duration: {
                "rounds": infusedInvestiture * roundsPerInvestiture,
                "startTime": null,
                "seconds": null,
                "combat": null,
                "turns": null,
                "startRound": null,
                "startTurn": null
            },
            type: "base",
            //@ts-ignore
            system: {
                "isStackable": false,
                "stacks": null
            },
            description: getAbilityDescription(item.system.description.value, "Character Regrowth"),
            origin: cancelRegrowthCaster.uuid,
            sort: 0,
            flags: {
                [MODULE_ID]: {
                    infusion_inv_remaining: infusedInvestiture,
                    start_turn_id: PRG.REGROWTH_INFUSION,
                    start_round: game.combat?.round ?? 0,
                }
            }
        };
        const regrowthInfusionEffect = await giveActorEffect(target.actor, regrowthInfusionEffectCreateData);
        cancelRegrowthCaster.setFlag(MODULE_ID, "descendantUuids", [regrowthInfusionEffect?.uuid!]);
    }
}
//#endregion