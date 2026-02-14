export interface TraitItemData extends DescriptionItemData, ActivatableItemData {
}
/**
 * Item data model that represents adversary traits.
 * Not to be confused with weapon & armor traits
 */
export declare class TraitItemDataModel implements TraitItemData, foundry.abstract.TypeDataModel<TraitItemData> {}