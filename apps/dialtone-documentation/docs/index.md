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
<dt-box as="section" padding-block-end="800" class="d-m-auto">
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
        <dt-text as="h2" kind="headline" wrap="balance" align="center" strength="semibold" density="200" class="home-section-title">Setting the tone</dt-text>
      </dt-box>
      <dt-box max-inline-size="1200">
        <dt-text as="p" align="center" wrap="balance" kind="body" strength="medium" class="home-type-lead">A shared design language shaping everything from our product interfaces to our marketing. It defines how our brand looks, feels, and behaves across every touchpoint. Built on principles of clarity, consistency, and accessibility, Dialtone keeps our visual identity cohesive and unmistakably Dialpad.</dt-text>
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
            <dt-text as="p" kind="body" strength="medium" class="home-type-body">Brand</dt-text>
          </dt-box>
        </dt-link>
        <dt-link to="./foundations/colors/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-foundations-02.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" strength="medium" class="home-type-body">Colors</dt-text>
          </dt-box>
        </dt-link>
        <dt-link to="./foundations/typography/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-foundations-03.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" strength="medium" class="home-type-body">Typography</dt-text>
          </dt-box>
        </dt-link>
        <dt-link to="./foundations/motion/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <svg-loader class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" name="home-foundations-04" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" strength="medium" class="home-type-body">Motion</dt-text>
          </dt-box>
        </dt-link>
      </dt-stack>
      <dt-stack class="home-section-inline" gap="550" align="center" justify="center">
        <dt-text as="h2" kind="headline" wrap="balance" align="center" density="200" strength="semibold" class="home-section-title">Foundations</dt-text>
        <dt-box max-inline-size="1200">
          <dt-text as="p" align="center" wrap="balance" kind="body" strength="medium" class="home-type-lead">The building blocks of Dialtone... Color, Type, Layout & Spacing, Icons, and more.</dt-text>
        </dt-box>
        <dt-button size="400" class="home-type-button" to="./foundations/">
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
            <dt-text as="p" kind="body" strength="medium" class="home-type-body">Components</dt-text>
          </dt-box>
        </dt-link>
        <dt-link to="./utilities/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-system--02.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" strength="medium" class="home-type-body">CSS Utilities</dt-text>
          </dt-box>
        </dt-link>
        <dt-link to="./tokens/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-system--03.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" strength="medium" class="home-type-body">Design Tokens</dt-text>
          </dt-box>
        </dt-link>
        <dt-link to="./ui-kits/" class="d-d-block d-td-none d-fc-primary d-fco75 h:d-fco95">
          <img src="/assets/images/home-system--04.png" alt="" class="d-bar-500 d-w100p d-ba d-bc-subtle h:d-bc-default h:d-bs-card" />
          <dt-box padding-inline="150">
            <dt-text as="p" kind="body" strength="medium" class="home-type-body">UI Kits</dt-text>
          </dt-box>
        </dt-link>
      </dt-stack>
      <dt-stack class="home-section-inline" gap="550" align="center" justify="center">
        <dt-text as="h2" kind="headline" wrap="balance" strength="semibold" align="center" density="200" class="home-section-title">Design System</dt-text>
        <dt-box max-inline-size="1200">
          <dt-text as="p" align="center" wrap="balance" kind="body" strength="medium" class="home-type-lead">Build with Dialtone Components, Design Tokens, CSS Utilities, and more.</dt-text>
        </dt-box>
        <dt-button :size="400" class="home-type-button" to="./dialtone/">
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
        <dt-text as="h2" kind="headline" wrap="balance" align="center" density="200" strength="semibold" class="home-section-title">What's New</dt-text>
        <dt-box max-inline-size="1200">
          <dt-text as="p" align="center" wrap="balance" kind="body" strength="medium" class="home-type-lead">The latest from Dialpad Design.</dt-text>
        </dt-box>
        <dt-box class="d-d-grid d-g-300 d-g-cols1 xl:d-g-cols3 d-ai-stretch home-section-blog-preview">
          <dt-link
            v-for="post in $page.blogPosts.sort(sortHandler).slice(0, 3)"
            :key="post.posted"
            :to="`/dialtone/whats-new/posts/${post.posted}`"
            class="d-d-block d-bar-500 d-td-none d-ba d-bc-transparent"
            :class="viewport.pick({
              xl: 'd-p-300 h:d-box-secondary-opaque h:d-bc-subtle h:d-bs-card',
            })"
          >
            <dt-stack gap="100">
              <dt-link class="d-d-inline">
                <dt-text as="h3" kind="headline" strength="semibold" wrap="pretty" class="home-type-card-title">{{ post.heading }}</dt-text>
              </dt-link>
              <dt-text as="time" kind="body" strength="medium" tone="tertiary" class="home-type-body">{{ post.author }} &middot; {{ formatDate(post.posted) }}</dt-text>
              <dt-text as="p" kind="body" strength="medium" tone="primary" wrap="pretty" class="home-type-body">{{ post.excerpt }}</dt-text>
            </dt-stack>
          </dt-link>
        </dt-box>
        <dt-button :size="400" class="home-type-button" to="./dialtone/whats-new/">
          View all
          <template #endIcon>
            <dt-icon name="arrow-right" size="300" />
          </template>
        </dt-button>
      </dt-stack>
    </dt-stack>
  </dt-box>
