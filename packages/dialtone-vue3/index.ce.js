import { defineCustomElement } from 'vue';
import DtButton from './components/button/button.ce.vue';

customElements.define('dt-button', defineCustomElement(DtButton));
