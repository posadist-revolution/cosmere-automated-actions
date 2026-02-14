// System Imports
import { TurnSpeed } from '@system/types/cosmere';
import { CosmereActor } from './actor';
import { SYSTEM_ID } from '@system/constants';
import { CombatantDataModel } from '@system/data/combatant';

// Module Imports
import { MODULE_ID } from '@module/constants';
import { MODULE_COMBATANT_FLAGS } from '@module/config';

export declare class CosmereCombatant extends foundry.documents.Combatant {
    system: CombatantDataModel;
    static defineSchema(): Combatant.Schema;
    static get schema(): foundry.data.fields.SchemaField<Combatant.Schema>;
    get actor(): CosmereActor;
    get isBoss(): boolean;
    get initiative(): number;
    get turnSpeed(): TurnSpeed;
    get activated(): boolean;
    get bossFastActivated(): boolean;
    rollInitiative(): Promise<this>;
    /**
     * Utility function to flip the combatants current turn speed between slow and fast. It then updates initiative to force an update of the combat-tracker ui
     */
    toggleTurnSpeed(): Promise<void>;
    markActivated(bossFastActivated?: boolean): Promise<void>;
    resetActivation(): Promise<void>;
}
export declare namespace CosmereCombatant {
    type Schema = Omit<Combatant.Schema, 'initiative'>;
}
declare module '@league-of-foundry-developers/foundry-vtt-types/configuration' {
    interface ConfiguredCombatant<SubType extends Combatant.SubType> {
        document: CosmereCombatant;
    }
    interface FlagConfig {
        Combatant: {
            [SYSTEM_ID]: {
                turnSpeed: TurnSpeed;
                bossFastActivated: boolean;
                activated: boolean;
            };
            [MODULE_ID]: MODULE_COMBATANT_FLAGS;
        };
    }
}
