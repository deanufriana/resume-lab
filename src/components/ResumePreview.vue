<template>
  <div class="relative w-full overflow-hidden" ref="wrapperRef">
    <div
      class="absolute top-0 left-1/2 transition-transform duration-300 ease-out origin-top"
      :style="{
        transform: `translateX(-50%) scale(${scale})`,
        width: `${baseWidth}px`,
        height: `${contentHeight}px`,
      }"
    >
      <div id="resume-preview" class="bg-white min-h-full p-10">
        <component :is="themeComponent" :resume-data="resumeData" />
      </div>
    </div>
    <!-- Spacer to ensure the relative container has the correct height after scaling -->
    <div :style="{ height: `${contentHeight * scale}px` }"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import type { Resume } from "../types/resume";
import { getTheme, getDefaultTheme } from "../themes";

interface Props {
  resumeData: Resume;
  themeId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  themeId: "simple",
});

const baseWidth = 800; // Base width for "desktop" look
const scale = ref(1);
const wrapperRef = ref<HTMLElement | null>(null);
const contentHeight = ref(300); // Start small to avoid excessive white space

function updateScale() {
  if (!wrapperRef.value) return;
  const containerWidth = wrapperRef.value.clientWidth;
  if (containerWidth < baseWidth) {
    scale.value = containerWidth / baseWidth;
  } else {
    scale.value = 1;
  }
}

// Update height based on actual content
function updateHeight() {
  const el = document.getElementById("resume-preview");
  if (el) {
    contentHeight.value = el.scrollHeight;
  }
}

const selectedTheme = computed(() => {
  const themeId = props.resumeData.meta?.theme || props.themeId || "simple";
  return getTheme(themeId) || getDefaultTheme();
});

const themeComponent = computed(() => selectedTheme.value.component);

onMounted(() => {
  updateScale();
  window.addEventListener("resize", updateScale);

  // Initial height measurement
  setTimeout(updateHeight, 500);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScale);
});

// Watch for data changes to re-measure height
watch(
  () => props.resumeData,
  () => {
    setTimeout(updateHeight, 100);
  },
  { deep: true },
);

watch(
  () => props.themeId,
  () => {
    setTimeout(updateHeight, 300);
  },
);
</script>
