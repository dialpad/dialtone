<!-- eslint-disable max-len -->
<template>
  <section class="hero">
    <div class="hero--inner-wrapper d-d-flex d-jc-space-between d-mx-auto d-wmx1340 d-pl32 d-pr32">
      <div class="dp-logo" />
      <div class="hero--content d-d-flex d-fd-column d-jc-center">
        <h1 class="d-headline-extra-extra-large d-mb12">
          Improve your UI's reception with Dialtone
        </h1>
        <p class="d-fs-300 d-lh-400 d-mb16 d-fc-secondary">
          Documented styles, components, and utility classes to help you quickly design and build unified experiences
          across Dialpad and Dialpad Meetings.
        </p>
        <div class="d-mb32 d-d-flex d-jc-center d-flow8">
          <a
            class="d-td-unset d-d-inline-flex"
            href="https://github.com/dialpad/dialtone/"
          >
            <img
              alt="Dialtone CSS version number"
              src="https://img.shields.io/github/package-json/v/dialpad/dialtone?color=D3BCFF&label=CSS"
            >
          </a>
          <a
            class="d-td-unset d-d-inline-flex"
            href="https://github.com/dialpad/dialtone-vue"
          >
            <img
              alt="Dialtone Vue version number"
              src="https://img.shields.io/github/package-json/v/dialpad/dialtone-vue?color=D3BCFF&label=Vue"
            >
          </a>
          <a
            class="d-td-unset d-d-inline-flex"
            href="https://github.com/dialpad/dialtone-vue/tree/vue3"
          >
            <img
              alt="Dialtone Vue version number"
              src="https://img.shields.io/github/package-json/v/dialpad/dialtone-vue/vue3?color=D3BCFF&label=Vue 3"
            >
          </a>
        </div>
        <div class="d-d-flex d-jc-center d-flow16">
          <router-link
            v-slot="{ navigate }"
            to="/guides/getting-started/"
            custom
          >
            <dt-button
              role="link"
              size="lg"
              @click="(e) => { sendAnalyticsEvent(); navigate(e); }"
              @keypress.enter="(e) => { sendAnalyticsEvent(); navigate(e); }"
            >
              Get started
            </dt-button>
          </router-link>
          <router-link
            v-slot="{ navigate }"
            to="/about/whats-new/"
            custom
          >
            <dt-button
              role="link"
              size="lg"
              importance="outlined"
              @click="(e) => { navigate(e); }"
              @keypress.enter="(e) => { navigate(e); }"
            >
              What's new?
            </dt-button>
          </router-link>
        </div>
      </div>
      <svg
        class="hero--image d-w50p d-as-flex-start"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 684 451"
        fill="none"
      >
        <g filter="url(#filter0_d_1046_9081)">
          <rect x="325" y="78" width="322" height="152" rx="4" fill="var(--dt-color-surface-primary)" />
          <circle cx="353" cy="102" r="12" fill="var(--dt-color-gold-300)" />
          <rect x="373" y="98" width="92" height="8" rx="3" fill="var(--dt-color-black-200)" />
          <rect width="322" height="40" transform="translate(325 118)" fill="black" fill-opacity="0.02" />
          <circle cx="353" cy="138" r="12" fill="var(--dt-color-purple-300)" />
          <rect x="373" y="134" width="127.336" height="8" rx="3" fill="var(--dt-color-black-400)" />
          <g clip-path="url(#clip0_1046_9081)">
            <rect width="34" height="32" transform="translate(529 122)" fill="var(--dt-color-brand-purple)" />
            <path
              d="M549.333 137V134.667C549.333 134.3 549.033 134 548.667 134H540.667C540.3 134 540 134.3 540 134.667V141.333C540 141.7 540.3 142 540.667 142H548.667C549.033 142 549.333 141.7 549.333 141.333V139L552 141.667V134.333L549.333 137Z"
              fill="var(--dt-color-neutral-white)"
            />
            <g filter="url(#filter1_i_1046_9081)">
              <rect width="34" height="32" transform="translate(563 122)" fill="var(--dt-color-brand-purple)" />
              <path
                d="M585.333 131.333H574.667C573.933 131.333 573.34 131.933 573.34 132.667L573.333 144.667L576 142H585.333C586.067 142 586.667 141.4 586.667 140.667V132.667C586.667 131.933 586.067 131.333 585.333 131.333ZM578 137.333H576.667V136H578V137.333ZM580.667 137.333H579.333V136H580.667V137.333ZM583.333 137.333H582V136H583.333V137.333Z"
                fill="var(--dt-color-neutral-white)"
              />
            </g>
            <g filter="url(#filter2_i_1046_9081)">
              <rect width="34" height="32" transform="translate(597 122)" fill="var(--dt-color-brand-purple)" />
              <path
                d="M610.413 137.193C611.373 139.08 612.92 140.62 614.807 141.587L616.273 140.12C616.453 139.94 616.72 139.88 616.953 139.96C617.7 140.207 618.507 140.34 619.333 140.34C619.7 140.34 620 140.64 620 141.007V143.333C620 143.7 619.7 144 619.333 144C613.073 144 608 138.927 608 132.667C608 132.3 608.3 132 608.667 132H611C611.367 132 611.667 132.3 611.667 132.667C611.667 133.5 611.8 134.3 612.047 135.047C612.12 135.28 612.067 135.54 611.88 135.727L610.413 137.193Z"
                fill="var(--dt-color-neutral-white)"
              />
            </g>
          </g>
          <circle cx="353" cy="174" r="12" fill="var(--dt-color-red-100)" />
          <rect x="373" y="170" width="111" height="8" rx="3" fill="var(--dt-color-black-200)" />
          <circle cx="353" cy="206" r="12" fill="#FFDB80" />
          <rect x="373" y="202" width="142" height="8" rx="3" fill="var(--dt-color-black-200)" />
        </g>
        <g filter="url(#filter3_d_1046_9081)">
          <rect x="249" y="10" width="88" height="88" rx="4" fill="var(--dt-color-surface-contrast)" />
          <path
            d="M306.583 31C306.261 31 306 31.2612 306 31.5833V34.9167C306 35.2388 306.261 35.5 306.583 35.5H309.917C310.239 35.5 310.5 35.2388 310.5 34.9167V31.5833C310.5 31.2612 310.239 31 309.917 31H306.583Z"
            fill="var(--dt-color-surface-primary)"
          />
          <path
            d="M306.583 37C306.261 37 306 37.2612 306 37.5833V40.9167C306 41.2388 306.261 41.5 306.583 41.5H309.917C310.239 41.5 310.5 41.2388 310.5 40.9167V37.5833C310.5 37.2612 310.239 37 309.917 37H306.583Z"
            fill="var(--dt-color-surface-primary)"
          />
          <path
            d="M312 31.5833C312 31.2612 312.261 31 312.583 31H315.917C316.239 31 316.5 31.2612 316.5 31.5833V34.9167C316.5 35.2388 316.239 35.5 315.917 35.5H312.583C312.261 35.5 312 35.2388 312 34.9167V31.5833Z"
            fill="var(--dt-color-surface-primary)"
          />
          <path
            d="M312.583 37C312.261 37 312 37.2612 312 37.5833V40.9167C312 41.2388 312.261 41.5 312.583 41.5H315.917C316.239 41.5 316.5 41.2388 316.5 40.9167V37.5833C316.5 37.2612 316.239 37 315.917 37H312.583Z"
            fill="var(--dt-color-surface-primary)"
          />
          <path
            d="M257 30C257 24.3431 257 21.5147 258.757 19.7574C260.515 18 263.343 18 269 18H281C286.657 18 289.485 18 291.243 19.7574C293 21.5147 293 24.3431 293 30V42C293 47.6569 293 50.4853 291.243 52.2426C289.485 54 286.657 54 281 54H269C263.343 54 260.515 54 258.757 52.2426C257 50.4853 257 47.6569 257 42V30Z"
            fill="var(--dt-color-brand-purple)"
          />
          <path
            d="M279.955 35.5909H274.864V39.4091H279.955V35.5909ZM282.5 40.6818V31.76C282.5 31.06 281.927 30.5 281.227 30.5H269.773C269.073 30.5 268.5 31.06 268.5 31.76V40.6818C268.5 41.3818 269.073 41.9545 269.773 41.9545H281.227C281.927 41.9545 282.5 41.3818 282.5 40.6818ZM281.227 40.6945H269.773V31.7536H281.227V40.6945Z"
            fill="var(--dt-color-neutral-white)"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M317.833 76.3333C317.833 76.975 317.308 77.5 316.667 77.5H306.167C305.525 77.5 305 76.975 305 76.3333V68.155C305 67.5133 305.525 67 306.167 67H316.667C317.308 67 317.833 67.5133 317.833 68.155V76.3333ZM312.583 76.345H310.25V74.5833H312.583V76.345ZM313.75 76.345V74.5833H316.667V76.345H313.75ZM316.667 73.4167V68.1492H306.167V73.4167H316.667ZM309.083 74.5833V76.345H306.167V74.5833H309.083Z"
            fill="var(--dt-color-surface-primary)"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M281.833 76.3333V68.155C281.833 67.5133 281.308 67 280.667 67H270.167C269.525 67 269 67.5133 269 68.155V76.3333C269 76.975 269.525 77.5 270.167 77.5H280.667C281.308 77.5 281.833 76.975 281.833 76.3333ZM276 76.345H280.667V72.8333H276V76.345ZM274.833 76.345V72.8333H270.167V76.345H274.833ZM276 71.6667H280.667V68.1492H276V71.6667ZM274.833 68.1492V71.6667H270.167V68.1492H274.833Z"
            fill="var(--dt-color-surface-primary)"
          />
        </g>
        <g filter="url(#filter4_d_1046_9081)">
          <rect x="249" y="180" width="192" height="225" rx="8" fill="var(--dt-color-surface-info)" />
          <g clip-path="url(#clip1_1046_9081)">
            <rect x="281" y="200.5" width="128" height="128" rx="64" fill="var(--dt-color-blue-200)" />
            <path
              d="M317.748 281.5V247.68H330.662C334.052 247.68 336.943 248.328 339.334 249.625C341.74 250.922 343.584 252.82 344.865 255.32C346.146 257.805 346.787 260.836 346.787 264.414V264.461C346.787 268.039 346.146 271.102 344.865 273.648C343.599 276.195 341.763 278.141 339.357 279.484C336.951 280.828 334.052 281.5 330.662 281.5H317.748ZM324.826 275.641H329.818C331.927 275.641 333.709 275.219 335.162 274.375C336.615 273.531 337.709 272.281 338.443 270.625C339.193 268.969 339.568 266.922 339.568 264.484V264.438C339.568 262.078 339.185 260.086 338.42 258.461C337.67 256.836 336.568 255.609 335.115 254.781C333.662 253.938 331.896 253.516 329.818 253.516H324.826V275.641ZM357.088 281.5V253.516H347.315V247.68H373.963V253.516H364.166V281.5H357.088Z"
              fill="var(--dt-color-blue-400)"
            />
          </g>
          <g clip-path="url(#clip2_1046_9081)">
            <g filter="url(#filter5_d_1046_9081)">
              <path d="M249 293.5L441 317.5V411H249V293.5Z" fill="var(--dt-color-surface-primary)" />
            </g>
            <rect x="265" y="333" width="127.336" height="12" rx="4" fill="var(--dt-color-black-200)" />
            <rect x="265" y="353" width="81" height="8" rx="3" fill="var(--dt-color-black-200)" />
            <g clip-path="url(#clip3_1046_9081)">
              <path
                d="M281 382.333C282.107 382.333 282.993 381.44 282.993 380.333L283 376.333C283 375.227 282.107 374.333 281 374.333C279.893 374.333 279 375.227 279 376.333V380.333C279 381.44 279.893 382.333 281 382.333ZM284.533 380.333C284.533 382.333 282.84 383.733 281 383.733C279.16 383.733 277.467 382.333 277.467 380.333H276.333C276.333 382.607 278.147 384.487 280.333 384.813V387H281.667V384.813C283.853 384.493 285.667 382.613 285.667 380.333H284.533Z"
                fill="var(--dt-color-foreground-secondary)"
              />
              <g filter="url(#filter6_d_1046_9081)">
                <path
                  d="M317 378.333C317.733 378.333 318.333 377.733 318.333 377C318.333 376.267 317.733 375.667 317 375.667C316.267 375.667 315.667 376.267 315.667 377C315.667 377.733 316.267 378.333 317 378.333ZM317 379.667C316.267 379.667 315.667 380.267 315.667 381C315.667 381.733 316.267 382.333 317 382.333C317.733 382.333 318.333 381.733 318.333 381C318.333 380.267 317.733 379.667 317 379.667ZM317 383.667C316.267 383.667 315.667 384.267 315.667 385C315.667 385.733 316.267 386.333 317 386.333C317.733 386.333 318.333 385.733 318.333 385C318.333 384.267 317.733 383.667 317 383.667Z"
                  fill="var(--dt-color-foreground-secondary)"
                />
              </g>
            </g>
            <rect x="265" y="281" width="32" height="32" rx="6" fill="var(--dt-color-brand-purple)" />
            <path
              d="M290 300.5C290 301.328 289.328 302 288.5 302C287.672 302 287 301.328 287 300.5L287 294.5C287 293.672 287.672 293 288.5 293C289.328 293 290 293.672 290 294.5V300.5Z"
              fill="var(--dt-color-neutral-white)"
            />
            <path
              d="M275 299.5C275 300.328 274.328 301 273.5 301C272.672 301 272 300.328 272 299.5L272 296.5C272 295.672 272.672 295 273.5 295C274.328 295 275 295.672 275 296.5L275 299.5Z"
              fill="var(--dt-color-neutral-white)"
            />
            <path
              d="M285 304.5C285 305.328 284.328 306 283.5 306C282.672 306 282 305.328 282 304.5L282 289.5C282 288.672 282.672 288 283.5 288C284.328 288 285 288.672 285 289.5L285 304.5Z"
              fill="var(--dt-color-neutral-white)"
            />
            <path
              d="M280 301.5C280 302.328 279.328 303 278.5 303C277.672 303 277 302.328 277 301.5L277 293.5C277 292.672 277.672 292 278.5 292C279.328 292 280 292.672 280 293.5L280 301.5Z"
              fill="var(--dt-color-neutral-white)"
            />
          </g>
          <rect
            x="2"
            y="-2"
            width="196"
            height="229"
            rx="10"
            transform="matrix(-1 0 0 1 445 180)"
            stroke="var(--dt-color-brand-purple)"
            stroke-width="4"
          />
        </g>
        <g filter="url(#filter7_d_1046_9081)">
          <rect x="635" y="218" width="24" height="24" rx="4" fill="var(--dt-color-purple-200)" />
          <rect x="607" y="218" width="24" height="24" rx="4" fill="var(--dt-color-purple-300)" />
          <rect x="579" y="218" width="24" height="24" rx="4" fill="var(--dt-color-purple-400)" />
          <rect x="551" y="218" width="24" height="24" rx="4" fill="var(--dt-color-purple-500)" />
          <rect x="523" y="218" width="24" height="24" rx="4" fill="var(--dt-color-purple-600)" />
        </g>
        <g filter="url(#filter8_d_1046_9081)">
          <path
            d="M16 140C16 137.791 17.7909 136 20 136H287C289.209 136 291 137.791 291 140V160H16V140Z"
            fill="var(--dt-color-brand-purple)"
          />
          <rect opacity="0.4" x="28" y="144" width="130" height="8" rx="3" fill="var(--dt-color-neutral-white)" />
          <path
            d="M16 160H291V224C291 226.209 289.209 228 287 228H20C17.7909 228 16 226.209 16 224V160Z"
            fill="var(--dt-color-surface-contrast)"
          />
          <circle cx="46" cy="194" r="18" fill="var(--dt-color-black-500)" />
          <rect x="70" y="180" width="83" height="12" rx="4" fill="var(--dt-color-black-500)" />
          <rect x="70" y="199" width="53" height="8" rx="3" fill="var(--dt-color-black-500)" />
          <rect x="185" y="172" width="44" height="44" rx="8" fill="var(--dt-color-red-300)" />
          <path
            d="M207 189.833C205.667 189.833 204.375 190.042 203.167 190.433V193.017C203.167 193.342 202.975 193.633 202.7 193.767C201.883 194.175 201.142 194.7 200.483 195.308C200.333 195.458 200.125 195.542 199.9 195.542C199.667 195.542 199.458 195.45 199.308 195.3L197.242 193.233C197.092 193.092 197 192.883 197 192.65C197 192.417 197.092 192.208 197.242 192.058C199.783 189.65 203.217 188.167 207 188.167C210.783 188.167 214.217 189.65 216.758 192.058C216.908 192.208 217 192.417 217 192.65C217 192.883 216.908 193.092 216.758 193.242L214.692 195.308C214.542 195.458 214.333 195.55 214.1 195.55C213.875 195.55 213.667 195.458 213.517 195.317C212.858 194.7 212.108 194.183 211.292 193.775C211.017 193.642 210.825 193.358 210.825 193.025V190.442C209.625 190.042 208.333 189.833 207 189.833Z"
            fill="var(--dt-color-neutral-white)"
          />
          <path
            d="M209.992 197.408L207.833 199.558V193.167H206.167V199.558L204.008 197.408L202.833 198.583L207 202.75L211.167 198.583L209.992 197.408Z"
            fill="var(--dt-color-neutral-white)"
          />
          <rect x="235" y="172" width="44" height="44" rx="8" fill="#1AA340" />
          <path
            d="M252.517 192.992C253.717 195.35 255.65 197.275 258.008 198.483L259.842 196.65C260.067 196.425 260.4 196.35 260.692 196.45C261.625 196.758 262.633 196.925 263.667 196.925C264.125 196.925 264.5 197.3 264.5 197.758V200.667C264.5 201.125 264.125 201.5 263.667 201.5C255.842 201.5 249.5 195.158 249.5 187.333C249.5 186.875 249.875 186.5 250.333 186.5H253.25C253.708 186.5 254.083 186.875 254.083 187.333C254.083 188.375 254.25 189.375 254.558 190.308C254.65 190.6 254.583 190.925 254.35 191.158L252.517 192.992Z"
            fill="var(--dt-color-neutral-white)"
          />
        </g>
        <g filter="url(#filter9_d_1046_9081)">
          <circle cx="648" cy="78" r="20" fill="var(--dt-color-green-100)" />
          <path
            d="M648 80C649.66 80 650.99 78.66 650.99 77L651 71C651 69.34 649.66 68 648 68C646.34 68 645 69.34 645 71V77C645 78.66 646.34 80 648 80ZM653.3 77C653.3 80 650.76 82.1 648 82.1C645.24 82.1 642.7 80 642.7 77H641C641 80.41 643.72 83.23 647 83.72V87H649V83.72C652.28 83.24 655 80.42 655 77H653.3Z"
            fill="var(--dt-color-green-400)"
          />
        </g>
        <g filter="url(#filter10_d_1046_9081)">
          <circle cx="441" cy="405" r="20" fill="var(--dt-color-black-600)" />
          <path
            d="M441.74 398.47C444.1 399.5 445.35 402.03 444.92 404.46C446.19 405.56 447 407.19 447 409V409.17C447.31 409.06 447.65 409 448 409C448.796 409 449.559 409.316 450.121 409.879C450.684 410.441 451 411.204 451 412C451 412.796 450.684 413.559 450.121 414.121C449.559 414.684 448.796 415 448 415H435C433.939 415 432.922 414.579 432.172 413.828C431.421 413.078 431 412.061 431 411C431 409.939 431.421 408.922 432.172 408.172C432.922 407.421 433.939 407 435 407H435.27C434 405.45 433.6 403.24 434.5 401.26C435.72 398.5 438.97 397.24 441.74 398.47ZM440.93 400.3C439.16 399.5 437.09 400.31 436.31 402.07C435.85 403.09 435.93 404.22 436.41 405.13C437.5 403.83 439.16 403 441 403C441.7 403 442.38 403.12 443 403.34C442.94 402.06 442.18 400.86 440.93 400.3ZM442.55 396.64C442 396.4 441.45 396.23 440.88 396.12L443.37 394.82L444.27 397.71C443.76 397.29 443.19 396.93 442.55 396.64ZM435.09 397.44C434.6 397.79 434.17 398.19 433.8 398.63L433.91 395.82L436.87 396.5C436.25 396.71 435.65 397.03 435.09 397.44ZM447 402.71C446.91 402.12 446.78 401.55 446.59 401L448.97 402.5L446.92 404.73C447.03 404.08 447.05 403.4 447 402.71ZM432.04 404.3C432.11 404.9 432.24 405.47 432.43 406L430.06 404.5L432.1 402.28C432 402.93 431.97 403.61 432.04 404.3ZM448 411H445V409C445 407.939 444.579 406.922 443.828 406.172C443.078 405.421 442.061 405 441 405C439.939 405 438.922 405.421 438.172 406.172C437.421 406.922 437 407.939 437 409H435C434.47 409 433.961 409.211 433.586 409.586C433.211 409.961 433 410.47 433 411C433 411.53 433.211 412.039 433.586 412.414C433.961 412.789 434.47 413 435 413H448C448.265 413 448.52 412.895 448.707 412.707C448.895 412.52 449 412.265 449 412C449 411.735 448.895 411.48 448.707 411.293C448.52 411.105 448.265 411 448 411Z"
            fill="var(--dt-color-surface-primary)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_1046_9081"
            x="317"
            y="72"
            width="338"
            height="168"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="4" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.0235294 0 0 0 0 0.0235294 0 0 0 0 0.0627451 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1046_9081" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1046_9081" result="shape" />
          </filter>
          <filter
            id="filter1_i_1046_9081"
            x="563"
            y="122"
            width="34"
            height="32"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="1" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.0352941 0 0 0 0 0.690196 0 0 0 1 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1046_9081" />
          </filter>
          <filter
            id="filter2_i_1046_9081"
            x="597"
            y="122"
            width="34"
            height="32"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="1" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.0352941 0 0 0 0 0.690196 0 0 0 1 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1046_9081" />
          </filter>
          <filter
            id="filter3_d_1046_9081"
            x="237"
            y="0"
            width="112"
            height="112"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="6" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.0235294 0 0 0 0 0.0235294 0 0 0 0 0.0627451 0 0 0 0.3 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1046_9081" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1046_9081" result="shape" />
          </filter>
          <filter
            id="filter4_d_1046_9081"
            x="237"
            y="170"
            width="216"
            height="249"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="4" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1046_9081" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1046_9081" result="shape" />
          </filter>
          <filter
            id="filter5_d_1046_9081"
            x="225"
            y="263.5"
            width="240"
            height="165.5"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="-6" />
            <feGaussianBlur stdDeviation="12" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.0509804 0 0 0 0 0.0470588 0 0 0 0 0.0588235 0 0 0 0.1 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1046_9081" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1046_9081" result="shape" />
          </filter>
          <filter
            id="filter6_d_1046_9081"
            x="298"
            y="362"
            width="38"
            height="38"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="1.5" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.945098 0 0 0 0 0.94902 0 0 0 0 0.956863 0 0 0 0.05 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1046_9081" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1046_9081" result="shape" />
          </filter>
          <filter
            id="filter7_d_1046_9081"
            x="511"
            y="208"
            width="160"
            height="48"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="6" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.0235294 0 0 0 0 0.0235294 0 0 0 0 0.0627451 0 0 0 0.3 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1046_9081" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1046_9081" result="shape" />
          </filter>
          <filter
            id="filter8_d_1046_9081"
            x="0"
            y="122"
            width="307"
            height="124"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="8" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.0235294 0 0 0 0 0.0235294 0 0 0 0 0.0627451 0 0 0 0.3 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1046_9081" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1046_9081" result="shape" />
          </filter>
          <filter
            id="filter9_d_1046_9081"
            x="612"
            y="44"
            width="72"
            height="72"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="8" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.0235294 0 0 0 0 0.0235294 0 0 0 0 0.0627451 0 0 0 0.3 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1046_9081" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1046_9081" result="shape" />
          </filter>
          <filter
            id="filter10_d_1046_9081"
            x="413"
            y="379"
            width="56"
            height="56"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="4" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.0235294 0 0 0 0 0.0235294 0 0 0 0 0.0627451 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1046_9081" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1046_9081" result="shape" />
          </filter>
          <clipPath id="clip0_1046_9081">
            <rect x="529" y="122" width="102" height="32" rx="4" fill="var(--dt-color-surface-primary)" />
          </clipPath>
          <clipPath id="clip1_1046_9081">
            <rect x="281" y="200.5" width="128" height="128" rx="64" fill="var(--dt-color-surface-primary)" />
          </clipPath>
          <clipPath id="clip2_1046_9081">
            <rect width="192" height="124" fill="var(--dt-color-surface-primary)" transform="translate(249 281)" />
          </clipPath>
          <clipPath id="clip3_1046_9081">
            <rect width="68" height="32" fill="var(--dt-color-surface-primary)" transform="translate(265 365)" />
          </clipPath>
        </defs>
      </svg>
    </div>
  </section>
  <section class="links d-d-grid d-gg16 d-g-cols12 d-wmx1340 d-mx-auto">
    <div class="link d-body-base d-gc3 d-px32 d-ta-center">
      <router-link
        class="d-fc-primary h:d-fc-purple-400 d-d-block d-td-none d-bar8 d-pt4"
        to="/design/"
      >
        <svg
          class="d-h96 d-mb24"
          viewBox="0 0 155 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.5332 13.8667H133.333V74.6667C133.333 77.6122 130.945 80 128 80H13.8665C10.921 80 8.5332 77.6122 8.5332 74.6667V13.8667Z"
            fill="var(--dt-color-surface-moderate)"
          />
          <path
            d="M133.333 10.6667L8.5332 10.6667V5.33333C8.5332 2.38782 10.921 -2.57506e-07 13.8665 0L128 9.97785e-06C130.945 1.02353e-05 133.333 2.38783 133.333 5.33334V10.6667Z"
            fill="var(--dt-color-purple-400)"
          />
          <path
            d="M15.4665 8.53328C16.9392 8.53328 18.1331 7.33938 18.1331 5.86662C18.1331 4.39386 16.9392 3.19995 15.4665 3.19995C13.9937 3.19995 12.7998 4.39386 12.7998 5.86662C12.7998 7.33938 13.9937 8.53328 15.4665 8.53328Z"
            fill="var(--dt-color-black-100)"
          />
          <path
            d="M24.0002 8.53328C25.4729 8.53328 26.6668 7.33938 26.6668 5.86662C26.6668 4.39386 25.4729 3.19995 24.0002 3.19995C22.5274 3.19995 21.3335 4.39386 21.3335 5.86662C21.3335 7.33938 22.5274 8.53328 24.0002 8.53328Z"
            fill="var(--dt-color-black-100)"
          />
          <path
            d="M32.5334 8.53328C34.0061 8.53328 35.2 7.33938 35.2 5.86662C35.2 4.39386 34.0061 3.19995 32.5334 3.19995C31.0606 3.19995 29.8667 4.39386 29.8667 5.86662C29.8667 7.33938 31.0606 8.53328 32.5334 8.53328Z"
            fill="var(--dt-color-black-100)"
          />
          <path
            d="M133.333 29.1555C123.538 29.1555 115.555 37.1377 115.555 46.9332C115.555 56.7289 123.538 64.711 133.333 64.711C135.787 64.711 137.778 62.7199 137.778 60.2666C137.778 59.1822 137.369 58.1332 136.64 57.2977C136.498 57.1199 136.409 56.9244 136.409 56.711C136.409 56.2132 136.8 55.8222 137.298 55.8222H140.445C146.329 55.8222 151.111 51.0399 151.111 45.1555C151.111 36.3377 143.129 29.1555 133.333 29.1555ZM143.111 48.711C141.635 48.711 140.445 47.5199 140.445 46.0444C140.445 44.5689 141.635 43.3777 143.111 43.3777C144.587 43.3777 145.778 44.5689 145.778 46.0444C145.778 47.5199 144.587 48.711 143.111 48.711ZM137.778 41.5999C136.302 41.5999 135.111 40.4089 135.111 38.9332C135.111 37.4577 136.302 36.2666 137.778 36.2666C139.253 36.2666 140.445 37.4577 140.445 38.9332C140.445 40.4089 139.253 41.5999 137.778 41.5999ZM120.889 46.0444C120.889 44.5689 122.08 43.3777 123.555 43.3777C125.031 43.3777 126.222 44.5689 126.222 46.0444C126.222 47.5199 125.031 48.711 123.555 48.711C122.08 48.711 120.889 47.5199 120.889 46.0444ZM131.555 38.9332C131.555 40.4089 130.365 41.5999 128.889 41.5999C127.413 41.5999 126.222 40.4089 126.222 38.9332C126.222 37.4577 127.413 36.2666 128.889 36.2666C130.365 36.2666 131.555 37.4577 131.555 38.9332Z"
            fill="var(--dt-color-purple-400)"
          />
          <path
            d="M26.6665 89.6L26.6665 54.4C26.6665 51.4545 24.2787 49.0667 21.3332 49.0667H6.39984C3.45432 49.0667 1.0665 51.4545 1.0665 54.4L1.0665 89.6C1.0665 92.5455 3.45432 94.9333 6.39984 94.9333H21.3332C24.2787 94.9333 26.6665 92.5455 26.6665 89.6Z"
            stroke="var(--dt-color-purple-400)"
            stroke-width="2"
          />
        </svg>
        <h2 class="d-headline-extra-large d-mb8 d-baw0">
          Design language
        </h2>
      </router-link>
      <p class="d-mb8 d-body-compact d-fc-secondary">
        Foundational color, iconography, and spacing guidelines
      </p>
      <router-link
        class="d-link"
        to="/design/"
      >
        Browse design guidelines
      </router-link>
    </div>
    <div class="link d-body-base d-gc3 d-px32 d-ta-center">
      <router-link
        class="d-fc-primary h:d-fc-purple-400 d-d-block d-td-none d-bar8 d-pt4"
        to="/components/"
      >
        <svg
          class="d-h96 d-mb24"
          viewBox="0 0 94 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.3589 72.2873V26.3889L55.5608 5.13062L92.2797 26.3889V72.2873L55.5608 93.0627L18.3589 72.2873Z"
            fill="var(--dt-color-surface-moderate)"
          />
          <path
            d="M3.86426 72.2873V26.3889L41.0662 5.13062L77.7847 26.3889V72.2873L41.0662 93.0627L3.86426 72.2873Z"
            stroke="var(--dt-color-purple-400)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M4.2207 26.103L27.7167 38.83" stroke="var(--dt-color-purple-400)" stroke-width="2" />
          <path d="M55.1182 59.384L77.6485 71.1446" stroke="var(--dt-color-purple-400)" stroke-width="2" />
          <path d="M77.9141 26.1035L54.4181 38.8305" stroke="var(--dt-color-purple-400)" stroke-width="2" />
          <path d="M27.0083 59.3894L3.51238 72.1164" stroke="var(--dt-color-purple-400)" stroke-width="2" />
          <path d="M41.0688 5.13062V30.254" stroke="var(--dt-color-purple-400)" stroke-width="2" />
          <path d="M41.0688 67.9387V93.0621" stroke="var(--dt-color-purple-400)" stroke-width="2" />
          <path
            d="M41.0665 8.99587C43.468 8.99587 45.4148 7.04908 45.4148 4.6476C45.4148 2.24611 43.468 0.299316 41.0665 0.299316C38.6651 0.299316 36.7183 2.24611 36.7183 4.6476C36.7183 7.04908 38.6651 8.99587 41.0665 8.99587Z"
            fill="var(--dt-color-purple-400)"
          />
          <path
            d="M40.9303 58.7906C46.6844 58.7906 51.3489 54.126 51.3489 48.372C51.3489 42.6179 46.6844 37.9534 40.9303 37.9534C35.1763 37.9534 30.5117 42.6179 30.5117 48.372C30.5117 54.126 35.1763 58.7906 40.9303 58.7906Z"
            fill="var(--dt-color-purple-400)"
          />
          <path
            d="M41.0665 95.9612C43.468 95.9612 45.4148 94.0144 45.4148 91.6129C45.4148 89.2114 43.468 87.2646 41.0665 87.2646C38.6651 87.2646 36.7183 89.2114 36.7183 91.6129C36.7183 94.0144 38.6651 95.9612 41.0665 95.9612Z"
            fill="var(--dt-color-purple-400)"
          />
          <path
            d="M77.7829 30.2537C80.1843 30.2537 82.1311 28.3069 82.1311 25.9054C82.1311 23.5039 80.1843 21.5571 77.7829 21.5571C75.3814 21.5571 73.4346 23.5039 73.4346 25.9054C73.4346 28.3069 75.3814 30.2537 77.7829 30.2537Z"
            fill="var(--dt-color-purple-400)"
          />
          <path
            d="M77.7829 75.6704C80.1843 75.6704 82.1311 73.7236 82.1311 71.3222C82.1311 68.9207 80.1843 66.9739 77.7829 66.9739C75.3814 66.9739 73.4346 68.9207 73.4346 71.3222C73.4346 73.7236 75.3814 75.6704 77.7829 75.6704Z"
            fill="var(--dt-color-purple-400)"
          />
          <path
            d="M4.34828 30.2537C6.74977 30.2537 8.69656 28.3069 8.69656 25.9054C8.69656 23.5039 6.74977 21.5571 4.34828 21.5571C1.94679 21.5571 0 23.5039 0 25.9054C0 28.3069 1.94679 30.2537 4.34828 30.2537Z"
            fill="var(--dt-color-purple-400)"
          />
          <path
            d="M4.34828 75.6704C6.74977 75.6704 8.69656 73.7236 8.69656 71.3222C8.69656 68.9207 6.74977 66.9739 4.34828 66.9739C1.94679 66.9739 0 68.9207 0 71.3222C0 73.7236 1.94679 75.6704 4.34828 75.6704Z"
            fill="var(--dt-color-purple-400)"
          />
        </svg>

        <h2 class="d-headline-extra-large d-mb8 d-baw0">
          Components
        </h2>
      </router-link>
      <p class="d-mb8 d-body-compact d-fc-secondary">
        Presentational UI components offered in CSS and Vue
      </p>
      <div class="d-d-inline-flex d-fd-column d-stack4">
        <router-link
          class="d-link"
          to="/components/"
        >
          Browse CSS components
        </router-link>
        <a
          class="d-link"
          href="https://vue.dialpad.design/"
          target="_blank"
          rel="noopener noreferrer"
        >Browse Vue components</a>
      </div>
    </div>
    <div class="link d-body-base d-gc3 d-px32 d-ta-center">
      <router-link
        class="d-fc-primary h:d-fc-purple-400 d-d-block d-td-none d-bar8 d-pt4"
        to="/utilities/"
      >
        <svg
          class="d-h96 d-mb24"
          viewBox="0 0 96 97"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 49C0 22.4903 21.4903 1 48 1C74.5096 1 96 22.4903 96 49C96 75.5096 74.5096 97 48 97C21.4903 97 0 75.5096 0 49Z"
            fill="var(--dt-color-surface-moderate)"
          />
          <path
            d="M48.0002 95.9787C73.9458 95.9787 94.9789 74.9456 94.9789 49C94.9789 23.0543 73.9458 2.02124 48.0002 2.02124C22.0546 2.02124 1.02148 23.0543 1.02148 49C1.02148 74.9456 22.0546 95.9787 48.0002 95.9787Z"
            stroke="var(--dt-color-purple-400)"
            stroke-width="2"
          />
          <path
            d="M17.4333 18.8453C22.1731 18.8453 26.0155 15.0029 26.0155 10.2631C26.0155 5.52329 22.1731 1.68091 17.4333 1.68091C12.6935 1.68091 8.85107 5.52329 8.85107 10.2631C8.85107 15.0029 12.6935 18.8453 17.4333 18.8453Z"
            fill="var(--dt-color-purple-400)"
          />
          <path
            d="M22.5588 13.7091L18.4283 9.57861C18.8368 8.53466 18.6098 7.30912 17.7474 6.44671C16.8396 5.53891 15.4779 5.35735 14.3886 5.85664L16.3403 7.80842L14.9786 9.1701L12.9815 7.21834C12.4368 8.30773 12.6637 9.66943 13.5715 10.5772C14.4339 11.4396 15.6594 11.6666 16.7035 11.2581L20.8339 15.3886C21.0155 15.5701 21.2878 15.5701 21.4694 15.3886L22.5134 14.3446C22.7403 14.163 22.7403 13.8453 22.5588 13.7091Z"
            fill="var(--dt-color-surface-primary)"
          />
          <path
            d="M17.702 19.0425C22.4023 19.0425 26.2127 15.2322 26.2127 10.5319C26.2127 5.83158 22.4023 2.02124 17.702 2.02124C13.0017 2.02124 9.19141 5.83158 9.19141 10.5319C9.19141 15.2322 13.0017 19.0425 17.702 19.0425Z"
            stroke="var(--dt-color-purple-400)"
            stroke-width="3"
          />
          <path
            d="M83.064 85.4256C86.0722 85.4256 88.5108 82.987 88.5108 79.9788C88.5108 76.9706 86.0722 74.532 83.064 74.532C80.0558 74.532 77.6172 76.9706 77.6172 79.9788C77.6172 82.987 80.0558 85.4256 83.064 85.4256Z"
            fill="var(--dt-color-purple-400)"
          />
          <path
            d="M83.0637 84.4043C85.5079 84.4043 87.4892 82.4229 87.4892 79.9788C87.4892 77.5346 85.5079 75.5532 83.0637 75.5532C80.6196 75.5532 78.6382 77.5346 78.6382 79.9788C78.6382 82.4229 80.6196 84.4043 83.0637 84.4043Z"
            stroke="var(--dt-color-purple-400)"
            stroke-width="3"
          />
          <path
            d="M47.9999 78.9574C64.545 78.9574 77.9574 65.545 77.9574 48.9999C77.9574 32.4549 64.545 19.0425 47.9999 19.0425C31.4549 19.0425 18.0425 32.4549 18.0425 48.9999C18.0425 65.545 31.4549 78.9574 47.9999 78.9574Z"
            fill="var(--dt-color-surface-primary)"
            stroke="var(--dt-color-purple-400)"
            stroke-width="2"
          />
          <path
            d="M63.256 48.9999C63.256 57.4231 61.4599 64.9981 58.6057 70.4304C55.7266 75.9099 51.9263 78.9574 48.0003 78.9574C44.0743 78.9574 40.274 75.9099 37.3948 70.4304C34.5406 64.9981 32.7446 57.4231 32.7446 48.9999C32.7446 40.5768 34.5406 33.0018 37.3948 27.5697C40.274 22.09 44.0743 19.0425 48.0003 19.0425C51.9263 19.0425 55.7266 22.09 58.6057 27.5697C61.4599 33.0018 63.256 40.5768 63.256 48.9999Z"
            fill="var(--dt-color-surface-primary)"
            stroke="var(--dt-color-purple-400)"
            stroke-width="2"
          />
          <path d="M17.5459 47.9788H78.4531" stroke="var(--dt-color-purple-400)" stroke-width="2" />
          <path d="M22.272 33.2769H73.728" stroke="var(--dt-color-purple-400)" stroke-width="2" />
          <path d="M22.272 63.7305H73.728" stroke="var(--dt-color-purple-400)" stroke-width="2" />
          <path d="M48 18.5464V79.4538" stroke="var(--dt-color-purple-400)" stroke-width="2" />
        </svg>
        <h2 class="d-headline-extra-large d-mb8 d-baw0">
          Utilities
        </h2>
      </router-link>
      <p class="d-mb8 d-body-compact d-fc-secondary">
        A utility-first CSS framework for building user interfaces.
      </p>
      <router-link
        class="d-link"
        to="/utilities/"
      >
        Browse utility classes
      </router-link>
    </div>
    <div class="link d-body-base d-gc3 d-px32 d-ta-center">
      <router-link
        class="d-fc-primary h:d-fc-purple-400 d-d-block d-td-none d-bar8 d-pt4"
        to="/guides/"
      >
        <svg
          class="d-h96 d-mb24"
          viewBox="0 0 87 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.0625 22.6081C9.0625 21.251 9.61418 19.9521 10.5909 19.0098L20.4847 9.46422C21.4167 8.565 22.6612 8.0625 23.9563 8.0625H82C84.7614 8.0625 87 10.3011 87 13.0625V90.0625C87 92.8239 84.7614 95.0625 82 95.0625H14.0625C11.3011 95.0625 9.0625 92.8239 9.0625 90.0625V22.6081Z"
            fill="var(--dt-color-surface-moderate)"
          />
          <path
            d="M76.9375 5V82C76.9375 84.2091 75.1466 86 72.9375 86H5C2.79086 86 1 84.2091 1 82V14.5456C1 13.4599 1.44134 12.4208 2.22268 11.667L12.1165 2.12137C12.8621 1.402 13.8577 1 14.8938 1H72.9375C75.1466 1 76.9375 2.79086 76.9375 5Z"
            stroke="var(--dt-color-purple-400)"
            stroke-width="2"
          />
          <rect x="14" y="16" width="49" height="2" fill="var(--dt-color-purple-400)" />
          <rect x="14" y="64" width="49" height="2" fill="var(--dt-color-purple-400)" />
          <rect x="14" y="72" width="46" height="2" fill="var(--dt-color-purple-400)" />
          <rect x="18" y="48" width="39" height="2" fill="var(--dt-color-purple-400)" />
          <rect x="14" y="48" width="2" height="2" fill="var(--dt-color-purple-400)" />
          <rect x="18" y="24" width="39" height="2" fill="var(--dt-color-purple-400)" />
          <rect x="14" y="24" width="2" height="2" fill="var(--dt-color-purple-400)" />
          <rect x="18" y="32" width="28" height="2" fill="var(--dt-color-purple-400)" />
          <rect x="18" y="56" width="28" height="2" fill="var(--dt-color-purple-400)" />
          <rect x="18" y="40" width="40" height="2" fill="var(--dt-color-purple-400)" />
          <rect x="14" y="40" width="2" height="2" fill="var(--dt-color-purple-400)" />
        </svg>
        <h2 class="d-headline-extra-large d-mb8 d-baw0">
          Guides
        </h2>
      </router-link>
      <p class="d-mb8 d-body-compact d-fc-secondary">
        Reference guidelines for Accessibility, Writing, and more
      </p>
      <div class="d-d-inline-flex d-fd-column d-stack4">
        <router-link
          class="d-link"
          to="/guides/getting-started/"
        >
          Getting started
        </router-link>
        <router-link
          class="d-link"
          to="/guides/content/"
        >
          Writing guidelines
        </router-link>
        <router-link
          class="d-link"
          to="/guides/accessibility/"
        >
          Accessibility
        </router-link>
      </div>
    </div>
  </section>
  <section class="d-bt d-bc-subtle d-bgc-secondary d-py64 d-ta-center">
    <div class="d-headline-large d-fw-medium d-fc-secondary d-px48 d-flow16 d-d-flex d-jc-center d-ai-center">
      <div>Don't see something? Want to contribute?</div>
      <a
        class="d-btn d-btn--muted d-btn--outlined d-btn--lg"
        href="https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10975&pid=12508"
        target="_blank"
        rel="noopener noreferrer"
      >
        Make a request
      </a>
      <a
        class="d-btn d-btn--muted d-btn--outlined d-btn--lg"
        href="https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=1&pid=12508"
        target="_blank"
        rel="noopener noreferrer"
      >
        Report a bug
      </a>
    </div>
  </section>
</template>

<script setup>
function sendAnalyticsEvent () {
  if (!window.gtag) return;
  window.gtag('event', 'click', { event_name: 'get_started_button_clicked' });
}
</script>
