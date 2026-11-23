<script setup lang="ts">
import { ref, watch } from "vue";
import { X, Copy, Check, Download, Upload, AlertCircle, FileCode2 } from "lucide-vue-next";
import type { Resume } from "../types/resume";
import { Button } from "./ui";
import { useToast } from "../composables/useToast";

const props = defineProps<{
  open: boolean;
  resumeData: Resume;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "apply-json", data: Resume): void;
  (e: "download-json"): void;
}>();

const toast = useToast();
const jsonText = ref("");
const parseError = ref<string | null>(null);
const copied = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

watch(
  () => [props.open, props.resumeData],
  ([isOpen]) => {
    if (isOpen) {
      jsonText.value = JSON.stringify(props.resumeData, null, 2);
      parseError.value = null;
    }
  },
  { immediate: true, deep: true },
);

function handleApply() {
  try {
    const parsed = JSON.parse(jsonText.value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Root JSON value must be an object.");
    }
    parseError.value = null;
    emit("apply-json", parsed as Resume);
    toast.success("JSON applied to resume!");
  } catch (err) {
    parseError.value = err instanceof Error ? err.message : "Invalid JSON";
  }
}

async function copyJson() {
  try {
    await navigator.clipboard.writeText(jsonText.value);
    copied.value = true;
    toast.success("Copied JSON to clipboard");
    setTimeout(() => {
      copied.value = false;
    }, 1800);
  } catch {
    toast.error("Failed to copy JSON");
  }
}

function handleFileUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const content = String(ev.target?.result || "");
      const parsed = JSON.parse(content);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Invalid resume JSON format");
      }
      jsonText.value = JSON.stringify(parsed, null, 2);
      parseError.value = null;
      emit("apply-json", parsed as Resume);
      toast.success("JSON file imported!");
    } catch (err) {
      parseError.value = err instanceof Error ? err.message : "Invalid JSON file";
      toast.error("Failed to parse JSON file");
    }
  };
  reader.readAsText(file);
  if (fileInput.value) fileInput.value.value = "";
}
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end no-print"
        @click.self="emit('close')"
      >
        <div
          class="w-full max-w-xl bg-white dark:bg-zinc-950 text-foreground border-l h-full flex flex-col shadow-xl"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                <FileCode2 class="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h2 class="text-sm font-semibold">JSON Resume Schema</h2>
                <p class="text-xs text-muted-foreground">Inspect, paste, or import raw JSON</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" class="h-8 w-8" @click="emit('close')">
              <X class="w-4 h-4" />
            </Button>
          </div>

          <!-- Toolbar -->
          <div
            class="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 border-b bg-muted/30"
          >
            <div class="flex items-center gap-2">
              <input
                ref="fileInput"
                type="file"
                accept=".json,application/json"
                class="hidden"
                @change="handleFileUpload"
              />
              <Button
                variant="outline"
                size="sm"
                class="h-7 text-xs gap-1.5"
                @click="fileInput?.click()"
              >
                <Upload class="w-3.5 h-3.5" /> Import .json
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="h-7 text-xs gap-1.5"
                @click="emit('download-json')"
              >
                <Download class="w-3.5 h-3.5" /> Download
              </Button>
            </div>
            <Button variant="ghost" size="sm" class="h-7 text-xs gap-1.5" @click="copyJson">
              <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-500" />
              <Copy v-else class="w-3.5 h-3.5" />
              {{ copied ? "Copied" : "Copy" }}
            </Button>
          </div>

          <!-- Editor -->
          <div class="flex-1 p-4 overflow-hidden flex flex-col gap-2">
            <div
              v-if="parseError"
              class="flex items-center gap-2 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs"
            >
              <AlertCircle class="w-4 h-4 flex-shrink-0" />
              <span>{{ parseError }}</span>
            </div>
            <textarea
              v-model="jsonText"
              spellcheck="false"
              class="flex-1 w-full rounded-lg border bg-muted/20 p-3 font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-ring resize-none custom-scrollbar"
            />
          </div>

          <!-- Footer -->
          <div class="px-5 py-3.5 border-t flex items-center justify-end gap-2 bg-muted/20">
            <Button variant="outline" size="sm" @click="emit('close')">Cancel</Button>
            <Button size="sm" @click="handleApply">Apply JSON Changes</Button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
