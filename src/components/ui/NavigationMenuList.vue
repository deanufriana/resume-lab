<template>
  <ul :class="cn('group flex flex-1 list-none items-center justify-center space-x-1', className)">
    <slot />
  </ul>
</template>

<script setup lang="ts">
import { cn } from '../../utils/cn';

interface Props {
  className?: string;
}

withDefaults(defineProps<Props>(), {
  className: '',
});
</script>

