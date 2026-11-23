<script setup lang="ts" generic="T extends string">
import Button from "./Button.vue";

defineProps<{
  modelValue: T;
  options: readonly T[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: T): void;
}>();
</script>

<template>
  <div class="inline-flex rounded-md border bg-muted/40 p-0.5 text-[11px]">
    <Button
      v-for="option in options"
      :key="option"
      variant="ghost"
      size="sm"
      @click="emit('update:modelValue', option)"
      :class="[
        'h-6 px-2 py-0 text-[11px] rounded capitalize',
        modelValue === option
          ? 'bg-background text-foreground shadow-sm font-medium hover:bg-background'
          : 'text-muted-foreground hover:text-foreground',
      ]"
    >
      {{ option }}
    </Button>
  </div>
</template>
