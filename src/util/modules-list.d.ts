export const ALL_ADDITIONAL_MODULES: ({
    name: string;
    title: string;
    default: boolean;
    dark: boolean;
    priority: number;
    light?: undefined;
} | {
    name: string;
    title: string;
    default: boolean;
    light: boolean;
    priority: number;
    dark?: undefined;
} | {
    name: string;
    title: string;
    default: boolean;
    priority: number;
    dark?: undefined;
    light?: undefined;
})[];
export const ALL_MODULES: ({
    name: string;
    title: string;
    default: boolean;
    dark: boolean;
    priority: number;
    light?: undefined;
} | {
    name: string;
    title: string;
    default: boolean;
    light: boolean;
    priority: number;
    dark?: undefined;
} | {
    name: string;
    title: string;
    default: boolean;
    priority: number;
    dark?: undefined;
    light?: undefined;
} | {
    name: string;
    default: boolean;
    light: boolean;
    priority: number;
    dark?: undefined;
} | {
    name: string;
    default: boolean;
    dark: boolean;
    priority: number;
    light?: undefined;
})[];
export const ADDITIONAL_DARK_MODULES_NAMES: string[];
export const ADDITIONAL_LIGHT_MODULES_NAMES: string[];
