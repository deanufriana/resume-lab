<script setup lang="ts">
import { ref, reactive, watch, computed, toRaw } from "vue";
import type { Meta, Resume } from "../types/resume";
import type { Theme } from "../themes";
import { Button, EmptyState } from "./ui/index";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  FolderGit2,
  EyeOff,
  FileText,
  Sparkles,
  FileCode2,
} from "lucide-vue-next";

import StudioRail, { type StudioSectionItem } from "./StudioRail.vue";
import CanvasToolbar from "./CanvasToolbar.vue";
import ResumePreview from "./ResumePreview.vue";
import BasicsSection from "./form/BasicsSection.vue";
import WorkSection from "./form/WorkSection.vue";
import EducationSection from "./form/EducationSection.vue";
import SkillsSection from "./form/SkillsSection.vue";
import ProjectsSection from "./form/ProjectsSection.vue";
import AdditionalSection from "./form/AdditionalSection.vue";

const props = defineProps<{
  resumeData: Resume;
  themes?: Theme[];
  themeId?: string;
}>();

const emit = defineEmits<{
  (e: "update", data: Resume): void;
  (e: "load-sample"): void;
  (e: "open-json"): void;
  (e: "clear-resume"): void;
  (e: "theme-change", themeId: string): void;
}>();

function cloneResume(data: Resume): Resume {
  const cloned = structuredClone(toRaw(data));
  if (!cloned.meta) {
    cloned.meta = {};
  }
  return cloned;
}

const localResume = reactive<Resume>(cloneResume(props.resumeData));
const activeSection = ref("basics");
const mobileView = ref<"edit" | "preview">("edit");
const onboardingDismissed = ref(false);
const canvasZoom = ref<"fit" | number>("fit");
let isSyncingFromParent = false;

watch(
  () => props.resumeData,
  (newData) => {
    const incoming = cloneResume(newData);
    if (JSON.stringify(incoming) !== JSON.stringify(toRaw(localResume))) {
      isSyncingFromParent = true;
      Object.assign(localResume, incoming);
      queueMicrotask(() => {
        isSyncingFromParent = false;
      });
    }
  },
  { deep: true },
);

watch(
  localResume,
  (newVal) => {
    if (isSyncingFromParent) return;
    emit("update", cloneResume(newVal));
  },
  { deep: true },
);

function updateMeta<K extends keyof Meta>(key: K, value: Meta[K]) {
  localResume.meta = { ...localResume.meta, [key]: value };
}

const hasResumeContent = computed(() => {
  const b = localResume.basics;
  return Boolean(
    b?.name?.trim() ||
    b?.label?.trim() ||
    b?.summary?.trim() ||
    localResume.work?.length ||
    localResume.education?.length ||
    localResume.skills?.length ||
    localResume.projects?.length,
  );
});

const completeness = computed(() => {
  let score = 0;
  if (localResume.basics?.name?.trim()) score += 20;
  if (localResume.basics?.email?.trim() || localResume.basics?.phone?.trim()) score += 15;
  if (localResume.basics?.summary?.trim()) score += 15;
  if (localResume.work?.length) score += 25;
  if (localResume.education?.length) score += 15;
  if (localResume.skills?.length) score += 10;
  return score;
});

const sections = computed<StudioSectionItem[]>(() => [
  {
    id: "basics",
    label: "Basics",
    icon: User,
    count: localResume.basics?.name?.trim() ? 1 : 0,
    isDot: true,
  },
  {
    id: "work",
    label: "Work",
    icon: Briefcase,
    count: localResume.work?.length || 0,
  },
  {
    id: "education",
    label: "Edu",
    icon: GraduationCap,
    count: localResume.education?.length || 0,
  },
  {
    id: "skills",
    label: "Skills",
    icon: Wrench,
    count: localResume.skills?.length || 0,
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderGit2,
    count: localResume.projects?.length || 0,
  },
  {
    id: "additional",
    label: "More",
    icon: Award,
    count:
      (localResume.awards?.length || 0) +
      (localResume.certificates?.length || 0) +
      (localResume.languages?.length || 0) +
      (localResume.interests?.length || 0) +
      (localResume.volunteer?.length || 0) +
      (localResume.publications?.length || 0),
  },
]);

const currentSection = computed(() => sections.value.find((s) => s.id === activeSection.value));
</script>

