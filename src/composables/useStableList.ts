import { ref, watch, type Ref } from "vue";

/**
 * Manages a draggable, collapsible list synced with a parent prop array.
 * Uses a WeakMap for stable item keys without mutating the underlying JSON data.
 */
export function useStableList<T extends object>(
  getSource: () => T[],
  onChange: (items: T[]) => void,
) {
  const localItems = ref([...getSource()]) as Ref<T[]>;
  const collapsed = ref<Record<string, boolean>>({});
  const itemKeys = new WeakMap<object, string>();
  let keyCounter = 0;

  function getItemKey(item: T): string {
    let key = itemKeys.get(item);
    if (!key) {
      key = `item-${++keyCounter}`;
      itemKeys.set(item, key);
    }
    return key;
  }

  function isCollapsed(item: T): boolean {
    return !!collapsed.value[getItemKey(item)];
  }

  function toggleCollapse(item: T): void {
    const key = getItemKey(item);
    collapsed.value[key] = !collapsed.value[key];
  }

  watch(
    getSource,
    (newVal) => {
      if (JSON.stringify(newVal) !== JSON.stringify(localItems.value)) {
        localItems.value = [...newVal];
      }
    },
    { deep: true },
  );

  watch(
    localItems,
    (newVal) => {
      if (JSON.stringify(newVal) !== JSON.stringify(getSource())) {
        onChange(newVal);
      }
    },
    { deep: true },
  );

  return {
    localItems,
    getItemKey,
    isCollapsed,
    toggleCollapse,
  };
}
