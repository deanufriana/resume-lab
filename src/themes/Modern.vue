<template>
  <div
    class="resume-content relative bg-white text-slate-900"
    :class="[densityClass, fontClass]"
    :style="{ '--resume-accent': accentColor }"
  >
    <!-- Header -->
    <header class="border-b-2 pb-4 mb-5" :style="{ borderColor: accentColor }">
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {{ resumeData.basics?.name || "Your Name" }}
          </h1>
          <p
            v-if="resumeData.basics?.label"
            class="text-base font-semibold mt-0.5"
            :style="{ color: accentColor }"
          >
            {{ resumeData.basics.label }}
          </p>
        </div>
        <div v-if="formattedLocation" class="text-xs font-medium text-slate-500 sm:text-right">
          {{ formattedLocation }}
        </div>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
        <a
          v-if="resumeData.basics?.email"
          :href="`mailto:${resumeData.basics.email}`"
          class="hover:underline font-medium"
          target="_blank"
        >
          {{ resumeData.basics.email }}
        </a>
        <span v-if="resumeData.basics?.phone">{{ resumeData.basics.phone }}</span>
        <a
          v-if="resumeData.basics?.url"
          :href="sanitizeUrl(resumeData.basics.url)"
          class="hover:underline"
          :style="{ color: accentColor }"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ resumeData.basics.url.replace(/^https?:\/\//, "") }}
        </a>
        <template v-if="resumeData.basics?.profiles?.length">
          <a
            v-for="(profile, index) in resumeData.basics.profiles"
            :key="index"
            :href="sanitizeUrl(profile.url)"
            class="hover:underline"
            :style="{ color: accentColor }"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ profile.network }}: {{ profile.username }}
          </a>
        </template>
      </div>
    </header>

    <!-- Summary -->
    <section v-if="resumeData.basics?.summary" class="section-block">
      <h2 class="modern-heading">Summary</h2>
      <p class="text-sm text-slate-700 leading-relaxed">{{ resumeData.basics.summary }}</p>
    </section>

    <!-- Two-Column Body -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Main Column (8 cols) -->
      <div class="col-span-8 modern-col">
        <!-- Work Experience -->
        <section v-if="resumeData.work?.length">
          <h2 class="modern-heading">Experience</h2>
          <div class="space-y-4">
            <div v-for="(work, index) in resumeData.work" :key="index" class="break-inside-avoid">
              <div class="flex justify-between items-baseline gap-2">
                <h3 class="text-sm font-bold text-slate-900">{{ work.position }}</h3>
                <span class="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                  {{ formatDate(work.startDate) }} – {{ formatDate(work.endDate) || "Present" }}
                </span>
              </div>
              <div class="text-xs font-semibold mb-1.5" :style="{ color: accentColor }">
                {{ work.name }}
                <span v-if="work.url" class="font-normal text-slate-500">
                  ·
                  <a
                    :href="sanitizeUrl(work.url)"
                    class="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ work.url.replace(/^https?:\/\//, "") }}</a
                  >
                </span>
              </div>
              <p v-if="work.summary" class="text-xs text-slate-600 mb-1.5 leading-relaxed">
                {{ work.summary }}
              </p>
              <ul
                v-if="work.highlights?.length"
                class="resume-list text-xs text-slate-700 space-y-1"
              >
                <li v-for="(highlight, hIndex) in work.highlights" :key="hIndex">
                  {{ highlight }}
                </li>
              </ul>
              <div v-if="work.skills?.length" class="mt-1.5 flex flex-wrap gap-1">
                <span
                  v-for="(s, sIdx) in work.skills"
                  :key="sIdx"
                  class="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 text-slate-700"
                >
                  {{ s }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Projects -->
        <section v-if="resumeData.projects?.length">
          <h2 class="modern-heading">Projects</h2>
          <div class="space-y-3">
            <div
              v-for="(project, index) in resumeData.projects"
              :key="index"
              class="break-inside-avoid"
            >
              <div class="flex justify-between items-baseline gap-2">
                <h3 class="text-sm font-bold text-slate-900">
                  {{ project.name }}
                  <a
                    v-if="project.url"
                    :href="sanitizeUrl(project.url)"
                    class="text-[11px] font-normal hover:underline ml-1"
                    :style="{ color: accentColor }"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ↗
                  </a>
                </h3>
                <span
                  v-if="project.startDate || project.endDate"
                  class="text-[11px] font-medium text-slate-500 whitespace-nowrap"
                >
                  {{ formatDate(project.startDate) }} –
                  {{ formatDate(project.endDate) || "Present" }}
                </span>
              </div>
              <p v-if="project.description" class="text-xs text-slate-600 mb-1">
                {{ project.description }}
              </p>
              <ul
                v-if="project.highlights?.length"
                class="resume-list text-xs text-slate-700 space-y-1"
              >
                <li v-for="(highlight, hIndex) in project.highlights" :key="hIndex">
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Volunteer -->
        <section v-if="resumeData.volunteer?.length">
          <h2 class="modern-heading">Volunteer</h2>
          <div class="space-y-3">
            <div
              v-for="(vol, index) in resumeData.volunteer"
              :key="index"
              class="break-inside-avoid"
            >
              <div class="flex justify-between items-baseline">
                <h3 class="text-xs font-bold text-slate-900">
                  {{ vol.position }} · <span class="font-semibold">{{ vol.organization }}</span>
                </h3>
                <span v-if="vol.startDate" class="text-[11px] text-slate-500 whitespace-nowrap">
                  {{ formatDate(vol.startDate) }} – {{ formatDate(vol.endDate) || "Present" }}
                </span>
              </div>
              <p v-if="vol.summary" class="text-xs text-slate-600 mt-0.5">{{ vol.summary }}</p>
            </div>
          </div>
        </section>

        <!-- Publications -->
        <section v-if="resumeData.publications?.length">
          <h2 class="modern-heading">Publications</h2>
          <div class="space-y-2">
            <div v-for="(pub, index) in resumeData.publications" :key="index">
              <div class="text-xs font-bold text-slate-900">{{ pub.name }}</div>
              <div class="text-[11px] text-slate-600">
                {{ pub.publisher }}
                <span v-if="pub.releaseDate">· {{ formatDate(pub.releaseDate) }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Sidebar Column (4 cols) -->
      <div class="col-span-4 modern-col border-l border-slate-100 pl-5">
        <!-- Skills -->
        <section v-if="resumeData.skills?.length">
          <h2 class="modern-heading">Skills</h2>
          <div class="space-y-3">
            <div v-for="(skill, index) in resumeData.skills" :key="index">
              <div class="text-xs font-bold text-slate-900 mb-1">
                {{ skill.name }}
                <span v-if="skill.level" class="font-normal text-slate-500"
                  >({{ skill.level }})</span
                >
              </div>
              <div v-if="skill.keywords?.length" class="flex flex-wrap gap-1">
                <span
                  v-for="(kw, kIdx) in skill.keywords"
                  :key="kIdx"
                  class="px-1.5 py-0.5 text-[10px] font-medium rounded border border-slate-200 text-slate-700 bg-slate-50"
                >
                  {{ kw }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Education -->
        <section v-if="resumeData.education?.length">
          <h2 class="modern-heading">Education</h2>
          <div class="space-y-3">
            <div
              v-for="(edu, index) in resumeData.education"
              :key="index"
              class="break-inside-avoid"
            >
              <div class="text-xs font-bold text-slate-900">
                {{ edu.studyType }} {{ edu.area ? `in ${edu.area}` : "" }}
              </div>
              <div class="text-xs font-medium" :style="{ color: accentColor }">
                {{ edu.institution }}
              </div>
              <div class="text-[11px] text-slate-500">
                {{ formatDate(edu.startDate) }} – {{ formatDate(edu.endDate) || "Present" }}
                <span v-if="edu.score">· GPA {{ edu.score }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Certificates -->
        <section v-if="resumeData.certificates?.length">
          <h2 class="modern-heading">Certificates</h2>
          <div class="space-y-2">
            <div v-for="(cert, index) in resumeData.certificates" :key="index">
              <div class="text-xs font-bold text-slate-900">{{ cert.name }}</div>
              <div class="text-[11px] text-slate-600">
                {{ cert.issuer }} <span v-if="cert.date">· {{ formatDate(cert.date) }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Awards -->
        <section v-if="resumeData.awards?.length">
          <h2 class="modern-heading">Awards</h2>
          <div class="space-y-2">
            <div v-for="(award, index) in resumeData.awards" :key="index">
              <div class="text-xs font-bold text-slate-900">{{ award.title }}</div>
              <div class="text-[11px] text-slate-600">
                {{ award.awarder }} <span v-if="award.date">· {{ formatDate(award.date) }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section v-if="resumeData.languages?.length">
          <h2 class="modern-heading">Languages</h2>
          <div class="space-y-1">
            <div v-for="(lang, index) in resumeData.languages" :key="index" class="text-xs">
              <span class="font-semibold text-slate-900">{{ lang.language }}</span>
              <span v-if="lang.fluency" class="text-slate-600"> — {{ lang.fluency }}</span>
            </div>
          </div>
        </section>

        <!-- Interests -->
        <section v-if="resumeData.interests?.length">
          <h2 class="modern-heading">Interests</h2>
          <div class="space-y-1">
            <div v-for="(interest, index) in resumeData.interests" :key="index" class="text-xs">
              <span class="font-semibold text-slate-900">{{ interest.name }}</span>
              <span v-if="interest.keywords?.length" class="text-slate-600">
                ({{ interest.keywords.join(", ") }})
              </span>
            </div>
          </div>
        </section>

        <!-- References -->
        <section v-if="resumeData.references?.length">
          <h2 class="modern-heading">References</h2>
          <div class="space-y-2">
            <div v-for="(ref, index) in resumeData.references" :key="index" class="text-xs">
              <div class="font-semibold text-slate-900">{{ ref.name }}</div>
              <p v-if="ref.reference" class="text-slate-600">{{ ref.reference }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Optional Signature Footer -->
    <footer
      v-if="resumeData.meta?.showSignature && resumeData.meta?.signatureDataUrl"
      class="mt-8 pt-4 border-t border-slate-200 flex justify-end"
    >
      <div class="text-center">
        <img
          :src="resumeData.meta.signatureDataUrl"
          alt="Signature"
          class="h-12 object-contain mx-auto"
        />
        <div
          class="text-[11px] font-medium text-slate-600 mt-1 border-t border-slate-300 pt-1 px-4"
        >
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

const props = defineProps<{
  resumeData: Resume;
}>();

const accentColor = computed(() => props.resumeData.meta?.accentColor || "#2563eb");

const fontClass = computed(() => {
  const f = props.resumeData.meta?.fontFamily || "sans";
  if (f === "serif") return "font-serif";
  if (f === "mono") return "font-mono";
  return "font-sans";
});

const densityClass = computed(() => {
  const d = props.resumeData.meta?.density || "standard";
  if (d === "compact") return "density-compact";
  if (d === "spacious") return "density-spacious";
  return "density-standard";
});

const formattedLocation = computed(() => {
  const loc = props.resumeData.basics?.location;
  if (!loc) return "";
  return [loc.city, loc.region, loc.countryCode].filter(Boolean).join(", ");
});
</script>

<style scoped>
.resume-content {
  --resume-accent: #2563eb;
}

.density-compact {
  line-height: 1.35;
}
.density-compact .section-block {
  margin-bottom: 0.75rem;
}
.density-compact .modern-col {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.density-standard {
  line-height: 1.5;
}
.density-standard .section-block {
  margin-bottom: 1.25rem;
}
.density-standard .modern-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.density-spacious {
  line-height: 1.65;
}
.density-spacious .section-block {
  margin-bottom: 1.75rem;
}
.density-spacious .modern-col {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.modern-heading {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--resume-accent);
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.25rem;
  margin-bottom: 0.65rem;
}

.resume-list {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}

.resume-list li {
  position: relative;
  padding-left: 0.9rem;
}

.resume-list li::before {
  content: "•";
  position: absolute;
  left: 0.15rem;
  color: var(--resume-accent);
  font-weight: 700;
}
</style>
