export interface ArmorItemData extends IdItemData, DescriptionItemData, EquippableItemData, ActivatableItemData, ExpertiseItemData, TraitsItemData<ArmorTraitId>, DeflectItemData, PhysicalItemData {
}
export declare class ArmorItemDataModel implements ArmorItemData extends foundry.abstract.TypeDataModel<ArmorItemData> {}