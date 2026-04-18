<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Resume } from '../../types/resume'
import { Input, Label, Textarea, Button, Separator } from '../ui/index'
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
  <div class="space-y-8 pb-10">
    <!-- Awards Section -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Awards</h3>
        <Button variant="outline" size="sm" @click="addItem('awards', { title: '', date: '', awarder: '', summary: '' })">
          <Plus class="w-4 h-4 mr-2" /> Add Award
        </Button>
      </div>
      <div v-for="(award, index) in localResume.awards" :key="index" class="p-4 border rounded-lg bg-muted/20 relative group">
        <Button variant="ghost" size="icon" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" @click="removeItem('awards', index)">
          <Trash2 class="w-4 h-4" />
        </Button>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div class="space-y-1">
            <Label class="text-xs">Title</Label>
            <Input v-model="award.title" placeholder="Employee of the Month" />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Date</Label>
            <Input v-model="award.date" type="date" />
          </div>
          <div class="space-y-1 md:col-span-2">
            <Label class="text-xs">Awarder</Label>
            <Input v-model="award.awarder" placeholder="Company Name" />
          </div>
          <div class="space-y-1 md:col-span-2">
            <Label class="text-xs">Summary</Label>
            <Textarea v-model="award.summary" placeholder="Brief description of the award..." />
          </div>
        </div>
      </div>
      <p v-if="!localResume.awards?.length" class="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No awards added yet.</p>
    </section>

    <Separator />

    <!-- Certificates Section -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Certificates</h3>
        <Button variant="outline" size="sm" @click="addItem('certificates', { name: '', date: '', issuer: '', url: '' })">
          <Plus class="w-4 h-4 mr-2" /> Add Certificate
        </Button>
      </div>
      <div v-for="(cert, index) in localResume.certificates" :key="index" class="p-4 border rounded-lg bg-muted/20 relative group">
        <Button variant="ghost" size="icon" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" @click="removeItem('certificates', index)">
          <Trash2 class="w-4 h-4" />
        </Button>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div class="space-y-1">
            <Label class="text-xs">Name</Label>
            <Input v-model="cert.name" placeholder="AWS Certified Architect" />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Date</Label>
            <Input v-model="cert.date" type="date" />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Issuer</Label>
            <Input v-model="cert.issuer" placeholder="Amazon Web Services" />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">URL</Label>
            <Input v-model="cert.url" placeholder="https://..." />
          </div>
        </div>
      </div>
      <p v-if="!localResume.certificates?.length" class="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No certificates added yet.</p>
    </section>

    <Separator />

    <!-- Languages Section -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Languages</h3>
        <Button variant="outline" size="sm" @click="addItem('languages', { language: '', fluency: '' })">
          <Plus class="w-4 h-4 mr-2" /> Add Language
        </Button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(lang, index) in localResume.languages" :key="index" class="flex items-end gap-2 p-3 border rounded-lg bg-muted/20 relative group">
          <div class="flex-1 space-y-1">
            <Label class="text-xs">Language</Label>
            <Input v-model="lang.language" placeholder="English" size="sm" />
          </div>
          <div class="flex-1 space-y-1">
            <Label class="text-xs">Fluency</Label>
            <Input v-model="lang.fluency" placeholder="Native / Professional" size="sm" />
          </div>
          <Button variant="ghost" size="icon" class="text-destructive h-8 w-8" @click="removeItem('languages', index)">
            <Trash2 class="w-4 h-4" />
          </Button>
        </div>
      </div>
      <p v-if="!localResume.languages?.length" class="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No languages added yet.</p>
    </section>

    <Separator />

    <!-- Interests Section -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Interests</h3>
        <Button variant="outline" size="sm" @click="addItem('interests', { name: '', keywords: [] })">
          <Plus class="w-4 h-4 mr-2" /> Add Interest
        </Button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(interest, index) in localResume.interests" :key="index" class="space-y-1 p-3 border rounded-lg bg-muted/20 relative group">
          <Button variant="ghost" size="icon" class="absolute top-1 right-1 h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" @click="removeItem('interests', index)">
            <Trash2 class="w-3 h-3" />
          </Button>
          <div class="space-y-1">
            <Label class="text-xs">Name</Label>
            <Input v-model="interest.name" placeholder="Photography" size="sm" />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Keywords (comma-separated)</Label>
            <Input 
              :model-value="interest.keywords?.join(', ')" 
              @update:model-value="val => interest.keywords = (val as string).split(',').map(s => s.trim()).filter(Boolean)"
              placeholder="Nature, Urban, Portrait" 
              size="sm"
            />
          </div>
        </div>
      </div>
      <p v-if="!localResume.interests?.length" class="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No interests added yet.</p>
    </section>

    <Separator />

    <!-- Volunteer Section -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Volunteer</h3>
        <Button variant="outline" size="sm" @click="addItem('volunteer', { organization: '', position: '', url: '', startDate: '', endDate: '', summary: '', highlights: [] })">
          <Plus class="w-4 h-4 mr-2" /> Add Volunteer
        </Button>
      </div>
      <div v-for="(vol, index) in localResume.volunteer" :key="index" class="p-4 border rounded-lg bg-muted/20 relative group">
        <Button variant="ghost" size="icon" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" @click="removeItem('volunteer', index)">
          <Trash2 class="w-4 h-4" />
        </Button>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div class="space-y-1">
            <Label class="text-xs">Organization</Label>
            <Input v-model="vol.organization" placeholder="Red Cross" />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Position</Label>
            <Input v-model="vol.position" placeholder="Volunteer" />
          </div>
          <div class="space-y-1 md:col-span-2">
            <Label class="text-xs">Summary</Label>
            <Textarea v-model="vol.summary" placeholder="Brief description of your volunteering..." />
          </div>
        </div>
      </div>
      <p v-if="!localResume.volunteer?.length" class="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No volunteer experience added yet.</p>
    </section>

    <Separator />

    <!-- Publications Section -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Publications</h3>
        <Button variant="outline" size="sm" @click="addItem('publications', { name: '', publisher: '', releaseDate: '', url: '', summary: '' })">
          <Plus class="w-4 h-4 mr-2" /> Add Publication
        </Button>
      </div>
      <div v-for="(pub, index) in localResume.publications" :key="index" class="p-4 border rounded-lg bg-muted/20 relative group">
        <Button variant="ghost" size="icon" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" @click="removeItem('publications', index)">
          <Trash2 class="w-4 h-4" />
        </Button>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div class="space-y-1">
            <Label class="text-xs">Name</Label>
            <Input v-model="pub.name" placeholder="Article Title" />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Publisher</Label>
            <Input v-model="pub.publisher" placeholder="Journal Name" />
          </div>
        </div>
      </div>
      <p v-if="!localResume.publications?.length" class="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">No publications added yet.</p>
    </section>
  </div>
</template>
