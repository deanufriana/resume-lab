<script setup lang="ts">
import { reactive, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { Resume } from "./types/resume";
import { Navbar, Footer } from "./components";
import { generatePDFFromElement } from "./utils/pdf";
import { useToast } from "./composables/useToast";
import { saveResumeToStorage, loadResumeFromStorage } from "./utils/storage";
import { themes, getDefaultTheme } from "./themes";
import exampleResume from "./data/resume.json";
import { Analytics } from "./utils/analytics";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const selectedThemeId = reactive({ value: getDefaultTheme().id });

// Track route changes
watch(
  () => route.path,
  (newPath) => {
    Analytics.trackTabChange(newPath.replace("/", "") || "upload");
  },
);

// Initialize resumeData
const resumeData = reactive<Resume>({
  basics: {
    name: "",
    label: "",
    email: "",
    phone: "",
    url: "",
    summary: "",
    location: { city: "" },
    profiles: [],
  },
  work: [],
  education: [],
  skills: [],
});

onMounted(() => {
  const savedResume = loadResumeFromStorage();
  if (savedResume && Object.keys(savedResume).length > 0) {
    if (
      savedResume.basics?.name ||
      savedResume.work?.length ||
      savedResume.education?.length
    ) {
      Object.assign(resumeData, savedResume);
      if (savedResume.meta?.theme) {
        selectedThemeId.value = savedResume.meta.theme;
      }
      toast.info("Session restored from local storage");
    }
  }
});

function handleThemeChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  selectedThemeId.value = target.value;
  if (!resumeData.meta) resumeData.meta = {};
  resumeData.meta.theme = selectedThemeId.value;
  saveResumeToStorage(resumeData);
  Analytics.trackThemeChange(target.value);
}

function handleFileLoaded(data: any) {
  try {
    Object.assign(resumeData, data);
    saveResumeToStorage(resumeData);
    toast.success("Resume JSON loaded successfully!");
    router.push("/preview");
    Analytics.trackResumeUpload();
  } catch (error) {
    toast.error("Failed to process resume data");
  }
}

function handleResumeUpdate(data: Resume) {
  Object.assign(resumeData, data);
  saveResumeToStorage(resumeData);
  toast.success("Resume updated!");
  Analytics.trackResumeUpdate();
}

async function generatePDF() {
  try {
    const previewElement = document.getElementById("resume-preview");
    if (!previewElement) throw new Error("Preview element not found");
    toast.info("Generating PDF...");
    await generatePDFFromElement(resumeData, previewElement);
    toast.success("PDF generated successfully!");
    Analytics.trackPDFExport();
  } catch (error) {
    toast.error("Failed to generate PDF");
  }
}

function downloadJSON() {
  const dataStr = JSON.stringify(resumeData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${resumeData.basics?.name?.replace(/\s+/g, "_") || "resume"}.json`;
  link.click();
  toast.success("JSON downloaded!");
  Analytics.trackJSONDownload(false);
}

function downloadExampleJSON() {
  const dataStr = JSON.stringify(exampleResume, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "resume-example.json";
  link.click();
  toast.success("Example downloaded!");
  Analytics.trackJSONDownload(true);
}
</script>

<template>
  <div class="min-h-screen bg-background relative overflow-hidden">
    <!-- Background Decor -->
    <div
      class="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none"
    ></div>
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary/5 to-transparent blur-3xl pointer-events-none"
    ></div>

    <Navbar :is-resume-loaded="!!resumeData.basics?.name" />

    <main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view v-slot="{ Component }">
        <transition
          mode="out-in"
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <component
            :is="Component"
            :resume-data="resumeData"
            :themes="themes"
            :theme-id="selectedThemeId.value"
            @update="handleResumeUpdate"
            @file-loaded="handleFileLoaded"
            @download-example="downloadExampleJSON"
            @download-json="downloadJSON"
            @export-pdf="generatePDF"
            @theme-change="handleThemeChange"
          />
        </transition>
      </router-view>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
