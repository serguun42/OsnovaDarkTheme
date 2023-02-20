export type ThemeModule = {
  name: string;
  title?: string;
  default: boolean;
  dark: boolean;
  light: boolean;
  priority: number;
};

export type AnimationCurveStyle = 'ease-in-out' | 'ease-in-out-slow' | 'ease-in' | 'ease-out' | 'ripple' | 'linear';

export type GenericEventType = Event &
  MouseEvent &
  TouchEvent &
  KeyboardEvent & {
    currentTarget: HTMLElement;
  };

export type ElementDescriptorType = {
  tag?: string;
  class?: string;
  id?: string;
  text?: string;
  html?: string;
  ripple?: boolean;
  mdlUpgrade?: boolean;
  mounted?: (thisElem: HTMLElement) => void;
  onclick?: (e: GenericEventType) => void;
  /** `contextmenu` listener does the same thing as usual `click` */
  contextSameAsClick?: boolean;
  data?: { [dataPropName: string]: string | number };
  tags?: { [attributeName: string]: string | number };
  attr?: { [attributeName: string]: string | number };
  child?: ElementDescriptorType;
  children?: Array<ElementDescriptorType>;
  listener?: { [listenerName: string]: (e: GenericEventType) => void };
  listeners?: { [listenerName: string]: (e: GenericEventType) => void };
};

export type SwitcherCheckboxRule = {
  name: string;
  title: string;
  subtitle?: string | undefined;
  checked: boolean;
  onchange: (e: GenericEventType) => void;
};

export type ObserverQueueItem = {
  tag?: string | undefined;
  id?: string | undefined;
  className?: string | undefined;
  attribute?:
    | {
        name: string;
        value: string;
      }
    | undefined;
  parent?: ObserverQueueItem | undefined;
  not?: ObserverQueueItem | undefined;
  resolver: (foundElem: HTMLElement) => void;
};
