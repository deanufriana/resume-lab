<script setup lang="ts">
import { watch, ref } from "vue";
import type { Work } from "../../types/resume";
import {
  Input,
  Label,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "../ui/index";
import Draggable from "vuedraggable";
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-vue-next";

const props = defineProps<{
  work: Work[];
}>();

const emit = defineEmits<{
  (e: "update:work", value: Work[]): void;
}>();

const localWork = ref([...props.work]);
const collapsedItems = ref<Record<number, boolean>>({});

watch(
  localWork,
  (newValue) => {
    emit("update:work", newValue);
  },
  { deep: true },
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

function toggleCollapse(index: number) {
  collapsedItems.value[index] = !collapsedItems.value[index];
}

function updateHighlights(index: number, value: string) {
  localWork.value[index].highlights = value
    .split("\n")
    .filter((h) => h.trim() !== "");
}

function updateSkills(index: number, value: string) {
  localWork.value[index].skills = value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Work Experience</h3>
      <Button @click="addWork" size="sm">
        <Plus class="w-4 h-4 mr-2" /> Add Experience
      </Button>
    </div>

    <Draggable
      v-model="localWork"
      item-key="name"
      handle=".handle"
      class="space-y-4"
    >
      <template #item="{ element: exp, index }">
        <Card>
          <CardHeader class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="handle cursor-grab active:cursor-grabbing">
                  <GripVertical class="w-4 h-4 text-muted-foreground" />
                </div>
                <CardTitle class="text-base">
                  {{ exp.name || `Experience #${index + 1}` }}
                </CardTitle>
              </div>
              <div class="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="toggleCollapse(index)"
                >
                  <ChevronUp v-if="!collapsedItems[index]" class="w-4 h-4" />
                  <ChevronDown v-else class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-destructive"
                  @click="removeWork(index)"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent
            v-show="!collapsedItems[index]"
            class="p-4 pt-0 space-y-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <Label class="text-xs">Company Name</Label>
                <Input v-model="exp.name" placeholder="Company Inc." />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Position</Label>
                <Input v-model="exp.position" placeholder="Software Engineer" />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">URL</Label>
                <Input v-model="exp.url" placeholder="https://..." />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="space-y-1">
                  <Label class="text-xs">Start Date</Label>
                  <Input v-model="exp.startDate" type="date" />
                </div>
                <div class="space-y-1">
                  <Label class="text-xs">End Date</Label>
                  <Input v-model="exp.endDate" type="date" />
                </div>
              </div>
            </div>
            <div class="space-y-1">
              <Label class="text-xs">Summary</Label>
              <Textarea
                v-model="exp.summary"
                placeholder="Brief overview of your role..."
              />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">Skills (comma-separated)</Label>
              <Input
                :model-value="exp.skills?.join(', ')"
                @update:model-value="
                  (val) => updateSkills(index, val as string)
                "
                placeholder="React, Vue, Node.js"
              />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">Highlights (one per line)</Label>
              <Textarea
                :model-value="exp.highlights?.join('\n')"
                @update:model-value="
                  (val) => updateHighlights(index, val as string)
                "
                placeholder="Led the frontend team...&#10;Reduced load times by 40%..."
                class="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </template>
    </Draggable>
  </div>
</template>
