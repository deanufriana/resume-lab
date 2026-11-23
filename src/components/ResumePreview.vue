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
      <div id="resume-preview" ref="previewRef" class="bg-white min-h-full p-10">
        <component :is="themeComponent" :resume-data="filteredResumeData" />
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
import { useResumePreview } from "../composables/useResumePreview";

interface Props {
  resumeData: Resume;
  themeId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  themeId: "simple",
});

const filteredResumeData = computed(() => {
  if (!props.resumeData.meta?.hideContact) {
    return props.resumeData;
  }
  const cloned = JSON.parse(JSON.stringify(props.resumeData));
  if (cloned.basics) {
    cloned.basics.email = "";
    cloned.basics.phone = "";
    cloned.basics.url = "";
    cloned.basics.profiles = [];
    if (cloned.basics.location) {
      cloned.basics.location.address = "";
    }
  }
  return cloned;
});

const baseWidth = 800; // Base width for "desktop" look
const scale = ref(1);
const wrapperRef = ref<HTMLElement | null>(null);
const previewRef = ref<HTMLElement | null>(null);
const { contentHeight, calculateContentHeight } = useResumePreview(previewRef);
let wrapperObserver: ResizeObserver | null = null;

function updateScale() {
  if (!wrapperRef.value) return;
  const containerWidth = wrapperRef.value.clientWidth;
  if (containerWidth < baseWidth) {
    scale.value = containerWidth / baseWidth;
  } else {
    scale.value = 1;
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
  if (wrapperRef.value) {
    wrapperObserver = new ResizeObserver(updateScale);
    wrapperObserver.observe(wrapperRef.value);
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScale);
  wrapperObserver?.disconnect();
});

watch(
  [() => props.resumeData, () => props.themeId],
  () => {
    calculateContentHeight();
  },
  { deep: true },
);
</script>
