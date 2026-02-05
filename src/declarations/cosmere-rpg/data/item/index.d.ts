import { ItemType } from '@system/types/cosmere';
import { WeaponItemDataModel } from './weapon';
import { ArmorItemDataModel } from './armor';
import { EquipmentItemDataModel } from './equipment';
import { LootItemDataModel } from './loot';
import { AncestryItemDataModel } from './ancestry';
import { CultureItemDataModel } from './culture';
import { PathItemDataModel } from './path';
import { TalentItemDataModel } from './talent';
import { TraitItemDataModel } from './trait';
import { ActionItemDataModel } from './action';
import { InjuryItemDataModel } from './injury';
import { ConnectionItemDataModel } from './connection';
import { GoalItemDataModel } from './goal';
import { PowerItemDataModel } from './power';
import { TalentTreeItemDataModel } from './talent-tree';
export declare const config: {
    weapon: typeof WeaponItemDataModel;
    armor: typeof ArmorItemDataModel;
    equipment: typeof EquipmentItemDataModel;
    loot: typeof LootItemDataModel;
    ancestry: typeof AncestryItemDataModel;
    culture: typeof CultureItemDataModel;
    path: typeof PathItemDataModel;
    talent: typeof TalentItemDataModel;
    trait: typeof TraitItemDataModel;
    action: typeof ActionItemDataModel;
    injury: typeof InjuryItemDataModel;
    connection: typeof ConnectionItemDataModel;
    goal: typeof GoalItemDataModel;
    power: typeof PowerItemDataModel;
    talent_tree: typeof TalentTreeItemDataModel;
};
export {WeaponItemData, WeaponItemDataModel} from './weapon';
export * from './armor';
export * from './equipment';
export * from './loot';
export * from './ancestry';
export * from './culture';
export * from './path';
export * from './talent';
export * from './action';
export * from './injury';
export * from './connection';
export * from './trait';
export * from './goal';
export * from './power';
export * from './talent-tree';
declare module "@league-of-foundry-developers/foundry-vtt-types/configuration" {
    interface DataModelConfig {
        Item: {
            [ItemType.Weapon]: typeof WeaponItemDataModel;
            [ItemType.Armor]: typeof ArmorItemDataModel;
            [ItemType.Equipment]: typeof EquipmentItemDataModel;
            [ItemType.Loot]: typeof LootItemDataModel;
            [ItemType.Ancestry]: typeof AncestryItemDataModel;
            [ItemType.Culture]: typeof CultureItemDataModel;
            [ItemType.Path]: typeof PathItemDataModel;
            [ItemType.Talent]: typeof TalentItemDataModel;
            [ItemType.Trait]: typeof TraitItemDataModel;
            [ItemType.Action]: typeof ActionItemDataModel;
            [ItemType.Injury]: typeof InjuryItemDataModel;
            [ItemType.Connection]: typeof ConnectionItemDataModel;
            [ItemType.Goal]: typeof GoalItemDataModel;
            [ItemType.Power]: typeof PowerItemDataModel;
            [ItemType.TalentTree]: typeof TalentTreeItemDataModel;
        };
    }
}
