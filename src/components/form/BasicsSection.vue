<script setup lang="ts">
import { reactive, watch } from "vue";
import type { Basics } from "../../types/resume";
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
    <CardContent class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="name">Name</Label>
          <Input id="name" v-model="localBasics.name" placeholder="John Doe" />
        </div>
        <div class="space-y-2">
          <Label for="label">Title</Label>
          <Input
            id="label"
            v-model="localBasics.label"
            placeholder="Software Engineer"
          />
        </div>
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            v-model="localBasics.email"
            placeholder="john@example.com"
          />
        </div>
        <div class="space-y-2">
          <Label for="phone">Phone</Label>
          <Input
            id="phone"
            v-model="localBasics.phone"
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div class="space-y-2">
          <Label for="url">Website</Label>
          <Input
            id="url"
            v-model="localBasics.url"
            placeholder="https://johndoe.com"
          />
        </div>
        <div class="space-y-2">
          <Label for="image">Profile Image URL</Label>
          <Input
            id="image"
            v-model="localBasics.image"
            placeholder="https://example.com/photo.jpg"
          />
        </div>
      </div>

      <div class="space-y-2">
        <Label for="summary">Summary</Label>
        <Textarea
          id="summary"
          v-model="localBasics.summary"
          placeholder="Brief professional summary..."
          class="min-h-[100px]"
        />
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <Label>Social Profiles</Label>
          <Button variant="outline" size="sm" @click="addProfile">
            <Plus class="w-4 h-4 mr-2" /> Add Profile
          </Button>
        </div>

        <Draggable
          v-if="localBasics.profiles && localBasics.profiles.length > 0"
          v-model="localBasics.profiles"
          item-key="url"
          handle=".handle"
          class="space-y-3"
        >
          <template #item="{ element: profile, index }">
            <div
              class="flex items-start gap-4 p-4 border rounded-lg bg-muted/30"
            >
              <div class="handle cursor-grab active:cursor-grabbing mt-2">
                <GripVertical class="w-4 h-4 text-muted-foreground" />
              </div>
              <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="space-y-1">
                  <Label class="text-xs">Network</Label>
                  <Input
                    v-model="profile.network"
                    placeholder="LinkedIn"
                    size="sm"
                  />
                </div>
                <div class="space-y-1">
                  <Label class="text-xs">Username</Label>
                  <Input
                    v-model="profile.username"
                    placeholder="johndoe"
                    size="sm"
                  />
                </div>
                <div class="space-y-1">
                  <Label class="text-xs">URL</Label>
                  <Input
                    v-model="profile.url"
                    placeholder="https://..."
                    size="sm"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                class="text-destructive"
                @click="removeProfile(index)"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </template>
        </Draggable>
      </div>
    </CardContent>
  </Card>
</template>
