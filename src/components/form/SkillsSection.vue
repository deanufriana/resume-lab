<script setup lang="ts">
import type { Skill } from "../../types/resume";
import { useStableList } from "../../composables/useStableList";
import {
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  EmptyState,
  TagInput,
} from "../ui/index";
import Draggable from "vuedraggable";
import { Wrench, GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-vue-next";

const props = defineProps<{
  skills: Skill[];
}>();

const emit = defineEmits<{
  (e: "update:skills", value: Skill[]): void;
}>();

const {
  localItems: localSkills,
  getItemKey,
  isCollapsed,
  toggleCollapse,
} = useStableList(
  () => props.skills,
  (val) => emit("update:skills", val),
);

function addSkill() {
  localSkills.value.push({
    name: "",
    level: "",
    keywords: [],
  });
}

function removeSkill(index: number) {
  localSkills.value.splice(index, 1);
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-base font-semibold">Skills</h3>
        <p class="text-xs text-muted-foreground">Group your technical or domain skills.</p>
      </div>
      <Button @click="addSkill" size="sm" class="h-8 text-xs">
        <Plus class="w-3.5 h-3.5 mr-1.5" /> Add Group
      </Button>
    </div>

    <EmptyState
      v-if="localSkills.length === 0"
      :icon="Wrench"
      title="No skills added yet"
      description="Group your technical or domain skills with interactive tags."
    >
      <Button size="sm" @click="addSkill"> <Plus class="w-4 h-4 mr-2" /> Add Skill </Button>
    </EmptyState>

    <Draggable
      v-else
      v-model="localSkills"
      :item-key="getItemKey"
      handle=".handle"
      class="space-y-3"
    >
      <template #item="{ element: skill, index }">
        <Card class="border-border/80 shadow-none">
          <CardHeader class="p-3.5">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5 min-w-0">
                <div
                  class="handle cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground"
                >
                  <GripVertical class="w-4 h-4" />
                </div>
                <CardTitle class="text-sm font-semibold truncate">
                  {{ skill.name || `Skill Group #${index + 1}` }}
                </CardTitle>
              </div>
              <div class="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" class="h-7 w-7" @click="toggleCollapse(skill)">
                  <ChevronUp v-if="!isCollapsed(skill)" class="w-4 h-4" />
                  <ChevronDown v-else class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-7 w-7 text-muted-foreground hover:text-destructive"
                  @click="removeSkill(index)"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent v-show="!isCollapsed(skill)" class="p-3.5 pt-0 space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <Label class="text-xs">Skill Group / Name</Label>
                <Input
                  v-model="skill.name"
                  placeholder="Frontend Development"
                  class="h-8 text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Level (optional)</Label>
                <Input v-model="skill.level" placeholder="Expert / Advanced" class="h-8 text-xs" />
              </div>
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs">Keywords</Label>
              <TagInput
                :model-value="skill.keywords || []"
                @update:model-value="(val) => (skill.keywords = val)"
                placeholder="Type skill & press Enter (e.g. React, Vue, TS)..."
              />
            </div>
          </CardContent>
        </Card>
      </template>
    </Draggable>
  </div>
</template>
