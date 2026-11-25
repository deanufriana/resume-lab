<template>
  <div
    class="resume-content relative bg-white text-gray-900"
    :class="densityClass"
    :style="{ fontFamily: resolvedFontFamily, '--resume-accent': accentColor }"
  >
    <!-- Classic Centered Harvard Header -->
    <header class="text-center pb-2.5 mb-3 border-b" :style="{ borderColor: accentColor }">
      <h1 class="text-2xl font-bold uppercase tracking-wide text-gray-950 leading-tight">
        {{ resumeData.basics?.name || "Your Name" }}
      </h1>
      <p v-if="resumeData.basics?.label" class="text-xs font-medium text-gray-700 mt-0.5">
        {{ resumeData.basics.label }}
      </p>

      <div
        v-if="contactItems.length"
        class="mt-1.5 flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5 text-[11px] text-gray-700"
      >
        <template v-for="(item, index) in contactItems" :key="item.key">
          <span v-if="index > 0" class="text-gray-400 select-none" aria-hidden="true">|</span>
          <a
            v-if="item.href"
            :href="item.href"
            class="hover:underline"
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
      <h2 class="harvard-heading">Summary</h2>
      <p class="text-gray-800 leading-snug">{{ resumeData.basics.summary }}</p>
    </section>

    <!-- Education (Harvard places Education or Experience cleanly; keep standard flow) -->
    <section v-if="resumeData.work?.length" class="section-block">
      <h2 class="harvard-heading">Experience</h2>
      <div class="space-y-2.5">
        <div v-for="(work, index) in resumeData.work" :key="index" class="break-inside-avoid">
          <div class="flex justify-between items-baseline gap-4">
            <div class="font-bold text-gray-950">
              <a
                v-if="work.url"
                :href="sanitizeUrl(work.url)"
                class="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ work.name }}
              </a>
              <span v-else>{{ work.name }}</span>
            </div>
            <div
              v-if="formatDateRange(work.startDate, work.endDate)"
              class="text-[11px] text-gray-700 whitespace-nowrap tabular-nums"
            >
              {{ formatDateRange(work.startDate, work.endDate) }}
            </div>
          </div>
          <div class="flex justify-between items-baseline gap-4">
            <div class="italic text-gray-800">{{ work.position }}</div>
            <div v-if="work.url" class="text-[10px] text-gray-500">
              {{ displayUrl(work.url) }}
            </div>
          </div>
          <p v-if="work.summary" class="text-gray-700 mt-0.5 leading-snug">
            {{ work.summary }}
          </p>
          <ul v-if="work.highlights?.length" class="resume-list text-gray-800 mt-0.5 space-y-0.5">
            <li v-for="(highlight, hIndex) in work.highlights" :key="hIndex">
              {{ highlight }}
            </li>
          </ul>
          <p v-if="work.skills?.length" class="mt-0.5 text-[11px] text-gray-700">
            <span class="font-semibold">Technologies:</span> {{ work.skills.join(", ") }}
          </p>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section v-if="resumeData.education?.length" class="section-block">
      <h2 class="harvard-heading">Education</h2>
      <div class="space-y-2">
        <div v-for="(edu, index) in resumeData.education" :key="index" class="break-inside-avoid">
          <div class="flex justify-between items-baseline gap-4">
            <div class="font-bold text-gray-950">
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
              v-if="formatDateRange(edu.startDate, edu.endDate)"
              class="text-[11px] text-gray-700 whitespace-nowrap tabular-nums"
            >
              {{ formatDateRange(edu.startDate, edu.endDate) }}
            </div>
          </div>
          <div class="flex justify-between items-baseline gap-4">
            <div class="italic text-gray-800">
              {{ [edu.studyType, edu.area].filter(Boolean).join(" in ") }}
            </div>
            <div v-if="edu.score" class="text-[11px] text-gray-700 tabular-nums">
              GPA: {{ edu.score }}
            </div>
          </div>
          <p v-if="edu.courses?.length" class="text-[11px] text-gray-700 mt-0.5">
            <span class="font-semibold">Relevant Coursework:</span> {{ edu.courses.join(", ") }}
          </p>
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section v-if="resumeData.projects?.length" class="section-block">
      <h2 class="harvard-heading">Projects</h2>
      <div class="space-y-2">
        <div
          v-for="(project, index) in resumeData.projects"
          :key="index"
          class="break-inside-avoid"
        >
          <div class="flex justify-between items-baseline gap-4">
            <div>
              <span class="font-bold text-gray-950">{{ project.name }}</span>
              <span v-if="project.url" class="text-[11px] text-gray-600 ml-1">
                (<a
                  :href="sanitizeUrl(project.url)"
                  class="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ displayUrl(project.url) }}</a
                >)
              </span>
            </div>
            <div
              v-if="formatDateRange(project.startDate, project.endDate)"
              class="text-[11px] text-gray-700 whitespace-nowrap tabular-nums"
            >
              {{ formatDateRange(project.startDate, project.endDate) }}
            </div>
          </div>
          <p v-if="project.description" class="text-gray-700 mt-0.5 leading-snug">
            {{ project.description }}
          </p>
          <ul
            v-if="project.highlights?.length"
            class="resume-list text-gray-800 mt-0.5 space-y-0.5"
          >
            <li v-for="(highlight, hIndex) in project.highlights" :key="hIndex">
              {{ highlight }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section v-if="resumeData.skills?.length" class="section-block">
      <h2 class="harvard-heading">Skills</h2>
      <div class="space-y-0.5">
        <div v-for="(skill, index) in resumeData.skills" :key="index" class="break-inside-avoid">
          <span class="font-bold text-gray-950">{{ skill.name }}</span>
          <span v-if="skill.level" class="text-gray-600"> ({{ skill.level }})</span>
          <span v-if="skill.keywords?.length" class="text-gray-800">
            : {{ skill.keywords.join(", ") }}
          </span>
        </div>
      </div>
    </section>

    <!-- Certificates -->
    <section v-if="resumeData.certificates?.length" class="section-block">
      <h2 class="harvard-heading">Certifications</h2>
      <div class="space-y-0.5">
        <div
          v-for="(cert, index) in resumeData.certificates"
          :key="index"
          class="flex justify-between items-baseline gap-4 break-inside-avoid"
        >
          <div>
            <a
              v-if="cert.url"
              :href="sanitizeUrl(cert.url)"
              class="font-bold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ cert.name }}
            </a>
            <span v-else class="font-bold text-gray-950">{{ cert.name }}</span>
            <span v-if="cert.issuer" class="text-gray-700"> — {{ cert.issuer }}</span>
          </div>
          <span v-if="cert.date" class="text-[11px] text-gray-700 whitespace-nowrap tabular-nums">
            {{ formatDate(cert.date) }}
          </span>
        </div>
      </div>
    </section>

    <!-- Volunteer -->
    <section v-if="resumeData.volunteer?.length" class="section-block">
      <h2 class="harvard-heading">Leadership &amp; Volunteer</h2>
      <div class="space-y-2">
        <div v-for="(vol, index) in resumeData.volunteer" :key="index" class="break-inside-avoid">
          <div class="flex justify-between items-baseline gap-4">
            <div class="font-bold text-gray-950">
              <a
                v-if="vol.url"
                :href="sanitizeUrl(vol.url)"
                class="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ vol.organization }}
              </a>
              <span v-else>{{ vol.organization }}</span>
            </div>
            <div
              v-if="formatDateRange(vol.startDate, vol.endDate)"
              class="text-[11px] text-gray-700 whitespace-nowrap tabular-nums"
            >
              {{ formatDateRange(vol.startDate, vol.endDate) }}
            </div>
          </div>
          <div v-if="vol.position" class="italic text-gray-800">{{ vol.position }}</div>
          <p v-if="vol.summary" class="text-gray-700 mt-0.5 leading-snug">{{ vol.summary }}</p>
          <ul v-if="vol.highlights?.length" class="resume-list text-gray-800 mt-0.5 space-y-0.5">
            <li v-for="(highlight, hIndex) in vol.highlights" :key="hIndex">
              {{ highlight }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Awards -->
    <section v-if="resumeData.awards?.length" class="section-block">
      <h2 class="harvard-heading">Honors &amp; Awards</h2>
      <div class="space-y-1">
        <div v-for="(award, index) in resumeData.awards" :key="index" class="break-inside-avoid">
          <div class="flex justify-between items-baseline gap-4">
            <div>
              <span class="font-bold text-gray-950">{{ award.title }}</span>
              <span v-if="award.awarder" class="text-gray-700"> — {{ award.awarder }}</span>
            </div>
            <span
              v-if="award.date"
              class="text-[11px] text-gray-700 whitespace-nowrap tabular-nums"
            >
              {{ formatDate(award.date) }}
            </span>
          </div>
          <p v-if="award.summary" class="text-gray-700 leading-snug">{{ award.summary }}</p>
        </div>
      </div>
    </section>

    <!-- Publications -->
    <section v-if="resumeData.publications?.length" class="section-block">
      <h2 class="harvard-heading">Publications</h2>
      <div class="space-y-1.5">
        <div
          v-for="(pub, index) in resumeData.publications"
          :key="index"
          class="break-inside-avoid"
        >
          <div class="flex justify-between items-baseline gap-4">
            <div>
              <a
                v-if="pub.url"
                :href="sanitizeUrl(pub.url)"
                class="font-bold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ pub.name }}
              </a>
              <span v-else class="font-bold text-gray-950">{{ pub.name }}</span>
              <span v-if="pub.publisher" class="text-gray-700"> — {{ pub.publisher }}</span>
            </div>
            <span
              v-if="pub.releaseDate"
              class="text-[11px] text-gray-700 whitespace-nowrap tabular-nums"
            >
              {{ formatDate(pub.releaseDate) }}
            </span>
          </div>
          <p v-if="pub.summary" class="text-gray-700 leading-snug">{{ pub.summary }}</p>
        </div>
      </div>
    </section>

    <!-- Languages & Interests -->
    <section
      v-if="resumeData.languages?.length || resumeData.interests?.length"
      class="section-block"
    >
      <h2 class="harvard-heading">Additional</h2>
      <div class="space-y-0.5 text-gray-800">
        <div v-if="resumeData.languages?.length">
          <span class="font-bold text-gray-950">Languages:</span>
          {{
            resumeData.languages
              .map((l) => (l.fluency ? `${l.language} (${l.fluency})` : l.language))
              .filter(Boolean)
              .join(", ")
          }}
        </div>
        <div v-for="(interest, index) in resumeData.interests" :key="index">
          <span class="font-bold text-gray-950">{{ interest.name }}</span>
          <span v-if="interest.keywords?.length">: {{ interest.keywords.join(", ") }}</span>
        </div>
      </div>
    </section>

    <!-- References -->
    <section v-if="resumeData.references?.length" class="section-block">
      <h2 class="harvard-heading">References</h2>
      <div class="space-y-1">
        <div v-for="(ref, index) in resumeData.references" :key="index" class="break-inside-avoid">
          <span class="font-bold text-gray-950">{{ ref.name }}</span>
          <span v-if="ref.reference" class="text-gray-700"> — {{ ref.reference }}</span>
        </div>
      </div>
    </section>

    <!-- Optional Signature Footer -->
    <footer
      v-if="resumeData.meta?.showSignature && resumeData.meta?.signatureDataUrl"
      class="mt-6 pt-3 border-t border-gray-300 flex justify-end break-inside-avoid"
    >
      <div class="text-center">
        <img
          :src="resumeData.meta.signatureDataUrl"
          alt="Signature"
          class="h-11 object-contain mx-auto"
        />
        <div class="text-[11px] text-gray-700 mt-1 border-t border-gray-400 pt-1 px-4">
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

const accentColor = computed(() => props.resumeData.meta?.accentColor || "#111827");

const resolvedFontFamily = computed(() => {
  const f = props.resumeData.meta?.fontFamily;
  if (f === "sans") return '"Inter", system-ui, sans-serif';
  if (f === "mono") return '"JetBrains Mono", monospace';
  return '"Georgia", "Cambria", "Times New Roman", serif';
});

const densityClass = computed(() => {
  const d = props.resumeData.meta?.density || "standard";
  if (d === "compact") return "density-compact text-[12px]";
  if (d === "spacious") return "density-spacious text-[14px]";
  return "density-standard text-[13px]";
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
  const items: Array<{ key: string; label: string; href?: string }> = [];

  if (formattedLocation.value) {
    items.push({ key: "location", label: formattedLocation.value });
  }
  if (basics?.phone) {
    items.push({ key: "phone", label: basics.phone, href: `tel:${basics.phone}` });
  }
  if (basics?.email) {
    items.push({ key: "email", label: basics.email, href: `mailto:${basics.email}` });
  }
  if (basics?.url) {
    items.push({
      key: "url",
      label: displayUrl(basics.url),
      href: sanitizeUrl(basics.url),
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
      });
    });
  }

  return items;
});
</script>

<style scoped>
.density-compact {
  line-height: 1.3;
}
.density-compact .section-block {
  margin-bottom: 0.7rem;
}

.density-standard {
  line-height: 1.4;
}
.density-standard .section-block {
  margin-bottom: 0.95rem;
}

.density-spacious {
  line-height: 1.55;
}
.density-spacious .section-block {
  margin-bottom: 1.25rem;
}

.harvard-heading {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--resume-accent, #111827);
  border-bottom: 1px solid var(--resume-accent, #111827);
  padding-bottom: 0.15rem;
  margin-bottom: 0.45rem;
}

.resume-content :deep(a),
.resume-content a {
  color: inherit;
}

.resume-list {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}

.resume-list li {
  position: relative;
  padding-left: 1rem;
  line-height: 1.35;
}

.resume-list li::before {
  content: "•";
  position: absolute;
  left: 0.25rem;
  color: var(--resume-accent, #111827);
  font-weight: bold;
}
</style>
