<script setup lang="ts">
import { FileUp, Download, Eye } from "lucide-vue-next";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui";
import FileUpload from "../components/ui/FileUpload.vue";
import type { Resume } from "../types/resume";

defineProps<{
  resumeData: Resume;
}>();

const emit = defineEmits<{
  (e: "file-loaded", data: any): void;
  (e: "download-example"): void;
  (e: "view-current"): void;
}>();
</script>

<template>
  <div class="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
    <Card class="border-dashed border-2 bg-card/50 backdrop-blur-sm">
      <CardHeader class="text-center">
        <div class="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <FileUp class="w-6 h-6 text-primary" />
        </div>
        <CardTitle class="text-3xl">Get Started</CardTitle>
        <CardDescription>
          Upload your resume in JSON format or download our example to see how it works.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <FileUpload @file-loaded="(data) => emit('file-loaded', data)" />
        <div class="flex items-center justify-center gap-4 pt-4">
          <Button variant="outline" @click="emit('download-example')" class="gap-2">
            <Download class="w-4 h-4" /> Example JSON
          </Button>
          <Button v-if="resumeData.basics?.name" @click="emit('view-current')" class="gap-2">
            View Current <Eye class="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
