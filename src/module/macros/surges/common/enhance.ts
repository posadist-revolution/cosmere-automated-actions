import { CosmereItem, CosmereActor } from "@system/documents";
import { activateAllItemEffects } from "../../../utils/helpers";

export function enhance(item: CosmereItem, actor: CosmereActor) {
	activateAllItemEffects(item);
}
