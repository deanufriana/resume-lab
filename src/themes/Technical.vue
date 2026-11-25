<template>
  <div
    class="resume-content relative bg-white text-slate-900"
    :class="densityClass"
    :style="{ fontFamily: resolvedFontFamily, '--resume-accent': accentColor }"
  >
    <!-- Header -->
    <header class="mb-5">
      <div class="border-l-[3px] pl-3.5" :style="{ borderColor: accentColor }">
        <h1 class="text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
          {{ resumeData.basics?.name || "Your Name" }}
        </h1>
        <p
          v-if="resumeData.basics?.label"
          class="text-sm font-semibold mt-0.5"
          :style="{ color: accentColor }"
        >
          {{ resumeData.basics.label }}
        </p>
      </div>

      <div
        v-if="contactItems.length"
        class="mt-2.5 pt-2 border-t border-slate-200 flex flex-wrap items-center gap-x-2 gap-y-1 font-tech-mono text-[11px] text-slate-600"
      >
        <template v-for="(item, index) in contactItems" :key="item.key">
          <span v-if="index > 0" class="text-slate-300 select-none" aria-hidden="true">·</span>
          <a
            v-if="item.href"
            :href="item.href"
            class="hover:underline"
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
      <h2 class="tech-heading">Summary</h2>
      <p class="text-xs text-slate-700 leading-relaxed">{{ resumeData.basics.summary }}</p>
    </section>

    <!-- Technical Skills Matrix -->
    <section v-if="resumeData.skills?.length" class="section-block">
      <h2 class="tech-heading">Technical Skills</h2>
      <div class="space-y-1.5">
        <div
          v-for="(skill, index) in resumeData.skills"
          :key="index"
          class="grid grid-cols-[140px_1fr] items-baseline gap-x-3 gap-y-1 break-inside-avoid"
        >
          <div class="text-xs font-bold text-slate-800 leading-snug">
            {{ skill.name }}
            <span v-if="skill.level" class="block text-[10px] font-normal text-slate-500">
              {{ skill.level }}
            </span>
          </div>
          <div v-if="skill.keywords?.length" class="flex flex-wrap gap-1">
            <span
              v-for="(kw, kIdx) in skill.keywords"
              :key="kIdx"
              class="tech-chip px-1.5 py-0.5 rounded font-tech-mono text-[10px] font-medium text-slate-700"
            >
              {{ kw }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Work Experience (Timeline Rail) -->
    <section v-if="resumeData.work?.length" class="section-block">
      <h2 class="tech-heading">Experience</h2>
      <div class="space-y-4 border-l border-slate-200 pl-4 ml-1">
        <div
          v-for="(work, index) in resumeData.work"
          :key="index"
          class="relative break-inside-avoid"
        >
          <span
            class="absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full ring-2 ring-white"
            :style="{ backgroundColor: accentColor }"
            aria-hidden="true"
          />
          <div class="flex justify-between items-baseline gap-3">
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-slate-900 leading-snug">
                {{ work.position }}
                <span v-if="work.name" class="font-semibold" :style="{ color: accentColor }">
                  @ {{ work.name }}
                </span>
                <a
                  v-if="work.url"
                  :href="sanitizeUrl(work.url)"
                  class="font-tech-mono text-[10px] font-normal text-slate-500 hover:underline ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ displayUrl(work.url) }}
                </a>
              </h3>
            </div>
            <span
              v-if="formatDateRange(work.startDate, work.endDate)"
              class="font-tech-mono text-[11px] text-slate-500 whitespace-nowrap tabular-nums"
            >
              {{ formatDateRange(work.startDate, work.endDate) }}
            </span>
          </div>
          <p v-if="work.summary" class="text-xs text-slate-600 mt-1 leading-relaxed">
            {{ work.summary }}
          </p>
          <ul
            v-if="work.highlights?.length"
            class="resume-list text-xs text-slate-700 space-y-1 mt-1.5"
          >
            <li v-for="(highlight, hIndex) in work.highlights" :key="hIndex">
              {{ highlight }}
            </li>
          </ul>
          <div v-if="work.skills?.length" class="mt-1.5 flex flex-wrap gap-1">
            <span
              v-for="(s, sIdx) in work.skills"
              :key="sIdx"
              class="tech-chip px-1.5 py-0.5 rounded font-tech-mono text-[10px] font-medium text-slate-700"
            >
              {{ s }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section v-if="resumeData.projects?.length" class="section-block">
      <h2 class="tech-heading">Projects</h2>
      <div class="space-y-3">
        <div
          v-for="(project, index) in resumeData.projects"
          :key="index"
          class="break-inside-avoid"
        >
          <div class="flex justify-between items-baseline gap-3">
            <h3 class="text-sm font-bold text-slate-900">
              {{ project.name }}
              <a
                v-if="project.url"
                :href="sanitizeUrl(project.url)"
                class="font-tech-mono text-[10px] font-normal hover:underline ml-1"
                :style="{ color: accentColor }"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ displayUrl(project.url) }}
              </a>
            </h3>
            <span
              v-if="formatDateRange(project.startDate, project.endDate)"
              class="font-tech-mono text-[11px] text-slate-500 whitespace-nowrap tabular-nums"
            >
              {{ formatDateRange(project.startDate, project.endDate) }}
            </span>
          </div>
          <p v-if="project.description" class="text-xs text-slate-600 mt-0.5 leading-relaxed">
            {{ project.description }}
          </p>
          <ul
            v-if="project.highlights?.length"
            class="resume-list text-xs text-slate-700 space-y-1 mt-1"
          >
            <li v-for="(highlight, hIndex) in project.highlights" :key="hIndex">
              {{ highlight }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section v-if="resumeData.education?.length" class="section-block">
      <h2 class="tech-heading">Education</h2>
      <div class="space-y-2.5">
        <div v-for="(edu, index) in resumeData.education" :key="index" class="break-inside-avoid">
          <div class="flex justify-between items-baseline gap-3">
            <div class="text-xs">
              <span class="font-bold text-slate-900">
                {{ [edu.studyType, edu.area].filter(Boolean).join(" — ") }}
              </span>
              <span v-if="edu.institution" class="text-slate-600">
                ·
                <a
                  v-if="edu.url"
                  :href="sanitizeUrl(edu.url)"
                  class="font-semibold hover:underline"
                  :style="{ color: accentColor }"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ edu.institution }}
                </a>
                <span v-else class="font-semibold">{{ edu.institution }}</span>
              </span>
            </div>
            <span
              v-if="formatDateRange(edu.startDate, edu.endDate) || edu.score"
              class="font-tech-mono text-[11px] text-slate-500 whitespace-nowrap tabular-nums"
            >
              {{
                [formatDateRange(edu.startDate, edu.endDate), edu.score ? `GPA ${edu.score}` : ""]
                  .filter(Boolean)
                  .join(" · ")
              }}
            </span>
          </div>
          <p v-if="edu.courses?.length" class="text-[11px] text-slate-600 mt-0.5">
            <span class="font-semibold text-slate-700">Courses:</span> {{ edu.courses.join(", ") }}
          </p>
        </div>
      </div>
    </section>

    <!-- Certificates -->
    <section v-if="resumeData.certificates?.length" class="section-block">
      <h2 class="tech-heading">Certificates</h2>
      <div class="space-y-1">
        <div
          v-for="(cert, index) in resumeData.certificates"
          :key="index"
          class="flex justify-between items-baseline gap-3 text-xs break-inside-avoid"
        >
          <div>
            <a
              v-if="cert.url"
              :href="sanitizeUrl(cert.url)"
              class="font-bold hover:underline"
              :style="{ color: accentColor }"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ cert.name }}
            </a>
            <span v-else class="font-bold text-slate-900">{{ cert.name }}</span>
            <span v-if="cert.issuer" class="text-slate-600"> · {{ cert.issuer }}</span>
          </div>
          <span
            v-if="cert.date"
            class="font-tech-mono text-[11px] text-slate-500 whitespace-nowrap tabular-nums"
          >
            {{ formatDate(cert.date) }}
          </span>
        </div>
      </div>
    </section>

    <!-- Volunteer -->
    <section v-if="resumeData.volunteer?.length" class="section-block">
      <h2 class="tech-heading">Volunteer</h2>
      <div class="space-y-2.5">
        <div v-for="(vol, index) in resumeData.volunteer" :key="index" class="break-inside-avoid">
          <div class="flex justify-between items-baseline gap-3">
            <div class="text-xs font-bold text-slate-900">
              {{ vol.position }}
              <span v-if="vol.organization" class="font-semibold" :style="{ color: accentColor }">
                @ {{ vol.organization }}
              </span>
              <a
                v-if="vol.url"
                :href="sanitizeUrl(vol.url)"
                class="font-tech-mono text-[10px] font-normal text-slate-500 hover:underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ displayUrl(vol.url) }}
              </a>
            </div>
            <span
              v-if="formatDateRange(vol.startDate, vol.endDate)"
              class="font-tech-mono text-[11px] text-slate-500 whitespace-nowrap tabular-nums"
            >
              {{ formatDateRange(vol.startDate, vol.endDate) }}
            </span>
          </div>
          <p v-if="vol.summary" class="text-xs text-slate-600 mt-0.5">{{ vol.summary }}</p>
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

    <!-- Awards -->
    <section v-if="resumeData.awards?.length" class="section-block">
      <h2 class="tech-heading">Awards</h2>
      <div class="space-y-1.5">
        <div v-for="(award, index) in resumeData.awards" :key="index" class="break-inside-avoid">
          <div class="flex justify-between items-baseline gap-3 text-xs">
            <div>
              <span class="font-bold text-slate-900">{{ award.title }}</span>
              <span v-if="award.awarder" class="text-slate-600"> · {{ award.awarder }}</span>
            </div>
            <span
              v-if="award.date"
              class="font-tech-mono text-[11px] text-slate-500 whitespace-nowrap tabular-nums"
            >
              {{ formatDate(award.date) }}
            </span>
          </div>
          <p v-if="award.summary" class="text-xs text-slate-600 mt-0.5 leading-snug">
            {{ award.summary }}
          </p>
        </div>
      </div>
    </section>

    <!-- Publications -->
    <section v-if="resumeData.publications?.length" class="section-block">
      <h2 class="tech-heading">Publications</h2>
      <div class="space-y-2">
        <div
          v-for="(pub, index) in resumeData.publications"
          :key="index"
          class="break-inside-avoid"
        >
          <div class="flex justify-between items-baseline gap-3 text-xs">
            <div>
              <a
                v-if="pub.url"
                :href="sanitizeUrl(pub.url)"
                class="font-bold hover:underline"
                :style="{ color: accentColor }"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ pub.name }}
              </a>
              <span v-else class="font-bold text-slate-900">{{ pub.name }}</span>
              <span v-if="pub.publisher" class="text-slate-600"> · {{ pub.publisher }}</span>
            </div>
            <span
              v-if="pub.releaseDate"
              class="font-tech-mono text-[11px] text-slate-500 whitespace-nowrap tabular-nums"
            >
              {{ formatDate(pub.releaseDate) }}
            </span>
          </div>
          <p v-if="pub.summary" class="text-xs text-slate-600 mt-0.5 leading-snug">
            {{ pub.summary }}
          </p>
        </div>
      </div>
    </section>

    <!-- Languages & Interests -->
    <section v-if="resumeData.languages?.length" class="section-block">
      <h2 class="tech-heading">Languages</h2>
      <div class="flex flex-wrap gap-x-5 gap-y-1 text-xs">
        <div v-for="(lang, index) in resumeData.languages" :key="index">
          <span class="font-bold text-slate-900">{{ lang.language }}</span>
          <span v-if="lang.fluency" class="text-slate-600"> ({{ lang.fluency }})</span>
        </div>
      </div>
    </section>

    <section v-if="resumeData.interests?.length" class="section-block">
      <h2 class="tech-heading">Interests</h2>
      <div class="space-y-1 text-xs">
        <div v-for="(interest, index) in resumeData.interests" :key="index">
          <span class="font-bold text-slate-900">{{ interest.name }}</span>
          <span v-if="interest.keywords?.length" class="text-slate-600">
            · {{ interest.keywords.join(", ") }}
          </span>
        </div>
      </div>
    </section>

    <!-- References -->
    <section v-if="resumeData.references?.length" class="section-block">
      <h2 class="tech-heading">References</h2>
      <div class="space-y-1.5 text-xs">
        <div v-for="(ref, index) in resumeData.references" :key="index" class="break-inside-avoid">
          <div class="font-bold text-slate-900">{{ ref.name }}</div>
          <p v-if="ref.reference" class="text-slate-600">{{ ref.reference }}</p>
        </div>
      </div>
    </section>

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
          class="font-tech-mono text-[11px] font-medium text-slate-600 mt-1 border-t border-slate-300 pt-1 px-4"
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
  if (formattedLocation.value) {
    items.push({ key: "location", label: formattedLocation.value });
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

.font-tech-mono {
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}

.density-compact {
  line-height: 1.35;
}
.density-compact .section-block {
  margin-bottom: 0.85rem;
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
  margin-bottom: 1.65rem;
}

.tech-heading {
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--resume-accent);
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.25rem;
  margin-bottom: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.tech-heading::before {
  content: "//";
  opacity: 0.55;
}

.tech-chip {
  background-color: #f1f5f9;
  background-color: color-mix(in srgb, var(--resume-accent) 7%, transparent);
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
  content: "›";
  position: absolute;
  left: 0.1rem;
  color: var(--resume-accent);
  font-weight: 700;
}
</style>
