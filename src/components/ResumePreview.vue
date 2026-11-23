<template>
  <div
    class="relative w-full overflow-x-auto custom-scrollbar py-1 print:overflow-visible print:p-0"
    ref="wrapperRef"
  >
    <div
      class="mx-auto relative transition-all duration-200 ease-out print:!w-full print:!h-auto"
      :style="{
        width: `${baseWidth * effectiveScale}px`,
        height: `${Math.max(1131, contentHeight) * effectiveScale}px`,
      }"
    >
      <div
        id="resume-preview"
        ref="previewRef"
        class="relative bg-white min-h-[1131px] p-10 shadow-lg rounded-none border border-black/10 origin-top-left transition-transform duration-200 ease-out"
        :style="{
          width: `${baseWidth}px`,
          transform: `scale(${effectiveScale})`,
        }"
      >
        <component :is="themeComponent" :resume-data="filteredResumeData" />

        <!-- Visual A4 Page-Break Indicators (hidden in print & PDF export) -->
        <div
          v-for="pageIdx in Math.max(0, pageCount - 1)"
          :key="pageIdx"
          class="no-print pointer-events-none absolute left-0 right-0 flex items-center"
          :style="{ top: `${40 + pageIdx * A4_PRINTABLE_HEIGHT}px` }"
        >
          <div class="w-full border-t border-dashed border-amber-500/60"></div>
          <span
            class="absolute right-3 -top-2.5 px-2 py-0.5 rounded-sm bg-amber-500/90 text-white text-[10px] font-semibold shadow-sm"
          >
            Page {{ pageIdx + 1 }} of {{ pageCount }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import type { Resume } from "../types/resume";
import { getTheme, getDefaultTheme } from "../themes";
import { useResumePreview } from "../composables/useResumePreview";
import { stripContactInfo } from "../utils/privacy";

interface Props {
  resumeData: Resume;
  themeId?: string;
  zoom?: "fit" | number;
}

const props = withDefaults(defineProps<Props>(), {
  themeId: "modern",
  zoom: "fit",
});

const A4_PRINTABLE_HEIGHT = 1055; // 800px * (277mm / 210mm) matching 10mm top/bottom PDF margins
const baseWidth = 800;

const filteredResumeData = computed(() => stripContactInfo(props.resumeData));

const fitScale = ref(1);
const wrapperRef = ref<HTMLElement | null>(null);
const previewRef = ref<HTMLElement | null>(null);
const { contentHeight, calculateContentHeight } = useResumePreview(previewRef);
let wrapperObserver: ResizeObserver | null = null;

const effectiveScale = computed(() => {
  if (props.zoom === "fit") {
    return fitScale.value;
  }
  return props.zoom;
});

const pageCount = computed(() => {
  if (!contentHeight.value) return 1;
  return Math.max(1, Math.ceil(Math.max(0, contentHeight.value - 80) / A4_PRINTABLE_HEIGHT));
});

function updateScale() {
  if (!wrapperRef.value) return;
  const containerWidth = wrapperRef.value.clientWidth;
  if (containerWidth > 0 && containerWidth < baseWidth) {
    fitScale.value = Math.max(0.3, containerWidth / baseWidth);
  } else {
    fitScale.value = 1;
  }
}

const selectedTheme = computed(() => {
  const themeId = props.resumeData.meta?.theme || props.themeId || "modern";
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
