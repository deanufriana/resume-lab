<template>
  <nav :class="cn('relative z-10 flex max-w-max flex-1 items-center justify-center overflow-x-auto', className)">
    <slot />
  </nav>
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

