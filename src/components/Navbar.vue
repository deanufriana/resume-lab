<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Menu, X, Upload, FileText, Eye, PenTool, Sun, Moon, Info } from "lucide-vue-next";
import { useDark } from "@vueuse/core";
import { cn } from "../utils/cn";
import { Button } from "./ui/index";
import { Analytics } from "../utils/analytics";

const route = useRoute();
const router = useRouter();

const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "",
});
const toggleDark = () => {
  isDark.value = !isDark.value;
  Analytics.trackDarkModeToggle(isDark.value);
};

interface Props {
  isResumeLoaded: boolean;
}

const props = defineProps<Props>();

const isMenuOpen = ref(false);

const activeTab = computed(() => {
  const path = route.path.replace("/", "");
  return path || "upload";
});

const navItems = [
  { id: "upload", path: "/upload", label: "Upload JSON", icon: Upload },
  { id: "manual", path: "/manual", label: "Manual Entry", icon: FileText },
  { id: "signature", path: "/signature", label: "Signature", icon: PenTool },
  { id: "about", path: "/about", label: "About", icon: Info },
];

function handleNavClick(path: string, id: string) {
  if (id === "preview" && !props.isResumeLoaded) return;
  router.push(path);
  isMenuOpen.value = false;
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-sm bg-primary flex items-center justify-center"
          >
            <FileText class="w-5 h-5 text-primary-foreground" />
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-bold tracking-tight font-outfit"
              >Resume Lab</span
            >
          </div>
        </div>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="handleNavClick(item.path, item.id)"
            :disabled="item.id === 'preview' && !isResumeLoaded"
            :class="
              cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                item.id === 'preview' &&
                  !isResumeLoaded &&
                  'opacity-50 cursor-not-allowed grayscale',
              )
            "
          >
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </button>
        </nav>

        <!-- GitHub/CTA etc -->
        <div class="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            @click="toggleDark()"
            class="rounded-lg"
            aria-label="Toggle theme"
          >
            <Sun v-if="isDark" class="w-5 h-5 text-yellow-500" />
            <Moon v-else class="w-5 h-5 text-slate-700" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            as="a"
            href="https://github.com/deanufriana/resume-lab"
            target="_blank"
            class="hidden sm:flex"
            @click="Analytics.trackExternalLink('https://github.com/deanufriana/resume-lab', 'GitHub')"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
          </Button>

          <!-- Mobile Toggle -->
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="md:hidden p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Menu v-if="!isMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="isMenuOpen"
        class="md:hidden border-t bg-background px-4 py-4 space-y-2"
      >
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="handleNavClick(item.path, item.id)"
          :disabled="item.id === 'preview' && !isResumeLoaded"
          :class="
            cn(
              'flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
              activeTab === item.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent text-muted-foreground',
              item.id === 'preview' &&
                !isResumeLoaded &&
                'opacity-50 cursor-not-allowed',
            )
          "
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.label }}
        </button>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
