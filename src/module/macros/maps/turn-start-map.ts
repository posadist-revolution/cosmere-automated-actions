import { TurnChangeEffectFunc, TurnChangeItemFunc } from "../index.js";

//Common stormlight actions

//Abrasion actions


//Adhesion actions


//Cohesion actions


//Division actions


//Graviatation actions


//Illumination actions
import { complexIllusionRound } from "../surges/illumination/illumination.js"

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


export var startTurnItemMap: Map<string, TurnChangeItemFunc> = new Map<string, TurnChangeItemFunc>([
	//Common stormlight actions


	//Abrasion actions


	//Adhesion actions


	//Cohesion actions


	//Division actions



	//Graviatation actions


	//Illumination actions
	["dismiss-complex-illusion", complexIllusionRound as TurnChangeItemFunc],


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

export var startTurnEffectMap: Map<string, TurnChangeEffectFunc> = new Map<string, TurnChangeEffectFunc>([
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