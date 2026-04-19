<script setup lang="ts">
import { FileText, Github, Linkedin, ExternalLink, Heart } from "lucide-vue-next";
import { Analytics } from "../utils/analytics";

const currentYear = new Date().getFullYear();

const otherApps = [
  {
    name: "Mortgage Loan (Simulasi KPR)",
    url: "https://deanufriana.github.io/simulasi-kpr/",
    description: "Modern mortgage calculator with fixed and floating rates."
  },
  {
    name: "Sistem Skripsi",
    url: "https://github.com/deanufriana/sistem_skripsi",
    description: "Online thesis management system."
  }
];

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/deanufriana",
    icon: Github
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/deanufriana",
    icon: Linkedin
  }
];
</script>

<template>
  <footer class="border-t bg-card/30 backdrop-blur-md py-12 mt-20 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 blur-3xl rounded-full pointer-events-none"></div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <!-- Brand & Summary -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 group cursor-default">
            <div class="w-8 h-8 rounded bg-primary flex items-center justify-center transition-transform group-hover:rotate-12">
              <FileText class="w-5 h-5 text-primary-foreground" />
            </div>
            <span class="font-bold text-xl font-outfit tracking-tight">Resume Lab</span>
          </div>
          <p class="text-muted-foreground text-sm leading-relaxed max-w-xs font-outfit">
            Crafting premium, ATS-optimized resumes with a modern touch. Built to help engineers land their dream roles.
          </p>
          <div class="flex items-center gap-4 pt-2">
            <a 
              v-for="social in socialLinks" 
              :key="social.name"
              :href="social.url"
              target="_blank"
              class="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
              @click="Analytics.trackExternalLink(social.url, social.name)"
              :aria-label="social.name"
            >
              <component :is="social.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Other Apps -->
        <div class="space-y-4">
          <h3 class="font-bold text-sm uppercase tracking-wider text-foreground font-outfit">My Other Apps</h3>
          <ul class="space-y-3">
            <li v-for="app in otherApps" :key="app.name">
              <a 
                :href="app.url" 
                target="_blank"
                class="group flex flex-col gap-0.5"
                @click="Analytics.trackExternalLink(app.url, app.name)"
              >
                <div class="flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  {{ app.name }}
                  <ExternalLink class="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
                </div>
                <span class="text-xs text-muted-foreground truncate max-w-[250px]">{{ app.description }}</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Quick Info -->
        <div class="space-y-4">
          <h3 class="font-bold text-sm uppercase tracking-wider text-foreground font-outfit">Built With</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="tech in ['Vue 3', 'TypeScript', 'Tailwind', 'Shadcn']" :key="tech"
              class="px-2.5 py-1 rounded-md bg-accent/50 text-[10px] font-semibold text-muted-foreground border border-border/50 uppercase tracking-tight"
            >
              {{ tech }}
            </span>
          </div>
          <div class="pt-4 flex flex-col gap-2">
            <p class="text-xs text-muted-foreground">
              Need a custom solution or collaboration?
            </p>
            <a href="mailto:devi.nufriana@gmail.com" class="text-sm font-semibold text-primary hover:underline font-outfit">
              Get in touch →
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright Area -->
      <div class="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <div class="flex items-center gap-1 select-none">
          <span>&copy; {{ currentYear }} Resume Lab. Created with</span>
          <Heart class="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
          <span>by</span>
          <a 
            href="https://github.com/deanufriana" 
            target="_blank" 
            class="font-bold text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            deanufriana
          </a>
        </div>
        <div class="flex gap-6">
          <span class="font-medium">Version 2.0.0</span>
          <span class="hidden sm:inline">|</span>
          <span class="font-medium">Jakarta, Indonesia</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
