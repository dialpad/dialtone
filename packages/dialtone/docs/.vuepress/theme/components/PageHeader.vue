<template>
  <section>
    <slot name="content-top" />
    <header class="d-stack2">
      <div class="d-d-flex d-ai-center d-gg8">
        <h1
          v-if="$frontmatter.title"
          class="dialtone-page-title"
          v-text="$frontmatter.title"
        />
        <span
          v-if="$frontmatter.new"
          class="d-badge d-badge--bulletin"
        >New</span>
      </div>
      <p
        v-if="$frontmatter.description"
        class="dialtone-intro"
        v-html="$frontmatter.description"
      />
    </header>
    <slot name="content-bottom" />
    <div
      v-if="$page.path.startsWith('/components') && !$frontmatter.no_preview"
      id="preview-header"
      class="d-docsite--preview-header d-d-flex d-jc-space-between"
    >
      <h2 class="d-docsite--header-3 d-m0">
        Preview
      </h2>
      <span>
        <a
          v-if="$frontmatter.storybook && $frontmatter.storybook !== 'planned'"
          class="d-btn d-btn--muted d-btn--muted"
          :href="$frontmatter.storybook"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="d-btn__icon d-btn__icon--left">
            <svg
              class="d-icon d-icon--size-300"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4.61824 20.4293L4.00072 3.92089C3.98032 3.37568 4.397 2.91362 4.93974
              2.87959L18.9352 2.00199C19.4877 1.96735 19.9635 2.38859 19.998 2.94286C19.9993
              2.96374 20 2.98466 20 3.00558V20.9945C20 21.5498 19.5513 22 18.9978 22C18.9828
              22 18.9678 21.9997 18.9528 21.999L5.57482 21.3962C5.0538 21.3727 4.6378 20.9522
              4.61824 20.4293Z"
                fill="#FF4785"
              />
              <path
                d="M15.8555 4.42657L15.9531 2.14956L17.9154 2L17.9999 4.34821C18.0028
              4.42993 17.9369 4.49849 17.8527 4.50135C17.8166 4.50257 17.7813 4.49135
              17.7529 4.46968L16.9962 3.89144L16.1003 4.55068C16.0331 4.6001 15.9374
              4.58735 15.8864 4.5222C15.865 4.49478 15.854 4.46096 15.8555 4.42657ZM13.346
              9.44092C13.346 9.82708 16.0275 9.642 16.3875 9.37075C16.3875 6.74106 14.9328
              5.3592 12.2692 5.3592C9.60547 5.3592 8.11304 6.76256 8.11304 8.8676C8.11304
              12.5339 13.2137 12.604 13.2137 14.6038C13.2137 15.1652 12.9304 15.4985 12.3069
              15.4985C11.4946 15.4985 11.1735 15.096 11.2112 13.7278C11.2112 13.4309 8.11304
              13.3384 8.01859 13.7278C7.77806 17.0436 9.90773 18 12.3447 18C14.7062 18 16.5575
              16.779 16.5575 14.5687C16.5575 10.6393 11.3813 10.7446 11.3813 8.79743C11.3813
              8.00804 11.9858 7.90279 12.3447 7.90279C12.7226 7.90279 13.4026 7.96739 13.346
              9.44092Z"
                fill="white"
              />
            </svg>
          </span>
          <span class="d-btn__label">Storybook</span>
        </a>
        <a
          v-if="$frontmatter.figma_url"
          class="d-btn d-btn--muted"
          :href="$frontmatter.figma_url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="d-btn__icon d-btn__icon--left">
            <svg
              class="d-icon d-icon--size-300"
              viewBox="0 0 24 24"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.3333 12C12.3333 11.0275 12.7196 10.0949 13.4073 9.40729C14.0949 8.71965
                15.0275 8.33334 16 8.33334C16.9724 8.33334 17.9051 8.71965 18.5927 9.40729C19.2803
                10.0949 19.6666 11.0275 19.6666 12C19.6666 12.9725 19.2803 13.9051 18.5927 14.5927C17.9051
                15.2804 16.9724 15.6667 16 15.6667C15.0275 15.6667 14.0949 15.2804 13.4073 14.5927C12.7196
                13.9051 12.3333 12.9725 12.3333 12V12Z"
                fill="#1ABCFE"
              />
              <path
                d="M5 19.3333C5 18.3609 5.38631 17.4282 6.07394 16.7406C6.76158 16.053 7.69421 15.6667
                8.66667 15.6667H12.3333V19.3333C12.3333 20.3058 11.947 21.2384 11.2594 21.926C10.5718 22.6137
                9.63913 23 8.66667 23C7.69421 23 6.76158 22.6137 6.07394 21.926C5.38631 21.2384 5 20.3058
                5 19.3333V19.3333Z"
                fill="#0ACF83"
              />
              <path
                d="M12.3333 1V8.33333H16C16.9724 8.33333 17.9051 7.94703 18.5927 7.25939C19.2803 6.57176
                19.6666 5.63913 19.6666 4.66667C19.6666 3.69421 19.2803 2.76158 18.5927 2.07394C17.9051 1.38631
                16.9724 1 16 1L12.3333 1Z"
                fill="#FF7262"
              /><path
                d="M5 4.66667C5 5.63913 5.38631 6.57176
                6.07394 7.25939C6.76158 7.94703 7.69421 8.33333 8.66667 8.33333H12.3333V1H8.66667C7.69421 1
                6.76158 1.38631 6.07394 2.07394C5.38631 2.76158 5 3.69421 5 4.66667V4.66667Z"
                fill="#F24E1E"
              />
              <path
                d="M5 12C5 12.9725 5.38631 13.9051 6.07394 14.5927C6.76158 15.2804 7.69421 15.6667 8.66667
                15.6667H12.3333V8.33334H8.66667C7.69421 8.33334 6.76158 8.71965 6.07394 9.40729C5.38631 10.0949
                5 11.0275 5 12V12Z"
                fill="#A259FF"
              />
            </svg>
          </span>
          <span class="d-btn__label">Figma</span>
        </a>
      </span>
    </div>
  </section>
</template>

<!-- TODO: validate that `storybook` and `figma` are URLS -->
