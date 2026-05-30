<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Menu,
  X,
  Upload,
  FileText,
  PenTool,
  Sun,
  Moon,
  Info,
  Settings,
  Github,
} from "lucide-vue-next";
import { useDark } from "@vueuse/core";
import { cn } from "../utils/cn";
import { Button } from "./ui/index";
import { Analytics } from "../utils/analytics";
import SettingsModal from "./SettingsModal.vue";

const route = useRoute();
const router = useRouter();
const isSettingsOpen = ref(false);

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
            class="size-8 rounded-sm bg-primary flex items-center justify-center"
          >
            <FileText class="size-5 text-primary-foreground" />
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-bold tracking-tight font-outfit"
              >Resume Lab</span
            >
          </div>
        </div>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <Button
            v-for="item in navItems"
            :key="item.id"
            variant="ghost"
            @click="handleNavClick(item.path, item.id)"
            :disabled="item.id === 'preview' && !isResumeLoaded"
            :class="
              cn(
                'rounded-full',
                activeTab === item.id &&
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                item.id === 'preview' &&
                  !isResumeLoaded &&
                  'opacity-50 cursor-not-allowed grayscale',
              )
            "
          >
            <component :is="item.icon" data-icon="inline-start" />
            {{ item.label }}
          </Button>
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
            <Sun v-if="isDark" class="size-5 text-foreground" />
            <Moon v-else class="size-5 text-foreground" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            @click="isSettingsOpen = true"
            class="rounded-lg"
            aria-label="API Key Settings"
          >
            <Settings class="size-5 text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            as="a"
            href="https://github.com/deanufriana/resume-lab"
            target="_blank"
            class="hidden sm:flex"
            @click="
              Analytics.trackExternalLink(
                'https://github.com/deanufriana/resume-lab',
                'GitHub',
              )
            "
          >
            <Github class="size-5" />
          </Button>

          <!-- Mobile Toggle -->
          <Button
            variant="ghost"
            size="icon"
            @click="isMenuOpen = !isMenuOpen"
            class="md:hidden"
            aria-label="Toggle menu"
          >
            <Menu v-if="!isMenuOpen" class="size-6" />
            <X v-else class="size-6" />
          </Button>
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
        class="md:hidden border-t bg-background px-4 py-4 flex flex-col gap-2"
      >
        <Button
          v-for="item in navItems"
          :key="item.id"
          variant="ghost"
          @click="handleNavClick(item.path, item.id)"
          :disabled="item.id === 'preview' && !isResumeLoaded"
          :class="
            cn(
              'w-full justify-start rounded-xl',
              activeTab === item.id
                ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                : 'text-muted-foreground',
              item.id === 'preview' &&
                !isResumeLoaded &&
                'opacity-50 cursor-not-allowed',
            )
          "
        >
          <component :is="item.icon" data-icon="inline-start" />
          {{ item.label }}
        </Button>
      </div>
    </transition>

    <!-- API Key Settings Modal -->
    <SettingsModal v-model:open="isSettingsOpen" />
  </header>
</template>

<style scoped>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
