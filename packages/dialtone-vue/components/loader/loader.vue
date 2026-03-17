<template>
  <div
    class="d-loader"
    :aria-label="ariaLabel || 'loading'"
    data-qa="dt-loader"
  >
    <svg
      :class="['d-icon', `d-icon--size-${size}`, 'd-loader__icon-track']"
      data-qa="dt-loader-icon-track"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="
          M12 0.0180664C18.6175 0.0180664 23.9819 5.38305 23.9819
          12.0005C23.9819 18.6177 18.6175 23.9819 12 23.9819C5.38281
          23.9819 0.0180664 18.6177 0.0180664 12.0005C0.0180664
          5.38305 5.38281 0.0180664 12 0.0180664ZM12 3.26807C7.17773
          3.26807 3.26807 7.17797 3.26807 12.0005C3.26807 16.8228
          7.17773 20.7319 12 20.7319C16.8223 20.7319 20.7319 16.8228
          20.7319 12.0005C20.7319 7.17797 16.8223 3.26807 12 3.26807Z
        "
      />
    </svg>
    <svg
      :class="['d-icon', `d-icon--size-${size}`, 'd-loader__icon']"
      data-qa="dt-loader-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="
          M0.0180664 12.0005
          C0.0180664 5.38305 5.38305 0.0180664 12.0005 0.0180664
          C12.8977 0.0183302 13.6255 0.745766 13.6255 1.64307
          C13.6255 2.54037 12.8977 3.2678 12.0005 3.26807
          C7.17797 3.26807 3.26807 7.17797 3.26807 12.0005
          C3.26833 16.8228 7.17814 20.7319 12.0005 20.7319
          C16.8226 20.7317 20.7317 16.8226 20.7319 12.0005
          C20.7319 11.103 21.4595 10.3755 22.3569 10.3755
          C23.2544 10.3755 23.9819 11.103 23.9819 12.0005
          C23.9817 18.6175 18.6175 23.9817 12.0005 23.9819
          C5.38321 23.9819 0.0183303 18.6177 0.0180664 12.0005Z
        "
      />
    </svg>
  </div>
</template>

<script>
import { ICON_SIZE_MODIFIERS } from '@/components/icon';

export default {
  name: 'DtLoader',

  props: {
    /**
     * The label of the loader as read out by a screen reader.
     * Default is "loading"
     */
    ariaLabel: {
      type: String,
      default: '',
    },

    /**
     * The size of the icon.
     * @values 100, 200, 300, 400, 500, 600, 700, 800
     */
    size: {
      type: String,
      default: '500',
      validator: (s) => Object.keys(ICON_SIZE_MODIFIERS).includes(s),
    },
  },
};
</script>
