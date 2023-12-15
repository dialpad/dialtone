<template>
  <dt-hovercard
    :id="$attrs.id"
    :placement="$attrs.placement"
    :content-class="$attrs.contentClass"
    :fallback-placements="$attrs.fallbackPlacements"
    :padding="$attrs.padding"
    :transition="$attrs.transition"
    :offset="$attrs.offset"
    initial-focus-element="none"
    :header-class="$attrs.headerClass"
    :footer-class="$attrs.footerClass"
    :append-to="$attrs.appendTo"
    @opened="$attrs.onOpened"
  >
    <template #anchor>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="active"
        avatar-seed="JN"
        avatar-alt="Avatar person"
        :avatar-src="defaultImage"
        user-status="Good Morning! :smile:"
        call-button-tooltip=""
      />
    </template>
    <template #content>
      <div>
        <dt-recipe-contact-row
          name="Jaqueline Nackos"
          avatar-presence="active"
          avatar-seed="JN"
          avatar-alt="Avatar person"
          :avatar-src="defaultImage"
          user-status="Good Morning! :smile:"
          call-button-tooltip="Call"
          selected
          :has-call-button="false"
        />
        <br>
        <p>
          Vice President of Sales Enablement
          Aerolabs
        </p>
        <p>
          <b>Work:</b> (415) 555-1234
        </p>
        <p>
          <b>Local Time:</b> 12:32 PM
        </p>
      </div>
    </template>
    <template
      v-if="$attrs.headerContent"
      #headerContent
    >
      <span v-html="$attrs.headerContent" />
    </template>
    <template
      v-if="$attrs.footerContent"
      #footerContent
    >
      <span v-html="$attrs.footerContent" />
    </template>
  </dt-hovercard>
</template>

<script setup>
import DtHovercard from './hovercard.vue';
import DtRecipeContactRow from '@/recipes/leftbar/contact_row/contact_row.vue';
import defaultImage from '@/common/assets/avatar2.png';
</script>
