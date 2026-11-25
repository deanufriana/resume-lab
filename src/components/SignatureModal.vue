<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { onKeyStroke } from "@vueuse/core";
import { X, Download, Trash2, PenTool, Check } from "lucide-vue-next";
import { Button, Switch } from "./ui";
import { useToast } from "../composables/useToast";
import { Analytics } from "../utils/analytics";

const props = defineProps<{
  open: boolean;
  showSignature?: boolean;
  existingSignatureUrl?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save-signature", payload: { dataUrl: string; showSignature: boolean }): void;
  (e: "toggle-show", value: boolean): void;
}>();

const toast = useToast();
const canvas = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);
const hasDrawn = ref(false);
const transparentBg = ref(true);
const includeOnResume = ref(props.showSignature ?? false);
let ctx: CanvasRenderingContext2D | null = null;
let lastX = 0;
let lastY = 0;

watch(
  () => props.open,
  async (isOpen) => {
    includeOnResume.value = props.showSignature ?? false;
    if (isOpen) {
      await nextTick();
      initCanvas();
    }
  },
);

onKeyStroke("Escape", () => {
  if (props.open) emit("close");
});

function initCanvas() {
  if (!canvas.value) return;
  const rect = canvas.value.parentElement?.getBoundingClientRect();
  if (rect && rect.width > 0) {
    canvas.value.width = rect.width;
    canvas.value.height = rect.height;
  }
  ctx = canvas.value.getContext("2d");
  if (ctx) {
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
  }
  hasDrawn.value = false;
}

function getCoordinates(e: PointerEvent) {
  if (!canvas.value) return { x: 0, y: 0 };
  const rect = canvas.value.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) * canvas.value.width) / rect.width,
    y: ((e.clientY - rect.top) * canvas.value.height) / rect.height,
  };
}

function startDrawing(e: PointerEvent) {
  isDrawing.value = true;
  hasDrawn.value = true;
  canvas.value?.setPointerCapture(e.pointerId);
  const { x, y } = getCoordinates(e);
  lastX = x;
  lastY = y;
  if (ctx) {
    ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  }
}

function draw(e: PointerEvent) {
  if (!isDrawing.value || !ctx) return;
  e.preventDefault();
  const { x, y } = getCoordinates(e);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  lastX = x;
  lastY = y;
}

function stopDrawing(e: PointerEvent) {
  if (isDrawing.value) {
    isDrawing.value = false;
    canvas.value?.releasePointerCapture(e.pointerId);
  }
}

function clearCanvas() {
  if (!ctx || !canvas.value) return;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  hasDrawn.value = false;
  Analytics.trackSignatureClear();
}

/**
 * Crops the drawn signature to its non-transparent bounding box with padding
 */
function getCroppedSignatureDataUrl(withWhiteBg: boolean): string | null {
  if (!canvas.value || !ctx) return null;
  const { width, height } = canvas.value;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        found = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!found) return null;

  const pad = 12;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(width - cropX, maxX - minX + pad * 2);
  const cropH = Math.min(height - cropY, maxY - minY + pad * 2);

  const out = document.createElement("canvas");
  out.width = cropW;
  out.height = cropH;
  const outCtx = out.getContext("2d");
  if (!outCtx) return null;

  if (withWhiteBg) {
    outCtx.fillStyle = "#ffffff";
    outCtx.fillRect(0, 0, cropW, cropH);
  }
  outCtx.drawImage(canvas.value, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
  return out.toDataURL("image/png", 1.0);
}

function exportPNG() {
  const dataUrl = getCroppedSignatureDataUrl(!transparentBg.value);
  if (!dataUrl) {
    toast.error("Please draw your signature first.");
    return;
  }
  const link = document.createElement("a");
  link.download = "signature.png";
  link.href = dataUrl;
  link.click();
  toast.success("Cropped PNG exported!");
  Analytics.trackSignatureExport();
}

function applyToResume() {
  const dataUrl = hasDrawn.value
    ? getCroppedSignatureDataUrl(false)
    : props.existingSignatureUrl || null;

  if (!dataUrl && includeOnResume.value) {
    toast.error("Draw a signature first to include it on your resume.");
    return;
  }

  emit("save-signature", {
    dataUrl: dataUrl || "",
    showSignature: includeOnResume.value,
  });
  toast.success(
    includeOnResume.value ? "Signature attached to resume" : "Signature settings saved",
  );
  emit("close");
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4 no-print"
        @click.self="emit('close')"
      >
        <div
          class="w-full max-w-xl max-h-[92dvh] bg-popover text-popover-foreground border rounded-t-xl sm:rounded-lg shadow-xl overflow-hidden flex flex-col"
        >
          <div
            class="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b flex-shrink-0"
          >
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                <PenTool class="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h2 class="text-sm font-semibold">Signature Studio</h2>
                <p class="text-xs text-muted-foreground">
                  Auto-cropped transparent PNG & resume footer stamp
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8"
              aria-label="Close modal"
              @click="emit('close')"
            >
              <X class="w-4 h-4" />
            </Button>
          </div>

          <div class="p-3.5 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
            <div
              class="w-full bg-white border border-dashed border-border ring-1 ring-border rounded-md overflow-hidden relative"
            >
              <div class="relative w-full h-44 sm:h-56">
                <canvas
                  ref="canvas"
                  class="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                  @pointerdown="startDrawing"
                  @pointermove="draw"
                  @pointerup="stopDrawing"
                  @pointerleave="stopDrawing"
                />
                <div
                  v-if="!hasDrawn"
                  class="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <span class="text-sm text-slate-400 font-medium">Draw your signature here</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div class="flex items-center gap-2">
                <Switch size="sm" v-model="transparentBg" aria-label="Transparent PNG background" />
                <span>Transparent PNG background</span>
              </div>

              <div class="flex items-center gap-2">
                <Switch
                  size="sm"
                  v-model="includeOnResume"
                  aria-label="Include signature on resume footer"
                />
                <span class="font-medium">Include signature on resume footer</span>
              </div>
            </div>
          </div>

          <div
            class="px-4 sm:px-5 py-3 sm:py-3.5 border-t bg-muted/20 flex flex-wrap items-center justify-between gap-2 flex-shrink-0"
          >
            <Button variant="outline" size="sm" class="gap-1.5" @click="clearCanvas">
              <Trash2 class="w-3.5 h-3.5" /> Clear
            </Button>
            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                class="gap-1.5"
                :disabled="!hasDrawn"
                @click="exportPNG"
              >
                <Download class="w-3.5 h-3.5" /> Export PNG
              </Button>
              <Button size="sm" class="gap-1.5" @click="applyToResume">
                <Check class="w-3.5 h-3.5" /> Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
