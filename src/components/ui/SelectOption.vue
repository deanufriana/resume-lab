<template>
  <option :value="value" :disabled="disabled">
    <slot>{{ label }}</slot>
  </option>
</template>

<script setup lang="ts">
interface Props {
  value: string | number;
  label?: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});
</script>

