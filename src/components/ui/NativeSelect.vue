<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { cn } from "../../utils/cn";

const nativeSelectVariants = cva(
  "flex w-full appearance-none rounded-md text-sm transition-all focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-border cursor-pointer font-outfit shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-background/50 hover:bg-accent/50 focus:border-primary/30",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface Props {
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
  variant?: VariantProps<typeof nativeSelectVariants>["variant"];
  size?: VariantProps<typeof nativeSelectVariants>["size"];
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  size: "default",
});

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <div class="relative w-full group">
    <select
      v-model="modelValue"
      :class="cn(nativeSelectVariants({ variant, size }), props.class)"
    >
      <slot />
    </select>
    <div
      class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-foreground transition-colors"
    >
      <ChevronDown
        :class="
          cn(
            'opacity-70',
            size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
          )
        "
      />
    </div>
  </div>
</template>

<style scoped>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
