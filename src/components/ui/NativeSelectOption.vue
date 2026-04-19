<script setup lang="ts">
interface Props {
  value?: string | number;
  disabled?: boolean;
}

defineProps<Props>();
</script>

<template>
  <option :value="value" :disabled="disabled" class="bg-background text-foreground">
    <slot />
  </option>
</template>
