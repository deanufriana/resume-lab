import { ref, onMounted, onUnmounted, nextTick, onUpdated, type Ref } from 'vue';

/**
 * Composable for managing resume preview container height calculations
 * Handles ResizeObserver setup and content height tracking
 */
export function useResumePreview(containerRef: Ref<HTMLElement | null>) {
  const contentHeight = ref(0);
  let resizeObserver: ResizeObserver | null = null;

  function calculateContentHeight() {
    nextTick(() => {
      if (containerRef.value) {
        contentHeight.value = containerRef.value.scrollHeight;
      }
    });
  }

  onMounted(() => {
    calculateContentHeight();
    window.addEventListener('resize', calculateContentHeight);

    if (containerRef.value) {
      resizeObserver = new ResizeObserver(() => {
        calculateContentHeight();
      });
      resizeObserver.observe(containerRef.value);
    }
  });

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    window.removeEventListener('resize', calculateContentHeight);
  });

  onUpdated(() => {
    calculateContentHeight();
  });

  return {
    contentHeight,
    calculateContentHeight,
  };
}

