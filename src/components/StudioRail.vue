<script setup lang="ts">
import type { Component } from "vue";
import { Edit3, Eye, Trash2 } from "lucide-vue-next";
import { Button } from "./ui/index";

export interface StudioSectionItem {
  id: string;
  label: string;
  icon: Component;
  count: number;
  isDot?: boolean;
}

defineProps<{
  sections: StudioSectionItem[];
  activeSection: string;
  mobileView: "edit" | "preview";
  completeness: number;
  hasContent: boolean;
}>();

const emit = defineEmits<{
  (e: "update:activeSection", id: string): void;
  (e: "update:mobileView", view: "edit" | "preview"): void;
  (e: "clear-resume"): void;
}>();
</script>

<template>
  <!-- Mobile View Switcher Bar -->
  <div
    class="lg:hidden flex-shrink-0 flex items-center justify-between px-3 sm:px-4 py-2 border-b bg-card no-print"
  >
    <div class="inline-flex rounded-md bg-muted p-0.5">
      <Button
        variant="ghost"
        size="sm"
        @click="emit('update:mobileView', 'edit')"
        :class="[
          'h-7 px-3 text-xs gap-1.5 touch-manipulation',
          mobileView === 'edit'
            ? 'bg-background text-foreground shadow-sm hover:bg-background font-medium'
            : 'text-muted-foreground',
        ]"
      >
        <Edit3 class="w-3.5 h-3.5" /> Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        @click="emit('update:mobileView', 'preview')"
        :class="[
          'h-7 px-3 text-xs gap-1.5 touch-manipulation',
          mobileView === 'preview'
            ? 'bg-background text-foreground shadow-sm hover:bg-background font-medium'
            : 'text-muted-foreground',
        ]"
      >
        <Eye class="w-3.5 h-3.5" /> Preview
      </Button>
    </div>

    <div class="flex items-center gap-2">
      <span class="text-[11px] font-medium text-muted-foreground tabular-nums">
        {{ completeness }}% complete
      </span>
      <Button
        v-if="hasContent"
        variant="ghost"
        size="icon"
        @click="emit('clear-resume')"
        title="Clear all resume data"
        class="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 class="w-3.5 h-3.5" />
      </Button>
    </div>
  </div>

  <!-- Left Icon Rail (Desktop) / Horizontal Pills (Mobile Edit) -->
  <aside
    :class="[
      'lg:w-16 lg:border-r bg-card/50 flex-shrink-0 no-print',
      mobileView === 'preview' ? 'hidden lg:flex' : 'flex',
      'flex-row lg:flex-col items-center justify-start lg:justify-between border-b lg:border-b-0 px-2 py-1.5 lg:py-4 gap-1.5 lg:gap-2 overflow-x-auto no-scrollbar',
    ]"
  >
    <nav class="flex flex-row lg:flex-col items-center gap-1.5">
      <Button
        v-for="section in sections"
        :key="section.id"
        :variant="activeSection === section.id ? 'default' : 'ghost'"
        @click="emit('update:activeSection', section.id)"
        :title="section.label"
        :class="[
          'relative flex flex-col items-center justify-center min-w-[3.25rem] h-11 p-1 text-[10px] font-medium gap-0.5 flex-shrink-0 touch-manipulation',
          activeSection === section.id ? 'shadow-sm' : 'text-muted-foreground',
        ]"
      >
        <component :is="section.icon" class="w-4 h-4" />
        <span class="leading-none">{{ section.label }}</span>
        <span
          v-if="section.count > 0 && section.isDot"
          :class="[
            'absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full',
            activeSection === section.id ? 'bg-primary-foreground/80' : 'bg-emerald-500',
          ]"
        />
        <span
          v-else-if="section.count > 0"
          :class="[
            'absolute top-1 right-1 min-w-[14px] h-[14px] px-1 rounded-full text-[9px] font-semibold leading-none flex items-center justify-center tabular-nums',
            activeSection === section.id
              ? 'bg-primary-foreground/20 text-primary-foreground'
              : 'bg-muted text-muted-foreground',
          ]"
        >
          {{ section.count }}
        </span>
      </Button>
    </nav>

    <div class="hidden lg:flex flex-col items-center gap-2">
      <Button
        v-if="hasContent"
        variant="ghost"
        size="icon"
        @click="emit('clear-resume')"
        title="Clear all resume data"
        class="w-10 h-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 class="w-4 h-4" />
      </Button>
    </div>
  </aside>
</template>
