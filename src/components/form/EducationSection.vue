<script setup lang="ts">
import type { Education } from "../../types/resume";
import { useStableList } from "../../composables/useStableList";
import { toMonthInput } from "../../utils/date";
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
import { GraduationCap, GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-vue-next";

const props = defineProps<{
  education: Education[];
}>();

const emit = defineEmits<{
  (e: "update:education", value: Education[]): void;
}>();

const {
  localItems: localEducation,
  getItemKey,
  isCollapsed,
  toggleCollapse,
} = useStableList(
  () => props.education,
  (val) => emit("update:education", val),
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
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-base font-semibold">Education</h3>
        <p class="text-xs text-muted-foreground">Degrees, bootcamps, or coursework.</p>
      </div>
      <Button @click="addEducation" size="sm" class="h-8 text-xs">
        <Plus class="w-3.5 h-3.5 mr-1.5" /> Add Education
      </Button>
    </div>

    <EmptyState
      v-if="localEducation.length === 0"
      :icon="GraduationCap"
      title="No education added yet"
      description="Include degrees, bootcamps, or relevant coursework."
    >
      <Button size="sm" @click="addEducation"> <Plus class="w-4 h-4 mr-2" /> Add Education </Button>
    </EmptyState>

    <Draggable
      v-else
      v-model="localEducation"
      :item-key="getItemKey"
      handle=".handle"
      class="space-y-3"
    >
      <template #item="{ element, index }: { element: Education; index: number }">
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
                <CardTitle class="text-sm font-semibold truncate">
                  {{ element.institution || `Education #${index + 1}` }}
                </CardTitle>
              </div>
              <div class="flex items-center gap-1 sm:gap-1.5 flex-shrink-0" @click.stop>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 sm:h-7 sm:w-7 touch-manipulation"
                  @click="toggleCollapse(element)"
                  :aria-label="
                    isCollapsed(element) ? 'Expand education details' : 'Collapse education details'
                  "
                >
                  <ChevronUp v-if="!isCollapsed(element)" class="w-4 h-4" />
                  <ChevronDown v-else class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 sm:h-7 sm:w-7 text-muted-foreground hover:text-destructive touch-manipulation"
                  @click="removeEducation(index)"
                  aria-label="Remove education"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent v-show="!isCollapsed(element)" class="p-3.5 pt-0 space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <Label class="text-xs">Institution</Label>
                <Input
                  v-model="element.institution"
                  placeholder="University of..."
                  class="h-9 sm:h-8 text-base sm:text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Area of Study</Label>
                <Input
                  v-model="element.area"
                  placeholder="Computer Science"
                  class="h-9 sm:h-8 text-base sm:text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Degree Type</Label>
                <Input
                  v-model="element.studyType"
                  placeholder="Bachelor's"
                  class="h-9 sm:h-8 text-base sm:text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">GPA / Score</Label>
                <Input
                  v-model="element.score"
                  placeholder="3.8/4.0"
                  class="h-9 sm:h-8 text-base sm:text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">URL</Label>
                <Input
                  v-model="element.url"
                  placeholder="https://..."
                  class="h-9 sm:h-8 text-base sm:text-xs"
                />
              </div>
              <div class="grid grid-cols-1 min-[440px]:grid-cols-2 gap-2">
                <div class="space-y-1">
                  <Label class="text-xs">Start Month</Label>
                  <Input
                    type="month"
                    :model-value="toMonthInput(element.startDate)"
                    @update:model-value="(v) => (element.startDate = String(v))"
                    class="h-9 sm:h-8 text-base sm:text-xs"
                  />
                </div>
                <div class="space-y-1">
                  <Label class="text-xs">End Month</Label>
                  <Input
                    type="month"
                    :model-value="toMonthInput(element.endDate)"
                    @update:model-value="(v) => (element.endDate = String(v))"
                    class="h-9 sm:h-8 text-base sm:text-xs"
                  />
                </div>
              </div>
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs">Relevant Courses</Label>
              <TagInput
                :model-value="element.courses || []"
                @update:model-value="(val) => (element.courses = val)"
                placeholder="Type course & press Enter..."
              />
            </div>
          </CardContent>
        </Card>
      </template>
    </Draggable>
  </div>
</template>
