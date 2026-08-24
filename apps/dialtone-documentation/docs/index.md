---
layout: Home
pageClass: dialpad-design-home
---

<dt-box position="relative">
  <dt-box
    v-if="viewport.atLeast('md') && isMigrationBannerVisible"
    position="absolute"
    inset-block-start="200"
    inset-inline="200"
    z-index="navigation"
    border-width="100"
    border-radius="400"
    shadow="small"
    class="d-of-hidden"
  >
    <migration-banner class="d-baw0" v-model:visible="isMigrationBannerVisible" />
  </dt-box>
  <gradient-hero />
</dt-box>
<dt-box as="section" class="d-m-auto">
  <dt-box as="article" padding-block="800">
    <showcase-carousel />
  </dt-box>
  <dt-box
    as="article"
    padding-block="800"
    :padding-inline="viewport.pick({
      default: '500', md: '800',
    })"
  >
    <dt-stack gap="550" align="center">
      <dt-box max-inline-size="1200">
        <dt-text as="h2" kind="headline" wrap="balance" align="center" strength="normal" density="200" class="home-section-title">Setting the tone</dt-text>
      </dt-box>
      <dt-box max-inline-size="1200">
        <dt-text as="p" align="center" wrap="balance" kind="headline" size="500" strength="normal">A shared design language shaping everything from our product interfaces to our marketing. It defines how our brand looks, feels, and behaves across every touchpoint. Built on principles of clarity, consistency, and accessibility, Dialtone keeps our visual identity cohesive and unmistakably Dialpad.</dt-text>
      </dt-box>
    </dt-stack>
  </dt-box>
  <dt-box
    as="article"
    padding-block="800"
    :padding-inline="viewport.pick({
      default: '500', md: '800',
    })"
  >
    <dt-stack gap="700" align="center">
      <dt-stack class="home-section-inline" :direction="{ 'default': 'column', 'md': 'row' }" gap="600" justify="center">
        <dt-link to="./foundations/brand/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <svg-loader class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" name="home-foundations-01" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">Brand</dt-text>
          </dt-box>
        </dt-link>
        <dt-link to="./foundations/colors/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-foundations-02.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">Colors</dt-text>
          </dt-box>
        </dt-link>
        <dt-link to="./foundations/typography/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-foundations-03.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">Typography</dt-text>
          </dt-box>
        </dt-link>
        <dt-link to="./foundations/motion/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <svg-loader class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" name="home-foundations-04" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">Motion</dt-text>
          </dt-box>
        </dt-link>
      </dt-stack>
      <dt-stack class="home-section-inline" gap="550" align="center" justify="center">
        <dt-text as="h2" kind="headline" wrap="balance" align="center" density="200" strength="normal" class="home-section-title">Foundations</dt-text>
        <dt-box max-inline-size="1200">
          <dt-text as="p" align="center" wrap="balance" kind="body" size="300" class="d-fs-350">The building blocks of Dialtone... Color, Type, Layout & Spacing, Icons, and more.</dt-text>
        </dt-box>
        <dt-button size="400" to="./foundations/">
          View all Foundations
          <template #endIcon>
            <dt-icon name="arrow-right" size="300" />
          </template>
        </dt-button>
      </dt-stack>
    </dt-stack>
  </dt-box>
  <dt-box
    as="article"
    padding-block="800"
    :padding-inline="viewport.pick({
      default: '500', md: '800',
    })"
  >
    <dt-stack gap="700" align="center">
      <dt-stack class="home-section-inline" :direction="{ 'default': 'column', 'md': 'row' }" gap="600" justify="center">
        <dt-link to="./components/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-system--01.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">Components</dt-text>
          </dt-box>
        </dt-link>
        <dt-link to="./utilities/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-system--02.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">CSS Utilities</dt-text>
          </dt-box>
        </dt-link>
        <dt-link to="./tokens/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-system--03.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">Design Tokens</dt-text>
          </dt-box>
        </dt-link>
        <dt-link to="./ui-kits/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-system--04.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" size="300">UI Kits</dt-text>
          </dt-box>
        </dt-link>
      </dt-stack>
      <dt-stack class="home-section-inline" gap="550" align="center" justify="center">
        <dt-text as="h2" kind="headline" wrap="balance" strength="normal" align="center" density="200" class="home-section-title">Design System</dt-text>
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
  <dt-box
    as="article"
    padding-block="800"
    :padding-inline="viewport.pick({
      default: '500', md: '800',
    })"
  >
    <dt-stack gap="700" align="center">
      <dt-stack class="home-section-inline" gap="550" align="center">
        <dt-text as="h2" kind="headline" wrap="balance" align="center" density="200" strength="normal" class="home-section-title">What's New</dt-text>
        <dt-box max-inline-size="1200">
          <dt-text as="p" align="center" wrap="balance" kind="body" size="300" class="d-fs-350">The latest from Dialpad Design.</dt-text>
        </dt-box>
        <dt-box class="d-d-grid d-g-300 d-g-cols1 md:d-g-cols3 d-ai-stretch home-section-blog-preview">
          <dt-link
            v-for="post in $page.blogPosts.sort(sortHandler).slice(0, 3)"
            :key="post.posted"
            :to="`/dialtone/whats-new/posts/${post.posted}`"
            class="d-d-block d-bar-500 d-td-none d-p-300 h:d-box-secondary-opaque d-ba d-bc-transparent h:d-bc-subtle h:d-bs-card"
          >
            <dt-stack gap="100">
              <dt-link class="d-d-inline">
                <dt-text as="h3" kind="headline" :size="400" strength="semibold">{{ post.heading }}</dt-text>
              </dt-link>
              <dt-text as="time" kind="body" :size="200" tone="tertiary">{{ post.author }} &middot; {{ formatDate(post.posted) }}</dt-text>
              <dt-text as="p" kind="body" :size="300" tone="primary" wrap="pretty">{{ post.excerpt }}</dt-text>
            </dt-stack>
          </dt-link>
        </dt-box>
        <dt-button :size="400" to="./dialtone/whats-new/">
          View all
          <template #endIcon>
            <dt-icon name="arrow-right" size="300" />
          </template>
        </dt-button>
      </dt-stack>
    </dt-stack>
  </dt-box>
