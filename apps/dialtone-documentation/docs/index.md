---
layout: Blank
---
<div
  id="docsearch"
  ref="docSearchBtn"
  class="d-d-none"
  options=""
/>

<header-overlay @search="openSearch" />
<gradient-hero />
<dt-stack class="d-m-auto">
  <dt-stack gap="550" class="d-py64 d-pt96 d-ai-center d-of-hidden d-w100p">
    <showcase-carousel />
  </dt-stack>
  <dt-stack gap="550" class="d-py64 d-px64 d-pb96 d-ai-center">
    <dt-stack style="filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 25px 30px);" class="d-w114">
      <svg-loader name="home--dialtone-badge" />
    </dt-stack>
    <h2 class="d-headline--xxl d-ff-expressive d-wmx764" style="font-size: 48px;font-family:var(--dt-font-family-expressive); text-wrap: balance; max-width: 1400px;">Setting the tone.</h2>
    <p class="d-ta-center d-docsite--paragraph d-m0 d-wmx764" style="text-wrap: balance; font-size: 24px; font-weight: 400;">Dialtone is Dialpad’s shared design language—shaping everything from our product interfaces to our marketing. It defines how our brand looks, feels, and behaves across every touchpoint. Built on principles of clarity, consistency, and accessibility, Dialtone keeps our visual identity cohesive and unmistakably Dialpad.</p>
  </dt-stack>
  <dt-stack gap="700" class="d-py64 d-px64 d-pt96 d-ai-center d-bgc-secondary-opaque">
    <dt-stack style="max-width: 1400px;" direction="row" gap="600" class="d-w100p d-jc-center">
      <router-link to="./foundations/brand/" class="d-d-block">
        <svg-loader class="d-bar16 d-w100p" name="home-foundations-01" />
      </router-link>
      <router-link to="./foundations/colors/" class="d-d-block">
        <svg-loader class="d-bar16 d-w100p d-ba d-bc-subtle" name="home-foundations-02" />
      </router-link>
      <router-link to="./foundations/typography/" class="d-d-block">
        <svg-loader class="d-bar16 d-w100p d-ba d-bc-subtle" name="home-foundations-03" />
      </router-link>
      <router-link to="./foundations/motion/" class="d-d-block">
        <svg-loader class="d-bar16 d-w100p d-ba d-bc-subtle" name="home-foundations-04" />
      </router-link>
    </dt-stack>
    <dt-stack style="max-width: 1400px;" gap="550" class="d-ai-center d-jc-center">
      <h2 class="d-headline--xxl d-ff-expressive" style="font-size: 48px;font-family:var(--dt-font-family-expressive); text-wrap: balance; max-width: 1400px;">Foundations</h2>
      <p class="d-ta-center d-docsite--paragraph d-m0 d-wmx764" style="text-wrap: balance; font-size: 24px; font-family:var(--dt-font-family-expressive)">The building blocks of Dialtone... Color, Type, Icons, and more.</p>
      <p class="d-ta-center d-docsite--paragraph d-m0 d-wmx764">
        <dt-link href="./foundations/">
          <dt-button size="lg" icon-position="right" @click="navigate">
            View Foundations
            <template #icon>
              <dt-icon name="arrow-right" size="300" />
            </template>
          </dt-button>
        </dt-link>
      </p>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="700" class="d-py64 d-px64 d-pb96 d-ai-center d-bgc-secondary-opaque">
    <dt-stack style="max-width: 1400px" direction="row" gap="600" class="d-w100p d-jc-center">
      <router-link to="./components/" class="d-d-block">
        <svg-loader class="d-bar16 d-w100p d-ba d-bc-subtle" name="home-system--01" />
      </router-link>
      <router-link to="./utilities/" class="d-d-block">
        <svg-loader class="d-bar16 d-w100p d-ba d-bc-subtle" name="home-system--02" />
      </router-link>
      <router-link to="./tokens/" class="d-d-block">
        <svg-loader class="d-bar16 d-w100p d-ba d-bc-subtle" name="home-system--03" />
      </router-link>
      <router-link to="./guides/content/" class="d-d-block">
        <svg-loader class="d-bar16 d-w100p d-ba d-bc-subtle" name="home-system--04" />
      </router-link>
    </dt-stack>
    <dt-stack style="max-width: 1400px" gap="550" class="d-ai-center d-jc-center">
      <h2 class="d-headline--xxl d-ff-expressive" style="font-size: 48px;font-family:var(--dt-font-family-expressive); text-wrap: balance; max-width: 1400px;">Design System</h2>
      <p class="d-ta-center d-docsite--paragraph d-m0 d-wmx764" style="text-wrap: balance;  font-size: 24px; font-family:var(--dt-font-family-expressive)">Build with Dialtone Components, Design Tokens, CSS Utilities, and more.</p>
      <p class="d-ta-center d-docsite--paragraph d-m0 d-wmx764">
        <dt-link href="./dialtone/">
          <dt-button size="lg" icon-position="right">
            View all Documentation
            <template #icon>
              <dt-icon name="arrow-right" size="300" />
            </template>
          </dt-button>
        </dt-link>
      </p>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="700" class="d-py64 d-px64 d-pt96 d-ai-center">
    <dt-stack style="max-width: 1400px" gap="550" class="d-ai-center">
      <h2 class="d-headline--xxl d-ff-expressive" style="font-size: 48px;font-family:var(--dt-font-family-expressive); text-wrap: balance; max-width: 1400px;">What's New</h2>
      <p class="d-ta-center d-docsite--paragraph d-m0 d-wmx764" style="text-wrap: balance; font-size: 24px; font-family:var(--dt-font-family-expressive)">The latest from Dialpad Design.</p>
      <p class="d-ta-center d-docsite--paragraph d-m0 d-wmx764">
        <dt-link href="./dialtone/whats-new/">
          <dt-button size="lg" icon-position="right">
            View all
            <template #icon>
              <dt-icon name="arrow-right" size="300" />
            </template>
          </dt-button>
        </dt-link>
      </p>
    </dt-stack>
    <dt-stack style="max-width: 1400px" direction="row" gap="600" class="d-w100p d-ai-flex-start d-jc-center">
      <dt-stack class="d-w100p">
        <p class="d-docsite--paragraph d-m0">
          <dt-link href="#link-to-" class=" d-d-block">
            <dt-stack gap="500">
              <img class="d-bar16 d-d-block d-w100p" src="/assets/images/placeholder-home-blog--01.png" alt="">
              <span>Replacing Hard-Coded or Base tokens for Chart Tokens</span>
            </dt-stack>
          </dt-link>
        </p>
      </dt-stack>
      <dt-stack class="d-w100p">
        <p class="d-docsite--paragraph d-m0">
          <dt-link href="#link-to-" class=" d-d-block">
            <dt-stack gap="500">
              <img class="d-bar16 d-d-block d-w100p" src="/assets/images/placeholder-home-blog--02.png" alt="">
              <span>Breaking change in postcss-responsive-variations plugin</span>
            </dt-stack>
          </dt-link>
        </p>
      </dt-stack>
      <dt-stack class="d-w100p">
        <p class="d-docsite--paragraph d-m0">
          <dt-link href="#link-to-" class=" d-d-block">
            <dt-stack gap="500">
              <img class="d-bar16 d-d-block d-w100p" src="/assets/images/placeholder-home-blog--03.png" alt="">
              <span>Vue 3 input components v-model breaking change</span>
            </dt-stack>
          </dt-link>
        </p>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</dt-stack>
