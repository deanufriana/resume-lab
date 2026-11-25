<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import Draggable from "vuedraggable";
import { GripVertical, Plus, X } from "lucide-vue-next";
import Button from "./Button.vue";

interface BulletRow {
  id: number;
  text: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string[];
    placeholder?: string;
    addLabel?: string;
  }>(),
  {
    modelValue: () => [],
    placeholder: "Describe an achievement or responsibility...",
    addLabel: "Add highlight",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

let nextId = 1;
const rows = ref<BulletRow[]>((props.modelValue || []).map((text) => ({ id: nextId++, text })));
const inputRefs = ref<Record<number, HTMLTextAreaElement | null>>({});

watch(
  () => props.modelValue,
  (val) => {
    const incoming = val || [];
    const current = rows.value.map((r) => r.text);
    if (JSON.stringify(incoming) !== JSON.stringify(current)) {
      rows.value = incoming.map((text, idx) => ({
        id: rows.value[idx]?.id ?? nextId++,
        text,
      }));
    }
  },
  { deep: true },
);

function emitRows() {
  emit(
    "update:modelValue",
    rows.value.map((r) => r.text),
  );
}

function setInputRef(id: number, el: unknown) {
  if (el instanceof HTMLTextAreaElement) {
    inputRefs.value[id] = el;
  } else {
    delete inputRefs.value[id];
  }
}

function updateItem(index: number, value: string) {
  rows.value[index].text = value;
  emitRows();
}

function addItem(atIndex?: number) {
  const newRow: BulletRow = { id: nextId++, text: "" };
  const insertIdx = atIndex !== undefined ? atIndex + 1 : rows.value.length;
  rows.value.splice(insertIdx, 0, newRow);
  emitRows();
  void nextTick(() => {
    inputRefs.value[newRow.id]?.focus();
  });
}

function removeItem(index: number) {
  const prevRow = index > 0 ? rows.value[index - 1] : null;
  rows.value.splice(index, 1);
  emitRows();
  if (prevRow) {
    void nextTick(() => {
      inputRefs.value[prevRow.id]?.focus();
    });
  }
}

function handleKeydown(e: KeyboardEvent, index: number) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    addItem(index);
  } else if (e.key === "Backspace" && !rows.value[index]?.text) {
    e.preventDefault();
    removeItem(index);
  }
}

function handlePaste(e: ClipboardEvent, index: number) {
  const pasted = e.clipboardData?.getData("text/plain") || "";
  if (!pasted.includes("\n")) return;

  const lines = pasted
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[•\-*]|\d+[.)])\s+/, "").trim())
    .filter(Boolean);

  if (lines.length <= 1) return;

  e.preventDefault();
  const newRows: BulletRow[] = lines.map((text) => ({ id: nextId++, text }));
  const isCurrentEmpty = !rows.value[index]?.text.trim();

  if (isCurrentEmpty) {
    rows.value.splice(index, 1, ...newRows);
  } else {
    rows.value.splice(index + 1, 0, ...newRows);
  }
  emitRows();
}
</script>

<template>
  <div class="space-y-2">
    <Draggable
      v-if="rows.length > 0"
      v-model="rows"
      item-key="id"
      handle=".bullet-handle"
      class="space-y-1.5"
      @update:model-value="emitRows"
    >
      <template #item="{ element, index }: { element: BulletRow; index: number }">
        <div class="flex items-start gap-1.5 group">
          <div
            class="bullet-handle cursor-grab active:cursor-grabbing pt-2 text-muted-foreground/60 hover:text-foreground flex-shrink-0"
            title="Drag to reorder"
          >
            <GripVertical class="w-3.5 h-3.5" />
          </div>
          <textarea
            :ref="(el) => setInputRef(element.id, el)"
            rows="1"
            :value="element.text"
            :placeholder="placeholder"
            @input="updateItem(index, ($event.target as HTMLTextAreaElement).value)"
            @keydown="handleKeydown($event, index)"
            @paste="handlePaste($event, index)"
            class="auto-fit-textarea flex-1 min-h-[38px] sm:min-h-[34px] rounded-md border border-input bg-transparent px-2.5 py-1.5 text-base sm:text-xs leading-relaxed transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            class="h-8 w-8 sm:h-7 sm:w-7 mt-0.5 text-muted-foreground hover:text-destructive flex-shrink-0"
            @click="removeItem(index)"
            aria-label="Remove highlight"
          >
            <X class="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </Button>
        </div>
      </template>
    </Draggable>

    <Button
      type="button"
      variant="outline"
      size="sm"
      class="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
      @click="addItem()"
    >
      <Plus class="w-3.5 h-3.5" />
      {{ addLabel }}
    </Button>
  </div>
</template>

<style scoped>
.auto-fit-textarea {
  field-sizing: content;
}
</style>
