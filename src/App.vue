<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center flex-col md:flex-row">
        <div class="flex flex-col justify-center">
          <h1 class="text-3xl font-bold text-gray-900">Resume Lab</h1>
          <p class="text-gray-600 mt-1">Lab for creating ATS-friendly resumes</p>
        </div>
        <!-- Navigation Menu -->
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink :class="[
                'cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm rounded-none transition-colors',
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]" @click="activeTab = 'upload'">
                Upload JSON
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink :class="[
                'cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm rounded-none transition-colors',
                activeTab === 'manual'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]" @click="activeTab = 'manual'">
                Manual Entry
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink :class="[
                'cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm rounded-none transition-colors',
                activeTab === 'preview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                !resumeData.basics?.name ? 'opacity-50 cursor-not-allowed' : ''
              ]" @click="activeTab = 'preview'" :disabled="!resumeData.basics?.name">
                Preview
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

      <!-- Toast Component -->
      <Toast />

      <!-- Upload Tab -->
      <div v-show="activeTab === 'upload'" class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h2 class="text-2xl font-bold text-gray-900">Upload Resume JSON</h2>
          <Button variant="outline" @click="downloadExampleJSON">
            <svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Example Format
          </Button>
        </div>
        <p class="text-sm text-gray-600 mb-4">Upload a JSON file matching the resume format, or download the example to
          see the structure.</p>
        <FileUpload input-id="resume-json-upload" @file-loaded="handleFileLoaded" @error="handleError" />
        <div v-if="resumeData.basics?.name" class="mt-6 p-4 bg-blue-50 rounded-lg">
          <p class="text-blue-900">
            <strong>Resume loaded:</strong> {{ resumeData.basics.name }}
          </p>
          <Button class="mt-4" @click="activeTab = 'preview'">View Preview</Button>
        </div>
      </div>

      <!-- Manual Entry Tab -->
      <div v-show="activeTab === 'manual'">
        <ResumeForm :resume-data="resumeData" @update="handleResumeUpdate" />
      </div>

      <!-- Preview Tab -->
      <div v-show="activeTab === 'preview'">
        <div class="mb-6 flex justify-between items-center gap-4 flex-wrap">
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-gray-700">Theme:</label>
            <Select v-model="selectedThemeId" @change="handleThemeChange">
              <SelectOption v-for="theme in themes" :key="theme.id" :value="theme.id" :label="theme.name" />
            </Select>
          </div>
          <div class="flex gap-4">
            <Button variant="outline" @click="downloadJSON">Download JSON</Button>
            <Button @click="generatePDF">Generate PDF</Button>
          </div>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg">
          <ResumePreview :resume-data="resumeData" :theme-id="selectedThemeId" ref="previewRef" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { Resume } from './types/resume';
import Button from './components/ui/Button.vue';
import Select from './components/ui/Select.vue';
import SelectOption from './components/ui/SelectOption.vue';
import NavigationMenu from './components/ui/NavigationMenu.vue';
import NavigationMenuList from './components/ui/NavigationMenuList.vue';
import NavigationMenuItem from './components/ui/NavigationMenuItem.vue';
import NavigationMenuLink from './components/ui/NavigationMenuLink.vue';
import FileUpload from './components/ui/FileUpload.vue';
import ResumeForm from './components/ResumeForm.vue';
import ResumePreview from './components/ResumePreview.vue';
import Toast from './components/ui/Toast.vue';
import { generatePDFFromElement } from './utils/pdf';
import { useToast } from './composables/useToast';
import { saveResumeToStorage, loadResumeFromStorage } from './utils/storage';
import { themes, getDefaultTheme } from './themes';
import exampleResume from './data/resume.json';

const activeTab = ref<'upload' | 'manual' | 'preview'>('upload');
const previewRef = ref<InstanceType<typeof ResumePreview> | null>(null);
const toast = useToast();
const selectedThemeId = ref<string>(getDefaultTheme().id);

// Initialize resumeData with empty structure
const resumeData = reactive<Resume>({
  basics: {
    name: '',
    label: '',
    email: '',
    phone: '',
    url: '',
    summary: '',
    location: {
      city: '',
    },
  },
  work: [],
  education: [],
  skills: [],
});

// Load resume data from localStorage on mount
onMounted(() => {
  const savedResume = loadResumeFromStorage();
  if (savedResume && Object.keys(savedResume).length > 0) {
    // Check if saved resume has meaningful data
    if (savedResume.basics?.name || savedResume.work?.length || savedResume.education?.length) {
      Object.assign(resumeData, savedResume);
      // Update theme selection if resume has a theme preference
      if (savedResume.meta?.theme) {
        selectedThemeId.value = savedResume.meta.theme;
      }
      toast.info('Resume data loaded from local storage', 3000);
    }
  }
});

function handleThemeChange() {
  // Save theme preference to resume data
  if (!resumeData.meta) {
    resumeData.meta = {};
  }
  resumeData.meta.theme = selectedThemeId.value;
  saveResumeToStorage(resumeData);
}

function handleFileLoaded(data: any) {
  try {
    Object.assign(resumeData, data);
    // Save to localStorage
    saveResumeToStorage(resumeData);
    toast.success('Resume JSON loaded successfully!');
  } catch (error) {
    handleError('Failed to process resume data');
  }
}

function handleError(message: string) {
  toast.error(message, 5000);
}

function handleResumeUpdate(data: Resume) {
  Object.assign(resumeData, data);
  // Save to localStorage
  saveResumeToStorage(resumeData);
  toast.success('Resume updated successfully!');
}

async function generatePDF() {
  try {
    if (!previewRef.value) {
      handleError('Preview not available');
      return;
    }

    const previewElement = document.getElementById('resume-preview');
    if (!previewElement) {
      handleError('Preview element not found');
      return;
    }

    toast.info('Generating PDF...', 2000);
    await generatePDFFromElement(resumeData, previewElement);
    toast.success('PDF generated successfully!');
  } catch (error) {
    handleError('Failed to generate PDF. Please try again.');
    console.error('PDF generation error:', error);
  }
}

function downloadJSON() {
  const dataStr = JSON.stringify(resumeData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = resumeData.basics?.name
    ? `${resumeData.basics.name.replace(/\s+/g, '_')}_Resume.json`
    : 'resume.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success('JSON file downloaded successfully!');
}

function downloadExampleJSON() {
  const dataStr = JSON.stringify(exampleResume, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'resume-example.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success('Example resume JSON downloaded successfully!');
}
</script>
