import { defineCustomElement } from 'vue';
import { DtButton as Button } from './components/button';

const DtButton = defineCustomElement(Button);

export { DtButton };

export function register () {
  customElements.define('dt-button', DtButton);
}
