<script setup lang="ts">
import { watch, ref } from "vue";
import type { Project } from "../../types/resume";
import {
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  FieldGroup,
  Field,
  FieldLabel,
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
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Projects</h3>
      <Button @click="addProject" size="sm">
        <Plus data-icon="inline-start" /> Add Project
      </Button>
    </div>

    <Draggable
      v-model="localProjects"
      item-key="name"
      handle=".handle"
      class="flex flex-col gap-4"
    >
      <template #item="{ element: project, index }">
        <Card>
          <CardHeader class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="handle cursor-grab active:cursor-grabbing">
                  <GripVertical class="size-4 text-muted-foreground" />
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
                  <ChevronUp v-if="!collapsedItems[index]" class="size-4" />
                  <ChevronDown v-else class="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-destructive"
                  @click="removeProject(index)"
                >
                  <Trash2 class="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent
            v-show="!collapsedItems[index]"
            class="p-4 pt-0 flex flex-col gap-4"
          >
            <FieldGroup class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel class="text-xs">Project Name</FieldLabel>
                <Input v-model="project.name" placeholder="Portfolio Website" />
              </Field>
              <Field>
                <FieldLabel class="text-xs">URL</FieldLabel>
                <Input v-model="project.url" placeholder="https://..." />
              </Field>
              <FieldGroup class="grid grid-cols-2 gap-2">
                <Field>
                  <FieldLabel class="text-xs">Start Date</FieldLabel>
                  <Input v-model="project.startDate" type="date" />
                </Field>
                <Field>
                  <FieldLabel class="text-xs">End Date</FieldLabel>
                  <Input v-model="project.endDate" type="date" />
                </Field>
              </FieldGroup>
            </FieldGroup>
            <Field>
              <FieldLabel class="text-xs">Description</FieldLabel>
              <Textarea
                v-model="project.description"
                placeholder="Short description of the project..."
              />
            </Field>
            <Field>
              <FieldLabel class="text-xs">Highlights (one per line)</FieldLabel>
              <Textarea
                :model-value="project.highlights?.join('\n')"
                @update:model-value="
                  (val) => updateHighlights(index, val as string)
                "
                placeholder="Implemented SSR with Nuxt.js...&#10;Integrated AWS S3 for uploads..."
                class="min-h-[100px]"
              />
            </Field>
          </CardContent>
        </Card>
      </template>
    </Draggable>
  </div>
</template>
