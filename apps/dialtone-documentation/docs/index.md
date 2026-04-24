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
<dt-box as="section" class="d-m-auto">
  <dt-box as="article" padding-block="800">
    <showcase-carousel />
  </dt-box>
  <dt-box as="article" padding-block="800" padding-inline="800" surface="secondary-opaque">
    <dt-stack gap="550" align="center">
      <dt-box inline-size="200" style="filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 25px 30px);">
        <svg-loader name="home--dialtone-badge" />
      </dt-box>
      <dt-box max-inline-size="1200">
        <dt-text as="h2" kind="headline" size="xxl" wrap="balance" strength="normal" class="home-section-title">Setting the tone</dt-text>
      </dt-box>
      <dt-box max-inline-size="1200">
        <dt-text as="p" align="center" wrap="balance" kind="headline" size="500" strength="normal">Dialtone is Dialpad’s shared design language, shaping everything from our product interfaces to our marketing. It defines how our brand looks, feels, and behaves across every touchpoint. Built on principles of clarity, consistency, and accessibility, Dialtone keeps our visual identity cohesive and unmistakably Dialpad.</dt-text>
      </dt-box>
    </dt-stack>
  </dt-box>
  <dt-box as="article" padding-block="800" padding-inline="800">
    <dt-stack gap="700" align="center">
      <dt-stack class="home-section-inline" :direction="{ 'default': 'column', 'md': 'row' }" gap="600" justify="center">
        <router-link to="./foundations/brand/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <svg-loader class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" name="home-foundations-01" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">Brand</dt-text>
          </dt-box>
        </router-link>
        <router-link to="./foundations/colors/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-foundations-02.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">Colors</dt-text>
          </dt-box>
        </router-link>
        <router-link to="./foundations/typography/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-foundations-03.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">Typography</dt-text>
          </dt-box>
        </router-link>
        <router-link to="./foundations/motion/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <svg-loader class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" name="home-foundations-04" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">Motion</dt-text>
          </dt-box>
        </router-link>
      </dt-stack>
      <dt-stack class="home-section-inline" gap="550" align="center" justify="center">
        <dt-text as="h2" kind="headline" size="xxl" wrap="balance" strength="normal" class="home-section-title">Foundations</dt-text>
        <dt-box max-inline-size="1200">
          <dt-text as="p" align="center" wrap="balance" kind="body" size="300" class="d-fs-350">The building blocks of Dialtone... Color, Type, Icons, and more.</dt-text>
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
  <dt-box as="article" padding-block="800" padding-inline="800" surface="secondary-opaque">
    <dt-stack gap="700" align="center">
      <dt-stack class="home-section-inline" :direction="{ 'default': 'column', 'md': 'row' }" gap="600" justify="center">
        <router-link to="./components/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-system--01.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">Components</dt-text>
          </dt-box>
        </router-link>
        <router-link to="./utilities/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-system--02.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">CSS Utilities</dt-text>
          </dt-box>
        </router-link>
        <router-link to="./tokens/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-system--03.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">Design Tokens</dt-text>
          </dt-box>
        </router-link>
        <router-link to="./ui-kits/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-system--04.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">UI Kits</dt-text>
          </dt-box>
        </router-link>
      </dt-stack>
      <dt-stack class="home-section-inline" gap="550" align="center" justify="center">
        <dt-text as="h2" kind="headline" size="xxl" wrap="balance" strength="normal" class="home-section-title">Design System</dt-text>
        <dt-box max-inline-size="1200">
          <dt-text as="p" align="center" wrap="balance" kind="body" size="300" class="d-fs-350">Build with Dialtone Components, Design Tokens, CSS Utilities, and more.</dt-text>
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
  <dt-box as="article" padding-block="800" padding-inline="800">
    <dt-stack gap="700" align="center">
      <dt-stack class="home-section-inline" gap="550" align="center">
        <dt-text as="h2" kind="headline" size="xxl" wrap="balance" strength="normal" class="home-section-title">What's New</dt-text>
        <dt-box max-inline-size="1200">
          <dt-text as="p" align="center" wrap="balance" kind="body" size="300" class="d-fs-350">The latest from Dialpad Design.</dt-text>
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
</dt-box>
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

// Mirror the pageClass frontmatter onto <body> for global styles.
onMounted(() => {
  document.body.classList.add('dialpad-design-home');
});

onUnmounted(() => {
  document.body.classList.remove('dialpad-design-home');
});

