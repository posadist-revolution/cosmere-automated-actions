import { registerAbrasionDefinitions } from "./surges/abrasion";
import { registerGravitationDefinitions } from "./surges/gravitation";
import { registerProgressionDefinitions } from "./surges/progression";

export function registerAllMacros(){
    registerAbrasionDefinitions();
    registerGravitationDefinitions();
    registerProgressionDefinitions();
}