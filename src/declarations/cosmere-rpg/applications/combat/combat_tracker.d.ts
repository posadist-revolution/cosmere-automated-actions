export interface CosmereTurnContext extends foundry.applications.sidebar.tabs.CombatTracker.TurnContext {
    type?: Actor.SubType;
    turnSpeed?: TurnSpeed;
    activated?: boolean;
    isBoss?: boolean;
    bossFastActivated?: boolean;
}

export interface CosmereTrackerContext extends foundry.applications.sidebar.tabs.CombatTracker.TrackerContext {
    turns: CosmereTurnContext[];
    fastPlayers: CosmereTurnContext[];
    slowPlayers: CosmereTurnContext[];
    fastNPC: CosmereTurnContext[];
    slowNPC: CosmereTurnContext[];
}

export declare class CosmereCombatTracker extends foundry.applications.sidebar.tabs
    .CombatTracker {

    static PARTS : any;

    public override async _prepareTrackerContext(
        context: foundry.applications.sidebar.tabs.CombatTracker.RenderContext & CosmereTrackerContext,
        options: foundry.applications.sidebar.tabs.CombatTracker.RenderOptions,
    ) : boolean;
}