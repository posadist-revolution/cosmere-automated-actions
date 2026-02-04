export declare const enum Size {
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
    Huge = 'huge',
    Garguantuan = 'gargantuan',
}

/**
 * A non-exhaustive list of creature types.
 * Used to provide standard options.
 */
export declare const enum CreatureType {
    Custom = 'custom',
    Humanoid = 'humanoid',
    Animal = 'animal',
}

/**
 * A non-exhaustive list of conditions
 */
export declare const enum Status {
    Afflicted = 'afflicted',
    Blind = 'blind',
    Burrowing = 'burrowing',
    Determined = 'determined',
    Disoriented = 'disoriented',
    Empowered = 'empowered',
    Enhanced = 'enhanced',
    Exhausted = 'exhausted',
    Flying = 'flying',
    Focused = 'focused',
    Hidden = 'hidden',
    Immobilized = 'immobilized',
    Invisible = 'invisible',
    Prone = 'prone',
    Restrained = 'restrained',
    Slowed = 'slowed',
    Stunned = 'stunned',
    Surprised = 'surprised',
    Unconscious = 'unconscious',
    Dead = 'dead',
}

export declare const enum InjuryType {
    FleshWound = 'flesh_wound',
    ShallowInjury = 'shallow_injury',
    ViciousInjury = 'vicious_injury',
    PermanentInjury = 'permanent_injury',
    Death = 'death',
}

export declare const enum AttributeGroup {
    Physical = 'phy',
    Cognitive = 'cog',
    Spiritual = 'spi',
}

export declare const enum Attribute {
    Strength = 'str',
    Speed = 'spd',
    Intellect = 'int',
    Willpower = 'wil',
    Awareness = 'awa',
    Presence = 'pre',
}

export declare const enum Resource {
    Health = 'hea',
    Focus = 'foc',
    Investiture = 'inv',
}

export declare enum Skill {
    Agility = 'agi',
    Athletics = 'ath',
    HeavyWeapons = 'hwp',
    LightWeapons = 'lwp',
    Stealth = 'stl',
    Thievery = 'thv',

    Crafting = 'cra',
    Deduction = 'ded',
    Discipline = 'dis',
    Intimidation = 'inm',
    Lore = 'lor',
    Medicine = 'med',

    Deception = 'dec',
    Insight = 'ins',
    Leadership = 'lea',
    Perception = 'prc',
    Persuasion = 'prs',
    Survival = 'sur',
}
// export declare type Skill = (typeof Skills)[keyof typeof Skills];

export declare const enum DerivedStatistic {
    MovementRate = 'mvr',
    LiftingCapactiy = 'lif',
    RecoveryDie = 'rcd',
}

export declare const enum PathType {
    Heroic = 'heroic',
}

export declare const enum PowerType {
    None = 'none',
}

/**
 * The categories of weapon available
 */
export declare const enum WeaponType {
    Light = 'light_wpn',
    Heavy = 'heavy_wpn',
    Special = 'special_wpn',
}

/**
 * The ids of all default system weapons.
 * This is not an exhaustive list of all possible weapons,
 * but is used to populate the `CONFIG.COSMERE.weapons` property.
 */
export declare const enum WeaponId {
    // Special
    Improvised = 'improvised',
    Unarmed = 'unarmed',
}

/**
 * The ids of all default system armors.
 * This is not an exhaustive list of all possible weapons,
 * but is used to populate the `CONFIG.COSMERE.armors` property.
 */
export declare const enum ArmorId {}

export declare const enum ExpertiseType {
    Armor = 'armor',
    Cultural = 'cultural',
    Specialist = 'specialist',
    Utility = 'utility',
    Weapon = 'weapon',
}

/**
 * The ids of all default system weapon traits.
 * This is not an exhaustive list of all possible weapon traits,
 * but is used to populate the `CONFIG.COSMERE.traits.weaponTraitIds` property.
 */
export declare const enum WeaponTraitId {
    Cumbersome = 'cumbersome',
    Dangerous = 'dangerous',
    Deadly = 'deadly',
    Defensive = 'defensive',
    Discreet = 'discreet',
    Indirect = 'indirect',
    Loaded = 'loaded',
    Momentum = 'momentum',
    Offhand = 'offhand',
    Pierce = 'pierce',
    Quickdraw = 'quickdraw',
    Thrown = 'thrown',
    TwoHanded = 'two_handed',
    Unique = 'unique',
    Fragile = 'fragile',
    Reach = 'reach',
}

/**
 * The ids of all default system armor traits.
 * This is not an exhaustive list of all possible armor traits,
 * but is used to populate the `CONFIG.COSMERE.traits.armorTraitIds` property.
 */
export declare const enum ArmorTraitId {
    Cumbersome = 'cumbersome',
    Dangerous = 'dangerous',
    Presentable = 'presentable',
    Unique = 'unique',
}

export declare const enum AdversaryRole {
    Minion = 'minion',
    Rival = 'rival',
    Boss = 'boss',
}

export declare const enum DeflectSource {
    None = 'none',
    Armor = 'armor',
}

export declare const enum ActivationType {
    None = 'none',
    Utility = 'utility',
    SkillTest = 'skill_test',
}

export declare const enum ItemConsumeType {
    Resource = 'resource', // E.g. health, focus, investiture
    Item = 'item',
}

export declare const enum ItemUseType {
    Use = 'use',
    Charge = 'charge',
}

export declare const enum ItemRechargeType {
    PerScene = 'per_scene',
}

export declare const enum EquipType {
    Hold = 'hold', // Item that you equip by holding it (either in one or two hands)
    Wear = 'wear', // Item that you equip by wearing it
}

export declare const enum HoldType {
    OneHanded = 'one_handed',
    TwoHanded = 'two_handed',
}

export declare const enum EquipHand {
    Main = 'main_hand',
    Off = 'off_hand',
}

export declare const enum EquipmentType {
    Basic = 'basic',
}

export declare const enum ActionType {
    Basic = 'basic',
    Ancestry = 'ancestry',
    Adversary = 'adversary',
}

export declare const enum ActionCostType {
    Action = 'act',
    Reaction = 'rea',
    FreeAction = 'fre',
    Special = 'spe',
}

export declare const enum AttackType {
    Melee = 'melee',
    Ranged = 'ranged',
}

export declare enum DamageType {
    Energy = 'energy',
    Impact = 'impact',
    Keen = 'keen',
    Spirit = 'spirit',
    Vital = 'vital',
    Healing = 'heal',
}

export declare const enum MovementType {
    Walk = 'walk',
    Swim = 'swim',
    Fly = 'fly',
}

export declare const enum RestType {
    Short = 'short',
    Long = 'long',
}

export declare const enum ImmunityType {
    Damage = 'damage',
    Condition = 'condition',
}

/* --- System --- */

export declare const enum ActorType {
    Character = 'character',
    Adversary = 'adversary',
}

export declare const enum ItemType {
    Weapon = 'weapon',
    Armor = 'armor',
    Equipment = 'equipment',
    Loot = 'loot',

    Ancestry = 'ancestry',
    Culture = 'culture',
    Path = 'path',
    Talent = 'talent',
    Trait = 'trait',

    Action = 'action',

    Injury = 'injury',
    Connection = 'connection',
    Goal = 'goal',

    Power = 'power',

    TalentTree = 'talent_tree',
}

export declare const enum TurnSpeed {
    Fast = 'fast',
    Slow = 'slow',
}