<template>
  <component
    :is="asChild ? 'slot' : (href ? 'a' : 'button')"
    :class="cn(
      'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
      className
    )"
    :href="href"
    :type="href ? undefined : 'button'"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { cn } from '../../utils/cn';

interface Props {
  asChild?: boolean;
  href?: string;
  className?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  asChild: false,
  className: '',
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  emit('click', event);
}
</script>
