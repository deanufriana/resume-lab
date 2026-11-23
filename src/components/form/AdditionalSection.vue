<script setup lang="ts">
import { ref, watch } from "vue";
import type { Resume } from "../../types/resume";
import { toMonthInput } from "../../utils/date";
import {
  Input,
  Label,
  Textarea,
  Button,
  Separator,
  TagInput,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/index";
import { Plus, Trash2 } from "lucide-vue-next";

const props = defineProps<{
  resume: Resume;
}>();

const emit = defineEmits<{
  (e: "update:resume", value: Resume): void;
}>();

const localResume = ref<Resume>(JSON.parse(JSON.stringify(props.resume)));

watch(
  () => props.resume,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(localResume.value)) {
      localResume.value = JSON.parse(JSON.stringify(newValue));
    }
  },
  { deep: true },
);

watch(
  localResume,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(props.resume)) {
      emit("update:resume", JSON.parse(JSON.stringify(newValue)));
    }
  },
  { deep: true },
);

function addItem(arrayName: keyof Resume, defaultItem: unknown) {
  if (!localResume.value[arrayName]) {
    (localResume.value as Record<string, unknown>)[arrayName] = [];
  }
  (localResume.value[arrayName] as unknown[]).push(defaultItem);
}

function removeItem(arrayName: keyof Resume, index: number) {
  (localResume.value[arrayName] as unknown[] | undefined)?.splice(index, 1);
}
</script>

