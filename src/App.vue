<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { Resume } from "./types/resume";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Navbar,
  ResumeForm,
  ResumePreview,
  SignaturePad,
} from "./components";
import { FileUp, Download, Eye, PenTool, Sparkles } from "lucide-vue-next";
import FileUpload from "./components/ui/FileUpload.vue";
import { generatePDFFromElement } from "./utils/pdf";
import { useToast } from "./composables/useToast";
import { saveResumeToStorage, loadResumeFromStorage } from "./utils/storage";
import { themes, getDefaultTheme } from "./themes";
import exampleResume from "./data/resume.json";

const activeTab = ref<"upload" | "manual" | "preview" | "signature">("upload");
const toast = useToast();
const selectedThemeId = ref<string>(getDefaultTheme().id);
const currentYear = computed(() => new Date().getFullYear());

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
}

function handleFileLoaded(data: any) {
  try {
    Object.assign(resumeData, data);
    saveResumeToStorage(resumeData);
    toast.success("Resume JSON loaded successfully!");
    activeTab.value = "preview";
  } catch (error) {
    toast.error("Failed to process resume data");
  }
}

function handleResumeUpdate(data: Resume) {
  Object.assign(resumeData, data);
  saveResumeToStorage(resumeData);
  toast.success("Resume updated!");
}

async function generatePDF() {
  try {
    const previewElement = document.getElementById("resume-preview");
    if (!previewElement) throw new Error("Preview element not found");
    toast.info("Generating PDF...");
    await generatePDFFromElement(resumeData, previewElement);
    toast.success("PDF generated successfully!");
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

    <Navbar
      v-model:active-tab="activeTab"
      :is-resume-loaded="!!resumeData.basics?.name"
    />

    <main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Upload Section -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-show="activeTab === 'upload'" class="max-w-2xl mx-auto">
          <Card class="border-dashed border-2 bg-card/50 backdrop-blur-sm">
            <CardHeader class="text-center">
              <div
                class="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"
              >
                <FileUp class="w-6 h-6 text-primary" />
              </div>
              <CardTitle class="text-3xl">Get Started</CardTitle>
              <CardDescription
                >Upload your resume in JSON format or download our example to
                see how it works.</CardDescription
              >
            </CardHeader>
            <CardContent class="space-y-6">
              <FileUpload @file-loaded="handleFileLoaded" />
              <div class="flex items-center justify-center gap-4 pt-4">
                <Button
                  variant="outline"
                  @click="downloadExampleJSON"
                  class="gap-2"
                >
                  <Download class="w-4 h-4" /> Example JSON
                </Button>
                <Button
                  v-if="resumeData.basics?.name"
                  @click="activeTab = 'preview'"
                  class="gap-2"
                >
                  View Current <Eye class="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </transition>

      <!-- Manual Entry Section -->
      <div v-show="activeTab === 'manual'">
        <ResumeForm :resume-data="resumeData" @update="handleResumeUpdate" />
      </div>

      <!-- Preview Section -->
      <div v-show="activeTab === 'preview'" class="space-y-6">
        <Card class="bg-card/50 backdrop-blur-sm">
          <CardContent class="p-6">
            <div
              class="flex flex-col sm:flex-row justify-between items-center gap-6"
            >
              <div class="flex items-center gap-4">
                <div class="space-y-1">
                  <Label
                    class="text-xs uppercase tracking-wider font-bold text-muted-foreground"
                    >Resume Template</Label
                  >
                  <select
                    @change="handleThemeChange"
                    :value="selectedThemeId"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option
                      v-for="theme in themes"
                      :key="theme.id"
                      :value="theme.id"
                    >
                      {{ theme.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="flex gap-3">
                <Button variant="outline" @click="downloadJSON" class="gap-2">
                  <Download class="w-4 h-4" /> JSON
                </Button>
                <Button @click="generatePDF" class="gap-2">
                  <Sparkles class="w-4 h-4" /> Export PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div
          class="rounded-2xl border bg-white overflow-hidden p-8 min-h-[1000px]"
        >
          <ResumePreview
            :resume-data="resumeData"
            :theme-id="selectedThemeId"
            ref="previewRef"
          />
        </div>
      </div>

      <!-- Signature Section -->
      <div v-show="activeTab === 'signature'" class="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <PenTool class="w-5 h-5 text-primary" /> Digital Signature
            </CardTitle>
            <CardDescription
              >Draw your signature here and export it as an image for your
              resume.</CardDescription
            >
          </CardHeader>
          <CardContent>
            <SignaturePad />
          </CardContent>
        </Card>
      </div>
    </main>

    <footer class="border-t bg-card/30 backdrop-blur-sm mt-20 py-12">
      <div class="max-w-7xl mx-auto px-4 text-center space-y-4">
        <div class="flex items-center justify-center gap-2">
          <div
            class="w-6 h-6 rounded bg-primary flex items-center justify-center"
          >
            <FileText class="w-4 h-4 text-primary-foreground" />
          </div>
          <span class="font-bold text-lg font-outfit">Resume Lab</span>
        </div>
        <p class="text-sm text-muted-foreground max-w-md mx-auto">
          The ultimate lab for crafting professional, ATS-optimized resumes that
          land interviews.
        </p>
        <p class="text-xs text-muted-foreground pt-4">
          © {{ currentYear }} Resume Lab. Built with Shadcn Vue & Vue 3.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
