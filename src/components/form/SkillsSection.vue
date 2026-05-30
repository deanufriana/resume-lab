<script setup lang="ts">
import { watch, ref } from "vue";
import type { Skill } from "../../types/resume";
import {
  Input,
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
  skills: Skill[];
}>();

const emit = defineEmits<{
  (e: "update:skills", value: Skill[]): void;
}>();

const localSkills = ref([...props.skills]);
const collapsedItems = ref<Record<number, boolean>>({});

watch(
  localSkills,
  (newValue) => {
    emit("update:skills", newValue);
  },
  { deep: true },
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

function toggleCollapse(index: number) {
  collapsedItems.value[index] = !collapsedItems.value[index];
}

function updateKeywords(index: number, value: string) {
  localSkills.value[index].keywords = value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Skills</h3>
      <Button @click="addSkill" size="sm">
        <Plus data-icon="inline-start" /> Add Skill
      </Button>
    </div>

    <Draggable
      v-model="localSkills"
      item-key="name"
      handle=".handle"
      class="flex flex-col gap-4"
    >
      <template #item="{ element: skill, index }">
        <Card>
          <CardHeader class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="handle cursor-grab active:cursor-grabbing">
                  <GripVertical class="size-4 text-muted-foreground" />
                </div>
                <CardTitle class="text-base">
                  {{ skill.name || `Skill #${index + 1}` }}
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
                  @click="removeSkill(index)"
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
                <FieldLabel class="text-xs">Skill Group / Name</FieldLabel>
                <Input v-model="skill.name" placeholder="Web Development" />
              </Field>
              <Field>
                <FieldLabel class="text-xs">Level (optional)</FieldLabel>
                <Input v-model="skill.level" placeholder="Expert / Advanced" />
              </Field>
            </FieldGroup>
            <Field>
              <FieldLabel class="text-xs">Keywords (comma-separated)</FieldLabel>
              <Input
                :model-value="skill.keywords?.join(', ')"
                @update:model-value="
                  (val) => updateKeywords(index, val as string)
                "
                placeholder="React, Vue, TypeScript, Next.js..."
              />
            </Field>
          </CardContent>
        </Card>
      </template>
    </Draggable>
  </div>
</template>
