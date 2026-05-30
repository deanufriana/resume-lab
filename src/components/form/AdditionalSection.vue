<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Resume } from '../../types/resume'
import { Input, Textarea, Button, Separator, FieldGroup, Field, FieldLabel } from '../ui/index'
import { Plus, Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  resume: Resume
}>()

const emit = defineEmits<{
  (e: 'update:resume', value: Resume): void
}>()

const localResume = reactive({ ...props.resume })

watch(localResume, (newValue) => {
  emit('update:resume', newValue)
}, { deep: true })

// Helper functions for adding/removing items
function addItem(arrayName: keyof Resume, defaultItem: any) {
  if (!localResume[arrayName]) (localResume as any)[arrayName] = []
  ;(localResume as any)[arrayName].push(defaultItem)
}

function removeItem(arrayName: keyof Resume, index: number) {
  ;(localResume as any)[arrayName].splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-8 pb-10">
    <!-- Awards Section -->
    <section class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Awards</h3>
        <Button variant="outline" size="sm" @click="addItem('awards', { title: '', date: '', awarder: '', summary: '' })">
          <Plus data-icon="inline-start" /> Add Award
        </Button>
      </div>
      <div v-for="(award, index) in localResume.awards" :key="index" class="p-4 border rounded-lg bg-muted/20 relative group">
        <Button variant="ghost" size="icon" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" @click="removeItem('awards', index)">
          <Trash2 class="size-4" />
        </Button>
        <FieldGroup class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <Field>
            <FieldLabel class="text-xs">Title</FieldLabel>
            <Input v-model="award.title" placeholder="Employee of the Month" />
          </Field>
          <Field>
            <FieldLabel class="text-xs">Date</FieldLabel>
            <Input v-model="award.date" type="date" />
          </Field>
          <Field class="md:col-span-2">
            <FieldLabel class="text-xs">Awarder</FieldLabel>
            <Input v-model="award.awarder" placeholder="Company Name" />
          </Field>
          <Field class="md:col-span-2">
            <FieldLabel class="text-xs">Summary</FieldLabel>
            <Textarea v-model="award.summary" placeholder="Brief description of the award..." />
          </Field>
        </FieldGroup>
      </div>
      <p v-if="!localResume.awards?.length" class="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No awards added yet.</p>
    </section>

    <Separator />

    <!-- Certificates Section -->
    <section class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Certificates</h3>
        <Button variant="outline" size="sm" @click="addItem('certificates', { name: '', date: '', issuer: '', url: '' })">
          <Plus data-icon="inline-start" /> Add Certificate
        </Button>
      </div>
      <div v-for="(cert, index) in localResume.certificates" :key="index" class="p-4 border rounded-lg bg-muted/20 relative group">
        <Button variant="ghost" size="icon" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" @click="removeItem('certificates', index)">
          <Trash2 class="size-4" />
        </Button>
        <FieldGroup class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <Field>
            <FieldLabel class="text-xs">Name</FieldLabel>
            <Input v-model="cert.name" placeholder="AWS Certified Architect" />
          </Field>
          <Field>
            <FieldLabel class="text-xs">Date</FieldLabel>
            <Input v-model="cert.date" type="date" />
          </Field>
          <Field>
            <FieldLabel class="text-xs">Issuer</FieldLabel>
            <Input v-model="cert.issuer" placeholder="Amazon Web Services" />
          </Field>
          <Field>
            <FieldLabel class="text-xs">URL</FieldLabel>
            <Input v-model="cert.url" placeholder="https://..." />
          </Field>
        </FieldGroup>
      </div>
      <p v-if="!localResume.certificates?.length" class="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No certificates added yet.</p>
    </section>

    <Separator />

    <!-- Languages Section -->
    <section class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Languages</h3>
        <Button variant="outline" size="sm" @click="addItem('languages', { language: '', fluency: '' })">
          <Plus data-icon="inline-start" /> Add Language
        </Button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(lang, index) in localResume.languages" :key="index" class="flex items-end gap-2 p-3 border rounded-lg bg-muted/20 relative group">
          <FieldGroup class="flex-1 grid grid-cols-2 gap-2">
            <Field>
              <FieldLabel class="text-xs">Language</FieldLabel>
              <Input v-model="lang.language" placeholder="English" size="sm" />
            </Field>
            <Field>
              <FieldLabel class="text-xs">Fluency</FieldLabel>
              <Input v-model="lang.fluency" placeholder="Native / Professional" size="sm" />
            </Field>
          </FieldGroup>
          <Button variant="ghost" size="icon" class="text-destructive size-8" @click="removeItem('languages', index)">
            <Trash2 class="size-4" />
          </Button>
        </div>
      </div>
      <p v-if="!localResume.languages?.length" class="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No languages added yet.</p>
    </section>

    <Separator />

    <!-- Interests Section -->
    <section class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Interests</h3>
        <Button variant="outline" size="sm" @click="addItem('interests', { name: '', keywords: [] })">
          <Plus data-icon="inline-start" /> Add Interest
        </Button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldGroup v-for="(interest, index) in localResume.interests" :key="index" class="flex flex-col gap-3 p-3 border rounded-lg bg-muted/20 relative group">
          <Button variant="ghost" size="icon" class="absolute top-1 right-1 size-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" @click="removeItem('interests', index)">
            <Trash2 class="size-3" />
          </Button>
          <Field>
            <FieldLabel class="text-xs">Name</FieldLabel>
            <Input v-model="interest.name" placeholder="Photography" size="sm" />
          </Field>
          <Field>
            <FieldLabel class="text-xs">Keywords (comma-separated)</FieldLabel>
            <Input 
              :model-value="interest.keywords?.join(', ')" 
              @update:model-value="val => interest.keywords = (val as string).split(',').map(s => s.trim()).filter(Boolean)"
              placeholder="Nature, Urban, Portrait" 
              size="sm"
            />
          </Field>
        </FieldGroup>
      </div>
      <p v-if="!localResume.interests?.length" class="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No interests added yet.</p>
    </section>

    <Separator />

    <!-- Volunteer Section -->
    <section class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Volunteer</h3>
        <Button variant="outline" size="sm" @click="addItem('volunteer', { organization: '', position: '', url: '', startDate: '', endDate: '', summary: '', highlights: [] })">
          <Plus data-icon="inline-start" /> Add Volunteer
        </Button>
      </div>
      <div v-for="(vol, index) in localResume.volunteer" :key="index" class="p-4 border rounded-lg bg-muted/20 relative group">
        <Button variant="ghost" size="icon" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" @click="removeItem('volunteer', index)">
          <Trash2 class="size-4" />
        </Button>
        <FieldGroup class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <Field>
            <FieldLabel class="text-xs">Organization</FieldLabel>
            <Input v-model="vol.organization" placeholder="Red Cross" />
          </Field>
          <Field>
            <FieldLabel class="text-xs">Position</FieldLabel>
            <Input v-model="vol.position" placeholder="Volunteer" />
          </Field>
          <Field class="md:col-span-2">
            <FieldLabel class="text-xs">Summary</FieldLabel>
            <Textarea v-model="vol.summary" placeholder="Brief description of your volunteering..." />
          </Field>
        </FieldGroup>
      </div>
      <p v-if="!localResume.volunteer?.length" class="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No volunteer experience added yet.</p>
    </section>

    <Separator />

    <!-- Publications Section -->
    <section class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Publications</h3>
        <Button variant="outline" size="sm" @click="addItem('publications', { name: '', publisher: '', releaseDate: '', url: '', summary: '' })">
          <Plus data-icon="inline-start" /> Add Publication
        </Button>
      </div>
      <div v-for="(pub, index) in localResume.publications" :key="index" class="p-4 border rounded-lg bg-muted/20 relative group">
        <Button variant="ghost" size="icon" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" @click="removeItem('publications', index)">
          <Trash2 class="size-4" />
        </Button>
        <FieldGroup class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <Field>
            <FieldLabel class="text-xs">Name</FieldLabel>
            <Input v-model="pub.name" placeholder="Article Title" />
          </Field>
          <Field>
            <FieldLabel class="text-xs">Publisher</FieldLabel>
            <Input v-model="pub.publisher" placeholder="Journal Name" />
          </Field>
        </FieldGroup>
      </div>
      <p v-if="!localResume.publications?.length" class="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No publications added yet.</p>
    </section>
  </div>
</template>
