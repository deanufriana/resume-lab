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

function updateKeywords(index: number, value: string) {
  localSkills.value[index].keywords = value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Skills</h3>
      <Button @click="addSkill" size="sm"> <Plus class="w-4 h-4 mr-2" /> Add Skill </Button>
    </div>

    <EmptyState
      v-if="localSkills.length === 0"
      :icon="Wrench"
      title="No skills added yet"
      description="Group your technical or domain skills with comma-separated keywords."
    >
      <Button size="sm" @click="addSkill"> <Plus class="w-4 h-4 mr-2" /> Add Skill </Button>
    </EmptyState>

    <Draggable
      v-else
      v-model="localSkills"
      :item-key="getItemKey"
      handle=".handle"
      class="space-y-4"
    >
      <template #item="{ element: skill, index }">
        <Card>
          <CardHeader class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="handle cursor-grab active:cursor-grabbing">
                  <GripVertical class="w-4 h-4 text-muted-foreground" />
                </div>
                <CardTitle class="text-base">
                  {{ skill.name || `Skill #${index + 1}` }}
                </CardTitle>
              </div>
              <div class="flex items-center gap-2">
                <Button variant="ghost" size="sm" @click="toggleCollapse(skill)">
                  <ChevronUp v-if="!isCollapsed(skill)" class="w-4 h-4" />
                  <ChevronDown v-else class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-destructive"
                  @click="removeSkill(index)"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent v-show="!isCollapsed(skill)" class="p-4 pt-0 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <Label class="text-xs">Skill Group / Name</Label>
                <Input v-model="skill.name" placeholder="Web Development" />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Level (optional)</Label>
                <Input v-model="skill.level" placeholder="Expert / Advanced" />
              </div>
            </div>
            <div class="space-y-1">
              <Label class="text-xs">Keywords (comma-separated)</Label>
              <Input
                :model-value="skill.keywords?.join(', ')"
                @update:model-value="(val) => updateKeywords(index, val as string)"
                placeholder="React, Vue, TypeScript, Next.js..."
              />
            </div>
          </CardContent>
        </Card>
      </template>
    </Draggable>
  </div>
</template>
