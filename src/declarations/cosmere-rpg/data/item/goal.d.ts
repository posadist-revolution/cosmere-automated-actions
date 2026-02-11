export interface GoalItemData extends IdItemData, DescriptionItemData {
    /**
     * The progress level of the goal
     */
    level: number;
    /**
     * The rewards for completing the goal
     */
    rewards: Collection<Goal.Reward>;
}

export declare class GoalItemDataModel implements GoalItemData, foundry.abstract.TypeDataModel<GoalItemData> {}