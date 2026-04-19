<template>
  <div
    ref="previewContainer"
    id="resume-preview"
    class="relative bg-white text-gray-900 font-sans"
  >
    <!-- Professional Header -->
    <header class="border-b-4 border-gray-900 pb-8 mb-8">
      <div class="flex flex-col items-center text-center">
        <h1
          class="text-4xl font-extrabold tracking-widest font-outfit uppercase mb-2"
        >
          {{ resumeData.basics?.name }}
        </h1>
        <p
          class="text-lg font-bold text-gray-600 uppercase tracking-widest font-outfit mb-4"
        >
          {{ resumeData.basics?.label }}
        </p>

        <div
          class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium"
        >
          <div v-if="resumeData.basics?.email" class="flex items-center gap-1">
            <span class="text-gray-400 font-bold">E:</span>
            {{ resumeData.basics.email }}
          </div>
          <div v-if="resumeData.basics?.phone" class="flex items-center gap-1">
            <span class="text-gray-400 font-bold">P:</span>
            {{ resumeData.basics.phone }}
          </div>
          <div
            v-if="resumeData.basics?.location"
            class="flex items-center gap-1"
          >
            <span class="text-gray-400 font-bold">L:</span>
            {{
              [
                resumeData.basics.location.city,
                resumeData.basics.location.region,
              ]
                .filter(Boolean)
                .join(", ")
            }}
          </div>
          <div v-if="resumeData.basics?.url" class="flex items-center gap-1">
            <span class="text-gray-400 font-bold">W:</span>
            <a
              :href="resumeData.basics.url"
              class="hover:text-blue-600 transition-colors"
              target="_blank"
              >{{ resumeData.basics.url.replace(/^https?:\/\//, "") }}</a
            >
          </div>
        </div>
      </div>
    </header>

    <!-- Summary -->
    <section v-if="resumeData.basics?.summary" class="mb-10">
      <h2 class="section-title">Professional Profile</h2>
      <p class="text-gray-700 leading-relaxed font-medium">
        {{ resumeData.basics.summary }}
      </p>
    </section>

    <!-- Experience -->
    <section v-if="resumeData.work?.length" class="mb-10">
      <h2 class="section-title">Core Experience</h2>
      <div class="space-y-8">
        <div v-for="(work, index) in resumeData.work" :key="index">
          <div class="flex justify-between items-baseline mb-2">
            <div>
              <h3 class="text-lg font-extrabold uppercase tracking-tight">
                {{ work.position }}
              </h3>
              <h4 class="text-base font-bold text-gray-600">{{ work.name }}</h4>
            </div>
            <div
              class="text-sm font-black text-gray-500 uppercase tracking-tighter"
            >
              {{ formatDate(work.startDate) }} —
              {{ formatDate(work.endDate) || "Present" }}
            </div>
          </div>
          <p v-if="work.summary" class="text-gray-700 font-medium mb-3">
            {{ work.summary }}
          </p>
          <ul v-if="work.highlights" class="resume-list grid grid-cols-1 gap-2">
            <li
              v-for="(highlight, hIndex) in work.highlights"
              :key="hIndex"
              class="text-sm text-gray-800 leading-snug"
            >
              {{ highlight }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Two-Column Section for Skills & Education -->
    <div class="grid grid-cols-2 gap-10">
      <!-- Left: Skills -->
      <section v-if="resumeData.skills?.length">
        <h2 class="section-title">Expertise</h2>
        <div class="space-y-4">
          <div v-for="(skill, index) in resumeData.skills" :key="index">
            <h3
              class="text-xs font-black uppercase tracking-widest text-gray-500 mb-2"
            >
              {{ skill.name }}
            </h3>
            <div
              class="flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold text-gray-800"
            >
              <span v-for="(keyword, kIndex) in skill.keywords" :key="kIndex">
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Right: Education -->
      <section v-if="resumeData.education?.length">
        <h2 class="section-title">Education</h2>
        <div class="space-y-6">
          <div v-for="(edu, index) in resumeData.education" :key="index">
            <div class="flex justify-between items-start gap-2">
              <h3 class="font-extrabold text-sm uppercase leading-tight">
                {{ edu.studyType }} <br />
                {{ edu.area }}
              </h3>
              <span
                class="text-[10px] font-black text-gray-500 whitespace-nowrap"
                >{{ formatDate(edu.startDate) }} -
                {{ formatDate(edu.endDate) }}</span
              >
            </div>
            <p class="text-sm font-bold text-gray-600">{{ edu.institution }}</p>
            <p
              v-if="edu.score"
              class="text-xs font-medium text-gray-500 mt-1 italic"
            >
              Honors / GPA: {{ edu.score }}
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- Final Section (Awards/Certs) -->
    <div
      v-if="resumeData.awards?.length || resumeData.certificates?.length"
      class="mt-10 pt-8 border-t-2 border-gray-100 grid grid-cols-2 gap-10"
    >
      <section v-if="resumeData.awards?.length">
        <h2 class="section-title !mb-4">Awards</h2>
        <ul class="space-y-2">
          <li
            v-for="(award, index) in resumeData.awards"
            :key="index"
            class="text-sm"
          >
            <span class="font-black">{{ award.title }}</span> —
            <span class="text-gray-600 font-bold"
              >{{ award.awarder }}, {{ formatDate(award.date) }}</span
            >
          </li>
        </ul>
      </section>

      <section v-if="resumeData.certificates?.length">
        <h2 class="section-title !mb-4">Certifications</h2>
        <ul class="space-y-2 text-sm">
          <li v-for="(cert, index) in resumeData.certificates" :key="index">
            <span class="font-black">{{ cert.name }}</span> —
            <span class="text-gray-600 font-bold">{{ cert.issuer }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Resume } from "../types/resume";
import { formatDate } from "../utils/date";
import { useResumePreview } from "../composables/useResumePreview";

interface Props {
  resumeData: Resume;
}

const props = defineProps<Props>();

const previewContainer = ref<HTMLElement | null>(null);
const { calculateContentHeight } = useResumePreview(previewContainer);

watch(
  () => props.resumeData,
  () => {
    calculateContentHeight();
  },
  { deep: true },
);
</script>

<style scoped>
#resume-preview {
  page-break-inside: avoid;
}

.section-title {
  @apply text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-4;
}

.section-title::after {
  content: "";
  @apply flex-1 h-[2px] bg-gray-100;
}

/* Custom List Styles */
.resume-list {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}

.resume-list li {
  position: relative;
  padding-left: 1rem;
  margin-left: 0;
}

.resume-list li::before {
  content: "■";
  position: absolute;
  left: 0;
  color: #111827; /* gray-900 */
  font-size: 0.6em;
  line-height: 2.2;
}

/* Ensure font is applied to headers */
.font-outfit {
  font-family: "Outfit", sans-serif;
}

@media print {
  #resume-preview {
    width: 210mm;
    min-height: 297mm;
  }
}
</style>
