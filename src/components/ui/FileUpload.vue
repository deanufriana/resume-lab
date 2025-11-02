<template>
  <div class="flex items-center justify-center w-full">
    <label
      :for="inputId"
      :class="cn(
        'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100',
        className
      )"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <svg
          class="w-10 h-10 mb-3 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p class="mb-2 text-sm text-gray-500">
          <span class="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p class="text-xs text-gray-500">JSON file only</p>
      </div>
      <input
        :id="inputId"
        type="file"
        class="hidden"
        accept=".json,application/json"
        @change="handleFileChange"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
import { cn } from '../../utils/cn';

interface Props {
  inputId?: string;
  className?: string;
}

withDefaults(defineProps<Props>(), {
  inputId: 'file-upload',
  className: '',
});

const emit = defineEmits<{
  fileLoaded: [data: any];
  error: [message: string];
}>();

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    emit('error', 'Please upload a valid JSON file');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target?.result as string);
      emit('fileLoaded', jsonData);
    } catch (error) {
      emit('error', 'Invalid JSON file. Please check the file format.');
    }
  };
  reader.onerror = () => {
    emit('error', 'Error reading file');
  };
  reader.readAsText(file);
}
</script>

