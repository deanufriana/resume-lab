<template>
  <div
    class="resume-content relative"
    :class="densityClass"
    :style="{ fontFamily: resolvedFontFamily, '--resume-accent': accentColor }"
  >
    <!-- Header -->
    <header class="border-b-2 pb-3 mb-5" :style="{ borderColor: accentColor }">
      <h1 class="text-2xl font-bold text-gray-900 mb-2 leading-tight">
        {{ resumeData.basics?.name || "Your Name" }}
        <span v-if="resumeData.basics?.label" class="font-normal text-gray-600">
          | {{ resumeData.basics.label }}
        </span>
      </h1>
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
        <div v-if="resumeData.basics?.email">
          <strong class="mr-1">Email:</strong>
          <a :href="`mailto:${resumeData.basics.email}`" class="hover:underline" target="_blank">
            {{ resumeData.basics.email }}
          </a>
        </div>
        <div v-if="resumeData.basics?.phone">
          <strong class="mr-1">Phone:</strong>
          <a :href="`tel:${resumeData.basics.phone}`" class="hover:underline" target="_blank">
            {{ resumeData.basics.phone }}
          </a>
        </div>
        <div v-if="resumeData.basics?.url">
          <strong class="mr-1">Website:</strong>
          <a
            :href="sanitizeUrl(resumeData.basics.url)"
            class="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ resumeData.basics.url }}
          </a>
        </div>
        <div v-if="formattedLocation">
          <strong>Location:</strong>
          {{ formattedLocation }}
        </div>
      </div>
      <div
        v-if="resumeData.basics?.profiles?.length"
        class="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm"
      >
        <a
          v-for="(profile, index) in resumeData.basics.profiles"
          :key="index"
          :href="sanitizeUrl(profile.url)"
          class="hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ profile.network }}: {{ profile.username }}
        </a>
      </div>
    </header>

    <!-- Summary -->
    <section v-if="resumeData.basics?.summary" class="section-block">
      <h2 class="section-heading">Summary</h2>
      <p class="text-gray-700 leading-relaxed">{{ resumeData.basics.summary }}</p>
    </section>

    <!-- Work Experience -->
    <section v-if="resumeData.work?.length" class="section-block">
      <h2 class="section-heading">Work Experience</h2>
      <div class="space-y-3.5">
        <div v-for="(work, index) in resumeData.work" :key="index" class="break-inside-avoid">
          <div class="flex justify-between items-baseline mb-1 gap-4">
            <div>
              <h3 class="text-base font-bold text-gray-900 leading-snug">
                {{ work.position }}
              </h3>
              <div class="text-sm font-medium text-gray-700">
                {{ work.name }}
                <span v-if="work.url" class="text-gray-600">
                  —
                  <a
                    :href="sanitizeUrl(work.url)"
                    class="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ work.url }}
                  </a>
                </span>
              </div>
            </div>
            <div class="text-xs text-gray-600 whitespace-nowrap">
              {{ formatDate(work.startDate) }} - {{ formatDate(work.endDate) || "Present" }}
            </div>
          </div>
          <p v-if="work.summary" class="text-gray-700 mb-1.5 italic leading-snug">
            {{ work.summary }}
          </p>
          <ul v-if="work.highlights?.length" class="resume-list text-gray-700 space-y-1">
            <li v-for="(highlight, hIndex) in work.highlights" :key="hIndex">
              {{ highlight }}
            </li>
          </ul>
          <div v-if="work.skills?.length" class="mt-1.5 text-xs text-gray-600">
            <span class="font-semibold text-gray-700">Skills:</span>
            {{ work.skills.join(", ") }}
          </div>
        </div>
      </div>
    </section>

    <!-- Volunteer Experience -->
    <section v-if="resumeData.volunteer?.length" class="section-block">
      <h2 class="section-heading">Volunteer Experience</h2>
      <div class="space-y-3">
        <div v-for="(vol, index) in resumeData.volunteer" :key="index" class="break-inside-avoid">
          <div class="flex justify-between items-baseline mb-1 gap-4">
            <div>
              <h3 class="text-base font-bold text-gray-900">{{ vol.position }}</h3>
              <div class="text-sm font-medium text-gray-700">
                {{ vol.organization }}
                <span v-if="vol.url" class="text-gray-600">
                  —
                  <a
                    :href="sanitizeUrl(vol.url)"
                    class="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ vol.url }}
                  </a>
                </span>
              </div>
            </div>
            <div class="text-xs text-gray-600 whitespace-nowrap">
              {{ formatDate(vol.startDate) }} - {{ formatDate(vol.endDate) || "Present" }}
            </div>
          </div>
          <p v-if="vol.summary" class="text-gray-700 mb-1.5 italic leading-snug">
            {{ vol.summary }}
          </p>
          <ul v-if="vol.highlights?.length" class="resume-list text-gray-700 space-y-1">
            <li v-for="(highlight, hIndex) in vol.highlights" :key="hIndex">
              {{ highlight }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section v-if="resumeData.education?.length" class="section-block">
      <h2 class="section-heading">Education</h2>
      <div class="space-y-3">
        <div v-for="(edu, index) in resumeData.education" :key="index" class="break-inside-avoid">
          <div class="flex justify-between items-baseline mb-0.5 gap-4">
            <div>
              <h3 class="text-base font-bold text-gray-900">
                {{ [edu.studyType, edu.area].filter(Boolean).join(" — ") }}
              </h3>
              <div class="text-sm font-medium text-gray-700">
                {{ edu.institution }}
                <span v-if="edu.url" class="text-gray-600">
                  —
                  <a
                    :href="sanitizeUrl(edu.url)"
                    class="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ edu.url }}
                  </a>
                </span>
                <span v-if="edu.score" class="text-gray-600"> · GPA: {{ edu.score }}</span>
              </div>
            </div>
            <div class="text-xs text-gray-600 whitespace-nowrap">
              {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) || "Present" }}
            </div>
          </div>
          <div v-if="edu.courses?.length" class="mt-1 text-xs text-gray-600">
            <span class="font-semibold text-gray-700">Courses:</span>
            {{ edu.courses.join(", ") }}
          </div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section v-if="resumeData.skills?.length" class="section-block">
      <h2 class="section-heading">Skills</h2>
      <div class="space-y-2">
        <div v-for="(skill, index) in resumeData.skills" :key="index">
          <span class="font-bold text-gray-900">{{ skill.name }}</span>
          <span v-if="skill.level" class="text-xs text-gray-600"> ({{ skill.level }})</span>
          <span v-if="skill.keywords?.length" class="text-gray-700">
            : {{ skill.keywords.join(", ") }}
          </span>
        </div>
      </div>
    </section>

    <!-- Certificates -->
    <section v-if="resumeData.certificates?.length" class="section-block">
      <h2 class="section-heading">Certificates</h2>
      <div class="space-y-1.5">
        <div v-for="(cert, index) in resumeData.certificates" :key="index">
          <span class="font-bold text-gray-900">{{ cert.name }}</span>
          <span class="text-sm text-gray-600">
            — {{ cert.issuer }}<span v-if="cert.date"> · {{ formatDate(cert.date) }}</span>
          </span>
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section v-if="resumeData.projects?.length" class="section-block">
      <h2 class="section-heading">Projects</h2>
      <div class="space-y-3">
        <div
          v-for="(project, index) in resumeData.projects"
          :key="index"
          class="break-inside-avoid"
        >
          <div class="flex justify-between items-baseline mb-1 gap-4">
            <div>
              <h3 class="text-base font-bold text-gray-900">
                {{ project.name }}
                <a
                  v-if="project.url"
                  :href="sanitizeUrl(project.url)"
                  class="text-xs font-normal hover:underline ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ project.url }}
                </a>
              </h3>
            </div>
            <div
              v-if="project.startDate || project.endDate"
              class="text-xs text-gray-600 whitespace-nowrap"
            >
              {{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) || "Present" }}
            </div>
          </div>
          <p v-if="project.description" class="text-gray-700 mb-1.5 leading-snug">
            {{ project.description }}
          </p>
          <ul v-if="project.highlights?.length" class="resume-list text-gray-700 space-y-1">
            <li v-for="(highlight, hIndex) in project.highlights" :key="hIndex">
              {{ highlight }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Awards -->
    <section v-if="resumeData.awards?.length" class="section-block">
      <h2 class="section-heading">Awards</h2>
      <div class="space-y-2">
        <div v-for="(award, index) in resumeData.awards" :key="index">
          <div class="font-bold text-gray-900">
            {{ award.title }}
            <span class="text-sm font-normal text-gray-600">
              — {{ award.awarder }}<span v-if="award.date"> · {{ formatDate(award.date) }}</span>
            </span>
          </div>
          <p v-if="award.summary" class="text-gray-700 mt-0.5 leading-snug">{{ award.summary }}</p>
        </div>
      </div>
    </section>

    <!-- Publications -->
    <section v-if="resumeData.publications?.length" class="section-block">
      <h2 class="section-heading">Publications</h2>
      <div class="space-y-2.5">
        <div v-for="(pub, index) in resumeData.publications" :key="index">
          <div class="flex justify-between items-baseline gap-4">
            <div>
              <h3 class="text-base font-bold text-gray-900">{{ pub.name }}</h3>
              <div class="text-sm font-medium text-gray-700">
                {{ pub.publisher }}
                <a
                  v-if="pub.url"
                  :href="sanitizeUrl(pub.url)"
                  class="text-xs font-normal hover:underline ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ pub.url }}
                </a>
              </div>
            </div>
            <div v-if="pub.releaseDate" class="text-xs text-gray-600 whitespace-nowrap">
              {{ formatDate(pub.releaseDate) }}
            </div>
          </div>
          <p v-if="pub.summary" class="text-gray-700 mt-1 leading-snug">{{ pub.summary }}</p>
        </div>
      </div>
    </section>

    <!-- Languages -->
    <section v-if="resumeData.languages?.length" class="section-block">
      <h2 class="section-heading">Languages</h2>
      <div class="flex flex-wrap gap-x-6 gap-y-1">
        <div v-for="(lang, index) in resumeData.languages" :key="index" class="text-gray-700">
          <strong>{{ lang.language }}:</strong> {{ lang.fluency }}
        </div>
      </div>
    </section>

    <!-- Interests -->
    <section v-if="resumeData.interests?.length" class="section-block">
      <h2 class="section-heading">Interests</h2>
      <div class="space-y-1.5">
        <div v-for="(interest, index) in resumeData.interests" :key="index">
          <span class="font-bold text-gray-900">{{ interest.name }}</span>
          <span v-if="interest.keywords?.length" class="text-gray-700">
            : {{ interest.keywords.join(", ") }}
          </span>
        </div>
      </div>
    </section>

    <!-- References -->
    <section v-if="resumeData.references?.length" class="section-block">
      <h2 class="section-heading">References</h2>
      <div class="space-y-2">
        <div v-for="(ref, index) in resumeData.references" :key="index">
          <div class="font-bold text-gray-900">{{ ref.name }}</div>
          <p v-if="ref.reference" class="text-gray-700 mt-0.5 leading-snug">{{ ref.reference }}</p>
        </div>
      </div>
    </section>

    <!-- Optional Signature Footer -->
    <footer
      v-if="resumeData.meta?.showSignature && resumeData.meta?.signatureDataUrl"
      class="mt-8 pt-4 border-t border-gray-300 flex justify-end"
    >
      <div class="text-center">
        <img
          :src="resumeData.meta.signatureDataUrl"
          alt="Signature"
          class="h-12 object-contain mx-auto"
        />
        <div class="text-xs text-gray-700 mt-1 border-t border-gray-400 pt-1 px-4">
          {{ resumeData.basics?.name }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Resume } from "../types/resume";
import { formatDate } from "../utils/date";
import { sanitizeUrl } from "../utils/url";

interface Props {
  resumeData: Resume;
}

const props = defineProps<Props>();

const accentColor = computed(() => props.resumeData.meta?.accentColor || "#1f2937");

const resolvedFontFamily = computed(() => {
  const f = props.resumeData.meta?.fontFamily;
  if (f === "sans") return '"Inter", system-ui, sans-serif';
  if (f === "mono") return '"JetBrains Mono", monospace';
  return '"Times New Roman", Times, serif';
});

const densityClass = computed(() => {
  const d = props.resumeData.meta?.density || "standard";
  if (d === "compact") return "density-compact text-[13px]";
  if (d === "spacious") return "density-spacious text-[15px]";
  return "density-standard text-[14px]";
});

const formattedLocation = computed(() => {
  const loc = props.resumeData.basics?.location;
  if (!loc) return "";
  return [loc.address, loc.city, loc.region, loc.postalCode, loc.countryCode]
    .filter(Boolean)
    .join(", ");
});
</script>

<style scoped>
.density-compact {
  line-height: 1.35;
}
.density-compact .section-block {
  margin-bottom: 0.9rem;
}

.density-standard {
  line-height: 1.5;
}
.density-standard .section-block {
  margin-bottom: 1.25rem;
}

.density-spacious {
  line-height: 1.65;
}
.density-spacious .section-block {
  margin-bottom: 1.6rem;
}

.section-heading {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--resume-accent, #111827);
  border-bottom: 1.5px solid var(--resume-accent, #1f2937);
  padding-bottom: 0.25rem;
  margin-bottom: 0.65rem;
}

.resume-content :deep(a),
.resume-content a {
  color: var(--resume-accent, #1f2937) !important;
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
  line-height: 1.45;
}

.resume-list li::before {
  content: "•";
  position: absolute;
  left: 0.35rem;
  color: var(--resume-accent, #374151);
  font-weight: bold;
}

img {
  display: block !important;
  margin-left: auto !important;
  margin-right: auto !important;
  max-width: 100%;
  height: auto;
}
</style>
