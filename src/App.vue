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

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand Section -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Resume Lab</h3>
            <p class="text-sm text-gray-600">
              Create professional, ATS-friendly resumes with ease. Build your resume by uploading JSON or filling out forms.
            </p>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-sm text-gray-600">
              © {{ currentYear }} Resume Lab. All rights reserved.
            </p>
            <div class="flex gap-4">
              <a
                href="https://github.com/deanufriana/resume-lab"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                title="GitHub"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
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

// Get current year for copyright
const currentYear = computed(() => new Date().getFullYear());

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
