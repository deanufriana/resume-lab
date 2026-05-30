<script setup lang="ts">
import { watch, ref } from "vue";
import type { Work } from "../../types/resume";
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
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Work Experience</h3>
      <Button @click="addWork" size="sm">
        <Plus data-icon="inline-start" /> Add Experience
      </Button>
    </div>

    <Draggable
      v-model="localWork"
      item-key="name"
      handle=".handle"
      class="flex flex-col gap-4"
    >
      <template #item="{ element: exp, index }">
        <Card>
          <CardHeader class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="handle cursor-grab active:cursor-grabbing">
                  <GripVertical class="size-4 text-muted-foreground" />
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
                  <ChevronUp v-if="!collapsedItems[index]" class="size-4" />
                  <ChevronDown v-else class="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-destructive"
                  @click="removeWork(index)"
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
                <FieldLabel class="text-xs">Company Name</FieldLabel>
                <Input v-model="exp.name" placeholder="Company Inc." />
              </Field>
              <Field>
                <FieldLabel class="text-xs">Position</FieldLabel>
                <Input v-model="exp.position" placeholder="Software Engineer" />
              </Field>
              <Field>
                <FieldLabel class="text-xs">URL</FieldLabel>
                <Input v-model="exp.url" placeholder="https://..." />
              </Field>
              <FieldGroup class="grid grid-cols-2 gap-2">
                <Field>
                  <FieldLabel class="text-xs">Start Date</FieldLabel>
                  <Input v-model="exp.startDate" type="date" />
                </Field>
                <Field>
                  <FieldLabel class="text-xs">End Date</FieldLabel>
                  <Input v-model="exp.endDate" type="date" />
                </Field>
              </FieldGroup>
            </FieldGroup>
            <Field>
              <FieldLabel class="text-xs">Summary</FieldLabel>
              <Textarea
                v-model="exp.summary"
                placeholder="Brief overview of your role..."
              />
            </Field>
            <Field>
              <FieldLabel class="text-xs">Skills (comma-separated)</FieldLabel>
              <Input
                :model-value="exp.skills?.join(', ')"
                @update:model-value="
                  (val) => updateSkills(index, val as string)
                "
                placeholder="React, Vue, Node.js"
              />
            </Field>
            <Field>
              <FieldLabel class="text-xs">Highlights (one per line)</FieldLabel>
              <Textarea
                :model-value="exp.highlights?.join('\n')"
                @update:model-value="
                  (val) => updateHighlights(index, val as string)
                "
                placeholder="Led the frontend team...&#10;Reduced load times by 40%..."
                class="min-h-[100px]"
              />
            </Field>
          </CardContent>
        </Card>
      </template>
    </Draggable>
  </div>
</template>
