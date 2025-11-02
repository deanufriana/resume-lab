<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    :class="cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
import { cn } from '../../utils/cn';

interface Props {
  type?: string;
  placeholder?: string;
  modelValue?: string | number;
  className?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  className: '',
});

defineEmits<{
  'update:modelValue': [value: string | number];
}>();
</script>

