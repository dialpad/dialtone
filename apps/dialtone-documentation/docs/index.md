---
layout: Blank
---
<div
  id="docsearch"
  ref="docSearchBtn"
  class="d-d-none"
  options=""
/>

<div class="dialtone-header dialtone-header--home d-bgc-primary d-bgo90 d-m-auto">
  <!-- <dialtone-logo /> -->
  <router-link
    class="d-pl8"
    title="Dialtone homepage"
    to="/"
  >
    <dt-stack>
      <dt-illustration name="dialpad-logo" />
    </dt-stack>
  </router-link>
  <navbar
    @search="openSearch"
  />
</div>
<div class="gradient-overlay" style="--overlay-opacity: 0; --text-opacity: .6;">
  <div class="gradient-overlay__overlay"></div>
  <h1
    class="d-headline--xxl d-h100p d-w100p d-d-grid d-plc-center d-ta-center d-fw-medium d-wmx1024 d-m-auto d-p32"
    style="
      font-size: 64px;
      font-family: var(--dt-font-family-expressive);
      text-wrap: balance;
      opacity: var(--text-opacity);
      transform: translateY(var(--text-translate-y, 0px));
      transition: none;
    "
  >
    <div
      style="
        background: linear-gradient(180deg, var(--dt-color-purple-550), var(--dt-color-purple-1000));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      "
    >
      Making every business, a better business through design.
    </div>
  </h1>