</dt-box>
<dt-stack align="center" justify="center" class="gradient-overlay--footer d-h-1000">
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
.dialpad-design-home {
  /* Matches the hero's own background so the canvas has no visible seam below it. */
  background-color: var(--dt-color-surface-primary);
}

.home-section-title {
  font-size: 36px;
  font-family: "Season Sans", var(--dt-font-family-body);

  @media screen and (min-width: 640px) {
    font-size: 48px;
  }
}

.home-section-inline {
  inline-size: 100%;
}

.home-section-blog-preview {
  max-inline-size: 1200px;
}

/* Footer gradient. Owns everything it needs directly: it used to be a modifier nested
   inside a shared `.gradient-overlay` block that the hero also used, and the hero's half
   of that block is gone. Its height comes from the `d-h-1000` utility on the element. */
.gradient-overlay--footer {
  --footer-grad-y: 200%;
  --grad: radial-gradient(50% 75% at 50% var(--footer-grad-y), #DAA3FF 0%, #FFB1CF 33%, #FFDAD7 66%, rgba(248, 247, 246, 0.00) 100%);

  position: relative;
  background-image: var(--grad);

  [data-dt-mode="dark"] & {
    --grad: radial-gradient(50% 75% at 50% var(--footer-grad-y), rgb(246, 100, 55) 0%, rgb(223, 38, 110) 30%, rgb(191, 10, 128) 44%, rgb(81, 30, 118) 71%, transparent 100%);
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
import { useViewportBreakpoints } from '../../theme/composables/useViewportBreakpoints.js';

const viewport = useViewportBreakpoints();
const isMigrationBannerVisible = ref(true);

const sortHandler = (a, b) => compareDesc(
  parse(a.posted, 'y-M-d', new Date()),
  parse(b.posted, 'y-M-d', new Date()),
);

const formatDate = (dateStr) => {
  return format(parse(dateStr, 'y-M-d', new Date()), 'MMMM do, y');
};

// Mirror the pageClass frontmatter onto <body> for global styles.
onMounted(() => {
  document.body.classList.add('dialpad-design-home');
});

onUnmounted(() => {
  document.body.classList.remove('dialpad-design-home');
});

// Scroll-driven effects — rAF-throttled so the two page scroll handlers don't thrash layout.
onMounted(() => {
  const hero = document.querySelector('.home-gradient-hero');
  const shaderLayer = hero?.querySelector('.home-gradient-hero__shader');
  const header = document.querySelector('.dialtone-header--home');
  let lastScrollY = window.scrollY;
  let ticking = false;

  if (!hero) return;

  const update = () => {
    const heroHeight = hero.offsetHeight;
    const scrollY = window.scrollY;

    // Overlay fades in across its scroll range: 0 at top → 1 when fully scrolled past.
    const overlayOpacity = Math.min(Math.max(scrollY / heroHeight, 0), 1);

    // Text starts at 0.6 and fades out twice as fast — done by 50% scroll.
    const textOpacity = Math.max(.8 - (scrollY / (heroHeight * 0.5)) * 0.6, 0);

    // Text slides down 0–325px over the overlay's scroll range.
    const scrollProgress = Math.min(scrollY / heroHeight, 1);
    const textTranslateY = scrollProgress * 325;

    hero.style.setProperty('--overlay-opacity', overlayOpacity);
    hero.style.setProperty('--text-opacity', textOpacity);
    hero.style.setProperty('--text-translate-y', `${textTranslateY}px`);

    // Canvas parallax: the shader layer overhangs the hero, and it travels up by exactly
    // that overhang across the hero's scroll range — so it arrives flush at the bottom
    // instead of uncovering it. The distance is measured off the element rather than
    // repeating the CSS value, so the two cannot drift apart.
    if (shaderLayer) {
      const parallaxRange = Math.max(shaderLayer.offsetHeight - heroHeight, 0);
      hero.style.setProperty('--shader-translate-y', `${-scrollProgress * parallaxRange}px`);
    }

    if (header) {
      const isScrollingUp = scrollY < lastScrollY;
      if (isScrollingUp) {
        header.classList.remove('dialtone-header--off-canvas');
      } else {
        // Only hide the header when scrolling DOWN and the gradient is out of view.
        const gradientRect = hero.getBoundingClientRect();
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
    const scrollViewportBottom = window.innerHeight;

    // scrollProgress: 0 when footer's top touches bottom of viewport, 1 when fully in view.
    const visibleTop = Math.max(0, scrollViewportBottom - rect.top);
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
