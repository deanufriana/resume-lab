<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import type { Resume } from "./types/resume";
import Navbar from "./components/Navbar.vue";
import JsonDrawer from "./components/JsonDrawer.vue";
import SignatureModal from "./components/SignatureModal.vue";
import AboutModal from "./components/AboutModal.vue";
import ConfirmModal from "./components/ConfirmModal.vue";
import Toast from "./components/ui/Toast.vue";
import { generatePDFFromElement } from "./utils/pdf";
import { useToast } from "./composables/useToast";
import {
  saveResumeToStorage,
  loadResumeFromStorage,
  clearResumeFromStorage,
} from "./utils/storage";
import { themes, getDefaultTheme } from "./themes";
import { Analytics } from "./utils/analytics";
import { fetchResumeFromGist, getGistParamFromLocation } from "./utils/gist";

const toast = useToast();
const selectedThemeId = ref(getDefaultTheme().id);
const saveStatus = ref<"saved" | "saving" | "idle">("idle");
const isJsonOpen = ref(false);
const isSignatureOpen = ref(false);
const isAboutOpen = ref(false);
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function createEmptyResume(): Resume {
  return {
    basics: {
      name: "",
      label: "",
      email: "",
      phone: "",
      url: "",
      summary: "",
      location: { city: "", region: "", countryCode: "", address: "" },
      profiles: [],
    },
    work: [],
    volunteer: [],
    education: [],
    awards: [],
    certificates: [],
    publications: [],
    skills: [],
    languages: [],
    interests: [],
    references: [],
    projects: [],
    meta: { theme: getDefaultTheme().id },
  };
}

const resumeData = reactive<Resume>(createEmptyResume());

const hasResumeContent = computed(() => {
  const b = resumeData.basics;
  return Boolean(
    b?.name?.trim() ||
    b?.label?.trim() ||
    b?.summary?.trim() ||
    resumeData.work?.length ||
    resumeData.education?.length ||
    resumeData.skills?.length ||
    resumeData.projects?.length,
  );
});

function loadFromLocalStorage() {
  const savedResume = loadResumeFromStorage();
  if (savedResume && Object.keys(savedResume).length > 0) {
    if (savedResume.basics?.name || savedResume.work?.length || savedResume.education?.length) {
      Object.assign(resumeData, createEmptyResume(), savedResume);
      if (savedResume.meta?.theme) {
        selectedThemeId.value = savedResume.meta.theme;
      }
      saveStatus.value = "saved";
    }
  }
}

onMounted(async () => {
  const gistParam = getGistParamFromLocation(window.location.search, window.location.hash);
  if (gistParam) {
    try {
      const { resume, filename } = await fetchResumeFromGist(gistParam);
      Object.assign(resumeData, createEmptyResume(), resume);
      if (resume.meta?.theme) {
        selectedThemeId.value = resume.meta.theme;
      }
      persistResume(true);
      toast.success(`Loaded ${filename} from Gist!`);
      return;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load resume from Gist");
    }
  }
  loadFromLocalStorage();
});

function persistResume(immediate = false) {
  if (saveTimer) clearTimeout(saveTimer);
  if (immediate) {
    saveResumeToStorage(resumeData);
    saveStatus.value = "saved";
    return;
  }
  saveStatus.value = "saving";
  saveTimer = setTimeout(() => {
    saveResumeToStorage(resumeData);
    saveStatus.value = "saved";
  }, 350);
}

function handleResumeUpdate(data: Resume) {
  Object.assign(resumeData, data);
  persistResume(false);
}

function handleThemeChange(themeId: string) {
  selectedThemeId.value = themeId;
  if (!resumeData.meta) resumeData.meta = {};
  resumeData.meta.theme = themeId;
  persistResume(true);
  Analytics.trackThemeChange(themeId);
}

function applyJsonData(data: Resume) {
  Object.assign(resumeData, createEmptyResume(), data);
  if (resumeData.meta?.theme) {
    selectedThemeId.value = resumeData.meta.theme;
  }
  persistResume(true);
  isJsonOpen.value = false;
  Analytics.trackResumeUpload();
}

const SAMPLE_GIST_ID = "b0396934938be633d75f134046ae8806";
let isLoadingSample = false;

const pendingConfirm = ref<"clear" | "sample" | null>(null);