</dt-box>
<halftone-surface flip-x class="home-halftone-footer d-h-600 d-pbs-800" />

<style lang="less">
.dialpad-design-home {
  /* Matches the hero's own background so the canvas has no visible seam below it. */
  background-color: var(--dt-color-surface-primary);
}

/* Resolve brand type spec: Season Sans (Dialtone's name for Season VF Sans), sizes from
   the brand ramp stepping up at 640px, headlines 600, body 500, buttons 600. Scoped to the
   page class so these win over DtText's size and strength classes. */
.dialpad-design-home {
  .home-section-title,
  .home-type-lead,
  .home-type-body,
  .home-type-card-title,
  .home-type-button {
    font-family: "Season Sans", var(--dt-font-family-body);
  }

  .home-section-title {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.005em;

    @media screen and (min-width: 640px) {
      font-size: 32px;
    }
  }

  .home-type-lead {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;

    @media screen and (min-width: 640px) {
      font-size: 20px;
    }
  }

  .home-type-body {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
  }

  .home-type-card-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;

    @media screen and (min-width: 640px) {
      font-size: 24px;
    }
  }

  .home-type-button {
    font-size: 16px;
    font-weight: 600;
  }
}

.home-section-inline {
  inline-size: 100%;
}

.home-section-blog-preview {
  max-inline-size: 1200px;
}

/* The footer halftone fades out before the container's top edge instead of being cut off there. */
.home-halftone-footer .halftone-surface__shader {
  mask-image: linear-gradient(to top, #000 45%, transparent 90%);
}

</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { parse, compareDesc, format } from 'date-fns';
import ShowcaseCarousel from '../../baseComponents/ShowcaseCarousel.vue';
import GradientHero from '../../baseComponents/GradientHero.vue';
import HalftoneSurface from '../../baseComponents/HalftoneSurface.vue';
import { useViewportBreakpoints } from '../../theme/composables/useViewportBreakpoints.js';
import { clamp01 } from '../../theme/utils/math.js';

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

// Hero scroll-driven effects share one rAF so their reads and writes stay together.
onMounted(() => {
  const hero = document.querySelector('.home-gradient-hero');
  const heroShaderLayer = hero?.querySelector('.halftone-surface__shader');
  let ticking = false;

  if (!hero) return;

  // Measured on resize rather than per frame. The height does not change while scrolling,
  // and reading it mid-frame is expensive here specifically: the custom properties written
  // below feed a transform on the shader layer, so any read after a write forces a
  // synchronous style-and-layout pass.
  let heroHeight = 0;
  let heroParallaxRange = 0;

  const measure = () => {
    heroHeight = hero.offsetHeight;
    // The shader layer overhangs the hero, and travels up by exactly that overhang across
    // the hero's scroll range, so it arrives flush at the bottom instead of uncovering it.
    // Measured off the element rather than repeating the CSS value, so the two cannot
    // drift apart.
    heroParallaxRange = heroShaderLayer
      ? Math.max(heroShaderLayer.offsetHeight - heroHeight, 0)
      : 0;
  };

  const update = () => {
    // Every read first, every write after. Interleaving them re-invalidates layout part
    // way through the frame and costs a forced reflow per switch.
    const scrollY = window.scrollY;

    // One clamped progress value drives all four properties. Two of them used to derive it
    // separately, one clamped and one not, which disagreed during overscroll — the
    // unclamped one went negative and drove the text and the parallax backwards.
    const scrollProgress = clamp01(scrollY / (heroHeight || 1));

    // Overlay fades in across the hero's scroll range: 0 at top → 1 once scrolled past.
    // Text fades faster, starting at 0.8 and reaching 0 at about two thirds of the range.
    const textOpacity = Math.max(0.8 - scrollProgress * 1.2, 0);

    hero.style.setProperty('--overlay-opacity', scrollProgress);
    hero.style.setProperty('--text-opacity', textOpacity);
    // Text slides down 0–325px over the same range.
    hero.style.setProperty('--text-translate-y', `${scrollProgress * 325}px`);
    hero.style.setProperty('--halftone-translate-y', `${-scrollProgress * heroParallaxRange}px`);

    ticking = false;
  };

  const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  const handleResize = () => {
    measure();
    handleScroll();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });
  measure();
  update(); // Set initial state (e.g. when loaded at a non-zero scroll position).

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
  });
});

</script>
