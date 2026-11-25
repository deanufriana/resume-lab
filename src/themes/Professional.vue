<template>
  <div
    class="resume-content relative bg-white text-gray-900"
    :class="densityClass"
    :style="{ fontFamily: resolvedFontFamily, '--resume-accent': accentColor }"
  >
    <!-- Professional Header -->
    <header class="border-b-2 pb-5 mb-6" :style="{ borderColor: accentColor }">
      <div class="flex flex-col items-center text-center">
        <h1 class="text-3xl font-extrabold tracking-widest uppercase mb-1.5">
          {{ resumeData.basics?.name || "Your Name" }}
        </h1>
        <p
          v-if="resumeData.basics?.label"
          class="text-base font-bold text-gray-600 uppercase tracking-widest mb-3"
        >
          {{ resumeData.basics.label }}
        </p>

        <div class="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs font-medium">
          <div v-if="resumeData.basics?.email" class="flex items-center gap-1">
            <span class="text-gray-400 font-bold">E:</span>
            <a :href="`mailto:${resumeData.basics.email}`" class="hover:underline" target="_blank">
              {{ resumeData.basics.email }}
            </a>
          </div>
          <div v-if="resumeData.basics?.phone" class="flex items-center gap-1">
            <span class="text-gray-400 font-bold">P:</span>
            <a :href="`tel:${resumeData.basics.phone}`" class="hover:underline">
              {{ resumeData.basics.phone }}
            </a>
          </div>
          <div v-if="formattedLocation" class="flex items-center gap-1">
            <span class="text-gray-400 font-bold">L:</span>
            {{ formattedLocation }}
          </div>
          <div v-if="resumeData.basics?.url" class="flex items-center gap-1">
            <span class="text-gray-400 font-bold">W:</span>
            <a
              :href="sanitizeUrl(resumeData.basics.url)"
              class="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ displayUrl(resumeData.basics.url) }}
            </a>
          </div>
        </div>

        <div
          v-if="resumeData.basics?.profiles?.length"
          class="mt-1.5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-medium"
        >
          <a
            v-for="(profile, index) in resumeData.basics.profiles"
            :key="index"
            :href="sanitizeUrl(profile.url)"
            class="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{
              [profile.network, profile.username || displayUrl(profile.url)]
                .filter(Boolean)
                .join(": ")
            }}
          </a>
        </div>
      </div>
    </header>

    <!-- Summary -->
    <section v-if="resumeData.basics?.summary" class="section-block">
      <h2 class="section-title">Professional Profile</h2>
      <p class="text-gray-700 leading-relaxed font-medium">
        {{ resumeData.basics.summary }}
      </p>
    </section>

    <!-- Experience -->
    <section v-if="resumeData.work?.length" class="section-block">
      <h2 class="section-title">Core Experience</h2>
      <div class="space-y-5">
        <div v-for="(work, index) in resumeData.work" :key="index" class="break-inside-avoid">
          <div class="flex justify-between items-baseline mb-1.5 gap-4">
            <div>
              <h3 class="text-base font-extrabold uppercase tracking-tight">
                {{ work.position }}
              </h3>
              <h4 class="text-sm font-bold text-gray-600">
                {{ work.name }}
                <span v-if="work.url" class="font-medium text-gray-500">
                  ·
                  <a
                    :href="sanitizeUrl(work.url)"
                    class="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ displayUrl(work.url) }}
                  </a>
                </span>
              </h4>
            </div>
            <div
              v-if="formatDateRange(work.startDate, work.endDate)"
              class="text-xs font-black text-gray-500 uppercase tracking-tight whitespace-nowrap tabular-nums"
            >
              {{ formatDateRange(work.startDate, work.endDate) }}
            </div>
          </div>
          <p v-if="work.summary" class="text-gray-700 font-medium mb-2 text-sm">
            {{ work.summary }}
          </p>
          <ul v-if="work.highlights?.length" class="resume-list grid grid-cols-1 gap-1.5">
            <li
              v-for="(highlight, hIndex) in work.highlights"
              :key="hIndex"
              class="text-sm text-gray-800 leading-snug"
            >
              {{ highlight }}
            </li>
          </ul>
          <div v-if="work.skills?.length" class="mt-2 text-xs text-gray-600">
            <span class="font-bold text-gray-700">Skills:</span> {{ work.skills.join(", ") }}
          </div>
        </div>
      </div>
    </section>

    <!-- Two-Column Section for Skills & Education -->
    <div
      v-if="resumeData.skills?.length || resumeData.education?.length"
      :class="[
        'grid gap-8 section-block',
        resumeData.skills?.length && resumeData.education?.length ? 'grid-cols-2' : 'grid-cols-1',
      ]"
    >
      <!-- Skills -->
      <section v-if="resumeData.skills?.length">
        <h2 class="section-title">Expertise</h2>
        <div class="space-y-3">
          <div v-for="(skill, index) in resumeData.skills" :key="index" class="break-inside-avoid">
            <h3 class="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">
              {{ skill.name }}
              <span v-if="skill.level" class="font-semibold normal-case tracking-normal">
                ({{ skill.level }})
              </span>
            </h3>
            <p
              v-if="skill.keywords?.length"
              class="text-sm font-semibold text-gray-800 leading-snug"
            >
              {{ skill.keywords.join(" · ") }}
            </p>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section v-if="resumeData.education?.length">
        <h2 class="section-title">Education</h2>
        <div class="space-y-4">
          <div v-for="(edu, index) in resumeData.education" :key="index" class="break-inside-avoid">
            <div class="flex justify-between items-start gap-2">
              <h3 class="font-extrabold text-sm uppercase leading-tight">
                {{ [edu.studyType, edu.area].filter(Boolean).join(" — ") }}
              </h3>
              <span
                v-if="formatDateRange(edu.startDate, edu.endDate)"
                class="text-[11px] font-black text-gray-500 whitespace-nowrap tabular-nums"
              >
                {{ formatDateRange(edu.startDate, edu.endDate) }}
              </span>
            </div>
            <p class="text-sm font-bold text-gray-600">
              <a
                v-if="edu.url"
                :href="sanitizeUrl(edu.url)"
                class="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ edu.institution }}
              </a>
              <span v-else>{{ edu.institution }}</span>
            </p>
            <p v-if="edu.score" class="text-xs font-medium text-gray-500 mt-0.5 italic">
              Honors / GPA: {{ edu.score }}
            </p>
            <p v-if="edu.courses?.length" class="text-xs text-gray-600 mt-1 leading-snug">
              <span class="font-bold text-gray-700">Courses:</span> {{ edu.courses.join(", ") }}
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- Projects -->
    <section v-if="resumeData.projects?.length" class="section-block">
      <h2 class="section-title">Projects</h2>
      <div class="space-y-4">
        <div
          v-for="(project, index) in resumeData.projects"
          :key="index"
          class="break-inside-avoid"
        >
          <div class="flex justify-between items-baseline gap-4">
            <h3 class="text-base font-extrabold uppercase tracking-tight">
              {{ project.name }}
              <a
                v-if="project.url"
                :href="sanitizeUrl(project.url)"
                class="text-xs font-semibold hover:underline ml-1 normal-case"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ displayUrl(project.url) }}
              </a>
            </h3>
            <span
              v-if="formatDateRange(project.startDate, project.endDate)"
              class="text-xs font-black text-gray-500 uppercase whitespace-nowrap tabular-nums"
            >
              {{ formatDateRange(project.startDate, project.endDate) }}
            </span>
          </div>
          <p v-if="project.description" class="text-sm text-gray-700 mt-1">
            {{ project.description }}
          </p>
          <ul v-if="project.highlights?.length" class="resume-list mt-1.5 space-y-1">
            <li
              v-for="(highlight, hIndex) in project.highlights"
              :key="hIndex"
              class="text-sm text-gray-800"
            >
              {{ highlight }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Awards & Certifications -->
    <div
      v-if="resumeData.awards?.length || resumeData.certificates?.length"
      :class="[
        'pt-5 border-t-2 border-gray-100 grid gap-10 section-block',
        resumeData.awards?.length && resumeData.certificates?.length
          ? 'grid-cols-2'
          : 'grid-cols-1',
      ]"
    >
      <section v-if="resumeData.awards?.length">
        <h2 class="section-title !mb-4">Awards</h2>
        <ul class="space-y-2">
          <li
            v-for="(award, index) in resumeData.awards"
            :key="index"
            class="text-sm break-inside-avoid"
          >
            <div>
              <span class="font-black">{{ award.title }}</span>
              <span v-if="award.awarder || award.date" class="text-gray-600 font-bold tabular-nums">
                — {{ [award.awarder, formatDate(award.date)].filter(Boolean).join(" · ") }}
              </span>
            </div>
            <p v-if="award.summary" class="text-xs text-gray-600 mt-0.5 leading-snug">
              {{ award.summary }}
            </p>
          </li>
        </ul>
      </section>

      <section v-if="resumeData.certificates?.length">
        <h2 class="section-title !mb-4">Certifications</h2>
        <ul class="space-y-2 text-sm">
          <li
            v-for="(cert, index) in resumeData.certificates"
            :key="index"
            class="break-inside-avoid"
          >
            <a
              v-if="cert.url"
              :href="sanitizeUrl(cert.url)"
              class="font-black hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ cert.name }}
            </a>
            <span v-else class="font-black">{{ cert.name }}</span>
            <span v-if="cert.issuer || cert.date" class="text-gray-600 font-bold tabular-nums">
              — {{ [cert.issuer, formatDate(cert.date)].filter(Boolean).join(" · ") }}
            </span>
          </li>
        </ul>
      </section>
    </div>

    <!-- Volunteer & Publications -->
    <div
      v-if="resumeData.volunteer?.length || resumeData.publications?.length"
      :class="[
        'grid gap-10 section-block',
        resumeData.volunteer?.length && resumeData.publications?.length
          ? 'grid-cols-2'
          : 'grid-cols-1',
      ]"
    >
      <section v-if="resumeData.volunteer?.length">
        <h2 class="section-title !mb-4">Volunteer</h2>
        <div class="space-y-3">
          <div
            v-for="(vol, index) in resumeData.volunteer"
            :key="index"
            class="text-sm break-inside-avoid"
          >
            <div class="flex justify-between items-baseline gap-2">
              <div class="font-black">
                {{ vol.position }}
                <span v-if="vol.organization"> — {{ vol.organization }}</span>
                <span v-if="vol.url" class="text-xs font-medium ml-1">
                  <a
                    :href="sanitizeUrl(vol.url)"
                    class="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ({{ displayUrl(vol.url) }})
                  </a>
                </span>
              </div>
              <span
                v-if="formatDateRange(vol.startDate, vol.endDate)"
                class="text-[11px] font-black text-gray-500 whitespace-nowrap tabular-nums"
              >
                {{ formatDateRange(vol.startDate, vol.endDate) }}
              </span>
            </div>
            <p v-if="vol.summary" class="text-gray-600 mt-0.5">{{ vol.summary }}</p>
            <ul v-if="vol.highlights?.length" class="resume-list mt-1 space-y-1">
              <li
                v-for="(highlight, hIndex) in vol.highlights"
                :key="hIndex"
                class="text-xs text-gray-800"
              >
                {{ highlight }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section v-if="resumeData.publications?.length">
        <h2 class="section-title !mb-4">Publications</h2>
        <div class="space-y-3">
          <div
            v-for="(pub, index) in resumeData.publications"
            :key="index"
            class="text-sm break-inside-avoid"
          >
            <div class="font-black">
              <a
                v-if="pub.url"
                :href="sanitizeUrl(pub.url)"
                class="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ pub.name }}
              </a>
              <span v-else>{{ pub.name }}</span>
            </div>
            <div
              v-if="pub.publisher || pub.releaseDate"
              class="text-gray-600 font-bold tabular-nums"
            >
              {{ [pub.publisher, formatDate(pub.releaseDate)].filter(Boolean).join(" · ") }}
            </div>
            <p v-if="pub.summary" class="text-xs text-gray-600 mt-0.5 leading-snug">
              {{ pub.summary }}
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- Languages & Interests -->
    <div
      v-if="resumeData.languages?.length || resumeData.interests?.length"
      :class="[
        'pt-5 border-t-2 border-gray-100 grid gap-10 section-block',
        resumeData.languages?.length && resumeData.interests?.length
          ? 'grid-cols-2'
          : 'grid-cols-1',
      ]"
    >
      <section v-if="resumeData.languages?.length">
        <h2 class="section-title !mb-4">Languages</h2>
        <div class="flex flex-wrap gap-4 text-sm">
          <div v-for="(lang, index) in resumeData.languages" :key="index">
            <span class="font-black">{{ lang.language }}:</span>
            <span class="text-gray-700">{{ lang.fluency }}</span>
          </div>
        </div>
      </section>

      <section v-if="resumeData.interests?.length">
        <h2 class="section-title !mb-4">Interests</h2>
        <div class="space-y-1 text-sm">
          <div v-for="(interest, index) in resumeData.interests" :key="index">
            <span class="font-black">{{ interest.name }}</span>
            <span v-if="interest.keywords?.length" class="text-gray-600">
              — {{ interest.keywords.join(", ") }}
            </span>
          </div>
        </div>
      </section>
    </div>

    <!-- References -->
    <section v-if="resumeData.references?.length" class="section-block">
      <h2 class="section-title !mb-4">References</h2>
      <div class="grid grid-cols-2 gap-6">
        <div
          v-for="(ref, index) in resumeData.references"
          :key="index"
          class="text-sm break-inside-avoid"
        >
          <div class="font-black">{{ ref.name }}</div>
          <p v-if="ref.reference" class="text-gray-600 mt-0.5">{{ ref.reference }}</p>
        </div>
      </div>
    </section>

    <!-- Optional Signature Footer -->
    <footer
      v-if="resumeData.meta?.showSignature && resumeData.meta?.signatureDataUrl"
      class="mt-8 pt-4 border-t border-gray-200 flex justify-end break-inside-avoid"
    >
      <div class="text-center">
        <img
          :src="resumeData.meta.signatureDataUrl"
          alt="Signature"
          class="h-12 object-contain mx-auto"
        />
        <div class="text-xs font-bold text-gray-700 mt-1 border-t border-gray-400 pt-1 px-4">
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