const confirmModalConfig = computed(() => {
  if (pendingConfirm.value === "clear") {
    return {
      title: "Clear resume data?",
      description:
        "This will remove all resume sections and clear your local browser storage. This action cannot be undone.",
      confirmLabel: "Clear Resume",
      variant: "destructive" as const,
    };
  }
  return {
    title: "Replace with sample resume?",
    description: "Loading the sample resume will overwrite your current resume data.",
    confirmLabel: "Load Sample",
    variant: "default" as const,
  };
});

async function performLoadSample() {
  if (isLoadingSample) return;
  isLoadingSample = true;
  toast.info("Loading sample resume...");
  try {
    const { resume } = await fetchResumeFromGist(SAMPLE_GIST_ID);
    Object.assign(resumeData, createEmptyResume(), resume);
    if (!resumeData.meta) resumeData.meta = {};
    if (resume.meta?.theme) {
      selectedThemeId.value = resume.meta.theme;
    } else {
      resumeData.meta.theme = selectedThemeId.value;
    }
    persistResume(true);
    toast.success("Sample resume loaded!");
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Failed to load sample resume");
  } finally {
    isLoadingSample = false;
  }
}

function requestLoadSample() {
  if (hasResumeContent.value) {
    pendingConfirm.value = "sample";
    return;
  }
  void performLoadSample();
}

function performClearResume() {
  Object.assign(resumeData, createEmptyResume());
  clearResumeFromStorage();
  saveStatus.value = "idle";
  toast.info("Resume cleared");
}

function requestClearResume() {
  if (!hasResumeContent.value) return;
  pendingConfirm.value = "clear";
}

function handleConfirmAction() {
  const action = pendingConfirm.value;
  pendingConfirm.value = null;
  if (action === "clear") {
    performClearResume();
  } else if (action === "sample") {
    void performLoadSample();
  }
}

function handleSaveSignature(payload: { dataUrl: string; showSignature: boolean }) {
  if (!resumeData.meta) resumeData.meta = {};
  if (payload.dataUrl) {
    resumeData.meta.signatureDataUrl = payload.dataUrl;
  }
  resumeData.meta.showSignature = payload.showSignature;
  persistResume(true);
}

async function generatePDF() {
  try {
    const previewElement = document.getElementById("resume-preview");
    if (!previewElement) {
      toast.error("Add some resume content before exporting.");
      return;
    }
    toast.info("Generating PDF...");
    await generatePDFFromElement(resumeData, previewElement);
    toast.success("PDF downloaded!");
    Analytics.trackPDFExport();
  } catch {
    toast.error("Failed to generate PDF");
  }
}

function downloadJSON() {
  const filename = `${resumeData.basics?.name?.replace(/\s+/g, "_") || "resume"}.json`;
  const dataStr = JSON.stringify(resumeData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  toast.success("JSON downloaded!");
  Analytics.trackJSONDownload(false);
}
</script>

<template>
  <div class="h-[100dvh] bg-background text-foreground flex flex-col overflow-hidden">
    <Navbar
      :save-status="saveStatus"
      :has-content="hasResumeContent"
      class="flex-shrink-0"
      @open-json="isJsonOpen = true"
      @open-signature="isSignatureOpen = true"
      @open-about="isAboutOpen = true"
      @load-sample="requestLoadSample"
      @clear-resume="requestClearResume"
      @export-pdf="generatePDF"
    />

    <main class="flex-1 min-h-0 flex flex-col">
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          :resume-data="resumeData"
          :themes="themes"
          :theme-id="selectedThemeId"
          @update="handleResumeUpdate"
          @load-sample="requestLoadSample"
          @open-json="isJsonOpen = true"
          @clear-resume="requestClearResume"
          @theme-change="handleThemeChange"
        />
      </router-view>
    </main>

    <JsonDrawer
      :open="isJsonOpen"
      :resume-data="resumeData"
      @close="isJsonOpen = false"
      @apply-json="applyJsonData"
      @download-json="downloadJSON"
    />

    <SignatureModal
      :open="isSignatureOpen"
      :show-signature="resumeData.meta?.showSignature"
      :existing-signature-url="resumeData.meta?.signatureDataUrl"
      @close="isSignatureOpen = false"
      @save-signature="handleSaveSignature"
    />

    <AboutModal :open="isAboutOpen" @close="isAboutOpen = false" />

    <ConfirmModal
      :open="pendingConfirm !== null"
      :title="confirmModalConfig.title"
      :description="confirmModalConfig.description"
      :confirm-label="confirmModalConfig.confirmLabel"
      :variant="confirmModalConfig.variant"
      @confirm="handleConfirmAction"
      @cancel="pendingConfirm = null"
    />

    <Toast />
  </div>
</template>
