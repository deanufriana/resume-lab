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
  Switch,
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
      <template #item="{ element, index }: { element: Work; index: number }">
        <Card class="border-border/80 shadow-none">
          <CardHeader class="p-3.5 cursor-pointer select-none" @click="toggleCollapse(element)">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5 min-w-0">
                <div
                  class="handle cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground"
                  @click.stop
                >
                  <GripVertical class="w-4 h-4" />
                </div>
                <div class="min-w-0">
                  <CardTitle class="text-sm font-semibold truncate">
                    {{ element.position || element.name || `Experience #${index + 1}` }}
                  </CardTitle>
                  <p
                    v-if="element.position && element.name"
                    class="text-xs text-muted-foreground truncate"
                  >
                    {{ element.name }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-1 sm:gap-1.5 flex-shrink-0" @click.stop>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 sm:h-7 sm:w-7 touch-manipulation"
                  @click="toggleCollapse(element)"
                  :aria-label="
                    isCollapsed(element) ? 'Expand role details' : 'Collapse role details'
                  "
                >
                  <ChevronUp v-if="!isCollapsed(element)" class="w-4 h-4" />
                  <ChevronDown v-else class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 sm:h-7 sm:w-7 text-muted-foreground hover:text-destructive touch-manipulation"
                  @click="removeWork(index)"
                  aria-label="Remove role"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent v-show="!isCollapsed(element)" class="p-3.5 pt-0 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <Label class="text-xs">Company Name</Label>
                <Input
                  v-model="element.name"
                  placeholder="Acme Corp"
                  class="h-9 sm:h-8 text-base sm:text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Position</Label>
                <Input
                  v-model="element.position"
                  placeholder="Senior Software Engineer"
                  class="h-9 sm:h-8 text-base sm:text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Company URL</Label>
                <Input
                  v-model="element.url"
                  placeholder="https://..."
                  class="h-9 sm:h-8 text-base sm:text-xs"
                />
              </div>
              <div class="grid grid-cols-1 min-[440px]:grid-cols-2 gap-2">
                <div class="space-y-1">
                  <Label class="text-xs block leading-4">Start</Label>
                  <Input
                    type="month"
                    :model-value="toMonthInput(element.startDate)"
                    @update:model-value="(v) => (element.startDate = String(v))"
                    class="h-9 sm:h-8 text-base sm:text-xs"
                  />
                </div>
                <div class="space-y-1">
                  <div class="flex items-center justify-between leading-4">
                    <Label class="text-xs">End</Label>
                    <div class="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Switch
                        size="sm"
                        :model-value="!element.endDate"
                        aria-label="Current role"
                        @update:model-value="(val) => toggleCurrentRole(element, val)"
                      />
                      <span class="whitespace-nowrap">Current</span>
                    </div>
                  </div>
                  <Input
                    type="month"
                    :disabled="!element.endDate"
                    :model-value="toMonthInput(element.endDate)"
                    @update:model-value="(v) => (element.endDate = String(v))"
                    class="h-9 sm:h-8 text-base sm:text-xs disabled:opacity-40"
                  />
                </div>
              </div>
            </div>
            <div class="space-y-1">
              <Label class="text-xs">Summary</Label>
              <Textarea
                v-model="element.summary"
                placeholder="Brief overview of your role and scope..."
                class="min-h-[68px] text-base sm:text-xs"
              />
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs">Skills Used</Label>
              <TagInput
                :model-value="element.skills || []"
                @update:model-value="(val) => (element.skills = val)"
                placeholder="Type skill & press Enter (e.g. TypeScript, Vue)..."
              />
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs">Key Highlights</Label>
              <BulletListInput
                :model-value="element.highlights || []"
                @update:model-value="(val) => (element.highlights = val)"
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
