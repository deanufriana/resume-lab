<script setup lang="ts">
import {
  FileText,
  PenTool,
  Sun,
  Moon,
  Info,
  FileCode2,
  Printer,
  Download,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-vue-next";
import { useDark } from "@vueuse/core";
import { Button } from "./ui/index";
import { Analytics } from "../utils/analytics";

defineProps<{
  saveStatus: "saved" | "saving" | "idle";
  hasContent: boolean;
}>();

const emit = defineEmits<{
  (e: "open-json"): void;
  (e: "open-signature"): void;
  (e: "open-about"): void;
  (e: "load-sample"): void;
  (e: "export-pdf"): void;
}>();

const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "",
});

const toggleDark = (event: MouseEvent) => {
  const nextDark = !isDark.value;
  Analytics.trackDarkModeToggle(nextDark);

  const supportsViewTransition =
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!supportsViewTransition) {
    isDark.value = nextDark;
    return;
  }

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => {
    isDark.value = nextDark;
  });

  void transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
      },
      {
        duration: 420,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
};
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 no-print"
  >
    <div class="h-full px-4 flex items-center justify-between gap-3">
      <!-- Brand + Save Status -->
      <div class="flex items-center gap-3 min-w-0">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <FileText class="w-4 h-4 text-primary-foreground" />
          </div>
          <span class="text-base font-bold tracking-tight font-outfit">Resume Lab</span>
        </div>

        <span
          v-if="saveStatus === 'saving'"
          class="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground"
        >
          <Loader2 class="w-3 h-3 animate-spin" /> Saving
        </span>
        <span
          v-else-if="saveStatus === 'saved'"
          class="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground"
        >
          <CheckCircle2 class="w-3 h-3" /> Saved
        </span>
      </div>

      <!-- Studio Actions -->
      <div class="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="ghost"
          size="sm"
          class="h-8 text-xs gap-1.5 hidden md:inline-flex"
          @click="emit('load-sample')"
        >
          <Sparkles class="w-3.5 h-3.5" /> Sample
        </Button>

        <Button variant="outline" size="sm" class="h-8 text-xs gap-1.5" @click="emit('open-json')">
          <FileCode2 class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">JSON</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          class="h-8 text-xs gap-1.5"
          @click="emit('open-signature')"
        >
          <PenTool class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Signature</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8"
          @click="emit('open-about')"
          aria-label="About Resume Lab"
        >
          <Info class="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8"
          @click="toggleDark($event)"
          aria-label="Toggle theme"
        >
          <Transition
            mode="out-in"
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -rotate-90 scale-75"
            enter-to-class="opacity-100 rotate-0 scale-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 rotate-0 scale-100"
            leave-to-class="opacity-0 rotate-90 scale-75"
          >
            <Sun v-if="isDark" class="w-4 h-4 text-amber-400" />
            <Moon v-else class="w-4 h-4" />
          </Transition>
        </Button>

        <div class="h-4 w-px bg-border mx-0.5 hidden sm:block"></div>

        <Button
          size="sm"
          class="h-8 text-xs gap-1.5"
          :disabled="!hasContent"
          @click="emit('export-pdf')"
        >
          <Download class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Download PDF</span>
          <span class="sm:hidden">PDF</span>
        </Button>
      </div>
    </div>
  </header>
</template>
