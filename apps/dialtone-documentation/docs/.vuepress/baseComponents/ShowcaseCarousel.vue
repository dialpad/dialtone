<!-- eslint-disable max-len -->
<template>
  <div ref="carouselContainerRef" class="showcase-carousel">
    <dt-stack ref="carouselTrackRef" direction="row" gap="800" class="showcase-carousel__track">
      <template v-for="item in showcaseItems" :key="item.name">
        <video
          v-if="item.type === 'video'"
          :src="item.videoSrc"
          :poster="item.posterSrc"
          :width="item.sourceWidth"
          :height="item.sourceHeight"
          :style="{
            alignSelf: item.alignSelf,
            inlineSize: item.sizes,
          }"
          class="d-bar-500 d-d-block showcase-carousel__item showcase-carousel__image"
          aria-hidden="true"
          muted
          loop
          playsinline
          disablepictureinpicture
          preload="none"
          draggable="false"
        />
        <picture
          v-else
          :style="{
            alignSelf: item.alignSelf,
            inlineSize: item.sizes,
          }"
          class="showcase-carousel__item"
        >
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
      </template>
    </dt-stack>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { withBase } from 'vuepress/client';

import {
  canUseHoverSteering,
  getCarouselPeriod,
  getHoverVelocity,
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
// Brand samples delivered as motion. The poster is the still shown before
// playback and under reduced motion.
const createShowcaseVideo = ({
  name,
  alignSelf,
  renderedWidth,
  sourceWidth,
  sourceHeight,
}) => ({
  type: 'video',
  name,
  alignSelf,
  sourceWidth,
  sourceHeight,
  sizes: `${renderedWidth}px`,
  videoSrc: withBase(`${SHOWCASE_VIDEO_ROOT}/home-showcase--${name}.mp4`),
  posterSrc: withBase(`${SHOWCASE_IMAGE_ROOT}/home-showcase--${name}.jpg`),
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

const DEFAULT_VELOCITY = 0.12;
const DEAD_ZONE = 0.01;
const MAX_HOVER_VELOCITY = 1.2;
const CURVE_EXPONENT = 2.5;
const SMOOTHING_ACTIVE = 0.5;
const SMOOTHING_INACTIVE = 0.15;
const MAX_FRAME_DURATION = 50;
const TOUCH_SCROLL_IDLE_FALLBACK = 200;
const RESIZE_DEBOUNCE = 150;

const carouselContainerRef = ref(null);
const carouselTrackRef = ref(null);

let cleanupCarousel = () => {};

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

    // Clones don't inherit Vue's `muted` prop binding, and browsers block
    // unmuted autoplay, so mute every video (originals and clones) explicitly.
    const carouselVideos = Array.from(carousel.querySelectorAll('video'));
    carouselVideos.forEach((video) => {
      video.muted = true;
      video.defaultMuted = true;
    });

    const playVideo = (video) => {
      if (reducedMotionQuery.matches) return;
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
    // paused on their posters.
    const syncVideoPlayback = () => {
      if (!videoObserver || reducedMotionQuery.matches) {
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
    let targetVelocity = DEFAULT_VELOCITY;
    let currentVelocity = DEFAULT_VELOCITY;
    let isHovering = false;
    let hoverRect = null;
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
        if (isHovering) hoverRect = carouselContainer.getBoundingClientRect();
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
        const smoothingFactor = isHovering ? SMOOTHING_ACTIVE : SMOOTHING_INACTIVE;
        currentVelocity = smoothCarouselVelocity(
          currentVelocity,
          targetVelocity,
          smoothingFactor,
          elapsedTime,
        );
        carouselContainer.scrollLeft = getLoopedScrollPosition(
          carouselContainer.scrollLeft + currentVelocity * elapsedTime,
          carouselPeriod,
          maxScrollPosition,
        );
      }

      lastFrameTime = timestamp;
      animationId = requestAnimationFrame(animateCarousel);
    };

    const startAnimation = () => {
      if (
        !isVisible ||
        isTouchScrolling ||
        reducedMotionQuery.matches ||
        carouselPeriod <= 0
      ) return;

      if (usesCompositorAutoplay) {
        carousel.classList.remove('showcase-carousel__track--autoplay-paused');
        return;
      }

      if (animationId !== null) return;
      animationId = requestAnimationFrame(animateCarousel);
    };

    const handleReducedMotionChange = () => {
      if (reducedMotionQuery.matches) {
        stopAnimation();
      } else {
        startAnimation();
      }
      syncVideoPlayback();
    };

    const handlePointerEnter = (event) => {
      if (!canUseHoverSteering(event.pointerType, fineHoverQuery.matches)) return;
      isHovering = true;
      targetVelocity = 0;
      hoverRect = carouselContainer.getBoundingClientRect();
      startAnimation();
    };

    const handlePointerMove = (event) => {
      if (!isHovering || !canUseHoverSteering(event.pointerType, fineHoverQuery.matches)) return;

      const relativePosition = (event.clientX - hoverRect.left - hoverRect.width / 2) / (hoverRect.width / 2);
      targetVelocity = getHoverVelocity(
        relativePosition,
        DEAD_ZONE,
        MAX_HOVER_VELOCITY,
        CURVE_EXPONENT,
      );
    };

    const handlePointerLeave = (event) => {
      if (!canUseHoverSteering(event.pointerType, fineHoverQuery.matches)) return;
      isHovering = false;
      targetVelocity = DEFAULT_VELOCITY;
    };

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
      targetVelocity = DEFAULT_VELOCITY;
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
      isHovering = false;
      currentVelocity = 0;
      targetVelocity = DEFAULT_VELOCITY;
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
        isHovering = false;
        targetVelocity = DEFAULT_VELOCITY;
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

    carouselContainer.addEventListener('pointerenter', handlePointerEnter);
    carouselContainer.addEventListener('pointermove', handlePointerMove);
    carouselContainer.addEventListener('pointerleave', handlePointerLeave);
    carouselContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    carouselContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    carouselContainer.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    carouselContainer.addEventListener('scroll', handleScroll, { passive: true });
    carouselContainer.addEventListener('scrollend', handleScrollEnd);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
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
      carouselVideos.forEach(video => video.pause());
      carouselContainer.removeEventListener('pointerenter', handlePointerEnter);
      carouselContainer.removeEventListener('pointermove', handlePointerMove);
      carouselContainer.removeEventListener('pointerleave', handlePointerLeave);
      carouselContainer.removeEventListener('touchstart', handleTouchStart);
      carouselContainer.removeEventListener('touchend', handleTouchEnd);
      carouselContainer.removeEventListener('touchcancel', handleTouchEnd);
      carouselContainer.removeEventListener('scroll', handleScroll);
      carouselContainer.removeEventListener('scrollend', handleScrollEnd);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      window.removeEventListener('resize', handleResize);
    };
  }
});

onUnmounted(() => cleanupCarousel());
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

.showcase-carousel::-webkit-scrollbar {
  display: none;
}

.showcase-carousel__track {
  block-size: 66vh;
  inline-size: max-content;
  user-select: none;
}

.showcase-carousel__item {
  display: block;
  flex: none;
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
