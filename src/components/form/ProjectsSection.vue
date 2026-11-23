<script setup lang="ts">
import type { Project } from "../../types/resume";
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
  BulletListInput,
} from "../ui/index";
import Draggable from "vuedraggable";
import { FolderGit2, GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-vue-next";

const props = defineProps<{
  projects: Project[];
}>();

const emit = defineEmits<{
  (e: "update:projects", value: Project[]): void;
}>();

const {
  localItems: localProjects,
  getItemKey,
  isCollapsed,
  toggleCollapse,
} = useStableList(
  () => props.projects,
  (val) => emit("update:projects", val),
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
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-base font-semibold">Projects</h3>
        <p class="text-xs text-muted-foreground">Personal, open-source, or key initiatives.</p>
      </div>
      <Button @click="addProject" size="sm" class="h-8 text-xs">
        <Plus class="w-3.5 h-3.5 mr-1.5" /> Add Project
      </Button>
    </div>

    <EmptyState
      v-if="localProjects.length === 0"
      :icon="FolderGit2"
      title="No projects added yet"
      description="Showcase personal, open-source, or side projects."
    >
      <Button size="sm" @click="addProject"> <Plus class="w-4 h-4 mr-2" /> Add Project </Button>
    </EmptyState>

    <Draggable
      v-else
      v-model="localProjects"
      :item-key="getItemKey"
      handle=".handle"
      class="space-y-3"
    >
      <template #item="{ element: project, index }">
        <Card class="border-border/80 shadow-none">
          <CardHeader class="p-3.5 cursor-pointer select-none" @click="toggleCollapse(project)">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5 min-w-0">
                <div
                  class="handle cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground"
                  @click.stop
                >
                  <GripVertical class="w-4 h-4" />
                </div>
                <CardTitle class="text-sm font-semibold truncate">
                  {{ project.name || `Project #${index + 1}` }}
                </CardTitle>
              </div>
              <div class="flex items-center gap-1 sm:gap-1.5 flex-shrink-0" @click.stop>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 sm:h-7 sm:w-7 touch-manipulation"
                  @click="toggleCollapse(project)"
                  :aria-label="
                    isCollapsed(project) ? 'Expand project details' : 'Collapse project details'
                  "
                >
                  <ChevronUp v-if="!isCollapsed(project)" class="w-4 h-4" />
                  <ChevronDown v-else class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 sm:h-7 sm:w-7 text-muted-foreground hover:text-destructive touch-manipulation"
                  @click="removeProject(index)"
                  aria-label="Remove project"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent v-show="!isCollapsed(project)" class="p-3.5 pt-0 space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <Label class="text-xs">Project Name</Label>
                <Input
                  v-model="project.name"
                  placeholder="Portfolio Website"
                  class="h-9 sm:h-8 text-base sm:text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">URL</Label>
                <Input
                  v-model="project.url"
                  placeholder="https://..."
                  class="h-9 sm:h-8 text-base sm:text-xs"
                />
              </div>
              <div class="grid grid-cols-1 min-[440px]:grid-cols-2 gap-2">
                <div class="space-y-1">
                  <Label class="text-xs">Start Month</Label>
                  <Input
                    type="month"
                    :model-value="toMonthInput(project.startDate)"
                    @update:model-value="(v) => (project.startDate = String(v))"
                    class="h-9 sm:h-8 text-base sm:text-xs"
                  />
                </div>
                <div class="space-y-1">
                  <Label class="text-xs">End Month</Label>
                  <Input
                    type="month"
                    :model-value="toMonthInput(project.endDate)"
                    @update:model-value="(v) => (project.endDate = String(v))"
                    class="h-9 sm:h-8 text-base sm:text-xs"
                  />
                </div>
              </div>
            </div>
            <div class="space-y-1">
              <Label class="text-xs">Description</Label>
              <Textarea
                v-model="project.description"
                placeholder="Short description of the project..."
                class="min-h-[64px] text-base sm:text-xs"
              />
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs">Highlights</Label>
              <BulletListInput
                :model-value="project.highlights || []"
                @update:model-value="(val) => (project.highlights = val)"
                placeholder="Implemented SSR with Nuxt.js..."
                add-label="Add highlight"
              />
            </div>
          </CardContent>
        </Card>
      </template>
    </Draggable>
  </div>
</template>
