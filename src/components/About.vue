<script setup lang="ts">
import {
  FileText,
  Mail,
  Sparkles,
  Rocket,
  ExternalLink,
  Laptop,
  CheckCircle2,
} from "lucide-vue-next";
import { Card, CardContent, Button } from "./ui/index";
import { Analytics } from "../utils/analytics";
import resumeData from "../data/resume.json";

const otherApps = [
  {
    name: "Mortgage Loan (Simulasi KPR)",
    url: "https://deanufriana.github.io/simulasi-kpr/",
    description:
      "A modern, responsive Mortgage Calculator built with React and Vite. Helps users estimate monthly payments for fixed and floating interest rates.",
    tags: ["React", "Vite", "Tailwind"],
    icon: Laptop,
  },
  {
    name: "Sistem Skripsi",
    url: "https://github.com/deanufriana/sistem_skripsi",
    description:
      "An online platform to organize and streamline the thesis process, making it accessible from anywhere and saving time for students and advisors.",
    tags: ["PHP", "MySQL", "Web"],
    icon: FileText,
  },
];
</script>

<template>
  <div
    class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700"
  >
    <!-- Hero / Vision Section -->
    <section class="max-w-4xl mx-auto text-center space-y-6">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2"
      >
        <Sparkles class="w-3.5 h-3.5" />
        The Vision
      </div>
      <h1
        class="text-4xl md:text-5xl font-black font-outfit tracking-tight text-foreground"
      >
        Crafting Resumes with
        <span
          class="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent"
          >Purpose & Precision</span
        >
      </h1>
      <p class="text-lg text-muted-foreground leading-relaxed font-outfit">
        {{ resumeData.basics.summary }}
      </p>
    </section>

    <!-- Projects Section -->
    <section class="max-w-4xl mx-auto space-y-8">
      <div class="space-y-2 text-center md:text-left">
        <div
          class="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest"
        >
          <Rocket class="w-4 h-4" /> Portfolio
        </div>
        <h2 class="text-3xl font-bold font-outfit">My Other Apps</h2>
        <p class="text-muted-foreground">
          Check out some of my other projects and tools.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6">
        <Card
          v-for="app in otherApps"
          :key="app.name"
          class="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border-2 hover:border-primary/30 bg-card/50 backdrop-blur-sm"
        >
          <div class="flex flex-col md:flex-row">
            <div
              class="md:w-1/3 bg-primary/5 flex items-center justify-center p-8 group-hover:bg-primary/10 transition-colors border-r"
            >
              <component
                :is="app.icon"
                class="w-12 h-12 text-primary/40 group-hover:text-primary transition-colors group-hover:scale-110 duration-500"
              />
            </div>
            <div class="md:w-2/3 p-6 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-xl font-bold font-outfit">
                    {{ app.name }}
                  </h3>
                  <a
                    :href="app.url"
                    target="_blank"
                    class="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    @click="Analytics.trackExternalLink(app.url, app.name)"
                  >
                    <ExternalLink class="w-5 h-5" />
                  </a>
                </div>
                <p class="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {{ app.description }}
                </p>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in app.tags"
                  :key="tag"
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Contact CTA -->
      <Card class="bg-primary text-primary-foreground border-none">
        <CardContent
          class="p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div class="space-y-2 text-center md:text-left">
            <h3 class="text-2xl font-bold font-outfit">
              Interested in Collaboration?
            </h3>
            <p class="text-primary-foreground/80">
              I'm always open to discussing new projects and creative ideas.
            </p>
          </div>
          <Button
            as="a"
            href="mailto:devi.nufriana@gmail.com"
            size="lg"
            class="rounded-full shadow-lg font-bold"
          >
            <Mail class="w-5 h-5" /> Say Hello
          </Button>
        </CardContent>
      </Card>
    </section>

    <!-- Why Resume Lab? -->
    <section class="max-w-4xl mx-auto space-y-8 pt-12">
      <div class="text-center space-y-2">
        <h2 class="text-3xl font-bold font-outfit">Why I built Resume Lab</h2>
        <p class="text-muted-foreground">
          The story behind the ultimate developer resume toolkit.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 rounded-2xl bg-accent/30 border space-y-4">
          <div
            class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"
          >
            <CheckCircle2 class="w-6 h-6 text-primary" />
          </div>
          <h4 class="font-bold text-lg font-outfit">ATS Optimization</h4>
          <p class="text-sm text-muted-foreground">
            I noticed many beautiful resumes failed automated screens. Resume
            Lab ensures the content is machine-readable without sacrificing
            aesthetics.
          </p>
        </div>
        <div class="p-6 rounded-2xl bg-accent/30 border space-y-4">
          <div
            class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"
          >
            <FileText class="w-6 h-6 text-primary" />
          </div>
          <h4 class="font-bold text-lg font-outfit">JSON First</h4>
          <p class="text-sm text-muted-foreground">
            As developers, we love data. Treating your resume as code allows for
            version control, easy updates, and multiple themes from a single
            source of truth.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
