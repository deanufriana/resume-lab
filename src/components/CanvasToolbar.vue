<script setup lang="ts">
import { EyeOff } from "lucide-vue-next";
import type { Meta } from "../types/resume";
import type { Theme } from "../themes";
import { Button, NativeSelect, NativeSelectOption, SegmentedControl } from "./ui/index";

const accentColors = [
  { name: "Blue", value: "#2563eb" },
  { name: "Slate", value: "#0f172a" },
  { name: "Emerald", value: "#059669" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Rose", value: "#e11d48" },
] as const;

const fontOptions = ["sans", "serif", "mono"] as const;
const densityOptions = ["compact", "standard", "spacious"] as const;

const props = defineProps<{
  themes?: Theme[];
  themeId?: string;
  meta?: Meta;
  zoom: "fit" | number;
}>();

const emit = defineEmits<{
  (e: "theme-change", themeId: string): void;
  (e: "update-meta", key: keyof Meta, value: Meta[keyof Meta]): void;
  (e: "update:zoom", zoom: "fit" | number): void;
}>();

const resolvedFont = () =>
  props.meta?.fontFamily || (props.themeId === "simple" ? "serif" : "sans");
</script>

<template>
  <div
    class="px-4 py-2 border-b bg-background/90 backdrop-blur-sm flex flex-wrap items-center justify-between gap-3 z-20 no-print"
  >
    <div class="flex flex-wrap items-center gap-2.5">
      <NativeSelect
        size="sm"
        :model-value="props.themeId"
        @change="(e: Event) => emit('theme-change', (e.target as HTMLSelectElement).value)"
      >
        <NativeSelectOption v-for="theme in props.themes" :key="theme.id" :value="theme.id">
          {{ theme.name }}
        </NativeSelectOption>
      </NativeSelect>

      <!-- Accent Color Swatches -->
      <div class="flex items-center gap-1.5 px-2.5 border-l border-r">
        <Button
          v-for="color in accentColors"
          :key="color.value"
          type="button"
          variant="ghost"
          size="icon"
          :title="color.name"
          @click="emit('update-meta', 'accentColor', color.value)"
          class="w-4 h-4 p-0 rounded-sm border border-black/20 dark:border-white/25 transition-transform hover:scale-110"
          :class="{
            'ring-1 ring-foreground scale-110':
              (props.meta?.accentColor || '#2563eb') === color.value,
          }"
          :style="{ backgroundColor: color.value }"
        />
      </div>

      <SegmentedControl
        class="hidden xl:inline-flex"
        :model-value="resolvedFont()"
        :options="fontOptions"
        @update:model-value="(val) => emit('update-meta', 'fontFamily', val)"
      />

      <SegmentedControl
        class="hidden xl:inline-flex"
        :model-value="props.meta?.density || 'standard'"
        :options="densityOptions"
        @update:model-value="(val) => emit('update-meta', 'density', val)"
      />
    </div>

    <div class="flex items-center gap-2.5">
      <label
        class="flex items-center gap-1.5 cursor-pointer select-none text-[11px] font-medium text-muted-foreground hover:text-foreground"
        title="Hide email, phone, website, and social links for Upwork"
      >
        <input
          type="checkbox"
          :checked="props.meta?.hideContact || false"
          @change="emit('update-meta', 'hideContact', ($event.target as HTMLInputElement).checked)"
          class="rounded border-input accent-amber-500"
        />
        <EyeOff v-if="props.meta?.hideContact" class="w-3.5 h-3.5 text-amber-500" />
        <span>Hide Contact</span>
      </label>

      <NativeSelect
        size="sm"
        :model-value="props.zoom"
        @update:model-value="(v) => emit('update:zoom', v === 'fit' ? 'fit' : Number(v))"
        aria-label="Preview zoom"
      >
        <NativeSelectOption value="fit">Fit</NativeSelectOption>
        <NativeSelectOption :value="0.75">75%</NativeSelectOption>
        <NativeSelectOption :value="0.9">90%</NativeSelectOption>
        <NativeSelectOption :value="1">100%</NativeSelectOption>
        <NativeSelectOption :value="1.15">115%</NativeSelectOption>
      </NativeSelect>
    </div>
  </div>
</template>
