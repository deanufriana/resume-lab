<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Basics, Location, Profile } from "../../types/resume";
import { Input, Label, Textarea, Button, Switch } from "../ui/index";
import Draggable from "vuedraggable";
import { GripVertical, Plus, Trash2 } from "lucide-vue-next";

const props = defineProps<{
  basics: Basics;
  hideContact?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:basics", value: Basics): void;
  (e: "update:hideContact", value: boolean): void;
}>();

const localBasicsHideContact = computed({
  get: () => props.hideContact || false,
  set: (value: boolean) => emit("update:hideContact", value),
});

function normalizeBasics(b: Basics): Basics & { location: Required<Location> } {
  return {
    ...JSON.parse(JSON.stringify(b || {})),
    location: {
      address: "",
      city: "",
      region: "",
      countryCode: "",
      postalCode: "",
      ...b?.location,
    },
  };
}

const localBasics = ref<Basics & { location: Required<Location> }>(normalizeBasics(props.basics));

watch(
  () => props.basics,
  (newValue) => {
    const normalized = normalizeBasics(newValue);
    if (JSON.stringify(normalized) !== JSON.stringify(localBasics.value)) {
      localBasics.value = normalized;
    }
  },
  { deep: true },
);

watch(
  localBasics,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(props.basics)) {
      emit("update:basics", JSON.parse(JSON.stringify(newValue)));
    }
  },
  { deep: true },
);

const profilesList = computed<Profile[]>({
  get: () => localBasics.value.profiles || [],
  set: (val) => {
    localBasics.value.profiles = val;
  },
});

const profileKeys = new WeakMap<Profile, number>();
let nextProfileKey = 0;

function getProfileKey(profile: Profile): number {
  let key = profileKeys.get(profile);
  if (key === undefined) {
    key = ++nextProfileKey;
    profileKeys.set(profile, key);
  }
  return key;
}

function addProfile() {
  if (!localBasics.value.profiles) localBasics.value.profiles = [];
  localBasics.value.profiles.push({ network: "", username: "", url: "" });
}

function removeProfile(index: number) {
  localBasics.value.profiles?.splice(index, 1);
}
</script>

<template>
  <div class="space-y-5">
    <div>
      <h3 class="text-base font-semibold">Basic Information</h3>
      <p class="text-xs text-muted-foreground">Personal details, location, and social profiles.</p>
    </div>

    <!-- Upwork Compliance Mode Switch -->
    <div
      class="p-3.5 border border-amber-500/20 rounded-md bg-amber-500/5 flex items-center justify-between transition-all"
    >
      <div class="space-y-1 pr-4">
        <div class="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <span
            class="inline-block w-2 h-2 rounded-full bg-amber-500"
            :class="{ 'animate-pulse': localBasicsHideContact }"
          ></span>
          Upwork Compliance Mode
        </div>
        <p class="text-xs text-muted-foreground leading-relaxed">
          Hides your email, phone, personal website, and social links in preview/exports. Keeps your
          input intact here.
        </p>
      </div>
      <Switch
        v-model="localBasicsHideContact"
        variant="amber"
        aria-label="Toggle Upwork Compliance Mode"
        class="flex-shrink-0"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="space-y-1">
        <Label for="name" class="text-xs">Name</Label>
        <Input
          id="name"
          v-model="localBasics.name"
          placeholder="John Doe"
          class="h-9 sm:h-8 text-base sm:text-xs"
        />
      </div>
      <div class="space-y-1">
        <Label for="label" class="text-xs">Title</Label>
        <Input
          id="label"
          v-model="localBasics.label"
          placeholder="Software Engineer"
          class="h-9 sm:h-8 text-base sm:text-xs"
        />
      </div>
      <div class="space-y-1">
        <Label for="email" class="text-xs">Email</Label>
        <Input
          id="email"
          type="email"
          v-model="localBasics.email"
          placeholder="john@example.com"
          class="h-9 sm:h-8 text-base sm:text-xs"
        />
      </div>
      <div class="space-y-1">
        <Label for="phone" class="text-xs">Phone</Label>
        <Input
          id="phone"
          v-model="localBasics.phone"
          placeholder="+1 (555) 000-0000"
          class="h-9 sm:h-8 text-base sm:text-xs"
        />
      </div>
      <div class="space-y-1">
        <Label for="url" class="text-xs">Website</Label>
        <Input
          id="url"
          v-model="localBasics.url"
          placeholder="https://johndoe.com"
          class="h-9 sm:h-8 text-base sm:text-xs"
        />
      </div>
      <div class="space-y-1">
        <Label for="image" class="text-xs">Profile Image URL</Label>
        <Input
          id="image"
          v-model="localBasics.image"
          placeholder="https://example.com/photo.jpg"
          class="h-9 sm:h-8 text-base sm:text-xs"
        />
      </div>
      <div class="space-y-1">
        <Label for="city" class="text-xs">City</Label>
        <Input
          id="city"
          v-model="localBasics.location.city"
          placeholder="Jakarta"
          class="h-9 sm:h-8 text-base sm:text-xs"
        />
      </div>
      <div class="space-y-1">
        <Label for="region" class="text-xs">Region / State</Label>
        <Input
          id="region"
          v-model="localBasics.location.region"
          placeholder="DKI Jakarta"
          class="h-9 sm:h-8 text-base sm:text-xs"
        />
      </div>
      <div class="space-y-1">
        <Label for="countryCode" class="text-xs">Country Code</Label>
        <Input
          id="countryCode"
          v-model="localBasics.location.countryCode"
          placeholder="ID"
          class="h-9 sm:h-8 text-base sm:text-xs"
        />
      </div>
      <div class="space-y-1">
        <Label for="address" class="text-xs">Address (Optional)</Label>
        <Input
          id="address"
          v-model="localBasics.location.address"
          placeholder="Street / Area"
          class="h-9 sm:h-8 text-base sm:text-xs"
        />
      </div>
    </div>

    <div class="space-y-1">
      <Label for="summary" class="text-xs">Summary</Label>
      <Textarea
        id="summary"
        v-model="localBasics.summary"
        placeholder="Brief professional summary..."
        class="min-h-[90px] text-base sm:text-xs"
      />
    </div>

    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <Label class="text-xs">Social Profiles</Label>
        <Button variant="outline" size="sm" class="h-8 text-xs" @click="addProfile">
          <Plus class="w-3.5 h-3.5 mr-1.5" /> Add Profile
        </Button>
      </div>

      <Draggable
        v-if="profilesList.length > 0"
        v-model="profilesList"
        :item-key="getProfileKey"
        handle=".handle"
        class="space-y-2.5"
      >
        <template #item="{ element, index }: { element: Profile; index: number }">
          <div class="flex items-start gap-2.5 p-3 border rounded-md bg-card">
            <div class="handle cursor-grab active:cursor-grabbing mt-2">
              <GripVertical class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div class="space-y-1">
                <Label class="text-xs">Network</Label>
                <Input
                  v-model="element.network"
                  placeholder="LinkedIn"
                  class="h-9 sm:h-8 text-base sm:text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Username</Label>
                <Input
                  v-model="element.username"
                  placeholder="johndoe"
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
            </div>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 sm:h-7 sm:w-7 text-muted-foreground hover:text-destructive flex-shrink-0 touch-manipulation"
              @click="removeProfile(index)"
              aria-label="Remove profile"
            >
              <Trash2 class="w-4 h-4" />
            </Button>
          </div>
        </template>
      </Draggable>
    </div>
  </div>
</template>