// Mouse-driven gradient position with eased interpolation.
onMounted(() => {
  let currentPositionX = 50; // Start at center
  let targetPositionX = 50;
  let currentPositionY = 100; // Start at bottom
  let targetPositionY = 100;
  let animationId;

  const gradientOverlay = document.querySelector('.gradient-overlay');

  const animate = () => {
    // Ease current toward target at 10% per frame (on both axes).
    currentPositionX += (targetPositionX - currentPositionX) * 0.1;
    currentPositionY += (targetPositionY - currentPositionY) * 0.1;

    if (gradientOverlay) {
      gradientOverlay.style.setProperty('--grad-position-x', `${currentPositionX}%`);
      gradientOverlay.style.setProperty('--grad-position-y', `${currentPositionY}%`);
    }

    animationId = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 100;

    // Subtle parallax — gradient tracks at 10% of mouse offset from center.
    // (0.1 = very subtle, 0.5 = more responsive.)
    const parallaxFactor = 0.1;
    const offsetFromCenter = mouseX - 50;
    targetPositionX = 50 + (offsetFromCenter * parallaxFactor);

    // Y lifts from 100% at center up to 120% at the viewport edges.
    const distanceFromCenter = Math.abs(mouseX - 50) / 50; // 0 at center, 1 at edge
    targetPositionY = 100 + (distanceFromCenter * 20);
  };

  animate();
  window.addEventListener('mousemove', handleMouseMove);

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(animationId);
  });
});

// Scroll-driven effects — rAF-throttled so the two window scroll handlers don't thrash layout.
onMounted(() => {
  const gradientOverlay = document.querySelector('.gradient-overlay');
  const header = document.querySelector('.dialtone-header--home');
  let lastScrollY = window.scrollY;
  let ticking = false;

  if (!gradientOverlay) return;

  const update = () => {
    const overlayHeight = gradientOverlay.offsetHeight;
    const scrollY = window.scrollY;

    // Overlay fades in across its scroll range: 0 at top → 1 when fully scrolled past.
    const overlayOpacity = Math.min(Math.max(scrollY / overlayHeight, 0), 1);

    // Text starts at 0.6 and fades out twice as fast — done by 50% scroll.
    const textOpacity = Math.max(0.6 - (scrollY / (overlayHeight * 0.5)) * 0.6, 0);

    // Text slides down 0–325px over the overlay's scroll range.
    const scrollProgress = Math.min(scrollY / overlayHeight, 1);
    const textTranslateY = scrollProgress * 325;

    gradientOverlay.style.setProperty('--overlay-opacity', overlayOpacity);
    gradientOverlay.style.setProperty('--text-opacity', textOpacity);
    gradientOverlay.style.setProperty('--text-translate-y', `${textTranslateY}px`);

    if (header) {
      const isScrollingUp = scrollY < lastScrollY;
      if (isScrollingUp) {
        header.classList.remove('dialtone-header--off-canvas');
      } else {
        // Only hide the header when scrolling DOWN and the gradient is out of view.
        const gradientRect = gradientOverlay.getBoundingClientRect();
        const isGradientInView = gradientRect.bottom > 0;
        if (!isGradientInView) {
          header.classList.add('dialtone-header--off-canvas');
        }
      }
    }

    lastScrollY = scrollY;
    ticking = false;
  };

  const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  update(); // Set initial state (e.g. when loaded at a non-zero scroll position).

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});

// Footer gradient parallax — rAF-throttled alongside the main scroll handler.
onMounted(() => {
  const footerGradient = document.querySelector('.gradient-overlay--footer');

  if (!footerGradient) return;

  let ticking = false;

  const update = () => {
    const rect = footerGradient.getBoundingClientRect();

    // scrollProgress: 0 when footer's top touches bottom of viewport, 1 when fully in view.
    const visibleTop = Math.max(0, window.innerHeight - rect.top);
    const scrollProgress = Math.min(Math.max(visibleTop / rect.height, 0), 1);

    // Interpolate Y from 150% down to 100% as the footer scrolls in.
    const footerGradY = 150 - (scrollProgress * 50);
    footerGradient.style.setProperty('--footer-grad-y', `${footerGradY}%`);

    ticking = false;
  };

  const handleFooterScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', handleFooterScroll, { passive: true });
  update(); // Set initial state.

  onUnmounted(() => {
    window.removeEventListener('scroll', handleFooterScroll);
  });
});
</script>
