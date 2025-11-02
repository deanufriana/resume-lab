<template>
  <div ref="previewContainer" id="resume-preview" class="relative"
    style="font-family: 'Times New Roman', Times, serif;">
    <!-- Header -->
    <div class="border-b-2 border-gray-800 pb-4 mb-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        {{ resumeData.basics?.name }} | {{ resumeData.basics?.label }}
      </h1>
      <div class="flex flex-wrap gap-2 text-sm text-gray-700">
        <div v-if="resumeData.basics?.email">
          <strong>Email:</strong> {{ resumeData.basics.email }}
        </div>
        <div v-if="resumeData.basics?.phone">
          <strong>Phone:</strong> {{ resumeData.basics.phone }}
        </div>
        <div v-if="resumeData.basics?.url">
          <strong>Website:</strong> {{ resumeData.basics.url }}
        </div>
        <div v-if="resumeData.basics?.location">
          <strong>Location:</strong>
          {{ [
            resumeData.basics.location.address,
            resumeData.basics.location.city,
            resumeData.basics.location.region,
            resumeData.basics.location.postalCode,
            resumeData.basics.location.countryCode
          ].filter(Boolean).join(', ') }}
        </div>
      </div>
      <div v-if="resumeData.basics?.profiles?.length" class="mt-2 flex flex-wrap gap-3 text-sm">
        <a v-for="(profile, index) in resumeData.basics.profiles" :key="index" :href="profile.url"
          class="text-blue-600 hover:underline" target="_blank">
          {{ profile.network }}: {{ profile.username }}
        </a>
      </div>
    </div>

    <!-- Summary -->
    <div v-if="resumeData.basics?.summary" class="mb-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        Summary
      </h2>
      <p class="text-gray-700 leading-relaxed">{{ resumeData.basics.summary }}</p>
    </div>

    <!-- Work Experience -->
    <div v-if="resumeData.work && resumeData.work.length > 0" class="mb-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        Work Experience
      </h2>
      <div v-for="(work, index) in resumeData.work" :key="index" class="mb-4">
        <div class="flex justify-between items-start mb-1">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ work.position }}
            </h3>
            <h4 class="text-base font-medium text-gray-700">
              {{ work.name }}
              <span v-if="work.url" class="text-sm text-gray-600">
                - {{ work.url }}
              </span>
            </h4>
          </div>
          <div class="text-sm text-gray-600 whitespace-nowrap ml-4">
            {{ formatDate(work.startDate) }} - {{ formatDate(work.endDate) || 'Present' }}
          </div>
        </div>
        <p v-if="work.summary" class="text-gray-700 mb-2 italic">{{ work.summary }}</p>
        <ul v-if="work.highlights" class="resume-list text-gray-700 space-y-1">
          <li v-for="(highlight, hIndex) in work.highlights" :key="hIndex">
            {{ highlight }}
          </li>
        </ul>
        <div v-if="work.skills && work.skills.length > 0" class="mt-2">
          <span class="text-sm font-semibold text-gray-700">Skills: </span>
          <span class="text-sm text-gray-600">{{ work.skills.join(', ') }}</span>
        </div>
      </div>
    </div>

    <!-- Volunteer Experience -->
    <div v-if="resumeData.volunteer && resumeData.volunteer.length > 0" class="mb-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        Volunteer Experience
      </h2>
      <div v-for="(vol, index) in resumeData.volunteer" :key="index" class="mb-4">
        <div class="flex justify-between items-start mb-1">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ vol.position }}
            </h3>
            <h4 class="text-base font-medium text-gray-700">
              {{ vol.organization }}
              <span v-if="vol.url" class="text-sm text-gray-600">
                - {{ vol.url }}
              </span>
            </h4>
          </div>
          <div class="text-sm text-gray-600 whitespace-nowrap ml-4">
            {{ formatDate(vol.startDate) }} - {{ formatDate(vol.endDate) || 'Present' }}
          </div>
        </div>
        <p v-if="vol.summary" class="text-gray-700 mb-2 italic">{{ vol.summary }}</p>
        <ul v-if="vol.highlights" class="resume-list text-gray-700 space-y-1">
          <li v-for="(highlight, hIndex) in vol.highlights" :key="hIndex">
            {{ highlight }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Education -->
    <div v-if="resumeData.education && resumeData.education.length > 0" class="mb-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        Education
      </h2>
      <div v-for="(edu, index) in resumeData.education" :key="index" class="mb-4">
        <div class="flex justify-between items-start mb-1">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ edu.studyType }} - {{ edu.area }}
            </h3>
            <h4 class="text-base font-medium text-gray-700">
              {{ edu.institution }}
              <span v-if="edu.url" class="text-sm text-blue-600">
                - {{ edu.url }}
              </span>
              <span v-if="edu.score" class="text-sm text-gray-600">
                - GPA: {{ edu.score }}
              </span>
            </h4>
          </div>
          <div class="text-sm text-gray-600 whitespace-nowrap ml-4">
            {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}
          </div>
        </div>
        <div v-if="edu.courses && edu.courses.length > 0" class="mt-2">
          <span class="text-sm font-semibold text-gray-700">Courses: </span>
          <span class="text-sm text-gray-600">{{ edu.courses.join(', ') }}</span>
        </div>
      </div>
    </div>

    <!-- Skills -->
    <div v-if="resumeData.skills && resumeData.skills.length > 0" class="mb-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        Skills
      </h2>
      <div v-for="(skill, index) in resumeData.skills" :key="index" class="mb-3">
        <div class="font-semibold text-gray-900">{{ skill.name }}</div>
        <div v-if="skill.level" class="text-sm text-gray-600 mb-1">
          Level: {{ skill.level }}
        </div>
        <div v-if="skill.keywords && skill.keywords.length > 0" class="text-gray-700">
          {{ skill.keywords.join(', ') }}
        </div>
      </div>
    </div>

    <!-- Certificates -->
    <div v-if="resumeData.certificates && resumeData.certificates.length > 0" class="mb-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        Certificates
      </h2>
      <div v-for="(cert, index) in resumeData.certificates" :key="index" class="mb-2">
        <div class="font-semibold text-gray-900">{{ cert.name }}</div>
        <div class="text-sm text-gray-600">
          {{ cert.issuer }} - {{ formatDate(cert.date) }}
        </div>
      </div>
    </div>

    <!-- Projects -->
    <div v-if="resumeData.projects && resumeData.projects.length > 0" class="mb-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        Projects
      </h2>
      <div v-for="(project, index) in resumeData.projects" :key="index" class="mb-4">
        <div class="flex justify-between items-start mb-1">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ project.name }}</h3>
            <a v-if="project.url" :href="project.url" class="text-sm text-blue-600 hover:underline" target="_blank">
              {{ project.url }}
            </a>
          </div>
          <div class="text-sm text-gray-600 whitespace-nowrap ml-4">
            {{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}
          </div>
        </div>
        <p v-if="project.description" class="text-gray-700 mb-2">
          {{ project.description }}
        </p>
        <ul v-if="project.highlights" class="resume-list text-gray-700 space-y-1">
          <li v-for="(highlight, hIndex) in project.highlights" :key="hIndex">
            {{ highlight }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Awards -->
    <div v-if="resumeData.awards && resumeData.awards.length > 0" class="mb-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        Awards
      </h2>
      <div v-for="(award, index) in resumeData.awards" :key="index" class="mb-3">
        <div class="font-semibold text-gray-900">{{ award.title }}</div>
        <div class="text-sm text-gray-600">
          {{ award.awarder }} - {{ formatDate(award.date) }}
        </div>
        <p v-if="award.summary" class="text-gray-700 mt-1">{{ award.summary }}</p>
      </div>
    </div>

    <!-- Publications -->
    <div v-if="resumeData.publications && resumeData.publications.length > 0" class="mb-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        Publications
      </h2>
      <div v-for="(pub, index) in resumeData.publications" :key="index" class="mb-4">
        <div class="flex justify-between items-start mb-1">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ pub.name }}</h3>
            <div class="text-base font-medium text-gray-700">{{ pub.publisher }}</div>
            <a v-if="pub.url" :href="pub.url" class="text-sm text-blue-600 hover:underline" target="_blank">
              {{ pub.url }}
            </a>
          </div>
          <div class="text-sm text-gray-600 whitespace-nowrap ml-4">
            {{ formatDate(pub.releaseDate) }}
          </div>
        </div>
        <p v-if="pub.summary" class="text-gray-700 mt-2">{{ pub.summary }}</p>
      </div>
    </div>

    <!-- Languages -->
    <div v-if="resumeData.languages && resumeData.languages.length > 0" class="mb-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        Languages
      </h2>
      <div class="flex flex-wrap gap-4">
        <div v-for="(lang, index) in resumeData.languages" :key="index" class="text-gray-700">
          <strong>{{ lang.language }}:</strong> {{ lang.fluency }}
        </div>
      </div>
    </div>

    <!-- Interests -->
    <div v-if="resumeData.interests && resumeData.interests.length > 0" class="mb-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        Interests
      </h2>
      <div v-for="(interest, index) in resumeData.interests" :key="index" class="mb-3">
        <div class="font-semibold text-gray-900">{{ interest.name }}</div>
        <div v-if="interest.keywords && interest.keywords.length > 0" class="text-gray-700">
          {{ interest.keywords.join(', ') }}
        </div>
      </div>
    </div>

    <!-- References -->
    <div v-if="resumeData.references && resumeData.references.length > 0" class="mb-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        References
      </h2>
      <div v-for="(ref, index) in resumeData.references" :key="index" class="mb-3">
        <div class="font-semibold text-gray-900">{{ ref.name }}</div>
        <p v-if="ref.reference" class="text-gray-700 mt-1">{{ ref.reference }}</p>
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

/* Fix bullet point alignment for PDF generation */
.resume-list {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}

.resume-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-left: 0;
  line-height: 1.6;
}

.resume-list li::before {
  content: '•';
  position: absolute;
  left: 0.5rem;
  color: #374151;
  font-weight: bold;
  font-size: 1em;
  line-height: 1.6;
  vertical-align: middle;
}

/* Fix image and SVG centering for PDF generation */
img {
  display: block !important;
  margin-left: auto !important;
  margin-right: auto !important;
  max-width: 100%;
  height: auto;
}

svg {
  display: inline-block !important;
  vertical-align: middle !important;
}

/* Ensure flex containers properly center content in PDF */
.flex.items-center {
  display: flex !important;
  align-items: center !important;
}

.flex.items-center svg {
  display: inline-block !important;
  vertical-align: middle !important;
  flex-shrink: 0 !important;
}

/* Force alignment for all flex containers */
[class*="flex"][class*="items-center"] {
  display: flex !important;
  align-items: center !important;
}

[class*="flex"][class*="items-center"] svg {
  display: inline-block !important;
  vertical-align: middle !important;
  flex-shrink: 0 !important;
}
</style>
