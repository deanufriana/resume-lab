<script setup lang="ts">
import { ref } from "vue";
import { X } from "lucide-vue-next";
import Button from "./Button.vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string[];
    placeholder?: string;
  }>(),
  {
    modelValue: () => [],
    placeholder: "Type and press Enter...",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const inputText = ref("");

function addTag(raw: string) {
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return;

  const existing = new Set(props.modelValue || []);
  const next = [...(props.modelValue || [])];
  for (const part of parts) {
    if (!existing.has(part)) {
      next.push(part);
      existing.add(part);
    }
  }
  emit("update:modelValue", next);
  inputText.value = "";
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    addTag(inputText.value);
  } else if (e.key === "Backspace" && inputText.value === "" && props.modelValue?.length) {
    removeTag(props.modelValue.length - 1);
  }
}

function handleBlur() {
  if (inputText.value.trim()) {
    addTag(inputText.value);
  }
}

function removeTag(index: number) {
  const next = [...(props.modelValue || [])];
  next.splice(index, 1);
  emit("update:modelValue", next);
}
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-1.5 min-h-9 w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-shadow"
  >
    <span
      v-for="(tag, idx) in modelValue"
      :key="`${tag}-${idx}`"
      class="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground border border-border/60"
    >
      {{ tag }}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        @click="removeTag(idx)"
        class="h-4 w-4 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
        :aria-label="`Remove ${tag}`"
      >
        <X class="w-3 h-3" />
      </Button>
    </span>
    <input
      v-model="inputText"
      type="text"
      :placeholder="modelValue?.length ? '' : placeholder"
      @keydown="handleKeydown"
      @blur="handleBlur"
      class="flex-1 min-w-[120px] bg-transparent text-xs outline-none placeholder:text-muted-foreground"
    />
  </div>
</template>
