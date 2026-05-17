import { createApp } from 'vue';
import * as dialtoneVue from '@dialpad/dialtone-vue';
import * as dialtoneIcons from '@dialpad/dialtone-icons/vue';
import App from './App.vue';

import '@dialpad/dialtone-css/lib/dist/dialtone.min.css';
import 'overlayscrollbars/overlayscrollbars.css';

const app = createApp(App);

// Register every Dt component + directive globally. The harness renders Dt
// names dynamically — in our SFCs (PickerApp, GalleryApp), in override .vue
// files dropped under apps/dialtone-documentation/thumbs/, and in Dt
// components' own internal templates (DtButton renders DtIcon, etc.). None
// of those sites locally import the Dt names they use, so they have to be
// available on the app instance. Directives ship with an install() function
// and must go through app.use(); components go through app.component(),
// split on the `Directive` suffix.
Object.entries(dialtoneVue).forEach(([name, comp]) => {
  if (name.endsWith('Directive') && typeof comp?.install === 'function') {
    app.use(comp);
  } else if (name.startsWith('Dt') && typeof comp === 'object' && comp !== null) {
    app.component(name, comp);
  }
});

// Same reasoning for icons + illustrations: override files reference them
// by tag (<dt-icon name="sun">, <dt-icon-user>, <dt-illustration-empty>)
// without local imports.
Object.entries(dialtoneIcons).forEach(([name, comp]) => {
  if (name.startsWith('DtIcon') || name.startsWith('DtIllustration')) {
    app.component(name, comp);
  }
});

app.mount('#thumb-root');
