<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import type { Resume } from "../types/resume";
import {
  Button,
  Card,
  CardContent,
  Separator,
  NativeSelect,
  NativeSelectOption,
} from "./ui/index";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  FolderGit2,
  Save,
  RotateCcw,
  Eye,
  Download,
  Sparkles,
  Edit3,
} from "lucide-vue-next";

import ResumePreview from "./ResumePreview.vue";

import BasicsSection from "./form/BasicsSection.vue";
import WorkSection from "./form/WorkSection.vue";
import EducationSection from "./form/EducationSection.vue";
import SkillsSection from "./form/SkillsSection.vue";
import ProjectsSection from "./form/ProjectsSection.vue";
import AdditionalSection from "./form/AdditionalSection.vue";

const props = defineProps<{
  resumeData: Resume;
  themes?: any[];
  themeId?: string;
}>();

const emit = defineEmits<{
  (e: "update", data: Resume): void;
  (e: "download-json"): void;
  (e: "export-pdf"): void;
  (e: "theme-change", event: Event): void;
}>();

const localResume = reactive<Resume>(
  JSON.parse(JSON.stringify(props.resumeData)),
);
if (!localResume.meta) {
  localResume.meta = {};
}
const activeSection = ref("basics");
const isShowingPreview = ref(false);

watch(
  () => props.resumeData,
  (newData) => {
    Object.assign(localResume, JSON.parse(JSON.stringify(newData)));
    if (!localResume.meta) {
      localResume.meta = {};
    }
  },
  { deep: true },
);

const hideContactVal = computed({
  get: () => localResume.meta?.hideContact || false,
  set: (val: boolean) => {
    if (!localResume.meta) localResume.meta = {};
    localResume.meta.hideContact = val;
    handleSave();
  }
});

function handleSave() {
  emit("update", { ...localResume });
}

function handleReset() {
  Object.assign(localResume, JSON.parse(JSON.stringify(props.resumeData)));
}

async function togglePreview() {
  isShowingPreview.value = !isShowingPreview.value;
}

function handleSectionClick(sectionId: string) {
  activeSection.value = sectionId;
  isShowingPreview.value = false;
}

const sections = [
  { id: "basics", label: "Basics", icon: User },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "additional", label: "Additional", icon: Award },
];
</script>

