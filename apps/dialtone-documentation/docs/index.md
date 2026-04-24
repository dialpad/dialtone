---
layout: Blank
pageClass: dialpad-design-home
---
<div
  id="docsearch"
  ref="docSearchBtn"
  class="d-d-none"
  options=""
/>

<dt-box>
  <header-overlay @search="openSearch" />
</dt-box>
<dt-box>
  <gradient-hero />
</dt-box>
<dt-stack as="section" class="d-m-auto">
  <dt-box as="article" border-width-block-start="100" border-color="subtle" padding-block="800">
    <showcase-carousel />
  </dt-box>
  <dt-box as="article" border-width-block-start="100" border-color="subtle" padding-block="800" padding-inline="800" surface="secondary-opaque">
    <dt-stack gap="550" align="center">
      <dt-box inline-size="200" style="filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 25px 30px);">
        <svg-loader name="home--dialtone-badge" />
      </dt-box>
      <dt-box max-inline-size="1200">
        <dt-text as="h2" kind="headline" size="xxl" wrap="balance" strength="normal" class="home-section-title">Setting the tone</dt-text>
      </dt-box>
      <dt-box max-inline-size="1200">
        <dt-text as="p" align="center" class="home-section-description">Dialtone is Dialpad’s shared design language—shaping everything from our product interfaces to our marketing. It defines how our brand looks, feels, and behaves across every touchpoint. Built on principles of clarity, consistency, and accessibility, Dialtone keeps our visual identity cohesive and unmistakably Dialpad.</dt-text>
      </dt-box>
    </dt-stack>
  </dt-box>
  <dt-box as="article" border-width-block-start="100" border-color="subtle" padding-block="800" padding-inline="800">
    <dt-stack gap="700" align="center">
      <dt-stack class="home-section-inline" :direction="{ 'default': 'column', 'md': 'row' }" gap="600" justify="center">
        <router-link to="./foundations/brand/" class="d-d-block">
          <svg-loader class="d-bar-500 d-w100p d-ba d-bc-subtle" name="home-foundations-01" />
        </router-link>
        <router-link to="./foundations/colors/" class="d-d-block">
          <svg-loader class="d-bar-500 d-w100p d-ba d-bc-subtle" name="home-foundations-02" />
        </router-link>
        <router-link to="./foundations/typography/" class="d-d-block">
          <svg-loader class="d-bar-500 d-w100p d-ba d-bc-subtle" name="home-foundations-03" />
        </router-link>
        <router-link to="./foundations/motion/" class="d-d-block">
          <svg-loader class="d-bar-500 d-w100p d-ba d-bc-subtle" name="home-foundations-04" />
        </router-link>
      </dt-stack>
      <dt-stack class="home-section-inline" gap="550" align="center" justify="center">
        <dt-text as="h2" kind="headline" size="xxl" wrap="balance" strength="normal" class="home-section-title">Foundations</dt-text>
        <dt-box max-inline-size="1200">
          <dt-text as="p" align="center" class="home-section-description">The building blocks of Dialtone... Color, Type, Icons, and more.</dt-text>
        </dt-box>
        <dt-button size="lg" to="./foundations/">
          View Foundations
          <template #endIcon>
            <dt-icon name="arrow-right" size="300" />
          </template>
        </dt-button>
      </dt-stack>
    </dt-stack>
  </dt-box>
  <dt-box as="article" border-width-block-start="100" border-color="subtle" padding-block="800" padding-inline="800" surface="secondary-opaque">
    <dt-stack gap="700" align="center">
      <dt-stack class="home-section-inline" :direction="{ 'default': 'column', 'md': 'row' }" gap="600" justify="center">
        <router-link to="./components/" class="d-d-block">
          <svg-loader class="d-bar-500 d-w100p d-ba d-bc-subtle" name="home-system--01" />
        </router-link>
        <router-link to="./utilities/" class="d-d-block">
          <svg-loader class="d-bar-500 d-w100p d-ba d-bc-subtle" name="home-system--02" />
        </router-link>
        <router-link to="./tokens/" class="d-d-block">
          <svg-loader class="d-bar-500 d-w100p d-ba d-bc-subtle" name="home-system--03" />
        </router-link>
        <router-link to="./guides/content/" class="d-d-block">
          <svg-loader class="d-bar-500 d-w100p d-ba d-bc-subtle" name="home-system--04" />
        </router-link>
      </dt-stack>
      <dt-stack class="home-section-inline" gap="550" align="center" justify="center">
        <dt-text as="h2" kind="headline" size="xxl" wrap="balance" strength="normal" class="home-section-title">Design System</dt-text>
        <dt-box max-inline-size="1200">
          <dt-text as="p" align="center" class="home-section-description">Build with Dialtone Components, Design Tokens, CSS Utilities, and more.</dt-text>
        </dt-box>
        <dt-button :size="400" to="./dialtone/">
          View all Documentation
          <template #endIcon>
            <dt-icon name="arrow-right" size="300" />
          </template>
        </dt-button>
      </dt-stack>
    </dt-stack>
  </dt-box>
  <dt-box as="article" border-width-block-start="100" border-color="subtle" padding-block="800" padding-inline="800">
    <dt-stack gap="700" align="center">
      <dt-stack class="home-section-inline" gap="550" align="center">
        <dt-text as="h2" kind="headline" size="xxl" wrap="balance" strength="normal" class="home-section-title">What's New</dt-text>
        <dt-box max-inline-size="1200">
          <dt-text as="p" align="center" class="home-section-description">The latest from Dialpad Design.</dt-text>
        </dt-box>
        <dt-button :size="400" to="./dialtone/whats-new/">
          View all
          <template #endIcon>
            <dt-icon name="arrow-right" size="300" />
          </template>
        </dt-button>
      </dt-stack>
      <dt-stack
        style="max-width: 1400px"
        gap="600"
        class="d-w100p"
        align="start"
        justify="center"
        :direction="{ 'default': 'column', 'md': 'row' }"
      >
        <dt-stack
          v-for="post in $page.blogPosts.sort(sortHandler).slice(0, 3)"
          :key="post.posted"
          class="d-w100p"
          align="start"
        >
          <router-link :to="`/dialtone/whats-new/posts/${post.posted}`" class="d-d-block d-td-none">
            <dt-stack gap="100">
              <dt-link class="d-d-inline">
                <dt-text as="h3" kind="headline" :size="400">{{ post.heading }}</dt-text>
              </dt-link>
              <dt-text as="time" kind="body" :size="200" tone="tertiary">{{ post.author }} &middot; {{ formatDate(post.posted) }}</dt-text>
              <dt-text as="p" kind="body" :size="300" tone="primary" wrap="pretty" max-lines="3" :title="post.excerpt">{{ post.excerpt }}</dt-text>
            </dt-stack>
          </router-link>
        </dt-stack>
      </dt-stack>
    </dt-stack>
  </dt-box>
