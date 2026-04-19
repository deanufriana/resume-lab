<template>
  <div ref="previewContainer" id="resume-preview" class="relative bg-white text-gray-900 font-sans p-0 min-h-[1100px]">
    <!-- Modern Header -->
    <header class="bg-gray-900 text-white p-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-4xl font-bold tracking-tight font-outfit">
            {{ resumeData.basics?.name }}
          </h1>
          <p class="text-xl text-blue-400 font-medium mt-1 font-outfit">
            {{ resumeData.basics?.label }}
          </p>
        </div>
        <div class="flex flex-col items-start md:items-end text-sm text-gray-300 gap-1">
          <div v-if="resumeData.basics?.email" class="flex items-center gap-2">
            <span>{{ resumeData.basics.email }}</span>
          </div>
          <div v-if="resumeData.basics?.phone" class="flex items-center gap-2">
            <span>{{ resumeData.basics.phone }}</span>
          </div>
          <div v-if="resumeData.basics?.location" class="flex items-center gap-2 text-xs uppercase tracking-wider">
            <span>{{ [resumeData.basics.location.city, resumeData.basics.location.region, resumeData.basics.location.countryCode].filter(Boolean).join(', ') }}</span>
          </div>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-12 gap-0 min-h-[900px]">
      <!-- Sidebar -->
      <aside class="col-span-12 md:col-span-4 bg-gray-50 p-8 border-r border-gray-200">
        <!-- Contact Detailed -->
        <section v-if="resumeData.basics?.url || resumeData.basics?.profiles?.length" class="mb-8">
          <h2 class="text-xs uppercase tracking-widest font-bold text-gray-500 mb-4 border-b pb-2">Connect</h2>
          <div class="space-y-3 text-sm">
            <div v-if="resumeData.basics?.url">
              <p class="font-semibold text-gray-900">Website</p>
              <a :href="resumeData.basics.url" class="text-blue-600 truncate block" target="_blank">{{ resumeData.basics.url.replace(/^https?:\/\//, '') }}</a>
            </div>
            <div v-for="(profile, index) in resumeData.basics?.profiles" :key="index">
              <p class="font-semibold text-gray-900">{{ profile.network }}</p>
              <a :href="profile.url" class="text-blue-600 truncate block" target="_blank">@{{ profile.username }}</a>
            </div>
          </div>
        </section>

        <!-- Skills -->
        <section v-if="resumeData.skills?.length" class="mb-8">
          <h2 class="text-xs uppercase tracking-widest font-bold text-gray-500 mb-4 border-b pb-2">Skills</h2>
          <div class="space-y-4">
            <div v-for="(skill, index) in resumeData.skills" :key="index">
              <p class="font-semibold text-gray-900 text-sm mb-1">{{ skill.name }}</p>
              <div class="flex flex-wrap gap-1">
                <span v-for="(keyword, kIndex) in skill.keywords" :key="kIndex" 
                  class="text-[10px] px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full font-medium">
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section v-if="resumeData.languages?.length" class="mb-8">
          <h2 class="text-xs uppercase tracking-widest font-bold text-gray-500 mb-4 border-b pb-2">Languages</h2>
          <div class="space-y-2">
            <div v-for="(lang, index) in resumeData.languages" :key="index" class="flex justify-between items-center text-sm">
              <span class="font-semibold text-gray-900">{{ lang.language }}</span>
              <span class="text-gray-600 text-xs italic">{{ lang.fluency }}</span>
            </div>
          </div>
        </section>

        <!-- Interests -->
        <section v-if="resumeData.interests?.length" class="mb-8 text-sm">
          <h2 class="text-xs uppercase tracking-widest font-bold text-gray-500 mb-4 border-b pb-2">Interests</h2>
          <div class="flex flex-wrap gap-x-4 gap-y-1">
            <span v-for="(interest, index) in resumeData.interests" :key="index" class="text-gray-700">
              {{ interest.name }}
            </span>
          </div>
        </section>
      </aside>

      <!-- Main Content -->
      <div class="col-span-12 md:col-span-8 p-8">
        <!-- Summary -->
        <section v-if="resumeData.basics?.summary" class="mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-3 font-outfit border-h-section">Professional Summary</h2>
          <p class="text-gray-700 leading-relaxed text-sm">
            {{ resumeData.basics.summary }}
          </p>
        </section>

        <!-- Experience -->
        <section v-if="resumeData.work?.length" class="mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-6 font-outfit border-h-section">Work Experience</h2>
          <div class="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
            <div v-for="(work, index) in resumeData.work" :key="index" class="relative pl-8">
              <!-- Timeline Dot -->
              <div class="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow-sm"></div>
              
              <div class="flex flex-col sm:flex-row justify-between items-start mb-1 gap-1">
                <h3 class="text-base font-bold text-gray-900">{{ work.position }}</h3>
                <span class="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {{ formatDate(work.startDate) }} — {{ formatDate(work.endDate) || 'Present' }}
                </span>
              </div>
              <h4 class="text-sm font-medium text-blue-600 mb-2">{{ work.name }}</h4>
              <p v-if="work.summary" class="text-gray-600 text-xs mb-2 italic">{{ work.summary }}</p>
              <ul v-if="work.highlights" class="resume-list space-y-1.5">
                <li v-for="(highlight, hIndex) in work.highlights" :key="hIndex" class="text-sm text-gray-700 pr-4">
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Projects -->
        <section v-if="resumeData.projects?.length" class="mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-4 font-outfit border-h-section">Projects</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="(project, index) in resumeData.projects" :key="index" class="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 class="font-bold text-gray-900 text-sm mb-1">{{ project.name }}</h3>
              <p class="text-xs text-gray-600 mb-2">{{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}</p>
              <p class="text-xs text-gray-700 line-clamp-3 mb-2">{{ project.description }}</p>
              <a v-if="project.url" :href="project.url" class="text-[10px] text-blue-600 hover:underline" target="_blank">{{ project.url.replace(/^https?:\/\//, '') }}</a>
            </div>
          </div>
        </section>

        <!-- Education -->
        <section v-if="resumeData.education?.length" class="mb-0">
          <h2 class="text-lg font-bold text-gray-900 mb-4 font-outfit border-h-section">Education</h2>
          <div class="space-y-4">
            <div v-for="(edu, index) in resumeData.education" :key="index">
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-bold text-gray-900 text-sm">{{ edu.studyType }} in {{ edu.area }}</h3>
                <span class="text-[10px] font-bold text-gray-500">{{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}</span>
              </div>
              <p class="text-sm text-gray-700">{{ edu.institution }}</p>
              <p v-if="edu.score" class="text-xs text-gray-600 mt-1">GPA: {{ edu.score }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Resume } from '../types/resume';
import { formatDate } from '../utils/date';
import { useResumePreview } from '../composables/useResumePreview';

interface Props {
  resumeData: Resume;
}

const props = defineProps<Props>();

const previewContainer = ref<HTMLElement | null>(null);
const { calculateContentHeight } = useResumePreview(previewContainer);

watch(() => props.resumeData, () => {
  calculateContentHeight();
}, { deep: true });
</script>

<style scoped>
#resume-preview {
  page-break-inside: avoid;
}

.border-h-section {
  @apply relative pb-2 mb-4;
}

.border-h-section::after {
  content: '';
  @apply absolute bottom-0 left-0 w-12 h-1 bg-blue-500 rounded-full;
}

/* Fix bullet point alignment for PDF generation */
.resume-list {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}

.resume-list li {
  position: relative;
  padding-left: 1.25rem;
  margin-left: 0;
  line-height: 1.5;
}

.resume-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #3b82f6; /* blue-500 */
  font-weight: bold;
  font-size: 0.8em;
  line-height: 1.8;
}

/* Ensure font is applied to headers */
.font-outfit {
  font-family: 'Outfit', sans-serif;
}

@media print {
  #resume-preview {
    width: 210mm;
    min-height: 297mm;
  }
}
</style>
