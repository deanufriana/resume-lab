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
      <aside class="w-full md:w-64 md:sticky md:top-24 self-start space-y-4">
        <Card class="border-none shadow-none bg-transparent">
          <CardContent class="p-0 space-y-2">
            <button
              v-for="section in sections"
              :key="section.id"
              @click="activeSection = section.id"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 text-left',
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground scale-[1.01]'
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground',
              ]"
            >
              <component :is="section.icon" class="w-5 h-5" />
              <span class="font-medium font-outfit">{{ section.label }}</span>
            </button>
          </CardContent>
        </Card>

        <Separator class="my-6" />

        <div class="flex flex-col gap-2">
          <Button class="w-full justify-start gap-2 h-11" @click="handleSave">
            <Save class="w-4 h-4" /> Save Changes
          </Button>
          <Button
            variant="outline"
            class="w-full justify-start gap-2 h-11"
            @click="handleReset"
          >
            <RotateCcw class="w-4 h-4" /> Reset Form
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
