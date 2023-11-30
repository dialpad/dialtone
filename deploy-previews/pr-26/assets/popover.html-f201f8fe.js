import{_ as v,v as k,x as m,a9 as _,I as h,D as a,G as s,C as b,L as f,F as x,s as d,y as n,z as t,K as g}from"./framework-4ea48d0d.js";import{D as y}from"./DialtoneUsage-47a5118d.js";const w={name:"ExamplePopover",props:{modal:{type:Boolean,default:!1},header:{type:Boolean,default:!1},footer:{type:Boolean,default:!1}},data(){return{shown:!1}},mounted(){window.addEventListener("keyup",p=>{p.key==="Escape"&&this.closeModal()})},beforeUnmount(){window.removeEventListener("keyup",p=>{p.key==="Escape"&&this.closeModal()})},methods:{closeModal(){document.body.classList.remove("d-of-hidden"),this.shown=!1},openModal(){this.modal&&document.body.classList.add("d-of-hidden"),this.shown=!0},togglePopover(){this.shown?this.closeModal():this.openModal()}}},C=["aria-hidden"],P={class:"d-popover d-fl-center d-fd-column d-p24 d-w100p d-of-auto"},M=["aria-expanded"],L=["aria-modal","aria-hidden"],A={key:0,class:"d-popover__header d-px16"},B=s("div",{class:"d-w100p"},`
          This is the header
        `,-1),V=[B],I={class:"d-popover__content d-p16"},T=s("div",{class:"d-mb8"},`
            This is content rendered within the popover.
          `,-1),E=s("button",{class:"d-btn d-btn--primary"},`
          Button
        `,-1),z={key:1,class:"d-popover__footer d-px16"},D=s("div",{class:"d-w100p"},`
          This is the footer
        `,-1),$=[D];function N(p,c,u,e,o,l){return k(),m(x,null,[u.modal?(k(),m("div",{key:0,class:"d-modal--transparent","aria-hidden":!o.shown,onClick:c[0]||(c[0]=_((...i)=>l.closeModal&&l.closeModal(...i),["self"]))},null,8,C)):h("v-if",!0),a(),s("div",P,[s("button",{id:"anchor1",class:"d-btn d-btn--primary","aria-expanded":!o.shown,"aria-controls":"dialog1","aria-haspopup":"dialog",onClick:c[1]||(c[1]=(...i)=>l.togglePopover&&l.togglePopover(...i))},`
      View Popover
    `,8,M),a(),s("div",{id:"dialog1",class:b(["d-popover__dialog d-popover__dialog--modal d-ps-relative d-t4 d-w264 d-hmx164",o.shown?"d-vi-visible":"d-vi-hidden"]),role:"dialog","aria-modal":u.modal,"aria-hidden":o.shown,"aria-labelledby":"anchor1"},[u.header?(k(),m("div",A,V)):h("v-if",!0),a(),s("div",I,[f(p.$slots,"content",{},()=>[T]),a(),E]),a(),u.footer?(k(),m("div",z,$)):h("v-if",!0)],10,L)])],64)}const r=v(w,[["render",N],["__file","ExamplePopover.vue"]]),S=s("h2",{id:"usage",tabindex:"-1",class:"d-docsite--header-2"},[a("Usage "),s("a",{class:"header-anchor d-link d-docsite--link d-link",href:"#usage","aria-hidden":"true"},"#")],-1),F={class:"d-docsite--paragraph"},R=s("p",{class:"d-docsite--paragraph"},"Your popover should be modal when:",-1),U=s("ul",{class:"d-docsite--unordered-list"},[s("li",{class:"d-docsite--list-element"},"It contains scrollable content."),a(),s("li",{class:"d-docsite--list-element"},"It contains components that hold user input state (input, checkbox).")],-1),W=s("p",{class:"d-docsite--paragraph"},"Your popover should be non-modal when:",-1),Y=s("ul",{class:"d-docsite--unordered-list"},[s("li",{class:"d-docsite--list-element"},"It is not scrollable."),a(),s("li",{class:"d-docsite--list-element"},"It contains only components that do not hold state (link, button).")],-1),j=s("ul",{class:"d-docsite--unordered-list"},[s("li",{class:"d-docsite--list-element"},"Smaller sized dialogs that trigger on user activation of an anchor element."),a(),s("li",{class:"d-docsite--list-element"},"Dialogs that should be positioned relative to the anchor."),a(),s("li",{class:"d-docsite--list-element"},"Dialogs that contain interactive components.")],-1),G={class:"d-docsite--unordered-list"},H={class:"d-docsite--list-element"},K=s("li",{class:"d-docsite--list-element"},"Dialogs that should be positioned in the center of the screen.",-1),J=s("li",{class:"d-docsite--list-element"},"Dialogs that are very large.",-1),O=s("li",{class:"d-docsite--list-element"},"Alerts.",-1),Q=s("h3",{id:"best-practices",tabindex:"-1",class:"d-docsite--header-3"},[a("Best practices "),s("a",{class:"header-anchor d-link d-docsite--link d-link",href:"#best-practices","aria-hidden":"true"},"#")],-1),X={class:"d-docsite--unordered-list"},Z={class:"d-docsite--list-element"},aa=s("li",{class:"d-docsite--list-element"},"Trigger using an anchor element, such as a button.",-1),sa=s("li",{class:"d-docsite--list-element"},"Render the dialog at the body element.",-1),na=s("li",{class:"d-docsite--list-element"},"Focus the first interactive element within the dialog after it is opened.",-1),ta=s("li",{class:"d-docsite--list-element"},"Close the dialog when ESC is pressed.",-1),oa=s("li",{class:"d-docsite--list-element"},"Close non-modal dialogs if they are scrolled out of visibility.",-1),pa=s("li",{class:"d-docsite--list-element"},"Set the z-index of the dialog to var(--zi-modal-element) if modal, var(--zi-popover) if not.",-1),ea=s("h2",{id:"variants-and-examples",tabindex:"-1",class:"d-docsite--header-2"},[a("Variants and examples "),s("a",{class:"header-anchor d-link d-docsite--link d-link",href:"#variants-and-examples","aria-hidden":"true"},"#")],-1),la=s("h3",{id:"popover-modal",tabindex:"-1",class:"d-docsite--header-3"},[a("Popover - Modal "),s("a",{class:"header-anchor d-link d-docsite--link d-link",href:"#popover-modal","aria-hidden":"true"},"#")],-1),ca=g(`<div class="language-html" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-modal--transparent<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>anchor1<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-btn d-btn--primary<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-expanded</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>false<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-controls</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog1<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-haspopup</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>View Popover<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog1<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover__dialog d-popover__dialog--modal d-ps-relative d-t4 d-w264<span class="token punctuation">&quot;</span></span> <span class="token attr-name">role</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-modal</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-hidden</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-labelledby</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>anchor1<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover__content d-p16<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
      This is content rendered within the popover.<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-btn d-btn--primary<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Button<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre></div><h3 id="popover-non-modal" tabindex="-1" class="d-docsite--header-3">Popover - Non Modal <a class="header-anchor d-link d-docsite--link d-link" href="#popover-non-modal" aria-hidden="true">#</a></h3>`,2),ua=g(`<div class="language-html" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>anchor2<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-btn d-btn--primary<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-expanded</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>false<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-controls</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog2<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-haspopup</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>View Popover<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog2<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover__dialog d-ps-relative d-t4 d-w264<span class="token punctuation">&quot;</span></span> <span class="token attr-name">role</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-modal</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>false<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-hidden</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-labelledby</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>anchor2<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover__content d-p16<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
      This is content rendered within the popover.<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-btn d-btn--primary<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Button<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre></div><h3 id="with-header-modal" tabindex="-1" class="d-docsite--header-3">With Header - Modal <a class="header-anchor d-link d-docsite--link d-link" href="#with-header-modal" aria-hidden="true">#</a></h3>`,2),ia=s("div",{class:"d-mb8"},[a("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae."),s("br")],-1),da=g(`<div class="language-html" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-modal--transparent<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>anchor3<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-btn d-btn--primary<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-expanded</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>false<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-controls</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog3<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-haspopup</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>View Popover<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog3<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover__dialog d-popover__dialog--modal d-ps-relative d-t4 d-w264 d-hmx164<span class="token punctuation">&quot;</span></span> <span class="token attr-name">role</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-modal</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-hidden</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-labelledby</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>anchor3<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover__header d-px16<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-w100p<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        This is the header
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover__content d-p16<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-mb8<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae.<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-btn d-btn--primary<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Button<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre></div><h3 id="with-footer-modal" tabindex="-1" class="d-docsite--header-3">With Footer - Modal <a class="header-anchor d-link d-docsite--link d-link" href="#with-footer-modal" aria-hidden="true">#</a></h3>`,2),ra=s("div",{class:"d-mb8"},[a("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae."),s("br")],-1),ka=g(`<div class="language-html" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-modal--transparent<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>anchor4<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-btn d-btn--primary<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-expanded</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>false<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-controls</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog4<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-haspopup</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>View Popover<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog4<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover__dialog d-popover__dialog--modal d-ps-relative d-t4 d-w264 d-hmx164<span class="token punctuation">&quot;</span></span> <span class="token attr-name">role</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dialog<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-modal</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-hidden</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span> <span class="token attr-name">aria-labelledby</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>anchor4<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover__content d-p16<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-mb8<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae.<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-btn d-btn--primary<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Button<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-popover__footer d-px16<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d-w100p<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        This is the footer
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre></div><h2 id="vue-api" tabindex="-1" class="d-docsite--header-2">Vue API <a class="header-anchor d-link d-docsite--link d-link" href="#vue-api" aria-hidden="true">#</a></h2>`,2),ma=s("h2",{id:"classes",tabindex:"-1",class:"d-docsite--header-2"},[a("Classes "),s("a",{class:"header-anchor d-link d-docsite--link d-link",href:"#classes","aria-hidden":"true"},"#")],-1),ga=s("p",{class:"d-docsite--paragraph"},"Popover must contain an anchor and content element. d-modal--transparent can be used as a sibling before the popover container if you wish to make the popover modal.",-1),ha=s("h2",{id:"accessibility",tabindex:"-1",class:"d-docsite--header-2"},[a("Accessibility "),s("a",{class:"header-anchor d-link d-docsite--link d-link",href:"#accessibility","aria-hidden":"true"},"#")],-1),va=s("p",{class:"d-docsite--paragraph"},[a('If your popover is modal, please see the accessibility section of this page regarding "focus trapping": '),s("a",{href:"components/modal/#accessibility"},"Modal Accessibility"),a(". The same rules will apply here if your popover is modal.")],-1),qa={__name:"popover.html",setup(p){return(c,u)=>{const e=d("code-well-header"),o=d("RouterLink"),l=d("component-vue-api"),i=d("component-class-table"),q=d("component-accessible-table");return k(),m("div",null,[n(e,{bgclass:"d-bgc-primary"},{default:t(()=>[n(r,{modal:""})]),_:1}),a(),S,a(),s("p",F,[a(`A Popover contains a dialog that will appear above other content when activated. It will always appear in a location relative to the anchor.
If you are looking for a dialog that does not display relative to the anchor, see `),n(o,{to:"/components/modal.html",class:"d-docsite--link d-link"},{default:t(()=>[a("Modal")]),_:1}),a(`.
Some common examples of popover usage: dropdown list, emoji picker dialog, add comment dialog.
A popover can be modal or non-modal. Below are some guidelines on when to use a modal vs non-modal popover.`)]),a(),R,a(),U,a(),W,a(),Y,a(),n(y,null,{do:t(()=>[j]),dont:t(()=>[s("ul",G,[s("li",H,[a("Content that is displayed on hover. Instead, use a "),n(o,{to:"/components/tooltip.html",class:"d-docsite--link d-link"},{default:t(()=>[a("Tooltip")]),_:1}),a(".")]),a(),K,a(),J,a(),O])]),_:1}),a(),Q,a(),s("ul",X,[s("li",Z,[a("Popovers should be fairly small. If you are looking for more of a full size dialog solution see "),n(o,{to:"/components/modal.html",class:"d-docsite--link d-link"},{default:t(()=>[a("Modal")]),_:1})]),a(),aa,a(),sa,a(),na,a(),ta,a(),oa,a(),pa]),a(),ea,a(),la,a(),n(e,{bgclass:"d-bgc-primary"},{default:t(()=>[n(r,{modal:""})]),_:1}),a(),ca,a(),n(e,{bgclass:"d-bgc-primary"},{default:t(()=>[n(r)]),_:1}),a(),ua,a(),n(e,{bgclass:"d-bgc-primary"},{default:t(()=>[n(r,{modal:"",header:""},{content:t(()=>[ia]),_:1})]),_:1}),a(),da,a(),n(e,{bgclass:"d-bgc-primary"},{default:t(()=>[n(r,{modal:"",footer:""},{content:t(()=>[ra]),_:1})]),_:1}),a(),ka,a(),n(l,{"component-name":"popover"}),ma,a(),ga,a(),n(i,{"component-name":"popover"}),ha,a(),va,a(),n(q,{"component-name":"popover"})])}}},fa=v(qa,[["__file","popover.html.vue"]]);export{fa as default};
