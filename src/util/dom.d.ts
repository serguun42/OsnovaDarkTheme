export type ObserverQueueItem = {
    tag?: string;
    id?: string;
    className?: string;
    attribute?: {
        name: string;
        value: string;
    };
    parent?: ObserverQueueItem;
    not?: ObserverQueueItem;
    resolver: (foundElem: HTMLElement) => void;
};
export type AnimationStyleSettingFunc = (iProgress: number) => any;
export type GenericEventType = Event & MouseEvent & TouchEvent & KeyboardEvent & {
    currentTarget: HTMLElement;
};
export type GlobalBuildLayoutListenerCallback = (e: GenericEventType) => any;
export type ElementDescriptorType = {
    tag?: string;
    class?: string;
    id?: string;
    text?: string;
    html?: string;
    ripple?: boolean;
    mdlUpgrade?: boolean;
    mounted?: (thisElem: HTMLElement) => void;
    onclick?: GlobalBuildLayoutListenerCallback;
    /**
     * - `contextmenu` listener does the same thing as usual `click`
     */
    contextSameAsClick?: boolean;
    data?: {
        [dataPropName: string]: string | number;
    };
    tags?: {
        [attributeName: string]: string | number;
    };
    attr?: {
        [attributeName: string]: string | number;
    };
    child?: ElementDescriptorType;
    children?: ElementDescriptorType[];
    listener?: {
        [listenerName: string]: GlobalBuildLayoutListenerCallback;
    };
    listeners?: {
        [listenerName: string]: GlobalBuildLayoutListenerCallback;
    };
};
export type AdditionalHandlingPropertyHandler = (iAdditionalHandlingPropertyValue: string | number | Function, iElemDesc: ElementDescriptorType, iDocElem: HTMLElement, iParentElem: HTMLElement) => void;
export type AdditionalHandlingProperties = {
    [propertyName: string]: AdditionalHandlingPropertyHandler;
};
/**
 * @param {String} query
 * @param {HTMLElement} [parent]
 * @returns {HTMLElement}
 */
export function QS(query: string, parent?: HTMLElement): HTMLElement;
/**
 * @param {String} query
 * @param {HTMLElement} [parent]
 * @returns {HTMLElement[]}
 */
export function QSA(query: string, parent?: HTMLElement): HTMLElement[];
/**
 * @param {string} query
 * @returns {HTMLElement}
 */
export function GEBI(query: string): HTMLElement;
/**
 * Remove element
 *
 * @param {HTMLElement} elem
 * @returns {void}
 */
export function GR(elem: HTMLElement): void;
/**
 * @param {() => void} iCallback
 * @param {number} iDelay
 * @returns {number}
 */
export function SetCustomInterval(iCallback: () => void, iDelay: number): number;
/**
 * @param {number} iIntervalID
 */
export function ClearCustomInterval(iIntervalID: number): void;
/**
 * @param {string | ObserverQueueItem} iKey
 * @param {false | Promise} [iWaitAlways=false]
 * @returns {Promise<HTMLElement>}
 */
export function WaitForElement(iKey: string | ObserverQueueItem, iWaitAlways?: false | Promise<any>): Promise<HTMLElement>;
/**
 * @callback AnimationStyleSettingFunc
 * @param {number} iProgress
 */
/**
 * @param {number} iDuration
 * @param {AnimationStyleSettingFunc} iStyleSettingFunc - Function for setting props by progress
 * @param {"ease-in-out"|"ease-in-out-slow"|"ease-in"|"ease-out"|"ripple"|"linear"} [iCurveStyle="ease-in-out"] - Curve Style
 * @param {number} [iSkipProgress=0] - How many of progress to skip, ranges from `0` to `1`
 * @returns {Promise<null>}
 */
export function Animate(iDuration: number, iStyleSettingFunc: AnimationStyleSettingFunc, iCurveStyle?: "ease-in-out" | "ease-in-out-slow" | "ease-in" | "ease-out" | "ripple" | "linear", iSkipProgress?: number): Promise<null>;
/** @type {{ [customElementName: string]: HTMLElement }} */
export const CUSTOM_ELEMENTS: {
    [customElementName: string]: HTMLElement;
};
/**
 * @param {string} iModuleName
 * @param {boolean} iStatus
 * @param {boolean} [iWithoutPrefix=false]
 */
export function ManageModule(iModuleName: string, iStatus: boolean, iWithoutPrefix?: boolean): void;
/**
 * @param {string} iLink
 * @param {number} iPriority
 * @param {string} [iModuleName]
 */
export function AddStyle(iLink: string, iPriority: number, iModuleName?: string): void;
/**
 * @param {string} iLink
 * @param {number} iPriority
 */
export function AddScript(iLink: string, iPriority: number): void;
/**
 * @typedef {Event & MouseEvent & TouchEvent & KeyboardEvent & { currentTarget: HTMLElement }} GenericEventType
 */
/**
 * @callback GlobalBuildLayoutListenerCallback
 * @param {GenericEventType} e
 */
/**
 * @typedef {object} ElementDescriptorType
 * @property {string} [tag]
 * @property {string} [class]
 * @property {string} [id]
 * @property {string} [text]
 * @property {string} [html]
 * @property {boolean} [ripple]
 * @property {boolean} [mdlUpgrade]
 * @property {(thisElem: HTMLElement) => void} [mounted]
 * @property {GlobalBuildLayoutListenerCallback} [onclick]
 * @property {boolean} [contextSameAsClick] - `contextmenu` listener does the same thing as usual `click`
 * @property {{[dataPropName: string]: string | number}} [data]
 * @property {{[attributeName: string]: string | number}} [tags]
 * @property {{[attributeName: string]: string | number}} [attr]
 * @property {ElementDescriptorType} [child]
 * @property {ElementDescriptorType[]} [children]
 * @property {{[listenerName: string]: GlobalBuildLayoutListenerCallback}} [listener]
 * @property {{[listenerName: string]: GlobalBuildLayoutListenerCallback}} [listeners]
 */
/**
 * @callback AdditionalHandlingPropertyHandler
 * @param {string | number | Function} iAdditionalHandlingPropertyValue
 * @param {ElementDescriptorType} iElemDesc
 * @param {HTMLElement} iDocElem
 * @param {HTMLElement} iParentElem
 * @returns {void}
 */
/**
 * @typedef {{[propertyName: string]: AdditionalHandlingPropertyHandler}} AdditionalHandlingProperties
 */
/**
 * @param {ElementDescriptorType[] | ElementDescriptorType} elements
 * @param {HTMLElement} container
 * @param {boolean} [clearContainer=true]
 * @param {AdditionalHandlingProperties} [additionalHandlingProperties=null]
 * @returns {void}
 */
export function GlobalBuildLayout(elements: ElementDescriptorType[] | ElementDescriptorType, container: HTMLElement, clearContainer?: boolean, additionalHandlingProperties?: AdditionalHandlingProperties): void;
