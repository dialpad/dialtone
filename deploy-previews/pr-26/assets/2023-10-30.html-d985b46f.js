import{p as o,B as s}from"./BlogPost-4d1fa146.js";import{_ as n,v as i,x as l,I as c,D as t,y as d,z as r,H as p,G as e}from"./framework-4ea48d0d.js";import"./app-066549e0.js";const h=e("p",{class:"d-docsite--paragraph"},"Hi everyone, hope you're having a great week. It's time for an update. First off we'll talk about the deprecation of the old icons in Dialtone, and then our exciting new tooltip directive!",-1),u=e("h2",{id:"deprecated-icons",tabindex:"-1",class:"d-docsite--header-2"},[t("Deprecated icons "),e("a",{class:"header-anchor d-link d-docsite--link d-link",href:"#deprecated-icons","aria-hidden":"true"},"#")],-1),k=e("p",{class:"d-docsite--paragraph"},[t("We've had a new icon set in Dialtone for quite a while now which you can see here: "),e("a",{href:"https://dialpad.design/components/icon",class:"d-docsite--link d-link",target:"_blank",rel:"noopener noreferrer"},"Icon List"),t(". Over the last quarter we've performed the migration on Dialpad to convert all of our icons to the new set. Two weeks from now on November 13th we will be removing the old icons from Dialtone. This means if you have an application outside of ubervoice that is using the old icons after Nov 13th it will error upon update to the latest Dialtone version.")],-1),m=e("h3",{id:"how-do-i-know-if-i-m-using-the-old-icons",tabindex:"-1",class:"d-docsite--header-3"},[t("How do I know if I'm using the old icons? "),e("a",{class:"header-anchor d-link d-docsite--link d-link",href:"#how-do-i-know-if-i-m-using-the-old-icons","aria-hidden":"true"},"#")],-1),g=e("p",{class:"d-docsite--paragraph"},[t("The old icons will have a path like this: "),e("code",null,"@dialpad/dialtone/lib/dist/vue/icons/IconName.vue"),t(" or "),e("code",null,"@dialpad/dialtone-legacy/lib/dist/vue/icons/IconName.vue")],-1),v=e("p",{class:"d-docsite--paragraph"},[t("The new icons should be used via the "),e("a",{href:"https://vue.dialpad.design/?path=/story/components-icon--default",class:"d-docsite--link d-link",target:"_blank",rel:"noopener noreferrer"},"DtIcon"),t(" component like so:")],-1),f=e("div",{class:"language-javascript","data-ext":"js"},[e("pre",{class:"language-javascript"},[e("code",null,[e("span",{class:"token keyword"},"import"),t(),e("span",{class:"token punctuation"},"{"),t(" DtIcon "),e("span",{class:"token punctuation"},"}"),t(),e("span",{class:"token keyword"},"from"),t(),e("span",{class:"token string"},"'@dialpad/dialtone-vue'"),e("span",{class:"token punctuation"},";"),t(`

`),e("span",{class:"token operator"},"<"),t("template"),e("span",{class:"token operator"},">"),t(`
  `),e("span",{class:"token operator"},"<"),t("dt"),e("span",{class:"token operator"},"-"),t("icon name"),e("span",{class:"token operator"},"="),e("span",{class:"token string"},'"external-link"'),t(" size"),e("span",{class:"token operator"},"="),e("span",{class:"token string"},'"300"'),t(),e("span",{class:"token operator"},"/"),e("span",{class:"token operator"},">"),t(`
`),e("span",{class:"token operator"},"<"),e("span",{class:"token operator"},"/"),t("template"),e("span",{class:"token operator"},">"),t(`
`)])])],-1),_=e("p",{class:"d-docsite--paragraph"},"Or by direct import of the svg. It is recommended to use the DtIcon component over this. Only use this method if you cannot use the vue component:",-1),w=e("div",{class:"language-javascript","data-ext":"js"},[e("pre",{class:"language-javascript"},[e("code",null,[e("span",{class:"token keyword"},"import"),t(" IconArrowUp "),e("span",{class:"token keyword"},"from"),t(),e("span",{class:"token string"},"'@dialpad/dialtone-icons/dist/svg/arrow-up.svg'"),e("span",{class:"token punctuation"},";"),t(`
`)])])],-1),y=e("h3",{id:"how-do-i-migrate",tabindex:"-1",class:"d-docsite--header-3"},[t("How do I migrate? "),e("a",{class:"header-anchor d-link d-docsite--link d-link",href:"#how-do-i-migrate","aria-hidden":"true"},"#")],-1),b=e("p",{class:"d-docsite--paragraph"},[t("Simply replace the existing icon with a corresponding icon from "),e("a",{href:"https://dialpad.design/components/icon",class:"d-docsite--link d-link",target:"_blank",rel:"noopener noreferrer"},"Icon List"),t(" passing the name into the DtIcon component. Some of the equivalent icons may be named differently than in the old system. If you are unable to find a reasonable replacement icon please let us know in #dialtone on slack. We can also assist with any complications that may arise from the migration.")],-1),D=e("h2",{id:"new-tooltip-directive",tabindex:"-1",class:"d-docsite--header-2"},[t("New tooltip directive "),e("a",{class:"header-anchor d-link d-docsite--link d-link",href:"#new-tooltip-directive","aria-hidden":"true"},"#")],-1),x=e("p",{class:"d-docsite--paragraph"},[t("In addition to our "),e("code",null,"DtTooltip"),t(" vue component, we now have a tooltip directive: "),e("a",{href:"https://vue.dialpad.design/?path=/docs/directives-tooltip--docs",class:"d-docsite--link d-link",target:"_blank",rel:"noopener noreferrer"},"v-dt-tooltip"),t(" see: "),e("a",{href:"https://vue.dialpad.design/?path=/story/directives-tooltip--default",class:"d-docsite--link d-link",target:"_blank",rel:"noopener noreferrer"},"storybook example"),t(". This is very similar to the v-tooltip directive we have in ubervoice, and is going to make it much easier to replace going forward.")],-1),I=e("h3",{id:"how-do-i-use-it",tabindex:"-1",class:"d-docsite--header-3"},[t("How do I use it? "),e("a",{class:"header-anchor d-link d-docsite--link d-link",href:"#how-do-i-use-it","aria-hidden":"true"},"#")],-1),T=e("p",{class:"d-docsite--paragraph"},[t("You may import it from "),e("code",null,"@dialpad/dialtone-vue/directives"),t(" in your entry point, and then register it via "),e("code",null,"Vue.use()"),t(" to make it globally available everywhere:")],-1),j=e("div",{class:"language-javascript","data-ext":"js"},[e("pre",{class:"language-javascript"},[e("code",null,[t(`
`),e("span",{class:"token comment"},"// This has already been done in Dialpad."),t(`
`),e("span",{class:"token keyword"},"import"),t(),e("span",{class:"token punctuation"},"{"),t(" DtTooltipDirective "),e("span",{class:"token punctuation"},"}"),t(),e("span",{class:"token keyword"},"from"),t(),e("span",{class:"token string"},"'@dialpad/dialtone-vue/directives'"),e("span",{class:"token punctuation"},";"),t(`

Vue`),e("span",{class:"token punctuation"},"."),e("span",{class:"token function"},"use"),e("span",{class:"token punctuation"},"("),t("DtTooltipDirective"),e("span",{class:"token punctuation"},")"),e("span",{class:"token punctuation"},";"),t(`
`)])])],-1),N=e("p",{class:"d-docsite--paragraph"},[t("You can then simply add the "),e("code",null,"v-dt-tooltip"),t(" directive to any element you want to have a tooltip:")],-1),H=e("div",{class:"language-html","data-ext":"html"},[e("pre",{class:"language-html"},[e("code",null,[e("span",{class:"token tag"},[e("span",{class:"token tag"},[e("span",{class:"token punctuation"},"<"),t("button")]),t(),e("span",{class:"token attr-name"},"v-dt-tooltip"),e("span",{class:"token attr-value"},[e("span",{class:"token punctuation attr-equals"},"="),e("span",{class:"token punctuation"},'"'),e("span",{class:"token punctuation"},"'"),t("This is a tooltip'"),e("span",{class:"token punctuation"},'"')]),e("span",{class:"token punctuation"},">")]),t("Hover me"),e("span",{class:"token tag"},[e("span",{class:"token tag"},[e("span",{class:"token punctuation"},"</"),t("button")]),e("span",{class:"token punctuation"},">")]),t(`
`)])])],-1),q=e("p",{class:"d-docsite--paragraph"},"or with a specific placement direction:",-1),V=e("div",{class:"language-html","data-ext":"html"},[e("pre",{class:"language-html"},[e("code",null,[e("span",{class:"token tag"},[e("span",{class:"token tag"},[e("span",{class:"token punctuation"},"<"),t("button")]),t(),e("span",{class:"token attr-name"},[e("span",{class:"token namespace"},"v-dt-tooltip:"),t("bottom-start")]),e("span",{class:"token attr-value"},[e("span",{class:"token punctuation attr-equals"},"="),e("span",{class:"token punctuation"},'"'),e("span",{class:"token punctuation"},"'"),t("This is a tooltip'"),e("span",{class:"token punctuation"},'"')]),e("span",{class:"token punctuation"},">")]),t("Hover me"),e("span",{class:"token tag"},[e("span",{class:"token tag"},[e("span",{class:"token punctuation"},"</"),t("button")]),e("span",{class:"token punctuation"},">")]),t(`
`)])])],-1),Y=e("h3",{id:"when-should-i-use-it",tabindex:"-1",class:"d-docsite--header-3"},[t("When should I use it? "),e("a",{class:"header-anchor d-link d-docsite--link d-link",href:"#when-should-i-use-it","aria-hidden":"true"},"#")],-1),B=e("p",{class:"d-docsite--paragraph"},[t("When you have to wrap a lot of things in a tooltip component it causes a lot of nesting and makes things harder to read. The tooltip directive is a great way to avoid this. That said the tooltip directive is only for simple tooltips. If you need to do anything more complicated than just showing basic text in a tooltip on hover, you should use the "),e("code",null,"DtTooltip"),t(" component. This should also make it easy to replace any existing v-tooltip directives in ubervoice with the new directive.")],-1),W=e("p",{class:"d-docsite--paragraph"},"Thanks for your cooperation and assistance in improving Dialtone!",-1),O={__name:"2023-10-30.html",setup($){return(a,z)=>(i(),l("div",null,[c(" Note the date must be in this format YYYY-M-D and wrapped in single quotes "),t(),d(s,{author:a.$frontmatter.author,posted:p(o)(a.$frontmatter.posted,"y-M-d",new Date),heading:a.$frontmatter.heading},{default:r(()=>[h,t(),u,t(),k,t(),m,t(),g,t(),v,t(),f,_,t(),w,y,t(),b,t(),D,t(),x,t(),I,t(),T,t(),j,N,t(),H,q,t(),V,Y,t(),B,t(),W]),_:1},8,["author","posted","heading"])]))}},S=n(O,[["__file","2023-10-30.html.vue"]]);export{S as default};
