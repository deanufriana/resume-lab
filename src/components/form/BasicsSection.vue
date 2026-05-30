<script setup lang="ts">
import { reactive, watch } from "vue";
import type { Basics } from "../../types/resume";
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
  FieldSet,
  FieldLegend,
} from "../ui/index";
import Draggable from "vuedraggable";
import { GripVertical, Plus, Trash2 } from "lucide-vue-next";

const props = defineProps<{
  basics: Basics;
}>();

const emit = defineEmits<{
  (e: "update:basics", value: Basics): void;
}>();

const localBasics = reactive({ ...props.basics });

watch(
  localBasics,
  (newValue) => {
    emit("update:basics", newValue);
  },
  { deep: true },
);

function addProfile() {
  if (!localBasics.profiles) localBasics.profiles = [];
  localBasics.profiles.push({ network: "", username: "", url: "" });
}

function removeProfile(index: number) {
  localBasics.profiles?.splice(index, 1);
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Basic Information</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-6">
      <FieldGroup class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel for="name">Name</FieldLabel>
          <Input id="name" v-model="localBasics.name" placeholder="John Doe" />
        </Field>
        <Field>
          <FieldLabel for="label">Title</FieldLabel>
          <Input
            id="label"
            v-model="localBasics.label"
            placeholder="Software Engineer"
          />
        </Field>
        <Field>
          <FieldLabel for="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            v-model="localBasics.email"
            placeholder="john@example.com"
          />
        </Field>
        <Field>
          <FieldLabel for="phone">Phone</FieldLabel>
          <Input
            id="phone"
            v-model="localBasics.phone"
            placeholder="+1 (555) 000-0000"
          />
        </Field>
        <Field>
          <FieldLabel for="url">Website</FieldLabel>
          <Input
            id="url"
            v-model="localBasics.url"
            placeholder="https://johndoe.com"
          />
        </Field>
        <Field>
          <FieldLabel for="image">Profile Image URL</FieldLabel>
          <Input
            id="image"
            v-model="localBasics.image"
            placeholder="https://example.com/photo.jpg"
          />
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel for="summary">Summary</FieldLabel>
        <Textarea
          id="summary"
          v-model="localBasics.summary"
          placeholder="Brief professional summary..."
          class="min-h-[100px]"
        />
      </Field>

      <FieldSet class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <FieldLegend variant="label">Social Profiles</FieldLegend>
          <Button variant="outline" size="sm" @click="addProfile">
            <Plus data-icon="inline-start" /> Add Profile
          </Button>
        </div>

        <Draggable
          v-if="localBasics.profiles && localBasics.profiles.length > 0"
          v-model="localBasics.profiles"
          item-key="url"
          handle=".handle"
          class="flex flex-col gap-3"
        >
          <template #item="{ element: profile, index }">
            <div
              class="flex items-start gap-4 p-4 border rounded-lg bg-muted/30"
            >
              <div class="handle cursor-grab active:cursor-grabbing mt-2">
                <GripVertical class="size-4 text-muted-foreground" />
              </div>
              <FieldGroup class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field>
                  <FieldLabel class="text-xs">Network</FieldLabel>
                  <Input
                    v-model="profile.network"
                    placeholder="LinkedIn"
                    size="sm"
                  />
                </Field>
                <Field>
                  <FieldLabel class="text-xs">Username</FieldLabel>
                  <Input
                    v-model="profile.username"
                    placeholder="johndoe"
                    size="sm"
                  />
                </Field>
                <Field>
                  <FieldLabel class="text-xs">URL</FieldLabel>
                  <Input
                    v-model="profile.url"
                    placeholder="https://..."
                    size="sm"
                  />
                </Field>
              </FieldGroup>
              <Button
                variant="ghost"
                size="icon"
                class="text-destructive"
                @click="removeProfile(index)"
              >
                <Trash2 class="size-4" />
              </Button>
            </div>
          </template>
        </Draggable>
      </FieldSet>
    </CardContent>
  </Card>
</template>
