<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { Resume } from "../types/resume";
import { Button, Card, CardContent, Separator } from "./ui/index";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  FolderGit2,
  Save,
  RotateCcw,
} from "lucide-vue-next";

import BasicsSection from "./form/BasicsSection.vue";
import WorkSection from "./form/WorkSection.vue";
import EducationSection from "./form/EducationSection.vue";
import SkillsSection from "./form/SkillsSection.vue";
import ProjectsSection from "./form/ProjectsSection.vue";
import AdditionalSection from "./form/AdditionalSection.vue";

const props = defineProps<{
  resumeData: Resume;
}>();

const emit = defineEmits<{
  (e: "update", data: Resume): void;
}>();

const localResume = reactive<Resume>(
  JSON.parse(JSON.stringify(props.resumeData)),
);
const activeSection = ref("basics");

watch(
  () => props.resumeData,
  (newData) => {
    Object.assign(localResume, JSON.parse(JSON.stringify(newData)));
  },
  { deep: true },
);

function handleSave() {
  emit("update", { ...localResume });
}

function handleReset() {
  Object.assign(localResume, JSON.parse(JSON.stringify(props.resumeData)));
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
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Sidebar Navigation -->
      <aside class="w-full md:w-64 md:sticky md:top-24 self-start space-y-6">
        <Card class="border-none shadow-none bg-transparent">
          <CardContent class="p-0 flex flex-nowrap overflow-x-auto md:flex-col gap-2 no-scrollbar">
            <button
              v-for="section in sections"
              :key="section.id"
              @click="activeSection = section.id"
              :class="[
                'flex-shrink-0 flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-md transition-all duration-200 text-left',
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground scale-[1.05] md:scale-[1.01] shadow-md'
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground',
                'min-w-[48px]'
              ]"
              :title="section.label"
            >
              <component :is="section.icon" class="w-5 h-5" />
              <span class="font-medium font-outfit hidden md:inline">{{ section.label }}</span>
            </button>
          </CardContent>
        </Card>

        <Separator class="hidden md:block my-2" />

        <div class="flex flex-row md:flex-col gap-3">
          <Button class="flex-1 justify-center md:justify-start gap-2 h-11" @click="handleSave">
            <Save class="w-4 h-4" /> <span class="hidden md:inline">Save Changes</span><span class="md:hidden">Save</span>
          </Button>
          <Button
            variant="outline"
            class="flex-1 justify-center md:justify-start gap-2 h-11"
            @click="handleReset"
          >
            <RotateCcw class="w-4 h-4" /> <span class="hidden md:inline">Reset Form</span><span class="md:hidden">Reset</span>
          </Button>
        </div>
      </aside>

      <!-- Main Form Area -->
      <main class="flex-1 min-w-0 md:h-[calc(100vh-140px)] md:overflow-y-auto md:pr-4 custom-scrollbar">
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
              @update:basics="(val) => (localResume.basics = val)"
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
    </div>
  </div>
</template>

<style scoped>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
