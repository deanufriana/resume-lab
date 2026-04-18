<script setup lang="ts">
import { watch, ref } from "vue";
import type { Project } from "../../types/resume";
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
  projects: Project[];
}>();

const emit = defineEmits<{
  (e: "update:projects", value: Project[]): void;
}>();

const localProjects = ref([...props.projects]);
const collapsedItems = ref<Record<number, boolean>>({});

watch(
  localProjects,
  (newValue) => {
    emit("update:projects", newValue);
  },
  { deep: true },
);

function addProject() {
  localProjects.value.push({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    highlights: [],
    url: "",
  });
}

function removeProject(index: number) {
  localProjects.value.splice(index, 1);
}

function toggleCollapse(index: number) {
  collapsedItems.value[index] = !collapsedItems.value[index];
}

function updateHighlights(index: number, value: string) {
  localProjects.value[index].highlights = value
    .split("\n")
    .filter((h) => h.trim() !== "");
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Projects</h3>
      <Button @click="addProject" size="sm">
        <Plus class="w-4 h-4 mr-2" /> Add Project
      </Button>
    </div>

    <Draggable
      v-model="localProjects"
      item-key="name"
      handle=".handle"
      class="space-y-4"
    >
      <template #item="{ element: project, index }">
        <Card>
          <CardHeader class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="handle cursor-grab active:cursor-grabbing">
                  <GripVertical class="w-4 h-4 text-muted-foreground" />
                </div>
                <CardTitle class="text-base">
                  {{ project.name || `Project #${index + 1}` }}
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
                  @click="removeProject(index)"
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
                <Label class="text-xs">Project Name</Label>
                <Input v-model="project.name" placeholder="Portfolio Website" />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">URL</Label>
                <Input v-model="project.url" placeholder="https://..." />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="space-y-1">
                  <Label class="text-xs">Start Date</Label>
                  <Input v-model="project.startDate" type="date" />
                </div>
                <div class="space-y-1">
                  <Label class="text-xs">End Date</Label>
                  <Input v-model="project.endDate" type="date" />
                </div>
              </div>
            </div>
            <div class="space-y-1">
              <Label class="text-xs">Description</Label>
              <Textarea
                v-model="project.description"
                placeholder="Short description of the project..."
              />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">Highlights (one per line)</Label>
              <Textarea
                :model-value="project.highlights?.join('\n')"
                @update:model-value="
                  (val) => updateHighlights(index, val as string)
                "
                placeholder="Implemented SSR with Nuxt.js...&#10;Integrated AWS S3 for uploads..."
                class="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </template>
    </Draggable>
  </div>
</template>
