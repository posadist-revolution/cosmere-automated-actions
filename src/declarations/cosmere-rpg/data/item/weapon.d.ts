export interface WeaponItemData extends IdItemData<WeaponId>, TypedItemData<WeaponType>, DescriptionItemData, EquippableItemData, ActivatableItemData, AttackingItemData, DamagingItemData, ExpertiseItemData, TraitsItemData<WeaponTraitId>, Partial<PhysicalItemData> {
}
export declare class WeaponItemDataModel implements WeaponItemData, foundry.abstract.TypeDataModel<WeaponItemData> {}