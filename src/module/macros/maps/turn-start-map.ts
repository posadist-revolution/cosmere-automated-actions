//Common stormlight actions

//Abrasion actions


//Adhesion actions


//Cohesion actions


//Division actions


//Graviatation actions
import { TurnChangeEffectFunc, TurnChangeItemFunc } from "../index.js";
import { gravitationRound } from "../surges/gravitation/gravitation.js"

//Illumination actions
import { complexIllusionRound } from "../surges/illumination/illumination.js"

//Progression actions
import { characterRegrowthExpendInvestiture, characterRegrowthEffectStartTurn } from "../surges/progression/progression.js";

//Tension actions


//Transformation actions


//Transportation actions


//Adversary actions


//Adversary features


//Adversary stormlight actions and features


//Adversary strikes


//Adversary unique


//Basic Macros


export const startTurnItemMap: Map<string, TurnChangeItemFunc> = new Map<string, TurnChangeItemFunc>([
	//Common stormlight actions


	//Abrasion actions


	//Adhesion actions


	//Cohesion actions


	//Division actions



	//Graviatation actions
	["dismiss-lashing", gravitationRound as TurnChangeItemFunc],


	//Illumination actions
	["dismiss-complex-illusion", complexIllusionRound as TurnChangeItemFunc],


	//Progression actions
    ["cancel-regrowth-infusion", characterRegrowthExpendInvestiture as TurnChangeItemFunc],


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
	["regrowth-infusion", characterRegrowthEffectStartTurn],

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