<dt-stack class="gradient-overlay gradient-overlay--footer d-h628 d-ai-center d-jc-center">
  <dt-stack class="d-w764 d-wmx100p d-pr16">
    <div class="footer-dialpad-design">
      <div class="footer-dialpad-design__light">
        <svg-loader name="footer-dialpad-design--light" />
      </div>
      <div class="footer-dialpad-design__dark">
        <svg-loader name="footer-dialpad-design--dark" />
      </div>
    </div>
  </dt-stack>
</dt-stack>

<style lang="less">
.dialpad-design-home {
  position: relative;
}

.gradient-overlay {
  --grad-position-x: 50%;
  --grad-position-y: 100%;
  --grad: radial-gradient(circle at var(--grad-position-x) var(--grad-position-y), rgb(218, 163, 255) 0%, rgb(230, 170, 250) 10%, rgb(240, 170, 235) 15%, rgb(255, 177, 207) 25%, rgba(255, 195, 210, 0.95) 35%, rgba(255, 210, 212, 0.9) 45%, rgba(255, 218, 215, 0.8) 60%, rgba(250, 230, 220, 0.7) 75%, var(--dt-shell-color-surface-default) 100%);
  --overlay-color-surface: var(--dt-shell-color-surface-default);
  --overlay-opacity: 0;

  position: relative;
  transition: --grad-position-x 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  background-image: var(--grad);
  background-attachment: fixed;
  height: 100vh;

  [data-dt-mode="dark"] & {
    --grad: radial-gradient(circle at var(--grad-position-x) var(--grad-position-y), rgb(246, 100, 55) 0%, rgb(223, 38, 110) 30%, rgb(191, 10, 128) 44%, rgb(81, 30, 118) 71%, var(--dt-color-purple-50) 100%);
    --overlay-color-surface: var(--dt-color-purple-50);
  }

  &--footer {
    --grad: radial-gradient(50% 75% at 50% 100%, #DAA3FF 0%, #FFB1CF 33%, #FFDAD7 66%, rgba(248, 247, 246, 0.00) 100%);
    background-attachment: initial;

    [data-dt-mode="dark"] & {
      --grad: radial-gradient(50% 75% at 50% 100%, rgb(246, 100, 55) 0%, rgb(223, 38, 110) 30%, rgb(191, 10, 128) 44%, rgb(81, 30, 118) 71%, transparent 100%);
      --overlay-color-surface: transparent;
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background-color: var(--overlay-color-surface);
    opacity: var(--overlay-opacity);
  }
}

[data-dt-mode="dark"] .footer-dialpad-design__light,
[data-dt-mode="light"] .footer-dialpad-design__dark {
  display: none;
}

</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ShowcaseCarousel from '../../baseComponents/ShowcaseCarousel.vue';
import GradientHero from '../../baseComponents/GradientHero.vue';
import HeaderOverlay from '../../baseComponents/HeaderOverlay.vue';

const docSearchBtn = ref(null);

const openSearch = () => {
  docSearchBtn.value?.children[0]?.click();
};

// Mouse-driven gradient position with smoothing
onMounted(() => {
  let currentPositionX = 50; // Start at center
  let targetPositionX = 50;
  let currentPositionY = 100; // Start at bottom
  let targetPositionY = 100;
  let animationId = null;

  const gradientOverlay = document.querySelector('.gradient-overlay');

  const animate = () => {
    // Smooth interpolation for X
    currentPositionX += (targetPositionX - currentPositionX) * 0.1;

    // Smooth interpolation for Y
    currentPositionY += (targetPositionY - currentPositionY) * 0.1;

    // Update CSS variables
    if (gradientOverlay) {
      gradientOverlay.style.setProperty('--grad-position-x', `${currentPositionX}%`);
      gradientOverlay.style.setProperty('--grad-position-y', `${currentPositionY}%`);
    }

    animationId = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e) => {
    // Get mouse X position as percentage of viewport width
    const mouseX = (e.clientX / window.innerWidth) * 100;

    // Parallax effect: gradient moves at 30% of mouse movement from center
    // This creates a subtle "lagging" effect
    const parallaxFactor = 0.1; // Adjust this to control how much the gradient follows (0.1 = very subtle, 0.5 = more responsive)
    const offsetFromCenter = mouseX - 50; // How far mouse is from center
    targetPositionX = 50 + (offsetFromCenter * parallaxFactor); // Gradient position relative to center

    // Calculate distance from center (0 to 1) based on actual mouse position
    const distanceFromCenter = Math.abs(mouseX - 50) / 50;

    // Map distance to Y position: 100% at center, up to 120% at edges
    targetPositionY = 100 + (distanceFromCenter * 20);
  };

  // Start animation loop
  animate();

  // Add mouse move listener
  window.addEventListener('mousemove', handleMouseMove);

  // Cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
});

// Scroll-driven effects
onMounted(() => {
  const gradientOverlay = document.querySelector('.gradient-overlay');
  const header = document.querySelector('.dialtone-header--home');
  let lastScrollY = window.scrollY;

  if (!gradientOverlay) return;

  const handleScroll = () => {
    // Get the height of the gradient overlay (100vh)
    const overlayHeight = gradientOverlay.offsetHeight;

    // Get current scroll position
    const scrollY = window.scrollY;

    // Calculate opacity based on scroll position
    // When scrollY is 0, opacity is 0
    // When scrollY equals overlayHeight, opacity is 1
    const overlayOpacity = Math.min(Math.max(scrollY / overlayHeight, 0), 1);

    // Calculate text opacity - starts at 0.6 and fades to 0 as you scroll
    // Text fades out faster than overlay appears (completes at 50% scroll)
    const textOpacity = Math.max(0.6 - (scrollY / (overlayHeight * 0.5)) * 0.6, 0);

    // Calculate text translation - moves down 0 to 50px as you scroll
    // Reaches maximum translation when element scrolls out of view
    const scrollProgress = Math.min(scrollY / overlayHeight, 1);
    const textTranslateY = scrollProgress * 325;

    // Update the CSS variables
    gradientOverlay.style.setProperty('--overlay-opacity', overlayOpacity);
    gradientOverlay.style.setProperty('--text-opacity', textOpacity);
    gradientOverlay.style.setProperty('--text-translate-y', `${textTranslateY}px`);

    // Header visibility logic
    if (header) {
      const isScrollingUp = scrollY < lastScrollY;

      // Always show header when scrolling up
      if (isScrollingUp) {
        header.classList.remove('dialtone-header--off-canvas');
      } else {
        // Only hide header when scrolling down AND gradient is out of view
        const gradientRect = gradientOverlay.getBoundingClientRect();
        const isGradientInView = gradientRect.bottom > 0;

        if (!isGradientInView) {
          header.classList.add('dialtone-header--off-canvas');
        }
      }
    }

    // Update last scroll position
    lastScrollY = scrollY;
  };

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Call once on mount to set initial state
  handleScroll();

  // Cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});
</script>
