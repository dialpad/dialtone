<!-- eslint-disable max-len -->
<template>
  <div class="showcase-carousel-wrapper">
    <div ref="carouselContainerRef" class="showcase-carousel">
      <dt-stack ref="carouselTrackRef" direction="row" gap="800" class="showcase-carousel__track">
        <div
          v-for="item in showcaseItems"
          :key="item.name"
          :style="{
            alignSelf: item.alignSelf,
            inlineSize: item.sizes,
          }"
          class="showcase-carousel__item"
        >
          <!-- For video tiles this lazy, responsive still doubles as the poster: shown
               before playback and under reduced motion, without an eager poster request. -->
          <picture class="d-d-block">
            <source :srcset="item.avifSrcset" :sizes="item.sizes" type="image/avif">
            <source :srcset="item.webpSrcset" :sizes="item.sizes" type="image/webp">
            <img
              :src="item.fallbackSrc"
              :width="item.sourceWidth"
              :height="item.sourceHeight"
              class="d-bar-500 d-d-block showcase-carousel__image"
              alt=""
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              draggable="false"
            >
          </picture>
          <video
            v-if="item.type === 'video'"
            :width="item.sourceWidth"
            :height="item.sourceHeight"
            class="d-bar-500 d-d-block showcase-carousel__video"
            aria-hidden="true"
            muted
            loop
            playsinline
            disablepictureinpicture
            preload="none"
            draggable="false"
          >
            <!-- Tiles keep fixed widths at every breakpoint, so pick the encode by pixel density. -->
            <source :src="item.videoSrc2x" type="video/mp4" media="(min-resolution: 2dppx), (-webkit-min-device-pixel-ratio: 2)">
            <source :src="item.videoSrc1x" type="video/mp4">
          </video>
        </div>
      </dt-stack>
    </div>
    <!-- WCAG 2.2.2: the carousel and its videos move on their own, so give everyone a way to stop them. -->
    <div class="showcase-carousel__controls">
      <dt-button
        v-dt-tooltip="isPaused ? 'Play showcase' : 'Pause showcase'"
        :aria-label="isPaused ? 'Play showcase' : 'Pause showcase'"
        kind="muted"
        importance="outlined"
        size="300"
        @click="togglePause"
      >
        <template #icon="{ iconSize }">
          <dt-icon :name="isPaused ? 'play' : 'pause'" :size="iconSize" />
        </template>
      </dt-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { withBase } from 'vuepress/client';

import {
  advanceScrollPosition,
  getCarouselPeriod,
  getLoopedScrollPosition,
  smoothCarouselVelocity,
} from './showcaseCarouselMotion.js';

const SHOWCASE_IMAGE_ROOT = '/assets/images';
const createShowcaseImage = ({
  name,
  alignSelf,
  renderedWidth,
  sourceWidth,
  sourceHeight,
  candidateWidths,
}) => {
  const createSrcset = format => candidateWidths
    .map(width => `${withBase(`${SHOWCASE_IMAGE_ROOT}/home-showcase/home-showcase--${name}-${width}w.${format}`)} ${width}w`)
    .join(', ');

  return {
    name,
    alignSelf,
    sourceWidth,
    sourceHeight,
    sizes: `${renderedWidth}px`,
    fallbackSrc: withBase(`${SHOWCASE_IMAGE_ROOT}/home-showcase--${name}.jpg`),
    avifSrcset: createSrcset('avif'),
    webpSrcset: createSrcset('webp'),
  };
};

const SHOWCASE_VIDEO_ROOT = '/assets/videos';
// Brand samples delivered as motion: a 1x/2x still (the poster) plus 1x/2x encodes.
// sourceWidth/sourceHeight are the 2x dimensions.
const createShowcaseVideo = ({
  name,
  alignSelf,
  renderedWidth,
  sourceWidth,
  sourceHeight,
}) => ({
  ...createShowcaseImage({
    name,
    alignSelf,
    renderedWidth,
    sourceWidth,
    sourceHeight,
    candidateWidths: [renderedWidth, renderedWidth * 2],
  }),
  type: 'video',
  videoSrc1x: withBase(`${SHOWCASE_VIDEO_ROOT}/home-showcase--${name}-${renderedWidth}w.mp4`),
  videoSrc2x: withBase(`${SHOWCASE_VIDEO_ROOT}/home-showcase--${name}-${renderedWidth * 2}w.mp4`),
});

