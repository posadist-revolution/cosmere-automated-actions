export const SurgeScalingTable = [
    {
        size: "small",
    },
    {
        size: "medium",
    },
    {
        size: "large",
    },
    {
        size: "huge",
    },
    {
        size: "gargantuan",
    }
]

export interface SizeInterface {
    width: number,
    height: number,
    "texture.scaleX": number,
    "texture.scaleY": number
}

export const sizes: Record<string, SizeInterface> = {
    small: { width: 1, height: 1, "texture.scaleX": 0.75, "texture.scaleY": 0.75 },
    medium: { width: 1, height: 1, "texture.scaleX": 1, "texture.scaleY": 1 },
    large: { width: 2, height: 2, "texture.scaleX": 1, "texture.scaleY": 1 },
    huge: { width: 3, height: 3, "texture.scaleX": 1, "texture.scaleY": 1 },
    gargantuan: { width: 4, height: 4, "texture.scaleX": 1, "texture.scaleY": 1 },
};