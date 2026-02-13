//Macro ids
import { PRG } from "../surges/progression/id.js"
//Common stormlight actions
import { breatheStormlight } from "../surges/common/breathe-stormlight.js"
import { enhance } from "../surges/common/enhance.js"
import { stormlightReclamation } from "../surges/common/stormlight-reclamation.js"

//Abrasion actions


//Adhesion actions


//Cohesion actions


//Division actions
import { division } from "../surges/division/division.js"

//Graviatation actions
import { dismissLashing, gravitation } from "../surges/gravitation/gravitation.js"

//Illumination actions
import { illumination } from "../surges/illumination/illumination.js"
import { dismissComplexIllusion } from "../surges/illumination/illumination.js"
import { dismissDisguise } from "../surges/illumination/illumination.js"

//Progression actions
import { progression, cancelCharacterRegrowth } from "../surges/progression/progression.js"
import { injuryRegrowth } from "../surges/progression/injury-regrowth.js"
import { fromTheBrink } from "../surges/progression/from-the-brink.js"

//Tension actions


//Transformation actions


//Transportation actions


//Adversary actions


//Adversary features


//Adversary stormlight actions and features


//Adversary strikes


//Adversary unique
import { disquiet } from "../adversary-features/actions/disquiet.js"
import { MacroFunc } from "../index.js"

//Basic Macros

export const macrosMap: Map<string, MacroFunc> = new Map<string, MacroFunc>([
	//Common stormlight actions
	["breathe-stormlight", breatheStormlight as MacroFunc],
	["enhance", enhance as MacroFunc],
	["stormlight-reclamation", stormlightReclamation as MacroFunc],

	//Abrasion actions


	//Adhesion actions


	//Cohesion actions


	//Division actions
	["division", division as MacroFunc],


	//Graviatation actions
	["gravitation", gravitation as MacroFunc],
	["dismiss-lashing", dismissLashing as MacroFunc],


	//Illumination actions
	["illumination", illumination as MacroFunc],
	["dismiss-complex-illusion", dismissComplexIllusion as MacroFunc],
	["dismiss-disguise", dismissDisguise as MacroFunc],

	//Progression actions
	[PRG.PROGRESSION, progression as MacroFunc],
	[PRG.INJURY_REGROWTH, injuryRegrowth as MacroFunc],
	[PRG.CANCEL_REGROWTH_INFUSION, cancelCharacterRegrowth as MacroFunc],
	[PRG.FROM_THE_BRINK, fromTheBrink as MacroFunc],

	//Tension actions


	//Transformation actions


	//Transportation actions


	//Adversary actions


	//Adversary features


	//Adversary stormlight actions and features


	//Adversary strikes


	//Adversary unique
	["disquiet", disquiet as MacroFunc],

	//Basic Macros
]);