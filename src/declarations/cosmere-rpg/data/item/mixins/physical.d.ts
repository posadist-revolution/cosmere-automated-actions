import { CommonItemData } from "../common";

interface PhysicalItemData extends CommonItemData{
    quantity: number;
    weight: {
        value: number;
        unit: string;
    };
    price: {
        value: number;
        unit: string; // Dervived from currency / denomination
        currency: string;
        denomination: {
            primary: string;
            secondary?: string;
        };
        baseValue: number; // Derived value in base denomination
    };
}