const showcaseItems = [
  createShowcaseImage({ name: '01', alignSelf: 'flex-start', renderedWidth: 468, sourceWidth: 1068, sourceHeight: 736, candidateWidths: [468, 936, 1068] }),
  createShowcaseVideo({ name: '02', alignSelf: 'flex-end', renderedWidth: 546, sourceWidth: 1092, sourceHeight: 728 }),
  createShowcaseImage({ name: '03', alignSelf: 'flex-start', renderedWidth: 352, sourceWidth: 1180, sourceHeight: 1284, candidateWidths: [352, 704, 1180] }),
  createShowcaseVideo({ name: '04', alignSelf: 'center', renderedWidth: 480, sourceWidth: 960, sourceHeight: 540 }),
  createShowcaseVideo({ name: '05', alignSelf: 'flex-end', renderedWidth: 320, sourceWidth: 640, sourceHeight: 800 }),
  createShowcaseVideo({ name: '06', alignSelf: 'flex-start', renderedWidth: 628, sourceWidth: 1256, sourceHeight: 812 }),
  createShowcaseImage({ name: '07', alignSelf: 'center', renderedWidth: 438, sourceWidth: 722, sourceHeight: 453, candidateWidths: [438, 722] }),
  createShowcaseVideo({ name: '08', alignSelf: 'flex-end', renderedWidth: 404, sourceWidth: 808, sourceHeight: 808 }),
  createShowcaseImage({ name: '09', alignSelf: 'flex-start', renderedWidth: 438, sourceWidth: 1440, sourceHeight: 1344, candidateWidths: [438, 876, 1440] }),
];

// Scroll speed in px/ms (35px/s). Also sets the CSS autoplay duration on touch devices.
const DEFAULT_VELOCITY = 0.035;
// Eases speed back up after a touch scroll; the carousel otherwise runs at a constant speed.
const VELOCITY_SMOOTHING = 0.15;
const MAX_FRAME_DURATION = 50;
const TOUCH_SCROLL_IDLE_FALLBACK = 200;
const RESIZE_DEBOUNCE = 150;

const carouselContainerRef = ref(null);
const carouselTrackRef = ref(null);
const isPaused = ref(false);

let cleanupCarousel = () => {};
let applyPauseState = () => {};

const togglePause = () => {
  isPaused.value = !isPaused.value;
  applyPauseState();
};

