<template>
  <textarea
    :placeholder="placeholder"
    :value="modelValue"
    :rows="rows"
    :class="cn(
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>

<script setup lang="ts">
import { cn } from '../../utils/cn';

interface Props {
  placeholder?: string;
  modelValue?: string;
  rows?: number;
  className?: string;
}

withDefaults(defineProps<Props>(), {
  placeholder: '',
  rows: 4,
  className: '',
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

