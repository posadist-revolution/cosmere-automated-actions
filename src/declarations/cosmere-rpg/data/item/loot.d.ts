export interface LootItemData extends DescriptionItemData, PhysicalItemData {
    /**
     * Is this item a form of currency?
     * If so, its value will be added to the character's total.
     */
    isMoney: boolean;
}
export declare class LootItemDataModel implements LootItemData, foundry.abstract.TypeDataModel<LootItemData> {}