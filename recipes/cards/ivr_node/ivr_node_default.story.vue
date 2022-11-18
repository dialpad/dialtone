<template>
  <dt-recipe-ivr-node
    :node-label="label"
    :node-type="nodeType"
    :is-selected="isSelected"
    :dtmf-key="dtmfKey"
    :menu-button-aria-label="menuButtonAriaLabel"
    @click="onClick($event)"
  >
    <template
      v-if="content"
      #content
    >
      <span v-html="content" />
    </template>
    <template
      v-else
      #content
    >
      <div v-if="expert">
        <p class="d-fs14 d-fw-bold">
          Account Issues
        </p>
        <p class="d-fs14">
          19 Nodes
        </p>
        <dt-button
          importance="clear"
          icon-position="right"
        >
          Launch Expert
          <template #icon>
            <dt-icon name="external-link" />
          </template>
        </dt-button>
      </div>
      <div v-if="transfer">
        <div class="d-d-flex d-ai-center d-gg8">
          <dt-avatar>
            <img
              data-qa="dt-avatar-image"
              :src="avatarSrc"
              alt="Person Avatar"
            >
          </dt-avatar>
          <p>Carolina Garcia Rodriguez</p>
        </div>
      </div>
      <div v-if="hangup || branch || goTo">
        <p class="d-fs14 d-fw-bold">
          Name
        </p>
        <p class="d-fs14">
          Description
        </p>
      </div>
      <div v-if="play">
        <p class="d-fs14 d-fc-purple-700">
          2022-Greeting.mp3
        </p>
      </div>
      <div v-if="collect || menu">
        <p class="d-fs14 d-fw-bold">
          {{ label }} prompt
        </p>
        <p class="d-fs14 d-fc-purple-700">
          {{ fileName }}
        </p>
      </div>
    </template>
    <template
      v-if="menuItems"
      #menuItems
    >
      <span v-html="menuItems" />
    </template>
    <template
      v-else
      #menuItems="{ close }"
    >
      <dt-list-item
        role="menuitem"
        navigation-type="arrow-keys"
        @click="close"
      >
        Edit
      </dt-list-item>
      <dt-list-item
        role="menuitem"
        navigation-type="arrow-keys"
        @click="close"
      >
        Copy
        <template #right>
          <dt-keyboard-shortcut
            screen-reader-text="Ctrl and C"
            shortcut="Ctrl + C"
          />
        </template>
      </dt-list-item>
      <dt-list-item
        role="menuitem"
        navigation-type="arrow-keys"
        @click="close"
      >
        Delete
        <template #right>
          <dt-keyboard-shortcut
            screen-reader-text="Delete"
            shortcut="Del"
          />
        </template>
      </dt-list-item>
    </template>
  </dt-recipe-ivr-node>
</template>

<script>
import DtRecipeIvrNode from './ivr_node';
import {
  IVR_NODE_BRANCH,
  IVR_NODE_EXPERT, IVR_NODE_GO_TO, IVR_NODE_HANGUP,
  IVR_NODE_LABELS,
  IVR_NODE_PROMPT_COLLECT,
  IVR_NODE_PROMPT_MENU,
  IVR_NODE_PROMPT_PLAY, IVR_NODE_TRANSFER,
} from './ivr_node_constants';
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';
import { DtAvatar } from '@/components/avatar';
import { DtListItem } from '@/components/list_item';
import { DtKeyboardShortcut } from '@/components/keyboard_shortcut';
import avatarImage from './avatar.png';

export default {
  name: 'DtRecipeIvrNodeDefault',
  components: { DtButton, DtRecipeIvrNode, DtIcon, DtAvatar, DtListItem, DtKeyboardShortcut },
  props: {
    nodeType: {
      type: String,
      default: null,
    },
  },

  computed: {
    avatarSrc () {
      return avatarImage;
    },

    items () {
      return [
        { name: 'Edit', id: 1 },
        { name: 'Copy', id: 2 },
        { name: 'Delete', id: 3 },
      ];
    },

    expert () {
      return this.nodeType === IVR_NODE_EXPERT;
    },

    menu () {
      return this.nodeType === IVR_NODE_PROMPT_MENU;
    },

    collect () {
      return this.nodeType === IVR_NODE_PROMPT_COLLECT;
    },

    play () {
      return this.nodeType === IVR_NODE_PROMPT_PLAY;
    },

    goTo () {
      return this.nodeType === IVR_NODE_GO_TO;
    },

    branch () {
      return this.nodeType === IVR_NODE_BRANCH;
    },

    transfer () {
      return this.nodeType === IVR_NODE_TRANSFER;
    },

    hangup () {
      return this.nodeType === IVR_NODE_HANGUP;
    },

    label () {
      return this.nodeLabel || IVR_NODE_LABELS[this.nodeType];
    },

    fileName () {
      return this.menu
        ? 'americas_office-workflow_main-menu-2022--FINAL.mp3'
        : 'americas_office-collect-menu-2022-FINAL.mp3';
    },
  },
};
</script>
