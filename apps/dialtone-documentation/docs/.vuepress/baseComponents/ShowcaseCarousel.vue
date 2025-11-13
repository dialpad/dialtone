<template>
  <div class="showcase-carousel">
    <dt-stack direction="row" gap="700" class="showcase-carousel__track">
      <img style="width: 468px;" class="d-bar16 d-d-block" src="/assets/images/home-showcase--01.jpg" alt="">
      <img style="width: 546px;" class="d-bar16 d-d-block" src="/assets/images/home-showcase--02.jpg" alt="">
      <img style="width: 352px;" class="d-bar16 d-d-block" src="/assets/images/home-showcase--03.jpg" alt="">
      <img style="width: 400px;" class="d-bar16 d-d-block" src="/assets/images/home-showcase--04.jpg" alt="">
      <img style="width: 480px;" class="d-bar16 d-d-block" src="/assets/images/home-showcase--05.jpg" alt="">
      <img style="width: 628px;" class="d-bar16 d-d-block" src="/assets/images/home-showcase--06.jpg" alt="">
      <img style="width: 438px;" class="d-bar16 d-d-block" src="/assets/images/home-showcase--07.jpg" alt="">
      <img style="width: 404px;" class="d-bar16 d-d-block" src="/assets/images/home-showcase--08.jpg" alt="">
      <img style="width: 438px;" class="d-bar16 d-d-block" src="/assets/images/home-showcase--09.jpg" alt="">
    </dt-stack>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// Configuration constants
const DEFAULT_SPEED = -8;          // Slow leftward scroll when not hovering
const MAX_SPEED = 350;              // Maximum speed at edges (px/frame)
const DEAD_ZONE = 0.20;             // Center 20% has zero movement
const CURVE_EXPONENT = 2.5;         // Exponential acceleration curve
const SMOOTHING_ACTIVE = 0.4;       // Fast response when hovering
const SMOOTHING_INACTIVE = 0.15;    // Smooth transition when leaving

onMounted(() => {
  const carouselContainer = document.querySelector('.showcase-carousel');
  const carousel = document.querySelector('.showcase-carousel__track');

  if (carousel && carouselContainer) {
    // Clone images multiple times for seamless infinite scrolling
    const images = carousel.querySelectorAll('img');
    // Clone twice more for smoother infinite scroll (3 total sets)
    for (let i = 0; i < 2; i++) {
      images.forEach(img => {
        const clone = img.cloneNode(true);
        carousel.appendChild(clone);
      });
    }

    // Track carousel state
    let currentPosition = 0;
    let targetSpeed = 0;
    let currentSpeed = 0;
    let animationId = null;
    let isHovering = false;

    // Get total width of one set of images
    const getTrackWidth = () => {
      const allImages = carousel.querySelectorAll('img');
      const imagesPerSet = allImages.length / 3; // We have 3 sets now
      let width = 0;
      for (let i = 0; i < imagesPerSet; i++) {
        width += allImages[i].offsetWidth;
      }
      // Add gaps (700 units from dt-stack)
      width += (imagesPerSet - 1) * 28; // Assuming 700 units = ~28px
      return width;
    };

    // Create debug overlay
    const debugDiv = document.createElement('div');
    debugDiv.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.8);color:#0f0;padding:10px;font-family:monospace;font-size:12px;z-index:9999;border-radius:4px;';
    document.body.appendChild(debugDiv);

    // Animation loop
    const animate = () => {
      const trackWidth = getTrackWidth();

      // Adaptive smoothing based on hover state
      const smoothingFactor = isHovering ? SMOOTHING_ACTIVE : SMOOTHING_INACTIVE;
      currentSpeed += (targetSpeed - currentSpeed) * smoothingFactor;

      // Update position
      currentPosition += currentSpeed;

      // Reset position for infinite loop
      if (currentPosition > 0) {
        currentPosition -= trackWidth;
      } else if (currentPosition < -trackWidth) {
        currentPosition += trackWidth;
      }

      // Apply transform
      carousel.style.transform = `translateX(${currentPosition}px)`;

      // Update debug display
      debugDiv.innerHTML = `
        <strong>Carousel Debug</strong><br>
        hovering: ${isHovering}<br>
        targetSpeed: ${targetSpeed.toFixed(2)}<br>
        currentSpeed: ${currentSpeed.toFixed(2)}<br>
        position: ${currentPosition.toFixed(0)}<br>
        smoothing: ${smoothingFactor.toFixed(2)}
      `;

      animationId = requestAnimationFrame(animate);
    };

    // Start default animation (slow leftward scroll)
    targetSpeed = DEFAULT_SPEED;
    animate();

    // Mouse interaction handlers
    carouselContainer.addEventListener('mouseenter', () => {
      isHovering = true;
    });

    carouselContainer.addEventListener('mouseleave', () => {
      isHovering = false;
      targetSpeed = DEFAULT_SPEED;
    });

    const handleMouseMove = (e) => {
      if (!isHovering) {
        console.log('mousemove fired but not hovering');
        return;
      }

      const rect = carouselContainer.getBoundingClientRect();
      const containerWidth = rect.width;
      const mouseX = e.clientX - rect.left;
      const centerX = containerWidth / 2;

      // Calculate relative position from center (-1 to 1)
      const relativeX = (mouseX - centerX) / centerX;

      console.log(`RECT: left=${rect.left.toFixed(0)}, width=${rect.width.toFixed(0)}, centerX=${centerX.toFixed(0)}`);
      console.log(`MOUSE: clientX=${e.clientX.toFixed(0)}, mouseX=${mouseX.toFixed(0)}, relativeX=${relativeX.toFixed(3)}`);

      // Apply dead zone: center 20% has zero movement
      let adjustedX = 0;
      if (Math.abs(relativeX) > DEAD_ZONE) {
        // Scale from dead zone edge to container edge
        // Maps [DEAD_ZONE, 1.0] → [0, 1.0]
        const beyondDeadZone = (Math.abs(relativeX) - DEAD_ZONE) / (1 - DEAD_ZONE);
        adjustedX = beyondDeadZone * Math.sign(relativeX);
      }

      // Calculate speed with exponential curve for dramatic acceleration
      const speedMultiplier = Math.pow(Math.abs(adjustedX), CURVE_EXPONENT);
      const calculatedSpeed = speedMultiplier * MAX_SPEED;

      console.log(`adjustedX=${adjustedX.toFixed(3)}, calculatedSpeed=${calculatedSpeed.toFixed(1)}`);

      // Set direction (reversed for intuitive control)
      if (relativeX < 0) {
        // Left half - scroll right (reversed)
        targetSpeed = calculatedSpeed;
      } else if (relativeX > 0) {
        // Right half - scroll left (reversed)
        targetSpeed = -calculatedSpeed;
      } else {
        // Exact center in dead zone
        targetSpeed = 0;
      }

      console.log(`targetSpeed set to: ${targetSpeed.toFixed(2)}`);
    };

    carouselContainer.addEventListener('mousemove', handleMouseMove);
    console.log('mousemove listener attached to:', carouselContainer);

    // Cleanup on unmount
    onUnmounted(() => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (debugDiv && debugDiv.parentNode) {
        debugDiv.parentNode.removeChild(debugDiv);
      }
    });
  }
});
</script>

<style scoped>
.showcase-carousel {
  overflow: hidden;
  width: 100%;
  max-width: 100vw;
}

.showcase-carousel__track {
  will-change: transform;
  transition: none;
}
</style>
