<script setup lang="ts">
import { ref, watch } from "vue";
import {
  Eye,
  EyeOff,
  Trash2,
  Save,
  Key,
  ShieldAlert,
} from "lucide-vue-next";
import {
  Badge,
  Button,
  FieldGroup,
  Field,
  FieldLabel,
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/index";
import { useToast } from "../composables/useToast";
import {
  getApiKeys,
  saveApiKeys,
  clearApiKeys,
  type ApiKeys,
} from "../utils/keys";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const toast = useToast();

const keys = ref<ApiKeys>({
  openai: "",
  claude: "",
  deepseek: "",
});

// Input field visibility states
const showOpenAI = ref(false);
const showClaude = ref(false);
const showDeepSeek = ref(false);

// Load keys when the modal opens
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      keys.value = getApiKeys();
    }
  },
  { immediate: true },
);

function handleSave() {
  try {
    saveApiKeys(keys.value);
    toast.success("API keys saved successfully!");
    emit("update:open", false);
  } catch (error) {
    toast.error("Failed to save API keys");
  }
}

function handleClear() {
  if (confirm("Are you sure you want to delete all saved API keys?")) {
    clearApiKeys();
    keys.value = { openai: "", claude: "", deepseek: "" };
    toast.info("All API keys cleared from local storage");
  }
}
</script>

<template>
  <Dialog :open="props.open" @update:open="val => emit('update:open', val)">
    <DialogContent class="sm:max-w-lg bg-card border border-border/80 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden relative">
      <!-- Background Gradient Blobs -->
      <div
        class="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"
      ></div>
      <div
        class="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
      ></div>

      <!-- Modal Header -->
      <DialogHeader class="relative z-10 flex flex-col gap-1.5 mb-2 text-left">
        <div class="flex items-center gap-2.5">
          <div
            class="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
          >
            <Key class="size-5" />
          </div>
          <div>
            <DialogTitle class="text-xl font-bold font-outfit tracking-tight">
              API Settings
            </DialogTitle>
            <DialogDescription class="text-xs text-muted-foreground font-outfit mt-0.5">
              Configure your AI integration keys
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <!-- Local Storage Warning -->
      <div
        class="flex gap-3 p-4 rounded-xl bg-accent/50 border border-border text-muted-foreground text-sm leading-relaxed font-medium relative z-10"
      >
        <ShieldAlert class="size-5 shrink-0 mt-0.5 text-foreground" />
        <div class="flex flex-col gap-1">
          <p class="font-bold font-outfit text-foreground">Local Storage Only</p>
          <p class="text-xs text-muted-foreground/90 leading-normal">
            Your keys are saved directly inside your browser's local storage and are <strong>never sent to our servers</strong>. All requests will be made client-side.
          </p>
        </div>
      </div>

      <!-- Form fields using official shadcn-vue FieldGroup and Field -->
      <FieldGroup class="flex flex-col gap-5 relative z-10">
        <!-- OpenAI Key -->
        <Field>
          <div class="flex items-center justify-between">
            <FieldLabel for="openai-key" class="font-outfit font-semibold text-sm">
              OpenAI API Key
            </FieldLabel>
            <Badge variant="outline" class="uppercase text-[10px] tracking-wider">OpenAI</Badge>
          </div>
          <InputGroup>
            <InputGroupInput
              id="openai-key"
              v-model="keys.openai"
              :type="showOpenAI ? 'text' : 'password'"
              placeholder="sk-proj-..."
              class="border-input/60 focus-visible:ring-emerald-500/50"
            />
            <InputGroupAddon align="inline-end">
              <Button
                variant="ghost"
                size="icon"
                class="rounded-lg text-muted-foreground hover:text-foreground"
                @click="showOpenAI = !showOpenAI"
              >
                <EyeOff v-if="showOpenAI" />
                <Eye v-else />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <!-- Claude (Anthropic) Key -->
        <Field>
          <div class="flex items-center justify-between">
            <FieldLabel for="claude-key" class="font-outfit font-semibold text-sm">
              Claude API Key
            </FieldLabel>
            <Badge variant="outline" class="uppercase text-[10px] tracking-wider">Anthropic</Badge>
          </div>
          <InputGroup>
            <InputGroupInput
              id="claude-key"
              v-model="keys.claude"
              :type="showClaude ? 'text' : 'password'"
              placeholder="sk-ant-..."
              class="border-input/60 focus-visible:ring-orange-500/50"
            />
            <InputGroupAddon align="inline-end">
              <Button
                variant="ghost"
                size="icon"
                class="rounded-lg text-muted-foreground hover:text-foreground"
                @click="showClaude = !showClaude"
              >
                <EyeOff v-if="showClaude" />
                <Eye v-else />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <!-- DeepSeek Key -->
        <Field>
          <div class="flex items-center justify-between">
            <FieldLabel for="deepseek-key" class="font-outfit font-semibold text-sm">
              DeepSeek API Key
            </FieldLabel>
            <Badge variant="outline" class="uppercase text-[10px] tracking-wider">DeepSeek</Badge>
          </div>
          <InputGroup>
            <InputGroupInput
              id="deepseek-key"
              v-model="keys.deepseek"
              :type="showDeepSeek ? 'text' : 'password'"
              placeholder="sk-..."
              class="border-input/60 focus-visible:ring-sky-500/50"
            />
            <InputGroupAddon align="inline-end">
              <Button
                variant="ghost"
                size="icon"
                class="rounded-lg text-muted-foreground hover:text-foreground"
                @click="showDeepSeek = !showDeepSeek"
              >
                <EyeOff v-if="showDeepSeek" />
                <Eye v-else />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>

      <!-- Action buttons -->
      <DialogFooter class="flex sm:justify-between items-center border-t border-border/80 pt-6 mt-4 relative z-10">
        <Button
          variant="outline"
          class="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2 h-10 border-destructive/20"
          @click="handleClear"
        >
          <Trash2 data-icon="inline-start" />
          Clear Keys
        </Button>

        <div class="flex items-center gap-2">
          <Button
            variant="ghost"
            class="h-10 px-4"
            @click="emit('update:open', false)"
          >
            Cancel
          </Button>
          <Button
            class="gap-2 h-10 px-5 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform duration-200"
            @click="handleSave"
          >
            <Save data-icon="inline-start" />
            Save Keys
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
