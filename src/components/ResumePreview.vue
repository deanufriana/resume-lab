<template>
  <div class="relative">
    <div class="p-8 bg-white max-w-3xl mx-auto overflow-x-auto">
      <component :is="themeComponent" :resume-data="resumeData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Resume } from '../types/resume';
import { getTheme, getDefaultTheme } from '../themes';

interface Props {
  resumeData: Resume;
  themeId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  themeId: 'simple',
});

const selectedTheme = computed(() => {
  const themeId = props.resumeData.meta?.theme || props.themeId || 'simple';
  return getTheme(themeId) || getDefaultTheme();
});

const themeComponent = computed(() => selectedTheme.value.component);
</script>
