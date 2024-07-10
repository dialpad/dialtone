<template>
  <router-link
    class="d-btn d-btn--muted h:d-bgc-transparent d-py6 d-px12 d-w216 d-jc-flex-start"
    title="Go back to the homepage"
    to="/"
  >
    <dt-stack gap="450" direction="row">
      <div
        id="gradient"
        class="dialtone-logo-gradient"
      >
        <div class="dialtone-logo-gradient--wrapper">
          <div class="dialtone-logo-gradient--blob dialtone-logo-gradient--gold" style="--i: 0;" />
          <div class="dialtone-logo-gradient--blob dialtone-logo-gradient--magenta" style="--i: 1;" />
          <div class="dialtone-logo-gradient--blob dialtone-logo-gradient--purple" style="--i: 2;" />
        </div>
        <svg viewBox="0 0 95 77" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M86.5079 16.1874C90.9234 16.1874 94.5035 12.6057 94.5035 8.18726C94.5035 3.76886 90.9234 0.187012 86.5079 0.187012C82.0918 0.187012 78.5125 3.76886 78.5125 8.18726C78.5125 12.6057 82.0918 16.1874 86.5079 16.1874ZM34.6749 14.5521C32.835 14.5521 29.6673 16.3058 28.0195 21.6884L28.0158 21.6991L12.4102 72.0435C11.3716 75.3936 7.81608 77.2669 4.46852 76.2277C1.12034 75.1886 -0.751923 71.631 0.28666 68.2815L15.8825 17.9688L15.8862 17.9574C18.4233 9.68223 25.072 1.85156 34.6749 1.85156C44.2747 1.85156 50.9136 9.66595 53.455 17.9287L53.4574 17.9357L65.4709 56.6884L65.4733 56.6964C67.1223 62.0636 70.2845 63.8121 72.1232 63.8121C76.6323 63.8121 80.2869 60.1554 80.2869 55.6437V29.1117C80.2869 25.6043 83.128 22.7616 86.6333 22.7616C90.1387 22.7616 92.9799 25.6043 92.9799 29.1117V55.6437C92.9799 67.1701 83.6424 76.5129 72.1232 76.5129C62.5331 76.5129 55.8857 68.702 53.3431 60.4375L53.3406 60.4283L41.3266 21.6757L41.3247 21.6681C39.6745 16.2982 36.519 14.5521 34.6749 14.5521Z"
            fill="white"
          />
        </svg>
      </div>
      <span class="d-fs-300 d-fw-bold">Dialtone</span>
    </dt-stack>
  </router-link>
</template>

<script setup>
</script>

<style lang="less">
@keyframes blob {
  from {
    transform: translate(0, 0) scale(1);
    rotate: 0deg;
  }
  20% {
    rotate: 25deg;
  }
  50% {
    transform: translate(45%, 25%) scale(1.5);
  }
  75% {
    rotate: 100deg;
  }
  to {
    rotate: 180deg;
  }
}

.dialtone-logo-gradient {
  --speed: 500ms;
  --gold-blob-width: 65%;
  --gold-blob-height: 30%;
  --magenta-blob-1-width: 50%;
  --magenta-blob-1-height: 40%;
  --magenta-blob-2-width: 30%;
  --magenta-blob-2-height: 30%;
  --purple-blob-1-width: 45%;
  --purple-blob-1-height: 50%;
  --purple-blob-2-width: 55%;
  --purple-blob-2-height: 30%;
  --logo-size: calc(var(--dt-size-550) + 4px);

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--logo-size);
  height: var(--logo-size);
  border-radius: calc(var(--logo-size) * .2875);
  overflow: hidden;
  background-color: var(--dt-color-magenta-300);
  background-image: linear-gradient(
    155deg,
    var(--dt-color-gold-300) 0%,
    var(--dt-color-magenta-300) 25%,
    var(--dt-color-purple-400) 70%
  );

  svg {
    position: relative;
    z-index: 2;
    width: 60%;
  }
}
.dialtone-logo-gradient--wrapper {
  top: 0;
  left: 0;
  position: absolute;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.dialtone-logo-gradient--blob::before,
.dialtone-logo-gradient--blob::after {
  position: absolute;
  content: "";
  border-radius: 100%;
  filter: blur(20px) brightness(1.1);
  z-index: 100;
  opacity: 85%;
  animation: blob var(--speed) linear calc(var(--i) * 0.05s) infinite;
}

.dialtone-logo-gradient--magenta::before,
.dialtone-logo-gradient--magenta::after {
  background-color: var(--dt-color-magenta-300);
}
.dialtone-logo-gradient--gold::before,
.dialtone-logo-gradient--gold::after {
  background-color: var(--dt-color-gold-300);
}
.dialtone-logo-gradient--purple::before,
.dialtone-logo-gradient--purple::after {
  background-color: var(--dt-color-purple-400);
}
.dialtone-logo-gradient--gold::before {
  width: var(--gold-blob-width);
  height: var(--gold-blob-height);
  top: 0;
  left: -10%;
}
.dialtone-logo-gradient--magenta::before {
  width: var(--magenta-blob-1-width);
  height: var(--magenta-blob-1-height);
  top: 0%;
  right: -10%;
}
.dialtone-logo-gradient--magenta::after {
  width: var(--magenta-blob-2-width);
  height: var(--magenta-blob-2-height);
  top: 10%;
  right: 20%;
}

.dialtone-logo-gradient--purple::before {
  width: var(--purple-blob-1-width);
  height: var(--purple-blob-1-height);
  bottom: -10%;
  right: 0%;
}
.dialtone-logo-gradient--purple::after {
  width: var(--purple-blob-2-width);
  height: var(--purple-blob-2-height);
  bottom: 0%;
  left: 0%;
}
</style>
