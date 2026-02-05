import { ActorType } from '@system/types/cosmere';
import { AdversaryActorDataModel } from './adversary';
import { CharacterActorDataModel } from './character';
import { CommonActorDataModel } from './common';
export declare const config: {
    readonly character: typeof CharacterActorDataModel;
    readonly adversary: typeof AdversaryActorDataModel;
};
export { CommonActorData, AttributeData }
declare module "@league-of-foundry-developers/foundry-vtt-types/configuration" {
    interface DataModelConfig {
        Actor: {
            'base': typeof CommonActorDataModel;
            [ActorType.Character]: typeof CharacterActorDataModel;
            [ActorType.Adversary]: typeof AdversaryActorDataModel;
        };
    }
}