const accentColor = computed(() => props.resumeData.meta?.accentColor || "#111827");

const resolvedFontFamily = computed(() => {
  const f = props.resumeData.meta?.fontFamily || "sans";
  if (f === "serif") return '"Georgia", "Cambria", "Times New Roman", serif';
  if (f === "mono") return '"JetBrains Mono", monospace';
  return '"Inter", system-ui, sans-serif';
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
  return [loc.city, loc.region, loc.countryCode].filter(Boolean).join(", ");
});

function displayUrl(url?: string): string {
  if (!url) return "";
  return url
    .trim()
    .replace(/^https?:\/\/(www\.)?/i, "")
    .replace(/\/+$/, "");
}

function formatDateRange(startDate?: string, endDate?: string): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  if (!start && !end) return "";
  if (start && end) return `${start} – ${end}`;
  if (start) return `${start} – Present`;
  return end;
}
</script>

<style scoped>
.density-compact {
  line-height: 1.35;
}
.density-compact .section-block {
  margin-bottom: 1.1rem;
}

.density-standard {
  line-height: 1.5;
}
.density-standard .section-block {
  margin-bottom: 1.5rem;
}

.density-spacious {
  line-height: 1.65;
}
.density-spacious .section-block {
  margin-bottom: 2rem;
}

.resume-content a {
  color: var(--resume-accent, #111827) !important;
}

.section-title {
  @apply text-xs font-black uppercase tracking-[0.18em] mb-4 flex items-center gap-3;
  color: var(--resume-accent, #4b5563);
}

.section-title::after {
  content: "";
  @apply flex-1 h-[2px] bg-gray-200;
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
  color: var(--resume-accent, #111827);
  font-size: 0.6em;
  line-height: 2.2;
}
</style>