<template>
  <div class="space-y-6 pb-8">
    <!-- Awards -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-semibold">Awards</h3>
          <p class="text-xs text-muted-foreground">Honors, prizes, or recognitions.</p>
        </div>
        <Button
          size="sm"
          class="h-8 text-xs"
          @click="addItem('awards', { title: '', date: '', awarder: '', summary: '' })"
        >
          <Plus class="w-3.5 h-3.5 mr-1.5" /> Add Award
        </Button>
      </div>

      <div v-if="localResume.awards?.length" class="space-y-3">
        <Card
          v-for="(award, index) in localResume.awards"
          :key="index"
          class="border-border/80 shadow-none"
        >
          <CardHeader class="p-3.5">
            <div class="flex items-center justify-between gap-2">
              <CardTitle class="text-sm font-semibold truncate">
                {{ award.title || `Award #${index + 1}` }}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                class="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                @click="removeItem('awards', index)"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent class="p-3.5 pt-0 space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <Label class="text-xs">Title</Label>
                <Input
                  v-model="award.title"
                  placeholder="Employee of the Month"
                  class="h-8 text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Date</Label>
                <Input
                  type="month"
                  :model-value="toMonthInput(award.date)"
                  @update:model-value="(v) => (award.date = String(v))"
                  class="h-8 text-xs"
                />
              </div>
              <div class="space-y-1 sm:col-span-2">
                <Label class="text-xs">Awarder</Label>
                <Input v-model="award.awarder" placeholder="Company Name" class="h-8 text-xs" />
              </div>
              <div class="space-y-1 sm:col-span-2">
                <Label class="text-xs">Summary</Label>
                <Textarea
                  v-model="award.summary"
                  placeholder="Brief description of the award..."
                  class="min-h-[60px] text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <p
        v-else
        class="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md bg-muted/20"
      >
        No awards added yet.
      </p>
    </section>

    <Separator />

    <!-- Certificates -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-semibold">Certificates</h3>
          <p class="text-xs text-muted-foreground">Professional certifications and licenses.</p>
        </div>
        <Button
          size="sm"
          class="h-8 text-xs"
          @click="addItem('certificates', { name: '', date: '', issuer: '', url: '' })"
        >
          <Plus class="w-3.5 h-3.5 mr-1.5" /> Add Certificate
        </Button>
      </div>

      <div v-if="localResume.certificates?.length" class="space-y-3">
        <Card
          v-for="(cert, index) in localResume.certificates"
          :key="index"
          class="border-border/80 shadow-none"
        >
          <CardHeader class="p-3.5">
            <div class="flex items-center justify-between gap-2">
              <CardTitle class="text-sm font-semibold truncate">
                {{ cert.name || `Certificate #${index + 1}` }}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                class="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                @click="removeItem('certificates', index)"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent class="p-3.5 pt-0 space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <Label class="text-xs">Name</Label>
                <Input
                  v-model="cert.name"
                  placeholder="AWS Certified Architect"
                  class="h-8 text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Date</Label>
                <Input
                  type="month"
                  :model-value="toMonthInput(cert.date)"
                  @update:model-value="(v) => (cert.date = String(v))"
                  class="h-8 text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Issuer</Label>
                <Input
                  v-model="cert.issuer"
                  placeholder="Amazon Web Services"
                  class="h-8 text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">URL</Label>
                <Input v-model="cert.url" placeholder="https://..." class="h-8 text-xs" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <p
        v-else
        class="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md bg-muted/20"
      >
        No certificates added yet.
      </p>
    </section>

    <Separator />

    <!-- Languages -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-semibold">Languages</h3>
          <p class="text-xs text-muted-foreground">Spoken or written languages.</p>
        </div>
        <Button
          size="sm"
          class="h-8 text-xs"
          @click="addItem('languages', { language: '', fluency: '' })"
        >
          <Plus class="w-3.5 h-3.5 mr-1.5" /> Add Language
        </Button>
      </div>

      <div v-if="localResume.languages?.length" class="space-y-2.5">
        <div
          v-for="(lang, index) in localResume.languages"
          :key="index"
          class="flex items-end gap-2.5 p-3 border border-border/80 rounded-md bg-card"
        >
          <div class="flex-1 space-y-1">
            <Label class="text-xs">Language</Label>
            <Input v-model="lang.language" placeholder="English" class="h-8 text-xs" />
          </div>
          <div class="flex-1 space-y-1">
            <Label class="text-xs">Fluency</Label>
            <Input v-model="lang.fluency" placeholder="Native / Professional" class="h-8 text-xs" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
            @click="removeItem('languages', index)"
          >
            <Trash2 class="w-4 h-4" />
          </Button>
        </div>
      </div>
      <p
        v-else
        class="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md bg-muted/20"
      >
        No languages added yet.
      </p>
    </section>

    <Separator />

    <!-- Interests -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-semibold">Interests</h3>
          <p class="text-xs text-muted-foreground">Hobbies or personal topics.</p>
        </div>
        <Button
          size="sm"
          class="h-8 text-xs"
          @click="addItem('interests', { name: '', keywords: [] })"
        >
          <Plus class="w-3.5 h-3.5 mr-1.5" /> Add Interest
        </Button>
      </div>

      <div v-if="localResume.interests?.length" class="space-y-3">
        <Card
          v-for="(interest, index) in localResume.interests"
          :key="index"
          class="border-border/80 shadow-none"
        >
          <CardHeader class="p-3.5">
            <div class="flex items-center justify-between gap-2">
              <CardTitle class="text-sm font-semibold truncate">
                {{ interest.name || `Interest #${index + 1}` }}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                class="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                @click="removeItem('interests', index)"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent class="p-3.5 pt-0 space-y-3">
            <div class="space-y-1">
              <Label class="text-xs">Name</Label>
              <Input v-model="interest.name" placeholder="Photography" class="h-8 text-xs" />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">Keywords</Label>
              <TagInput
                :model-value="interest.keywords || []"
                @update:model-value="(val) => (interest.keywords = val)"
                placeholder="Nature, Urban, Portrait..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <p
        v-else
        class="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md bg-muted/20"
      >
        No interests added yet.
      </p>
    </section>

    <Separator />

    <!-- Volunteer -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-semibold">Volunteer</h3>
          <p class="text-xs text-muted-foreground">Community or open-source contributions.</p>
        </div>
        <Button
          size="sm"
          class="h-8 text-xs"
          @click="
            addItem('volunteer', {
              organization: '',
              position: '',
              url: '',
              startDate: '',
              endDate: '',
              summary: '',
              highlights: [],
            })
          "
        >
          <Plus class="w-3.5 h-3.5 mr-1.5" /> Add Volunteer
        </Button>
      </div>

      <div v-if="localResume.volunteer?.length" class="space-y-3">
        <Card
          v-for="(vol, index) in localResume.volunteer"
          :key="index"
          class="border-border/80 shadow-none"
        >
          <CardHeader class="p-3.5">
            <div class="flex items-center justify-between gap-2">
              <CardTitle class="text-sm font-semibold truncate">
                {{ vol.organization || `Volunteer #${index + 1}` }}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                class="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                @click="removeItem('volunteer', index)"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent class="p-3.5 pt-0 space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <Label class="text-xs">Organization</Label>
                <Input v-model="vol.organization" placeholder="Red Cross" class="h-8 text-xs" />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Position</Label>
                <Input v-model="vol.position" placeholder="Volunteer" class="h-8 text-xs" />
              </div>
              <div class="space-y-1 sm:col-span-2">
                <Label class="text-xs">Summary</Label>
                <Textarea
                  v-model="vol.summary"
                  placeholder="Brief description of your volunteering..."
                  class="min-h-[60px] text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <p
        v-else
        class="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md bg-muted/20"
      >
        No volunteer experience added yet.
      </p>
    </section>

    <Separator />

    <!-- Publications -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-semibold">Publications</h3>
          <p class="text-xs text-muted-foreground">Articles, papers, or talks.</p>
        </div>
        <Button
          size="sm"
          class="h-8 text-xs"
          @click="
            addItem('publications', {
              name: '',
              publisher: '',
              releaseDate: '',
              url: '',
              summary: '',
            })
          "
        >
          <Plus class="w-3.5 h-3.5 mr-1.5" /> Add Publication
        </Button>
      </div>

      <div v-if="localResume.publications?.length" class="space-y-3">
        <Card
          v-for="(pub, index) in localResume.publications"
          :key="index"
          class="border-border/80 shadow-none"
        >
          <CardHeader class="p-3.5">
            <div class="flex items-center justify-between gap-2">
              <CardTitle class="text-sm font-semibold truncate">
                {{ pub.name || `Publication #${index + 1}` }}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                class="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                @click="removeItem('publications', index)"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent class="p-3.5 pt-0 space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <Label class="text-xs">Name</Label>
                <Input v-model="pub.name" placeholder="Article Title" class="h-8 text-xs" />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Publisher</Label>
                <Input v-model="pub.publisher" placeholder="Journal Name" class="h-8 text-xs" />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">Release Date</Label>
                <Input
                  type="month"
                  :model-value="toMonthInput(pub.releaseDate)"
                  @update:model-value="(v) => (pub.releaseDate = String(v))"
                  class="h-8 text-xs"
                />
              </div>
              <div class="space-y-1">
                <Label class="text-xs">URL</Label>
                <Input v-model="pub.url" placeholder="https://..." class="h-8 text-xs" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <p
        v-else
        class="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md bg-muted/20"
      >
        No publications added yet.
      </p>
    </section>
  </div>
</template>
