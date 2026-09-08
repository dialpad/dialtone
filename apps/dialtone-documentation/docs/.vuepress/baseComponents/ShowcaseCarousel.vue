<!-- eslint-disable max-len -->
<template>
  <div ref="carouselContainerRef" class="showcase-carousel">
    <dt-stack ref="carouselTrackRef" direction="row" gap="800" class="showcase-carousel__track">
      <img style="align-self: flex-start; width: 468px;" class="d-bar-500 d-d-block" src="/assets/images/home-showcase--01.jpg" alt="" draggable="false">
      <img style="align-self: flex-end; width: 546px;" class="d-bar-500 d-d-block" src="/assets/images/home-showcase--02.jpg" alt="" draggable="false">
      <img style="align-self: flex-start; width: 352px;" class="d-bar-500 d-d-block" src="/assets/images/home-showcase--03.jpg" alt="" draggable="false">
      <img style="align-self: center; width: 400px;" class="d-bar-500 d-d-block" src="/assets/images/home-showcase--04.jpg" alt="" draggable="false">
      <img style="align-self: flex-end; width: 480px;" class="d-bar-500 d-d-block" src="/assets/images/home-showcase--05.jpg" alt="" draggable="false">
      <img style="align-self: flex-start; width: 628px;" class="d-bar-500 d-d-block" src="/assets/images/home-showcase--06.jpg" alt="" draggable="false">
      <img style="align-self: center; width: 438px;" class="d-bar-500 d-d-block" src="/assets/images/home-showcase--07.jpg" alt="" draggable="false">
      <img style="align-self: flex-end; width: 404px;" class="d-bar-500 d-d-block" src="/assets/images/home-showcase--08.jpg" alt="" draggable="false">
      <img style="align-self: flex-start; width: 438px;" class="d-bar-500 d-d-block" src="/assets/images/home-showcase--09.jpg" alt="" draggable="false">
    </dt-stack>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

import {
  canUseHoverSteering,
  getCarouselPeriod,
  getHoverVelocity,
  getLoopedScrollPosition,
  smoothCarouselVelocity,
} from './showcaseCarouselMotion.js';

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
    const images = carousel.querySelectorAll('img');
    let firstCloneImage = null;

    for (let setIndex = 0; setIndex < 2; setIndex++) {
      images.forEach((img, index) => {
        const clone = img.cloneNode(true);
        carousel.appendChild(clone);
        if (setIndex === 0 && index === 0) firstCloneImage = clone;
      });
    }

    const fineHoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
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
      carouselPeriod = getCarouselPeriod(images[0], firstCloneImage);
      maxScrollPosition = carouselContainer.scrollWidth - carouselContainer.clientWidth;
      carousel.style.setProperty('--showcase-carousel-autoplay-distance', `${-carouselPeriod}px`);
      carousel.style.setProperty(
        '--showcase-carousel-autoplay-duration',
        `${carouselPeriod / DEFAULT_VELOCITY}ms`,
      );
      recenterCarousel();
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
      if (!isVisible || isTouchScrolling) return;

      if (usesCompositorAutoplay) {
        carousel.classList.remove('showcase-carousel__track--autoplay-paused');
        return;
      }

      if (animationId !== null) return;
      animationId = requestAnimationFrame(animateCarousel);
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

    carouselContainer.addEventListener('pointerenter', handlePointerEnter);
    carouselContainer.addEventListener('pointermove', handlePointerMove);
    carouselContainer.addEventListener('pointerleave', handlePointerLeave);
    carouselContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    carouselContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    carouselContainer.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    carouselContainer.addEventListener('scroll', handleScroll, { passive: true });
    carouselContainer.addEventListener('scrollend', handleScrollEnd);
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
      carouselContainer.removeEventListener('pointerenter', handlePointerEnter);
      carouselContainer.removeEventListener('pointermove', handlePointerMove);
      carouselContainer.removeEventListener('pointerleave', handlePointerLeave);
      carouselContainer.removeEventListener('touchstart', handleTouchStart);
      carouselContainer.removeEventListener('touchend', handleTouchEnd);
      carouselContainer.removeEventListener('touchcancel', handleTouchEnd);
      carouselContainer.removeEventListener('scroll', handleScroll);
      carouselContainer.removeEventListener('scrollend', handleScrollEnd);
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
