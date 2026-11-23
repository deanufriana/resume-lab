declare module "vuedraggable" {
  import type { VNodeChild } from "vue";

  const draggableComponent: new <T = any>() => {
    $props: {
      list?: T[];
      modelValue?: T[];
      itemKey: string | ((item: T) => string | number);
      handle?: string;
      tag?: string;
      clone?: (original: T) => T;
      move?: (evt: any, originalEvent: any) => boolean | void;
      componentData?: Record<string, any>;
      "onUpdate:modelValue"?: (value: T[]) => void;
    };
    $slots: {
      item: (props: { element: T; index: number }) => VNodeChild;
      header?: () => VNodeChild;
      footer?: () => VNodeChild;
    };
  };

  export default draggableComponent;
}
