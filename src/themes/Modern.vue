<template>
  <div
    class="resume-content relative bg-white text-slate-900"
    :class="densityClass"
    :style="{ fontFamily: resolvedFontFamily, '--resume-accent': accentColor }"
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

      <div
        v-if="contactItems.length"
        class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600"
      >
        <template v-for="(item, index) in contactItems" :key="item.key">
          <span v-if="index > 0" class="text-slate-300 select-none" aria-hidden="true">·</span>
          <a
            v-if="item.href"
            :href="item.href"
            class="hover:underline"
            :class="item.accent ? 'font-medium' : ''"
            :style="item.accent ? { color: accentColor } : undefined"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item.label }}
          </a>
          <span v-else>{{ item.label }}</span>
        </template>
      </div>
    </header>

    <!-- Summary -->
    <section v-if="resumeData.basics?.summary" class="section-block">
      <h2 class="modern-heading">Summary</h2>
      <p class="text-sm text-slate-700 leading-relaxed">{{ resumeData.basics.summary }}</p>
    </section>

    <!-- Two-Column Body (collapses to full width when sidebar is empty) -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Main Column -->
      <div :class="[hasSidebar ? 'col-span-8' : 'col-span-12', 'modern-col']">
        <!-- Work Experience -->
        <section v-if="resumeData.work?.length">
          <h2 class="modern-heading">Experience</h2>
          <div class="space-y-4">
            <div v-for="(work, index) in resumeData.work" :key="index" class="break-inside-avoid">
              <div class="flex justify-between items-baseline gap-2">
                <h3 class="text-sm font-bold text-slate-900">{{ work.position }}</h3>
                <span
                  v-if="formatDateRange(work.startDate, work.endDate)"
                  class="text-[11px] font-medium text-slate-500 whitespace-nowrap tabular-nums"
                >
                  {{ formatDateRange(work.startDate, work.endDate) }}
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
                    >{{ displayUrl(work.url) }}</a
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
                  class="skill-pill px-1.5 py-0.5 text-[10px] font-medium rounded text-slate-700"
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
                    {{ displayUrl(project.url) }}
                  </a>
                </h3>
                <span
                  v-if="formatDateRange(project.startDate, project.endDate)"
                  class="text-[11px] font-medium text-slate-500 whitespace-nowrap tabular-nums"
                >
                  {{ formatDateRange(project.startDate, project.endDate) }}
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
              <div class="flex justify-between items-baseline gap-2">
                <h3 class="text-xs font-bold text-slate-900">
                  {{ vol.position }}
                  <span v-if="vol.organization" class="font-semibold">
                    · {{ vol.organization }}
                  </span>
                  <span v-if="vol.url" class="font-normal text-slate-500">
                    ·
                    <a
                      :href="sanitizeUrl(vol.url)"
                      class="hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      >{{ displayUrl(vol.url) }}</a
                    >
                  </span>
                </h3>
                <span
                  v-if="formatDateRange(vol.startDate, vol.endDate)"
                  class="text-[11px] text-slate-500 whitespace-nowrap tabular-nums"
                >
                  {{ formatDateRange(vol.startDate, vol.endDate) }}
                </span>
              </div>
              <p v-if="vol.summary" class="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {{ vol.summary }}
              </p>
              <ul
                v-if="vol.highlights?.length"
                class="resume-list text-xs text-slate-700 space-y-1 mt-1"
              >
                <li v-for="(highlight, hIndex) in vol.highlights" :key="hIndex">
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Publications -->
        <section v-if="resumeData.publications?.length">
          <h2 class="modern-heading">Publications</h2>
          <div class="space-y-2.5">
            <div
              v-for="(pub, index) in resumeData.publications"
              :key="index"
              class="break-inside-avoid"
            >
              <div class="flex justify-between items-baseline gap-2">
                <div class="text-xs font-bold text-slate-900">
                  <a
                    v-if="pub.url"
                    :href="sanitizeUrl(pub.url)"
                    class="hover:underline"
                    :style="{ color: accentColor }"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ pub.name }}
                  </a>
                  <span v-else>{{ pub.name }}</span>
                </div>
                <span
                  v-if="pub.releaseDate"
                  class="text-[11px] text-slate-500 whitespace-nowrap tabular-nums"
                >
                  {{ formatDate(pub.releaseDate) }}
                </span>
              </div>
              <div v-if="pub.publisher" class="text-[11px] text-slate-600">
                {{ pub.publisher }}
              </div>
              <p v-if="pub.summary" class="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {{ pub.summary }}
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- Sidebar Column -->
      <div v-if="hasSidebar" class="col-span-4 modern-col border-l border-slate-200 pl-5">
        <!-- Skills -->
        <section v-if="resumeData.skills?.length">
          <h2 class="modern-heading">Skills</h2>
          <div class="space-y-3">
            <div
              v-for="(skill, index) in resumeData.skills"
              :key="index"
              class="break-inside-avoid"
            >
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
                  class="skill-pill px-1.5 py-0.5 text-[10px] font-medium rounded text-slate-700"
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
              </div>
              <div
                v-if="formatDateRange(edu.startDate, edu.endDate) || edu.score"
                class="text-[11px] text-slate-500 tabular-nums"
              >
                {{
                  [formatDateRange(edu.startDate, edu.endDate), edu.score ? `GPA ${edu.score}` : ""]
                    .filter(Boolean)
                    .join(" · ")
                }}
              </div>
              <div v-if="edu.courses?.length" class="mt-1 text-[10px] text-slate-600 leading-snug">
                <span class="font-semibold text-slate-700">Courses:</span>
                {{ edu.courses.join(", ") }}
              </div>
            </div>
          </div>
        </section>

        <!-- Certificates -->
        <section v-if="resumeData.certificates?.length">
          <h2 class="modern-heading">Certificates</h2>
          <div class="space-y-2">
            <div
              v-for="(cert, index) in resumeData.certificates"
              :key="index"
              class="break-inside-avoid"
            >
              <div class="text-xs font-bold text-slate-900">
                <a
                  v-if="cert.url"
                  :href="sanitizeUrl(cert.url)"
                  class="hover:underline"
                  :style="{ color: accentColor }"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ cert.name }}
                </a>
                <span v-else>{{ cert.name }}</span>
              </div>
              <div v-if="cert.issuer || cert.date" class="text-[11px] text-slate-600 tabular-nums">
                {{ [cert.issuer, formatDate(cert.date)].filter(Boolean).join(" · ") }}
              </div>
            </div>
          </div>
        </section>

        <!-- Awards -->
        <section v-if="resumeData.awards?.length">
          <h2 class="modern-heading">Awards</h2>
          <div class="space-y-2">
            <div
              v-for="(award, index) in resumeData.awards"
              :key="index"
              class="break-inside-avoid"
            >
              <div class="text-xs font-bold text-slate-900">{{ award.title }}</div>
              <div
                v-if="award.awarder || award.date"
                class="text-[11px] text-slate-600 tabular-nums"
              >
                {{ [award.awarder, formatDate(award.date)].filter(Boolean).join(" · ") }}
              </div>
              <p v-if="award.summary" class="text-[11px] text-slate-600 mt-0.5 leading-snug">
                {{ award.summary }}
              </p>
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
            <div
              v-for="(ref, index) in resumeData.references"
              :key="index"
              class="text-xs break-inside-avoid"
            >
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
      class="mt-8 pt-4 border-t border-slate-200 flex justify-end break-inside-avoid"
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