onMounted(() => {
  const carouselContainer = carouselContainerRef.value;
  const carousel = carouselTrackRef.value?.$el;

  if (carousel && carouselContainer) {
    const carouselItems = Array.from(carousel.children);
    let firstCloneItem = null;

    for (let setIndex = 0; setIndex < 2; setIndex++) {
      carouselItems.forEach((item, index) => {
        const clone = item.cloneNode(true);
        carousel.appendChild(clone);
        if (setIndex === 0 && index === 0) firstCloneItem = clone;
      });
    }

    const fineHoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // The pause control, reduced motion, and a hidden page all stop the scroll and the videos.
    const isMotionStopped = () => isPaused.value || reducedMotionQuery.matches || document.hidden;

    // Clones don't inherit Vue's `muted` prop binding, and browsers block
    // unmuted autoplay, so mute every video (originals and clones) explicitly.
    const carouselVideos = Array.from(carousel.querySelectorAll('video'));

    // The video stays transparent over its poster still until it has frames to show.
    const revealVideo = ({ target }) => {
      target.classList.add('showcase-carousel__video--ready');
    };

    carouselVideos.forEach((video) => {
      video.muted = true;
      video.defaultMuted = true;
      video.addEventListener('playing', revealVideo);
    });

    const playVideo = (video) => {
      if (isMotionStopped()) return;
      video.play().catch(() => {});
    };

    // Only play videos while they're on screen, so the cloned sets
    // don't all decode at once.
    const handleVideoVisibilityChange = (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          playVideo(target);
        } else {
          target.pause();
        }
      });
    };

    const videoObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(handleVideoVisibilityChange)
      : null;

    // Without an observer there's no reliable visibility check, so videos stay
    // paused on their posters. IntersectionObserver doesn't report a hidden tab,
    // so page visibility is checked here too (and re-synced on visibilitychange).
    const syncVideoPlayback = () => {
      if (!videoObserver || isMotionStopped()) {
        carouselVideos.forEach(video => video.pause());
        return;
      }

      // Re-observing fires a fresh callback for each video's current visibility.
      videoObserver.disconnect();
      carouselVideos.forEach(video => videoObserver.observe(video));
    };
    const usesCompositorAutoplay = !fineHoverQuery.matches;
    const supportsScrollEnd = 'onscrollend' in carouselContainer;

    let carouselPeriod = 0;
    let maxScrollPosition = 0;
    let animationId = null;
    let lastFrameTime = null;
    let currentVelocity = DEFAULT_VELOCITY;
    let scrollPosition = 0;
    let isTouchScrolling = false;
    let isNativeScrolling = false;
    let isTouchActive = false;
    let isVisible = false;
    let scrollIdleTimer = null;
    let resizeTimer = null;
    let visibilityObserver = null;

    const recenterCarousel = () => {
      const position = getLoopedScrollPosition(
        carouselContainer.scrollLeft,
        carouselPeriod,
        maxScrollPosition,
      );

      if (position !== carouselContainer.scrollLeft) {
        carouselContainer.scrollLeft = position;
      }
    };

    const measureCarouselPeriod = () => {
      carouselPeriod = getCarouselPeriod(carouselItems[0], firstCloneItem);
      maxScrollPosition = carouselContainer.scrollWidth - carouselContainer.clientWidth;

      if (carouselPeriod <= 0) {
        stopAnimation();
        return;
      }

      carousel.style.setProperty('--showcase-carousel-autoplay-distance', `${-carouselPeriod}px`);
      carousel.style.setProperty(
        '--showcase-carousel-autoplay-duration',
        `${carouselPeriod / DEFAULT_VELOCITY}ms`,
      );
      recenterCarousel();
      startAnimation();
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measureCarouselPeriod();
      }, RESIZE_DEBOUNCE);
    };

    const stopAnimation = () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      animationId = null;
      lastFrameTime = null;

      if (usesCompositorAutoplay) {
        carousel.classList.add('showcase-carousel__track--autoplay-paused');
      }
    };

    const animateCarousel = (timestamp) => {
      if (!isVisible || isTouchScrolling) {
        stopAnimation();
        return;
      }

      if (lastFrameTime !== null) {
        const elapsedTime = Math.min(timestamp - lastFrameTime, MAX_FRAME_DURATION);
        currentVelocity = smoothCarouselVelocity(
          currentVelocity,
          DEFAULT_VELOCITY,
          VELOCITY_SMOOTHING,
          elapsedTime,
        );
        scrollPosition = advanceScrollPosition(
          scrollPosition,
          carouselContainer.scrollLeft,
          currentVelocity * elapsedTime,
          carouselPeriod,
          maxScrollPosition,
        );
        carouselContainer.scrollLeft = scrollPosition;
      }

      lastFrameTime = timestamp;
      animationId = requestAnimationFrame(animateCarousel);
    };

    const startAnimation = () => {
      if (!isVisible || isTouchScrolling || isMotionStopped() || carouselPeriod <= 0) return;

      if (usesCompositorAutoplay) {
        carousel.classList.remove('showcase-carousel__track--autoplay-paused');
        return;
      }

      if (animationId !== null) return;
      animationId = requestAnimationFrame(animateCarousel);
    };

    // Re-applies motion state after a pause toggle, a reduced-motion change, or a page
    // visibility change, including the compositor animation on touch devices.
    const syncMotion = () => {
      if (isMotionStopped()) {
        stopAnimation();
      } else {
        startAnimation();
      }
      syncVideoPlayback();
    };

    applyPauseState = syncMotion;

    const clearScrollIdleTimer = () => {
      if (scrollIdleTimer === null) return;
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = null;
    };

    const finishTouchScroll = () => {
      if (!isTouchScrolling) return;
      clearScrollIdleTimer();
      recenterCarousel();
      isTouchScrolling = false;
      isNativeScrolling = false;
      currentVelocity = 0;
      startAnimation();
    };

    const scheduleTouchScrollEnd = () => {
      clearScrollIdleTimer();
      scrollIdleTimer = window.setTimeout(() => {
        isNativeScrolling = false;
        finishTouchScroll();
      }, TOUCH_SCROLL_IDLE_FALLBACK);
    };

    const handleTouchStart = (event) => {
      isTouchActive = event.touches.length > 0;
      if (isTouchScrolling) return;

      clearScrollIdleTimer();
      isTouchScrolling = true;
      isNativeScrolling = false;
      currentVelocity = 0;
      stopAnimation();
    };

    const handleTouchEnd = (event) => {
      isTouchActive = event.touches.length > 0;
      if (!isTouchScrolling || isTouchActive) return;

      if (!isNativeScrolling) {
        finishTouchScroll();
      } else if (!supportsScrollEnd) {
        scheduleTouchScrollEnd();
      }
    };

    const handleScroll = () => {
      if (!isTouchScrolling) return;
      isNativeScrolling = true;
      if (!supportsScrollEnd && !isTouchActive) scheduleTouchScrollEnd();
    };

    const handleScrollEnd = () => {
      isNativeScrolling = false;
      if (!isTouchActive) finishTouchScroll();
    };

    const handleVisibilityChange = ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };

    if (usesCompositorAutoplay) {
      carousel.classList.add(
        'showcase-carousel__track--compositor-autoplay',
        'showcase-carousel__track--autoplay-paused',
      );
    }

    measureCarouselPeriod();
    syncVideoPlayback();

    carouselContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    carouselContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    carouselContainer.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    carouselContainer.addEventListener('scroll', handleScroll, { passive: true });
    carouselContainer.addEventListener('scrollend', handleScrollEnd);
    reducedMotionQuery.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncMotion);
    window.addEventListener('resize', handleResize);

    if ('IntersectionObserver' in window) {
      visibilityObserver = new IntersectionObserver(handleVisibilityChange);
      visibilityObserver.observe(carouselContainer);
    } else {
      isVisible = true;
      startAnimation();
    }

    cleanupCarousel = () => {
      stopAnimation();
      clearScrollIdleTimer();
      window.clearTimeout(resizeTimer);
      visibilityObserver?.disconnect();
      videoObserver?.disconnect();
      carouselVideos.forEach((video) => {
        video.pause();
        video.removeEventListener('playing', revealVideo);
      });
      carouselContainer.removeEventListener('touchstart', handleTouchStart);
      carouselContainer.removeEventListener('touchend', handleTouchEnd);
      carouselContainer.removeEventListener('touchcancel', handleTouchEnd);
      carouselContainer.removeEventListener('scroll', handleScroll);
      carouselContainer.removeEventListener('scrollend', handleScrollEnd);
      reducedMotionQuery.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncMotion);
      window.removeEventListener('resize', handleResize);
    };
  }
});