<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar Navigation (Persistent) -->
      <aside class="w-full lg:w-64 lg:sticky lg:top-24 self-start space-y-6">
        <Card class="border-none shadow-none bg-transparent">
          <CardContent
            class="p-0 flex flex-nowrap overflow-x-auto lg:flex-col gap-2 no-scrollbar"
          >
            <button
              v-for="section in sections"
              :key="section.id"
              @click="handleSectionClick(section.id)"
              :class="[
                'flex-shrink-0 flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-md transition-all duration-200 text-left',
                activeSection === section.id && !isShowingPreview
                  ? 'bg-primary text-primary-foreground scale-[1.05] shadow-md'
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground',
                'min-w-[48px]',
              ]"
              :title="section.label"
            >
              <component :is="section.icon" class="w-5 h-5" />
              <span class="font-medium font-outfit hidden lg:inline">{{
                section.label
              }}</span>
            </button>
          </CardContent>
        </Card>

        <Separator class="hidden lg:block my-2" />

        <div class="flex flex-row lg:flex-col gap-3">
          <Button
            class="flex-1 justify-center lg:justify-start gap-2 h-11"
            @click="handleSave"
          >
            <Save class="w-4 h-4" />
            <span class="hidden lg:inline">Save Changes</span
            ><span class="lg:hidden">Save</span>
          </Button>
          <Button
            variant="outline"
            class="flex-1 justify-center lg:justify-start gap-2 h-11"
            @click="handleReset"
          >
            <RotateCcw class="w-4 h-4" />
            <span class="hidden lg:inline">Reset Form</span
            ><span class="lg:hidden">Reset</span>
          </Button>

          <Button
            variant="secondary"
            class="flex-1 justify-center lg:justify-start gap-2 h-11 border-primary/20"
            @click="togglePreview"
          >
            <component :is="isShowingPreview ? Edit3 : Eye" class="w-4 h-4" />
            <span class="hidden lg:inline">{{
              isShowingPreview ? "Edit Resume" : "Preview Resume"
            }}</span>
            <span class="lg:hidden">{{
              isShowingPreview ? "Edit" : "Preview"
            }}</span>
          </Button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 min-w-0">
        <transition name="fade" mode="out-in">
          <main
            v-if="!isShowingPreview"
            key="editor"
            class="lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-4 custom-scrollbar"
          >
            <transition
              mode="out-in"
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform translate-y-4 opacity-0"
              enter-to-class="transform translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform translate-y-0 opacity-100"
              leave-to-class="transform translate-y-4 opacity-0"
            >
              <div :key="activeSection">
                <BasicsSection
                  v-if="activeSection === 'basics'"
                  :basics="localResume.basics!"
                  :hide-contact="localResume.meta?.hideContact"
                  @update:basics="(val) => (localResume.basics = val)"
                  @update:hide-contact="(val) => { if (!localResume.meta) localResume.meta = {}; localResume.meta.hideContact = val; handleSave(); }"
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
            </transition>
          </main>

          <div
            v-else
            key="preview"
            class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-4 lg:pb-10 custom-scrollbar"
          >
            <!-- Integrated Preview Action Bar -->
            <Card
              class="bg-card/50 backdrop-blur-md sticky top-0 z-30 border-primary/10 shadow-lg mb-6"
            >
              <CardContent class="p-4 sm:p-6">
                <div
                  class="flex flex-col md:flex-row justify-between items-center gap-6"
                >
                  <div class="flex flex-wrap items-center gap-6 w-full md:w-auto">
                    <div class="flex-1 md:flex-initial min-w-[120px] space-y-1">
                      <NativeSelect
                        @change="(e: any) => emit('theme-change', e)"
                        :model-value="props.themeId"
                        class="h-9"
                      >
                        <NativeSelectOption
                          v-for="theme in props.themes"
                          :key="theme.id"
                          :value="theme.id"
                        >
                          {{ theme.name }}
                        </NativeSelectOption>
                      </NativeSelect>
                    </div>

                    <!-- Upwork Compliance Toggle Switch -->
                    <label class="flex items-center gap-3 cursor-pointer select-none">
                      <div class="relative">
                        <input
                          type="checkbox"
                          v-model="hideContactVal"
                          class="sr-only peer"
                        />
                        <div class="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary transition-colors"></div>
                      </div>
                      <span class="text-xs font-semibold text-muted-foreground peer-checked:text-foreground tracking-tight">
                        Hide contact info for Upwork
                      </span>
                    </label>
                  </div>

                  <div class="flex gap-2 w-full md:w-auto">
                    <Button
                      variant="outline"
                      @click="emit('download-json')"
                      class="flex-1 md:flex-none gap-2"
                    >
                      <Download class="w-4 h-4" />
                      <span class="hidden sm:inline">Download JSON</span
                      ><span class="sm:hidden">JSON</span>
                    </Button>
                    <Button
                      @click="emit('export-pdf')"
                      class="flex-1 md:flex-none gap-2"
                    >
                      <Sparkles class="w-4 h-4" />
                      <span class="hidden sm:inline">Export PDF</span
                      ><span class="sm:hidden">PDF</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Upwork Compliance Mode Warning Banner -->
            <div
              v-if="localResume.meta?.hideContact"
              class="max-w-4xl mx-auto p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start sm:items-center gap-3 text-amber-600 dark:text-amber-400 mb-6 transition-all animate-in fade-in slide-in-from-top-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <div class="text-xs leading-relaxed font-medium">
                <span class="font-bold">Upwork Compliance Mode Active:</span> Your email, phone number, website, and social links are hidden from this preview and the exported PDF.
              </div>
            </div>

            <!-- Preview Display -->
            <div
              class="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-primary/5"
            >
              <ResumePreview
                :resume-data="localResume"
                :theme-id="props.themeId"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-outfit {
  font-family: "Outfit", sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