</div>
<dt-stack class="d-m-auto" style="max-width: 1400px">
  <dt-stack gap="550" class="d-px32 d-py64 d-ai-center">
    <figure class="d-ta-center"><img class="d-bar16 d-wmx912 d-d-block" src="/assets/images/color--sample-01.jpg" alt=""></figure>
  </dt-stack>
  <dt-stack gap="550" class="d-px32 d-py64 d-ai-center">
    <svg class="d-w114" viewBox="0 0 96 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="96" height="36" rx="12" fill="white"/>
    <path d="M17.523 25.2C16.5896 25.2 15.7496 24.9667 15.003 24.5C14.2696 24.0333 13.6896 23.3933 13.263 22.58C12.8496 21.7533 12.643 20.8267 12.643 19.8C12.643 18.7733 12.8496 17.8533 13.263 17.04C13.6896 16.2133 14.2696 15.5733 15.003 15.12C15.7496 14.6533 16.5896 14.42 17.523 14.42C18.1896 14.42 18.8163 14.5733 19.403 14.88C20.003 15.1733 20.4496 15.5533 20.743 16.02V12.06V10.46V10.38H22.883V23.7V24.92V25H20.743V23.56C20.4496 24.0267 20.003 24.42 19.403 24.74C18.8163 25.0467 18.1896 25.2 17.523 25.2ZM17.843 23.34C18.363 23.34 18.8363 23.22 19.263 22.98C19.6896 22.7267 20.0296 22.38 20.283 21.94C20.5496 21.5 20.703 21 20.743 20.44V19.12C20.703 18.56 20.5496 18.0667 20.283 17.64C20.0296 17.2133 19.6896 16.88 19.263 16.64C18.8363 16.4 18.363 16.28 17.843 16.28C17.2696 16.28 16.7496 16.4267 16.283 16.72C15.8296 17.0133 15.4696 17.4267 15.203 17.96C14.9496 18.4933 14.823 19.1 14.823 19.78C14.823 20.4733 14.9496 21.0933 15.203 21.64C15.4696 22.1733 15.8296 22.5933 16.283 22.9C16.7496 23.1933 17.2696 23.34 17.843 23.34ZM27.2561 24.9V25H25.1161V24.9V23.72V16.3V14.7V14.62H27.2561V23.72V24.9ZM26.1761 13.08C25.7894 13.08 25.4628 12.9533 25.1961 12.7C24.9428 12.4333 24.8161 12.1133 24.8161 11.74C24.8161 11.3533 24.9428 11.0333 25.1961 10.78C25.4628 10.5133 25.7894 10.38 26.1761 10.38C26.5628 10.38 26.8894 10.5133 27.1561 10.78C27.4228 11.0333 27.5561 11.3533 27.5561 11.74C27.5561 12.1133 27.4228 12.4333 27.1561 12.7C26.8894 12.9533 26.5628 13.08 26.1761 13.08ZM32.5511 25.2C31.8578 25.2 31.2378 25.0733 30.6911 24.82C30.1444 24.5533 29.7178 24.1933 29.4111 23.74C29.1044 23.2867 28.9511 22.7667 28.9511 22.18C28.9511 21.58 29.0911 21.06 29.3711 20.62C29.6644 20.18 30.0778 19.8267 30.6111 19.56C31.1444 19.28 31.7911 19.08 32.5511 18.96L35.6911 18.5V18.14C35.6911 17.7 35.5978 17.3267 35.4111 17.02C35.2378 16.7133 34.9844 16.4867 34.6511 16.34C34.3311 16.18 33.9644 16.1 33.5511 16.1C33.0844 16.1 32.6778 16.18 32.3311 16.34C31.9978 16.4867 31.7244 16.7 31.5111 16.98C31.3111 17.26 31.1644 17.5933 31.0711 17.98L29.0911 17.44C29.2644 16.88 29.5378 16.3733 29.9111 15.92C30.2978 15.4667 30.7978 15.1067 31.4111 14.84C32.0244 14.56 32.7378 14.42 33.5511 14.42C34.3911 14.42 35.1311 14.5733 35.7711 14.88C36.4244 15.1733 36.9244 15.6133 37.2711 16.2C37.6311 16.7733 37.8111 17.4533 37.8111 18.24V23.54V24.92V25H35.6911V20.04L32.8911 20.52C32.3178 20.6133 31.8778 20.7933 31.5711 21.06C31.2778 21.3133 31.1311 21.66 31.1311 22.1C31.1311 22.5267 31.2911 22.88 31.6111 23.16C31.9444 23.4267 32.3711 23.56 32.8911 23.56C33.4511 23.56 33.9444 23.42 34.3711 23.14C34.8111 22.86 35.1511 22.5067 35.3911 22.08C35.6311 21.64 35.7778 21.18 35.8311 20.7L36.2111 22.32C35.9311 23.2933 35.4578 24.02 34.7911 24.5C34.1244 24.9667 33.3778 25.2 32.5511 25.2ZM42.0998 24.92V25H39.9598V24.92V23.72V12.06V10.46V10.38H42.0998V23.72V24.92ZM48.3548 25.2C47.4082 25.2 46.6482 24.92 46.0748 24.36C45.5015 23.8 45.2148 22.9867 45.2148 21.92V16.42H43.3948V14.62C44.0348 14.62 44.4748 14.5667 44.7148 14.46C44.9682 14.3533 45.1282 14.1467 45.1948 13.84C45.2748 13.5333 45.3148 12.98 45.3148 12.18H47.3348V14.62H49.9748V16.42H47.3348V21.76C47.3348 22.2933 47.4682 22.6933 47.7348 22.96C48.0015 23.2133 48.3482 23.34 48.7748 23.34C48.9748 23.34 49.1615 23.32 49.3348 23.28C49.5082 23.24 49.6882 23.16 49.8748 23.04V24.86C49.7415 24.9533 49.5282 25.0333 49.2348 25.1C48.9415 25.1667 48.6482 25.2 48.3548 25.2ZM55.7722 25.2C54.7855 25.2 53.8922 24.9667 53.0922 24.5C52.3055 24.0333 51.6855 23.3867 51.2322 22.56C50.7922 21.7333 50.5722 20.8133 50.5722 19.8C50.5722 18.7733 50.7922 17.8533 51.2322 17.04C51.6855 16.2267 52.3055 15.5867 53.0922 15.12C53.8789 14.6533 54.7789 14.42 55.7922 14.42C56.7789 14.42 57.6655 14.6533 58.4522 15.12C59.2522 15.5867 59.8789 16.2333 60.3322 17.06C60.7855 17.8733 61.0122 18.7867 61.0122 19.8C61.0122 20.8267 60.7855 21.7467 60.3322 22.56C59.8789 23.3733 59.2522 24.02 58.4522 24.5C57.6655 24.9667 56.7722 25.2 55.7722 25.2ZM55.7922 23.34C56.3789 23.34 56.8989 23.1867 57.3522 22.88C57.8055 22.5733 58.1589 22.1533 58.4122 21.62C58.6789 21.0867 58.8122 20.48 58.8122 19.8C58.8122 19.12 58.6789 18.5133 58.4122 17.98C58.1589 17.4467 57.7989 17.0333 57.3322 16.74C56.8789 16.4333 56.3655 16.28 55.7922 16.28C55.2055 16.28 54.6789 16.4333 54.2122 16.74C53.7589 17.0333 53.4055 17.4467 53.1522 17.98C52.8989 18.5133 52.7722 19.12 52.7722 19.8C52.7722 20.48 52.8989 21.0867 53.1522 21.62C53.4055 22.1533 53.7589 22.5733 54.2122 22.88C54.6789 23.1867 55.2055 23.34 55.7922 23.34ZM62.6942 24.92V23.72V16.3V14.7V14.62H64.8342V16.06C65.1809 15.5667 65.6209 15.1733 66.1542 14.88C66.7009 14.5733 67.3009 14.42 67.9542 14.42C68.7009 14.42 69.3676 14.5733 69.9542 14.88C70.5409 15.1733 71.0009 15.6 71.3342 16.16C71.6809 16.7067 71.8542 17.3467 71.8542 18.08V23.72V24.92V25H69.7142V24.92V23.72V18.6C69.7142 18.1067 69.6276 17.6867 69.4542 17.34C69.2809 16.9933 69.0209 16.7333 68.6742 16.56C68.3409 16.3733 67.9476 16.28 67.4942 16.28C67.0676 16.28 66.6676 16.3933 66.2942 16.62C65.9342 16.8333 65.6209 17.1333 65.3542 17.52C65.1009 17.8933 64.9276 18.3133 64.8342 18.78V23.72V24.92V25H62.6942V24.92ZM75.5828 19.76C75.5828 20.4933 75.7095 21.1333 75.9628 21.68C76.2161 22.2267 76.5695 22.6467 77.0228 22.94C77.4895 23.2333 78.0361 23.38 78.6628 23.38C79.3428 23.38 79.8961 23.2333 80.3228 22.94C80.7495 22.6333 81.0495 22.1667 81.2228 21.54L83.3228 22.14C83.0428 23.0867 82.4961 23.8333 81.6828 24.38C80.8695 24.9267 79.8428 25.2 78.6028 25.2C77.6161 25.2 76.7295 24.9733 75.9428 24.52C75.1695 24.0533 74.5628 23.4133 74.1228 22.6C73.6961 21.7733 73.4828 20.84 73.4828 19.8C73.4828 18.76 73.6961 17.8333 74.1228 17.02C74.5495 16.1933 75.1428 15.5533 75.9028 15.1C76.6761 14.6467 77.5495 14.42 78.5228 14.42C79.8161 14.42 80.8361 14.72 81.5828 15.32C82.3295 15.92 82.8295 16.66 83.0828 17.54C83.3495 18.42 83.4295 19.2933 83.3228 20.16H74.7228V18.6H81.1028C81.0761 18.1067 80.9495 17.6733 80.7228 17.3C80.5095 16.9133 80.2095 16.6133 79.8228 16.4C79.4495 16.1867 79.0161 16.08 78.5228 16.08C77.8961 16.08 77.3628 16.2333 76.9228 16.54C76.4828 16.8333 76.1495 17.26 75.9228 17.82C75.6961 18.3667 75.5828 19.0133 75.5828 19.76Z" fill="url(#paint0_linear_149_17602)"/>
    <defs>
    <linearGradient id="paint0_linear_149_17602" x1="84" y1="30" x2="1.37972" y2="28.4004" gradientUnits="userSpaceOnUse">
    <stop stop-color="#7C52FF"/>
    <stop offset="0.33" stop-color="#FF13AC"/>
    <stop offset="0.66" stop-color="#FF1356"/>
    <stop offset="1" stop-color="#FF5F2F"/>
    </linearGradient>
    </defs>
    </svg>
    <h2 class="d-headline--xxl d-ff-expressive" style="font-size: 48px;font-family:var(--dt-font-family-expressive); text-wrap: balance; max-width: 1400px;">Setting the tone.</h2>
    <p class="d-ta-center d-docsite--paragraph d-m0" style="text-wrap: balance;">Dialtone is Dialpad’s shared design language—shaping everything from our product interfaces to our marketing. It defines how our brand looks, feels, and behaves across every touchpoint. Built on principles of clarity, consistency, and accessibility, Dialtone keeps our visual identity cohesive and unmistakably Dialpad.</p>
  </dt-stack>
  <dt-stack gap="700" class="d-px32 d-py64 d-ai-center">
    <dt-stack direction="row" gap="600" class="d-w100p">
      <svg-loader class="d-ba d-bar16" name="placeholder" />
      <svg-loader class="d-ba d-bar16" name="placeholder" />
      <svg-loader class="d-ba d-bar16" name="placeholder" />
      <svg-loader class="d-ba d-bar16" name="placeholder" />
    </dt-stack>
    <dt-stack gap="550" class="d-ai-center">
      <h2 class="d-headline--xxl d-ff-expressive" style="font-size: 48px;font-family:var(--dt-font-family-expressive); text-wrap: balance; max-width: 1400px;">Foundations</h2>
      <p class="d-ta-center d-docsite--paragraph d-m0" style="text-wrap: balance;">The building blocks of Dialtone... Color, Type, Icons, and more.</p>
      <p class="d-ta-center d-docsite--paragraph d-m0">
        <dt-button size="lg" icon-position="right">
          View Foundations
          <template #icon>
            <dt-icon name="arrow-right" size="300" />
          </template>
        </dt-button>
      </p>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="700" class="d-px32 d-py64 d-ai-center">
    <dt-stack direction="row" gap="600" class="d-w100p">
      <svg-loader class="d-ba d-bar16" name="placeholder" />
      <svg-loader class="d-ba d-bar16" name="placeholder" />
      <svg-loader class="d-ba d-bar16" name="placeholder" />
      <svg-loader class="d-ba d-bar16" name="placeholder" />
    </dt-stack>
    <dt-stack gap="550" class="d-ai-center">
      <h2 class="d-headline--xxl d-ff-expressive" style="font-size: 48px;font-family:var(--dt-font-family-expressive); text-wrap: balance; max-width: 1400px;">Design System</h2>
      <p class="d-ta-center d-docsite--paragraph d-m0" style="text-wrap: balance;">Build with Dialtone's Components, Design Tokens, CSS Utilities, and more.</p>
      <p class="d-ta-center d-docsite--paragraph d-m0">
        <dt-button size="lg" icon-position="right">
          View the system
          <template #icon>
            <dt-icon name="arrow-right" size="300" />
          </template>
        </dt-button>
      </p>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="700" class="d-px32 d-py64 d-ai-center">
    <dt-stack gap="550" class="d-ai-center">
      <h2 class="d-headline--xxl d-ff-expressive" style="font-size: 48px;font-family:var(--dt-font-family-expressive); text-wrap: balance; max-width: 1400px;">What's New</h2>
      <p class="d-ta-center d-docsite--paragraph d-m0" style="text-wrap: balance;">The latest from Dialpad Design.</p>
      <p class="d-ta-center d-docsite--paragraph d-m0">
        <dt-button size="lg" icon-position="right">
          View all
          <template #icon>
            <dt-icon name="arrow-right" size="300" />
          </template>
        </dt-button>
      </p>
    </dt-stack>
    <dt-stack direction="row" gap="600" class="d-w100p d-ai-flex-start">
      <dt-stack class="d-w100p">
        <p class="d-docsite--paragraph d-m0" style="font-size: 24px;">
          <dt-link href="#link-to-" class=" d-d-block">
            <svg-loader class="d-ba d-bar16" name="placeholder" />
            <span>Replacing Hard-Coded or Base tokens for Chart Tokens</span>
          </dt-link>
        </p>
      </dt-stack>
      <dt-stack class="d-w100p">
        <p class="d-docsite--paragraph d-m0" style="font-size: 24px;">
          <dt-link href="#link-to-" class=" d-d-block">
            <svg-loader class="d-ba d-bar16" name="placeholder" />
            <span>Breaking change in postcss-responsive-variations plugin</span>
          </dt-link>
        </p>
      </dt-stack>
      <dt-stack class="d-w100p">
        <p class="d-docsite--paragraph d-m0" style="font-size: 24px;">
          <dt-link href="#link-to-" class=" d-d-block">
            <svg-loader class="d-ba d-bar16" name="placeholder" />
            <span>Vue 3 input components v-model breaking change</span>
          </dt-link>
        </p>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</dt-stack>