onUnmounted(() => {
  cleanupCarousel();
  applyPauseState = () => {};
});
</script>

<style scoped>
.showcase-carousel {
  overflow-x: auto;
  overflow-y: hidden;
  inline-size: 100%;
  max-inline-size: 100vw;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;
  scroll-behavior: auto;
  touch-action: pan-x pan-y;
  user-select: none;
  -webkit-overflow-scrolling: touch;
}

.showcase-carousel__controls {
  display: flex;
  justify-content: flex-end;
  padding-block-start: var(--dt-space-400);
  padding-inline: var(--dt-space-500);
}

/* Nothing moves under reduced motion, so there's nothing to pause. */
@media (prefers-reduced-motion: reduce) {
  .showcase-carousel__controls {
    display: none;
  }
}

.showcase-carousel::-webkit-scrollbar {
  display: none;
}

.showcase-carousel__track {
  block-size: 66vh;
  inline-size: max-content;
  user-select: none;
}

.showcase-carousel__item {
  position: relative;
  display: block;
  flex: none;
}

.showcase-carousel__video {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  opacity: 0;
}

.showcase-carousel__video--ready {
  opacity: 1;
}

.showcase-carousel__image {
  block-size: auto;
  inline-size: 100%;
}

.showcase-carousel__track--compositor-autoplay {
  animation: showcase-carousel-autoplay
    var(--showcase-carousel-autoplay-duration)
    linear
    infinite;
  will-change: transform;
}

.showcase-carousel__track--autoplay-paused {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .showcase-carousel__track--compositor-autoplay {
    animation: none;
  }
}

@keyframes showcase-carousel-autoplay {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(var(--showcase-carousel-autoplay-distance), 0, 0);
  }
}

@media screen and (min-width: 640px) {
  .showcase-carousel__track {
    block-size: 768px;
  }
}
</style>
