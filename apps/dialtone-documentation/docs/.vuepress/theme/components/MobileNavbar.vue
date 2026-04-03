<template>
  <dt-stack direction="row" align="center" class="d-mis-auto lg:d-d-none">
    <dt-button
      v-show="!isMenuOpen"
      importance="clear"
      :circle="true"
      @click="$emit('search')"
    >
      <template #startIcon>
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
      <template #startIcon>
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
      <template #startIcon>
        <dt-icon name="close" />
      </template>
    </dt-button>
    <dt-stack
      as="nav"
      align="baseline"
      class="
        mobile-header-drop-down-menu
        d-ps-fixed
        d-l0
        d-w100p
        d-bgc-secondary
        d-of-auto
        d-fs-300
        d-py-300
        d-px-200
        d-h100p
        d-t64
        d-zi-navigation-fixed
        "
      :class="{ 'd-o0 d-d-none': !isMenuOpen }"
    >
      <dt-link
        v-for="link in items"
        :key="link"
        :to="link.link"
        class="d-mbe-150"
        :class="{ 'router-link-active': isActiveLink(link.text) }"
        @click="toggleNavbar"
      >
        {{ link.text }}
      </dt-link>
    </dt-stack>
  </dt-stack>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const isMenuOpen = ref(false);
const route = useRoute();
const router = useRouter();

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
  // Wait for any pending route navigation to complete
  await router.isReady();
  await nextTick();

  // Then toggle menu state
  isMenuOpen.value = !isMenuOpen.value;
  document.body.classList.toggle('d-of-hidden', !!isMenuOpen.value);
};
</script>