<style scoped lang="less">
.dialpad-design-home {
  position: relative;
}
.dialtone-header {
  &--home {
    max-width: 1400px;
    box-shadow: var(--dt-shadow-card);
    box-shadow: 0 255.043px 71.487px 0 rgba(0, 0, 0, 0.00), 0 163.131px 65.306px 0 rgba(0, 0, 0, 0.01), 0 91.912px 55.094px 0 rgba(0, 0, 0, 0.03), 0 40.85px 40.85px 0 rgba(0, 0, 0, 0.05), 0 10.212px 22.306px 0 rgba(0, 0, 0, 0.05);

    border-radius: var(--dt-size-radius-450);
    position: fixed;
    inset: 16px;
    inset-block-end: auto;

    z-index: 1;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
}

.gradient-overlay {
  --grad: radial-gradient(circle at bottom center, rgb(218, 163, 255) 0%, rgb(230, 170, 250) 10%, rgb(240, 170, 235) 15%, rgb(255, 177, 207) 25%, rgba(255, 195, 210, 0.95) 35%, rgba(255, 210, 212, 0.9) 45%, rgba(255, 218, 215, 0.8) 60%, rgba(250, 230, 220, 0.7) 75%, var(--dt-shell-color-surface-default) 100%);
  --overlay-color-surface: var(--dt-shell-color-surface-default);
  --overlay-opacity: 0;

  position: relative;
  background-image: var(--grad);
  background-attachment: fixed;
  height: 100vh;

  [data-dt-mode="dark"] & {
    --grad: radial-gradient(circle at bottom center, rgb(246, 100, 55) 0%, rgb(223, 38, 110) 30%, rgb(191, 10, 128) 44%, rgb(81, 30, 118) 71%, var(--dt-color-purple-50) 100%);
    --overlay-color-surface: var(--dt-color-purple-50);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background-color: var(--overlay-color-surface);
    opacity: var(--overlay-opacity);
  }
}

.dialtone-home-header {
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Navbar from '../../theme/components/Navbar.vue';

const docSearchBtn = ref(null);

const openSearch = () => {
  docSearchBtn.value?.children[0]?.click();
};

// Scroll-driven opacity effect
onMounted(() => {
  const gradientOverlay = document.querySelector('.gradient-overlay');
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
