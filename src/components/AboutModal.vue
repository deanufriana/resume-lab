<script setup lang="ts">
import { X, FileText, ExternalLink, Github, Linkedin, Mail } from "lucide-vue-next";
import { Button } from "./ui";
import { Analytics } from "../utils/analytics";

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const appVersion = __APP_VERSION__;

const otherApps = [
  {
    name: "Mortgage Loan (Simulasi KPR)",
    url: "https://deanufriana.github.io/simulasi-kpr/",
    description: "Responsive mortgage calculator for fixed & floating rates.",
  },
  {
    name: "Sistem Skripsi",
    url: "https://github.com/deanufriana/sistem_skripsi",
    description: "Online thesis organization platform for students & advisors.",
  },
];
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4 no-print"
      @click.self="emit('close')"
    >
      <div
        class="w-full max-w-lg max-h-[90dvh] bg-white dark:bg-zinc-950 text-foreground border rounded-t-xl sm:rounded-md shadow-lg overflow-hidden flex flex-col"
      >
        <div
          class="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b flex-shrink-0"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <FileText class="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 class="text-sm font-semibold">About Resume Lab</h2>
              <p class="text-xs text-muted-foreground">
                Version {{ appVersion }} · JSON-first ATS Resume Studio
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" class="h-8 w-8" @click="emit('close')">
            <X class="w-4 h-4" />
          </Button>
        </div>

        <div class="p-4 sm:p-5 space-y-4 sm:space-y-5 text-sm overflow-y-auto flex-1">
          <p class="text-muted-foreground text-xs leading-relaxed">
            Built to craft clean, ATS-friendly resumes from structured JSON Resume data—stored
            locally in your browser with zero tracking of your personal details.
          </p>

          <div class="space-y-2">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Other Projects by deanufriana
            </h3>
            <div class="space-y-2">
              <a
                v-for="app in otherApps"
                :key="app.name"
                :href="app.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                @click="Analytics.trackExternalLink(app.url, app.name)"
              >
                <div>
                  <div class="text-xs font-semibold">{{ app.name }}</div>
                  <div class="text-[11px] text-muted-foreground">{{ app.description }}</div>
                </div>
                <ExternalLink class="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </a>
            </div>
          </div>

          <div
            class="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground"
          >
            <div class="flex items-center gap-2">
              <a
                href="https://github.com/deanufriana/resume-lab"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Github class="w-3.5 h-3.5" /> GitHub
              </a>
              <span>·</span>
              <a
                href="https://www.linkedin.com/in/deanufriana"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Linkedin class="w-3.5 h-3.5" /> LinkedIn
              </a>
              <span>·</span>
              <a
                href="mailto:devi.nufriana@gmail.com"
                class="inline-flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Mail class="w-3.5 h-3.5" /> Contact
              </a>
            </div>
            <span>Jakarta, ID</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