<template>
  <div
    class="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row overflow-hidden print:h-auto print:overflow-visible print:block"
  >
    <StudioRail
      v-model:active-section="activeSection"
      v-model:mobile-view="mobileView"
      :sections="sections"
      :completeness="completeness"
      :has-content="hasResumeContent"
      @clear-resume="emit('clear-resume')"
    />

    <!-- Pane 2: Center Editor Inspector -->
    <section
      :class="[
        'lg:w-[430px] xl:w-[470px] flex-shrink-0 lg:border-r bg-background flex flex-col min-w-0 no-print',
        mobileView === 'edit' ? 'flex-1 lg:flex-none flex' : 'hidden lg:flex',
      ]"
    >
      <!-- Editor Sub-header -->
      <div class="px-5 py-2.5 border-b flex items-center justify-between gap-3 bg-card/30">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {{ currentSection?.label }}
          </span>
          <span
            v-if="currentSection && currentSection.count > 0 && !currentSection.isDot"
            class="text-[11px] font-medium text-muted-foreground tabular-nums"
          >
            · {{ currentSection.count }}
          </span>
        </div>
        <span class="text-[11px] text-muted-foreground tabular-nums">
          {{ completeness }}% complete
        </span>
      </div>

      <!-- Scrollable Form Area -->
      <div class="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        <!-- Welcome Onboarding Banner (when empty) -->
        <div
          v-if="!hasResumeContent && !onboardingDismissed"
          class="p-4 rounded-md border bg-card shadow-sm space-y-3"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <h3 class="text-sm font-semibold">Welcome to Resume Lab Studio</h3>
              <p class="text-xs text-muted-foreground mt-0.5">
                Start with sample data, import an existing JSON Resume, or fill in the form below.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              @click="onboardingDismissed = true"
              class="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </Button>
          </div>
          <div class="flex flex-wrap gap-2">
            <Button size="sm" class="h-8 text-xs gap-1.5" @click="emit('load-sample')">
              <Sparkles class="w-3.5 h-3.5" /> Load Sample Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="h-8 text-xs gap-1.5"
              @click="emit('open-json')"
            >
              <FileCode2 class="w-3.5 h-3.5" /> Import / Paste JSON
            </Button>
          </div>
        </div>

        <BasicsSection
          v-if="activeSection === 'basics'"
          :basics="localResume.basics!"
          :hide-contact="localResume.meta?.hideContact"
          @update:basics="(val) => (localResume.basics = val)"
          @update:hide-contact="(val) => updateMeta('hideContact', val)"
        />

        <WorkSection
          v-else-if="activeSection === 'work'"
          :work="localResume.work || []"
          @update:work="(val) => (localResume.work = val)"
        />

        <EducationSection
          v-else-if="activeSection === 'education'"
          :education="localResume.education || []"
          @update:education="(val) => (localResume.education = val)"
        />

        <SkillsSection
          v-else-if="activeSection === 'skills'"
          :skills="localResume.skills || []"
          @update:skills="(val) => (localResume.skills = val)"
        />

        <ProjectsSection
          v-else-if="activeSection === 'projects'"
          :projects="localResume.projects || []"
          @update:projects="(val) => (localResume.projects = val)"
        />

        <AdditionalSection
          v-else-if="activeSection === 'additional'"
          :resume="localResume"
          @update:resume="(val) => Object.assign(localResume, val)"
        />
      </div>
    </section>

    <!-- Pane 3: Right Live A4 Canvas -->
    <section
      :class="[
        'flex-1 flex flex-col bg-muted/30 relative min-w-0 overflow-hidden print:overflow-visible print:bg-white',
        mobileView === 'preview' ? 'flex' : 'hidden lg:flex print:flex',
      ]"
    >
      <CanvasToolbar
        v-model:zoom="canvasZoom"
        :themes="props.themes"
        :theme-id="props.themeId"
        :meta="localResume.meta"
        @theme-change="(id) => emit('theme-change', id)"
        @update-meta="updateMeta"
      />

      <!-- Upwork Compliance Banner -->
      <div
        v-if="localResume.meta?.hideContact"
        class="mx-4 mt-3 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs no-print"
      >
        <EyeOff class="w-4 h-4 flex-shrink-0" />
        <span>
          <strong>Upwork Privacy Mode:</strong> Email, phone, website, and social profiles are
          hidden in preview & exports.
        </span>
      </div>

      <!-- Scrollable A4 Dot-Grid Canvas -->
      <div
        class="flex-1 overflow-y-auto p-4 sm:p-6 bg-dot-pattern custom-scrollbar print:overflow-visible print:p-0 print:bg-none"
      >
        <ResumePreview
          v-if="hasResumeContent"
          :resume-data="localResume"
          :theme-id="props.themeId"
          :zoom="canvasZoom"
        />
        <EmptyState
          v-else
          class="max-w-md mx-auto mt-12 bg-card/80 backdrop-blur-sm"
          :icon="FileText"
          title="Live A4 Preview"
          description="Start typing in the editor or load the sample resume to see your live A4 layout."
        >
          <Button size="sm" @click="emit('load-sample')" class="gap-1.5">
            <Sparkles class="w-4 h-4" /> Load Sample
          </Button>
        </EmptyState>
      </div>
    </section>
  </div>
</template>
