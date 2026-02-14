export interface EquipmentItemData extends TypedItemData<EquipmentType>, DescriptionItemData, PhysicalItemData, ActivatableItemData, DamagingItemData {
}
export declare class EquipmentItemDataModel implements EquipmentItemData, foundry.abstract.TypeDataModel<EquipmentItemData> {}