//Common stormlight actions

//Abrasion actions


//Adhesion actions


//Cohesion actions


//Division actions


//Graviatation actions
import { gravitationRound } from "../surges/gravitation/gravitation.js"

//Illumination actions
import { complexIllusionRound } from "../surges/illumination/illumination.js"

//Progression actions
import { characterRegrowthStartTurn } from "../surges/progression/progression.js"

//Tension actions


//Transformation actions


//Transportation actions


//Adversary actions


//Adversary features


//Adversary stormlight actions and features


//Adversary strikes


//Adversary unique


//Basic Macros


export const startTurnItemMap: Map<string, Function> = new Map<string, Function>([
	//Common stormlight actions


	//Abrasion actions


	//Adhesion actions


	//Cohesion actions


	//Division actions



	//Graviatation actions
	["dismiss-lashing", gravitationRound],


	//Illumination actions
	["dismiss-complex-illusion", complexIllusionRound],


	//Progression actions
	["regrowth-infusion", characterRegrowthStartTurn],

	//Tension actions


	//Transformation actions


	//Transportation actions


	//Adversary actions


	//Adversary features


	//Adversary stormlight actions and features


	//Adversary strikes


	//Adversary unique

	//Basic Macros
]);

export const startTurnEffectMap: Map<string, Function> = new Map<string, Function>([
	//Common stormlight actions


	//Abrasion actions


	//Adhesion actions


	//Cohesion actions


	//Division actions


	//Graviatation actions


	//Illumination actions


	//Progression actions


	//Tension actions


	//Transformation actions


	//Transportation actions


	//Adversary actions


	//Adversary features


	//Adversary stormlight actions and features


	//Adversary strikes


	//Adversary unique

	//Basic Macros
]);