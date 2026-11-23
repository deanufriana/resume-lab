<script setup lang="ts">
import type { Work } from "../../types/resume";
import { useStableList } from "../../composables/useStableList";
import { toMonthInput } from "../../utils/date";
import {
  Input,
  Label,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  EmptyState,
  TagInput,
  BulletListInput,
} from "../ui/index";
import Draggable from "vuedraggable";
import { Briefcase, GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-vue-next";

const props = defineProps<{
  work: Work[];
}>();

const emit = defineEmits<{
  (e: "update:work", value: Work[]): void;
}>();

const {
  localItems: localWork,
  getItemKey,
  isCollapsed,
  toggleCollapse,
} = useStableList(
  () => props.work,
  (val) => emit("update:work", val),
);

function addWork() {
  localWork.value.push({
    name: "",
    position: "",
    url: "",
    startDate: "",
    endDate: "",
    summary: "",
    highlights: [],
    skills: [],
  });
}

function removeWork(index: number) {
  localWork.value.splice(index, 1);
}

function toggleCurrentRole(exp: Work, isCurrent: boolean) {
  if (isCurrent) {
    exp.endDate = "";
  } else {
    const now = new Date();
    exp.endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-base font-semibold">Work Experience</h3>
        <p class="text-xs text-muted-foreground">Drag handles to reorder roles.</p>
      </div>
      <Button @click="addWork" size="sm" class="h-8 text-xs">
        <Plus class="w-3.5 h-3.5 mr-1.5" /> Add Role
      </Button>
    </div>

    <EmptyState
      v-if="localWork.length === 0"
      :icon="Briefcase"
      title="No work experience yet"
      description="Add your current or past roles to highlight your career history."
    >
      <Button size="sm" @click="addWork"> <Plus class="w-4 h-4 mr-2" /> Add Experience </Button>
    </EmptyState>

    <Draggable v-else v-model="localWork" :item-key="getItemKey" handle=".handle" class="space-y-3">
      <template #item="{ element: exp, index }">
        <Card class="border-border/80 shadow-none">
          <CardHeader class="p-3.5">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5 min-w-0">
                <div
                  class="handle cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground"
                >
                  <GripVertical class="w-4 h-4" />
                </div>
                <div class="min-w-0">
                  <CardTitle class="text-sm font-semibold truncate">
                    {{ exp.position || exp.name || `Experience #${index + 1}` }}
                  </CardTitle>
                  <p v-if="exp.position && exp.name" class="text-xs text-muted-foreground truncate">
                    {{ exp.name }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" class="h-7 w-7" @click="toggleCollapse(exp)">
                  <ChevronUp v-if="!isCollapsed(exp)" class="w-4 h-4" />
                  <ChevronDown v-else class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-7 w-7 text-muted-foreground hover:text-destructive"
                  @click="removeWork(index)"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent v-show="!isCollapsed(exp)" class="p-3.5 pt-0 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <Label class="text-xs">Company Name</Label>
                <Input v-model="exp.name" placeholder="Acme Corp" class="h-8 text-xs" />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Position</Label>
                <Input
                  v-model="exp.position"
                  placeholder="Senior Software Engineer"
                  class="h-8 text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Company URL</Label>
                <Input v-model="exp.url" placeholder="https://..." class="h-8 text-xs" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="space-y-1">
                  <Label class="text-xs block leading-4">Start</Label>
                  <Input
                    type="month"
                    :model-value="toMonthInput(exp.startDate)"
                    @update:model-value="(v) => (exp.startDate = String(v))"
                    class="h-8 text-xs"
                  />
                </div>
                <div class="space-y-1">
                  <div class="flex items-center justify-between leading-4">
                    <Label class="text-xs">End</Label>
                    <label
                      class="flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer select-none whitespace-nowrap"
                    >
                      <input
                        type="checkbox"
                        :checked="!exp.endDate"
                        @change="
                          toggleCurrentRole(exp, ($event.target as HTMLInputElement).checked)
                        "
                        class="rounded border-input accent-foreground h-3 w-3"
                      />
                      Current
                    </label>
                  </div>
                  <Input
                    type="month"
                    :disabled="!exp.endDate"
                    :model-value="toMonthInput(exp.endDate)"
                    @update:model-value="(v) => (exp.endDate = String(v))"
                    class="h-8 text-xs disabled:opacity-40"
                  />
                </div>
              </div>
            </div>
            <div class="space-y-1">
              <Label class="text-xs">Summary</Label>
              <Textarea
                v-model="exp.summary"
                placeholder="Brief overview of your role and scope..."
                class="min-h-[68px] text-xs"
              />
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs">Skills Used</Label>
              <TagInput
                :model-value="exp.skills || []"
                @update:model-value="(val) => (exp.skills = val)"
                placeholder="Type skill & press Enter (e.g. TypeScript, Vue)..."
              />
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs">Key Highlights</Label>
              <BulletListInput
                :model-value="exp.highlights || []"
                @update:model-value="(val) => (exp.highlights = val)"
                placeholder="Led migration to Vite, cutting build time by 40%..."
                add-label="Add highlight"
              />
            </div>
          </CardContent>
        </Card>
      </template>
    </Draggable>
  </div>
</template>
