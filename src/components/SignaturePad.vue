<template>
  <div class="flex flex-col items-center w-full max-w-3xl mx-auto">
    <div class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-foreground mb-2">Draw Your Signature</h2>
      <p class="text-muted-foreground text-sm">Draw your signature below and export it as a PNG file. Use your mouse or touch screen.</p>
    </div>
    
    <div class="w-full bg-white border-2 border-dashed border-border rounded-xl overflow-hidden relative">
      <!-- Responsive container that maintains aspect ratio or sets limits -->
      <div class="relative w-full" style="height: 300px;">
        <canvas
          ref="canvas"
          class="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          @pointerdown="startDrawing"
          @pointermove="draw"
          @pointerup="stopDrawing"
          @pointerleave="stopDrawing"
        ></canvas>
        <div v-if="!hasDrawn" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <span class="text-2xl text-muted-foreground font-medium">Draw here</span>
        </div>
      </div>
    </div>

    <div class="flex gap-4 mt-8 w-full justify-center">
      <Button variant="outline" @click="clearCanvas" class="w-32">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Clear
      </Button>
      <Button @click="exportPNG" :disabled="!hasDrawn" class="w-48 bg-blue-600 hover:bg-blue-700">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export PNG
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Button from './ui/Button.vue';
import { useToast } from '../composables/useToast';
import { Analytics } from '../utils/analytics';

const toast = useToast();
const canvas = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);
const hasDrawn = ref(false);
let ctx: CanvasRenderingContext2D | null = null;
let lastX = 0;
let lastY = 0;

// Resize observer to handle canvas resizing without stretching pixels
let resizeObserver: ResizeObserver | null = null;

const initCanvas = () => {
  if (canvas.value) {
    // Set internal canvas resolution to match display size to prevent stretching
    const rect = canvas.value.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.value.width = rect.width;
      canvas.value.height = rect.height;
    }
    
    ctx = canvas.value.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0f172a'; // Slate 900
    }
  }
};

onMounted(() => {
  initCanvas();
  
  if (canvas.value?.parentElement) {
    resizeObserver = new ResizeObserver(() => {
      // Re-init canvas on resize (this clears it, which is fine for simple usage, 
      // but if we want to preserve drawing we'd need to copy it)
      const currentHasDrawn = hasDrawn.value;
      
      // Basic resize handler without saving rect since width/height are derived when drawing
      if (!currentHasDrawn) {
        initCanvas();
      }
    });
    resizeObserver.observe(canvas.value.parentElement);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

const getCoordinates = (e: PointerEvent) => {
  if (!canvas.value) return { x: 0, y: 0 };
  const rect = canvas.value.getBoundingClientRect();
  
  // Calculate relative position factoring in actual dimensions
  const scaleX = canvas.value.width / rect.width;
  const scaleY = canvas.value.height / rect.height;
  
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
};

const startDrawing = (e: PointerEvent) => {
  isDrawing.value = true;
  hasDrawn.value = true;
  canvas.value?.setPointerCapture(e.pointerId);
  const { x, y } = getCoordinates(e);
  lastX = x;
  lastY = y;
  
  // Draw a dot on simple click without moving
  if (ctx) {
    ctx.beginPath();
    ctx.arc(x, y, (ctx.lineWidth || 3) / 2, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  }
};

const draw = (e: PointerEvent) => {
  if (!isDrawing.value || !ctx) return;
  e.preventDefault();
  const { x, y } = getCoordinates(e);
  
  // Improve drawing smoothness by using quadratic curves if we tracked older points,
  // but linear interpolation is often fine for basic signatures on small screens.
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  
  lastX = x;
  lastY = y;
};

const stopDrawing = (e: PointerEvent) => {
  if (isDrawing.value) {
    isDrawing.value = false;
    canvas.value?.releasePointerCapture(e.pointerId);
  }
};

const clearCanvas = () => {
  if (!ctx || !canvas.value) return;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  hasDrawn.value = false;
  toast.info('Canvas cleared');
  Analytics.trackSignatureClear();
};

const exportPNG = () => {
  if (!canvas.value) return;
  
  try {
    // Create a temporary canvas because we want a white background for our transparent drawing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // We only take the exact drawn area if possible, but for simplicity we export the whole canvas 
    tempCanvas.width = canvas.value.width;
    tempCanvas.height = canvas.value.height;
    
    if (tempCtx) {
      // White background for the PNG
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      // Original signature over white background
      tempCtx.drawImage(canvas.value, 0, 0);
      
      const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Signature exported successfully!');
      Analytics.trackSignatureExport();
    }
  } catch (err) {
    toast.error('Failed to export signature.');
    console.error(err);
  }
};
</script>