const resolvedFontFamily = computed(() => {
  const f = props.resumeData.meta?.fontFamily || "sans";
  if (f === "serif") return '"Georgia", "Cambria", "Times New Roman", serif';
  if (f === "mono") return '"JetBrains Mono", monospace';
  return '"Inter", system-ui, sans-serif';
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

const hasSidebar = computed(() =>
  Boolean(
    props.resumeData.skills?.length ||
    props.resumeData.education?.length ||
    props.resumeData.certificates?.length ||
    props.resumeData.awards?.length ||
    props.resumeData.languages?.length ||
    props.resumeData.interests?.length ||
    props.resumeData.references?.length,
  ),
);

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

const contactItems = computed(() => {
  const basics = props.resumeData.basics;
  const items: Array<{ key: string; label: string; href?: string; accent?: boolean }> = [];

  if (basics?.email) {
    items.push({ key: "email", label: basics.email, href: `mailto:${basics.email}` });
  }
  if (basics?.phone) {
    items.push({ key: "phone", label: basics.phone, href: `tel:${basics.phone}` });
  }
  if (basics?.url) {
    items.push({
      key: "url",
      label: displayUrl(basics.url),
      href: sanitizeUrl(basics.url),
      accent: true,
    });
  }
  if (basics?.profiles?.length) {
    basics.profiles.forEach((profile, index) => {
      const label = [profile.network, profile.username || displayUrl(profile.url)]
        .filter(Boolean)
        .join(": ");
      if (!label) return;
      items.push({
        key: `profile-${index}`,
        label,
        href: profile.url ? sanitizeUrl(profile.url) : undefined,
        accent: true,
      });
    });
  }

  return items;
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

.skill-pill {
  background-color: #f1f5f9;
  background-color: color-mix(in srgb, var(--resume-accent) 8%, transparent);
  border: 1px solid #e2e8f0;
  border-color: color-mix(in srgb, var(--resume-accent) 18%, transparent);
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
