<script setup lang="ts">
import { watch, ref } from "vue";
import type { Education } from "../../types/resume";
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
  education: Education[];
}>();

const emit = defineEmits<{
  (e: "update:education", value: Education[]): void;
}>();

const localEducation = ref([...props.education]);
const collapsedItems = ref<Record<number, boolean>>({});

watch(
  localEducation,
  (newValue) => {
    emit("update:education", newValue);
  },
  { deep: true },
);

function addEducation() {
  localEducation.value.push({
    institution: "",
    url: "",
    area: "",
    studyType: "",
    startDate: "",
    endDate: "",
    score: "",
    courses: [],
  });
}

function removeEducation(index: number) {
  localEducation.value.splice(index, 1);
}

function toggleCollapse(index: number) {
  collapsedItems.value[index] = !collapsedItems.value[index];
}

function updateCourses(index: number, value: string) {
  localEducation.value[index].courses = value
    .split("\n")
    .filter((h) => h.trim() !== "");
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Education</h3>
      <Button @click="addEducation" size="sm">
        <Plus data-icon="inline-start" /> Add Education
      </Button>
    </div>

    <Draggable
      v-model="localEducation"
      item-key="institution"
      handle=".handle"
      class="flex flex-col gap-4"
    >
      <template #item="{ element: edu, index }">
        <Card>
          <CardHeader class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="handle cursor-grab active:cursor-grabbing">
                  <GripVertical class="size-4 text-muted-foreground" />
                </div>
                <CardTitle class="text-base">
                  {{ edu.institution || `Education #${index + 1}` }}
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
                  @click="removeEducation(index)"
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
                <FieldLabel class="text-xs">Institution</FieldLabel>
                <Input
                  v-model="edu.institution"
                  placeholder="University of..."
                />
              </Field>
              <Field>
                <FieldLabel class="text-xs">Area of Study</FieldLabel>
                <Input v-model="edu.area" placeholder="Computer Science" />
              </Field>
              <Field>
                <FieldLabel class="text-xs">Degree Type</FieldLabel>
                <Input v-model="edu.studyType" placeholder="Bachelor's" />
              </Field>
              <Field>
                <FieldLabel class="text-xs">GPA / Score</FieldLabel>
                <Input v-model="edu.score" placeholder="3.8/4.0" />
              </Field>
              <Field>
                <FieldLabel class="text-xs">URL</FieldLabel>
                <Input v-model="edu.url" placeholder="https://..." />
              </Field>
              <FieldGroup class="grid grid-cols-2 gap-2">
                <Field>
                  <FieldLabel class="text-xs">Start Date</FieldLabel>
                  <Input v-model="edu.startDate" type="date" />
                </Field>
                <Field>
                  <FieldLabel class="text-xs">End Date</FieldLabel>
                  <Input v-model="edu.endDate" type="date" />
                </Field>
              </FieldGroup>
            </FieldGroup>
            <Field>
              <FieldLabel class="text-xs">Courses (one per line)</FieldLabel>
              <Textarea
                :model-value="edu.courses?.join('\n')"
                @update:model-value="
                  (val) => updateCourses(index, val as string)
                "
                placeholder="DS101 - Algorithms&#10;OS202 - Operating Systems..."
                class="min-h-[100px]"
              />
            </Field>
          </CardContent>
        </Card>
      </template>
    </Draggable>
  </div>
</template>
