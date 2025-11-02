<template>
  <select
    :value="modelValue"
    :class="cn(
      'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )"
    :disabled="disabled"
    @change="handleChange"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
import { cn } from '../../utils/cn';

interface Props {
  modelValue?: string | number;
  className?: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  className: '',
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  change: [event: Event];
}>();

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
  emit('change', event);
}
</script>