</dt-stack>
<dt-stack align="center" justify="center" class="gradient-overlay gradient-overlay--footer d-h-1000">
  <dt-stack class="d-w-1200 d-wmx100p d-pie-200">
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
[data-dt-mode="dark"] .dialpad-design-home {
  --dt-shell-color-surface-default: var(--dt-color-purple-50);
}

.home-section-title {
  font-size: 48px;
  font-family: var(--dt-font-family-expressive);
}

.home-section-description {
  text-wrap: balance;
  font-size: 24px;
  font-weight: 300;
}

.home-section-inline {
  inline-size: 100%;
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
  block-size: 100vh;

  [data-dt-mode="dark"] & {
    --grad: radial-gradient(circle at var(--grad-position-x) var(--grad-position-y), rgb(246, 100, 55) 0%, rgb(223, 38, 110) 30%, rgb(191, 10, 128) 44%, rgb(81, 30, 118) 71%, var(--dt-color-purple-50) 100%);
    --overlay-color-surface: var(--dt-color-purple-50);
  }

  &--footer {
    --footer-grad-y: 200%;
    --grad: radial-gradient(50% 75% at 50% var(--footer-grad-y), #DAA3FF 0%, #FFB1CF 33%, #FFDAD7 66%, rgba(248, 247, 246, 0.00) 100%);
    background-attachment: initial;

    [data-dt-mode="dark"] & {
      --grad: radial-gradient(50% 75% at 50% var(--footer-grad-y), rgb(246, 100, 55) 0%, rgb(223, 38, 110) 30%, rgb(191, 10, 128) 44%, rgb(81, 30, 118) 71%, transparent 100%);
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
import { parse, compareDesc, format } from 'date-fns';
import ShowcaseCarousel from '../../baseComponents/ShowcaseCarousel.vue';
import GradientHero from '../../baseComponents/GradientHero.vue';
import HeaderOverlay from '../../baseComponents/HeaderOverlay.vue';

const docSearchBtn = ref(null);

const sortHandler = (a, b) => compareDesc(
  parse(a.posted, 'y-M-d', new Date()),
  parse(b.posted, 'y-M-d', new Date()),
);

const formatDate = (dateStr) => {
  return format(parse(dateStr, 'y-M-d', new Date()), 'MMMM do, y');
};

const openSearch = () => {
  docSearchBtn.value?.children[0]?.click();
};

// Add page-specific class to body
onMounted(() => {
  document.body.classList.add('dialpad-design-home');
});

onUnmounted(() => {
  document.body.classList.remove('dialpad-design-home');
});

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

// Footer gradient parallax effect
onMounted(() => {
  const footerGradient = document.querySelector('.gradient-overlay--footer');

  if (!footerGradient) return;

  const handleFooterScroll = () => {
    const rect = footerGradient.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate how much of the footer is in view
    // When footer top is at bottom of viewport: progress = 0
    // When footer is fully in view: progress = 1
    const elementHeight = rect.height;
    const visibleTop = Math.max(0, windowHeight - rect.top);
    const scrollProgress = Math.min(Math.max(visibleTop / elementHeight, 0), 1);

    // Interpolate from 150% to 100%
    // scrollProgress 0 -> 150%, scrollProgress 1 -> 100%
    const footerGradY = 150 - (scrollProgress * 50);

    // Update CSS variable
    footerGradient.style.setProperty('--footer-grad-y', `${footerGradY}%`);
  };

  // Add scroll event listener
  window.addEventListener('scroll', handleFooterScroll, { passive: true });

  // Call once on mount to set initial state
  handleFooterScroll();

  // Cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener('scroll', handleFooterScroll);
  });
});
</script>
