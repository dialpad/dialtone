<template>
  <div class="d-ml-auto d-d-none lg:d-d-flex d-ai-center">
    <dt-button
      v-show="!isMenuOpen"
      importance="clear"
      :circle="true"
      @click="$emit('search')"
    >
      <template #icon>
        <dt-icon
          name="search"
          size="400"
        />
      </template>
    </dt-button>
    <dt-button
      v-show="!isMenuOpen"
      importance="clear"
      :circle="true"
      @click="toggleNavbar"
    >
      <template #icon>
        <dt-icon
          name="menu"
          size="500"
        />
      </template>
    </dt-button>
    <dt-button
      v-show="isMenuOpen"
      importance="clear"
      :circle="true"
      @click="toggleNavbar"
    >
      <template #icon>
        <dt-icon name="close" />
      </template>
    </dt-button>
    <nav
      class="
        mobile-header-drop-down-menu d-ps-fixed d-l0 d-w100p
        d-bgc-secondary d-of-auto d-fs-300 d-d-flex
        d-fd-column d-ai-baseline d-py24 d-px16
        d-h100p d-t64 d-zi-navigation-fixed
      "
      :class="{ 'd-o0 d-d-none': !isMenuOpen }"
    >
      <router-link
        v-for="link in items"
        :key="link"
        :to="link.link"
        class="d-link d-mb12"
        :class="{ 'router-link-active': isActiveLink(link.text) }"
        @click="toggleNavbar"
      >
        {{ link.text }}
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const isMenuOpen = ref(false);
const route = useRoute();

defineProps({
  items: { type: Array, required: true },
  activeLink: { type: String, default: '' },
});

defineEmits(['search']);

const isActiveLink = (text) => {
  const linkBase = text.toLowerCase();
  return route.path.search(linkBase) !== -1;
};
const toggleNavbar = async () => {
  setTimeout(() => {
    isMenuOpen.value = !isMenuOpen.value;
    document.body.classList.toggle('d-of-hidden', !!isMenuOpen.value);
  }, 10);
};
</script>
