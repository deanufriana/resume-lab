<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { Separator as RadixSeparator, type SeparatorProps } from "radix-vue";
import { cn } from "../../utils/cn";

const props = defineProps<SeparatorProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <RadixSeparator
    v-bind="delegatedProps"
    :class="
      cn(
        'shrink-0 bg-border',
        props.orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full',
        props.class,
      )
    "
  />
</template>
