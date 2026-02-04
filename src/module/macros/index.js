//Common stormlight actions
import { breatheStormlight } from "./surges/common/breathe-stormlight.js"
import { enhance } from "./surges/common/enhance.js"
import { stormlightReclamation } from "./surges/common/stormlight-reclamation.js"


//Abrasion actions


//Adhesion actions


//Cohesion actions


//Division actions
import { division } from "./surges/division/division.js"


//Graviatation actions
import { dismissLashing, gravitation, gravitationRound } from "./surges/gravitation/gravitation.js"


//Illumination actions
import { illumination, complexIllusionRound } from "./surges/illumination/illumination.js"
import { dismissComplexIllusion } from "./surges/illumination/illumination.js"
import { dismissDisguise } from "./surges/illumination/illumination.js"


//Progression actions
import { progression, cancelCharacterRegrowth, characterRegrowthRound } from "./surges/progression/progression.js"
import { explosiveGrowth } from "./surges/progression/explosive-growth.js"
import { injuryRegrowth } from "./surges/progression/injury-regrowth.js"
import { fromTheBrink } from "./surges/progression/from-the-brink.js"





//Tension actions


//Transformation actions


//Transportation actions


//Adversary actions


//Adversary features


//Adversary stormlight actions and features


//Adversary strikes


//Adversary unique
import { disquiet } from "./adversary-features/actions/disquiet.js"


//Basic Macros


export const macros = {
	//Common stormlight actions
	"breathe-stormlight": breatheStormlight,
	"enhance": enhance,
	"stormlight-reclamation": stormlightReclamation,

	//Abrasion actions


	//Adhesion actions


	//Cohesion actions


	//Division actions
	division: division,


	//Graviatation actions
	gravitation: gravitation,
	"dismiss-lashing": dismissLashing,


	//Illumination actions
	illumination: illumination,
	"dismiss-complex-illusion": dismissComplexIllusion,
	"dismiss-disguise": dismissDisguise,

	//Progression actions
	progression: progression,
	"injury-regrowth": injuryRegrowth,
	"cancel-character-regrowth": cancelCharacterRegrowth,
	"cancel-regrowth-infusion": cancelCharacterRegrowth,
	"from-the-brink": fromTheBrink,

	//Tension actions


	//Transformation actions


	//Transportation actions


	//Adversary actions


	//Adversary features


	//Adversary stormlight actions and features


	//Adversary strikes


	//Adversary unique
	disquiet: disquiet,

	//Basic Macros
}

export const roundIncriment = {
	//Common stormlight actions
	

	//Abrasion actions


	//Adhesion actions


	//Cohesion actions


	//Division actions
	


	//Graviatation actions
	"dismiss-lashing": gravitationRound,


	//Illumination actions
	"dismiss-complex-illusion": complexIllusionRound,
	

	//Progression actions
	"cancel-regrowth-infusion": characterRegrowthRound,

	//Tension actions


	//Transformation actions


	//Transportation actions


	//Adversary actions


	//Adversary features


	//Adversary stormlight actions and features


	//Adversary strikes


	//Adversary unique

	//Basic Macros
}