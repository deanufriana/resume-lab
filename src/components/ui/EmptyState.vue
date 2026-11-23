<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue";
import { cn } from "../../utils/cn";

const props = defineProps<{
  icon?: Component;
  title: string;
  description?: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 border-2 border-dashed border-border rounded-xl bg-muted/20',
        props.class,
      )
    "
  >
    <div
      v-if="props.icon"
      class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"
    >
      <component :is="props.icon" class="w-6 h-6" />
    </div>
    <h4 class="text-base font-semibold text-foreground">{{ props.title }}</h4>
    <p v-if="props.description" class="text-sm text-muted-foreground mt-1 max-w-md">
      {{ props.description }}
    </p>
    <div v-if="$slots.default" class="mt-5 flex flex-wrap items-center justify-center gap-3">
      <slot />
    </div>
  </div>
</template>
