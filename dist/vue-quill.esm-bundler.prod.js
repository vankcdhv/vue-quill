/*!
 * VueQuill @vueup/vue-quill v1.0.0-beta.10
 * https://vueup.github.io/vue-quill/
 * 
 * Includes quill v1.3.7
 * https://quilljs.com/
 * 
 * Copyright (c) 2022 Ahmad Luthfi Masruri
 * Released under the MIT license
 * Date: 2022-09-03T02:53:33.894Z
 */
import e from"quill";export{default as Quill}from"quill";export{default as Delta}from"quill-delta";import{defineComponent as t,onMounted as o,onBeforeUnmount as l,ref as n,watch as r,h as a,nextTick as i}from"vue";const d={essential:[[{header:[1,2,3,4,5,6,!1]}],["bold","italic","underline"],[{list:"ordered"},{list:"bullet"},{align:[]}],["blockquote","code-block","link"],[{color:[]},"clean"]],minimal:[[{header:1},{header:2}],["bold","italic","underline"],[{list:"ordered"},{list:"bullet"},{align:[]}]],full:[["bold","italic","underline","strike"],["blockquote","code-block"],[{header:1},{header:2}],[{list:"ordered"},{list:"bullet"}],[{script:"sub"},{script:"super"}],[{indent:"-1"},{indent:"+1"}],[{direction:"rtl"}],[{size:["small",!1,"large","huge"]}],[{header:[1,2,3,4,5,6,!1]}],[{color:[]},{background:[]}],[{font:[]}],[{align:[]}],["link","video","image"],["clean"]]},s=t({name:"QuillEditor",inheritAttrs:!1,props:{content:{type:[String,Object],default:()=>{}},contentType:{type:String,default:"delta",validator:e=>["delta","html","text"].includes(e)},enable:{type:Boolean,default:!0},readOnly:{type:Boolean,default:!1},placeholder:{type:String,required:!1},theme:{type:String,default:"snow",validator:e=>["snow","bubble",""].includes(e)},toolbar:{type:[String,Array,Object],required:!1,validator:e=>"string"!=typeof e||""===e||("#"===e.charAt(0)||-1!==Object.keys(d).indexOf(e))},modules:{type:Object,required:!1},options:{type:Object,required:!1},globalOptions:{type:Object,required:!1}},emits:["textChange","selectionChange","editorChange","update:content","focus","blur","ready"],setup:(t,a)=>{let s,u;o((()=>{m()})),l((()=>{s=null}));const c=n(),m=()=>{var o;if(c.value){if(u=b(),t.modules)if(Array.isArray(t.modules))for(const o of t.modules)e.register(`modules/${o.name}`,o.module);else e.register(`modules/${t.modules.name}`,t.modules.module);s=new e(c.value,u),f(t.content),s.on("text-change",g),s.on("selection-change",h),s.on("editor-change",v),"bubble"!==t.theme&&c.value.classList.remove("ql-bubble"),"snow"!==t.theme&&c.value.classList.remove("ql-snow"),null===(o=s.getModule("toolbar"))||void 0===o||o.container.addEventListener("mousedown",(e=>{e.preventDefault()})),a.emit("ready",s)}},b=()=>{const e={};if(""!==t.theme&&(e.theme=t.theme),t.readOnly&&(e.readOnly=t.readOnly),t.placeholder&&(e.placeholder=t.placeholder),t.toolbar&&""!==t.toolbar&&(e.modules={toolbar:(()=>{if("object"==typeof t.toolbar)return t.toolbar;if("string"==typeof t.toolbar){return"#"===t.toolbar.charAt(0)?t.toolbar:d[t.toolbar]}})()}),t.modules){const o=(()=>{var e,o;const l={};if(Array.isArray(t.modules))for(const n of t.modules)l[n.name]=null!==(e=n.options)&&void 0!==e?e:{};else l[t.modules.name]=null!==(o=t.modules.options)&&void 0!==o?o:{};return l})();e.modules=Object.assign({},e.modules,o)}return Object.assign({},t.globalOptions,t.options,e)},g=(e,t,o)=>{a.emit("update:content",y()),a.emit("textChange",{delta:e,oldContents:t,source:o})},p=n(),h=(e,t,o)=>{p.value=!!(null==s?void 0:s.hasFocus()),a.emit("selectionChange",{range:e,oldRange:t,source:o})};r(p,(e=>{a.emit(e?"focus":"blur",c)}));const v=(...e)=>{"text-change"===e[0]&&a.emit("editorChange",{name:e[0],delta:e[1],oldContents:e[2],source:e[3]}),"selection-change"===e[0]&&a.emit("editorChange",{name:e[0],range:e[1],oldRange:e[2],source:e[3]})},y=(e,o)=>"html"===t.contentType?O():"text"===t.contentType?T(e,o):null==s?void 0:s.getContents(e,o),f=(e,o="api")=>{"html"===t.contentType?q(e):"text"===t.contentType?x(e,o):null==s||s.setContents(e,o)},T=(e,t)=>{var o;return null!==(o=null==s?void 0:s.getText(e,t))&&void 0!==o?o:""},x=(e,t="api")=>{null==s||s.setText(e,t)},O=()=>{var e;return null!==(e=null==s?void 0:s.root.innerHTML)&&void 0!==e?e:""},q=e=>{s&&(s.root.innerHTML=e)};return r((()=>t.enable),(e=>{s&&s.enable(e)})),{editor:c,getEditor:()=>c.value,getToolbar:()=>{var e;return null===(e=null==s?void 0:s.getModule("toolbar"))||void 0===e?void 0:e.container},getQuill:()=>{if(s)return s;throw'The quill editor hasn\'t been instantiated yet, \n                  make sure to call this method when the editor ready\n                  or use v-on:ready="onReady(quill)" event instead.'},getContents:y,setContents:f,getHTML:O,setHTML:q,pasteHTML:(e,t="api")=>{const o=null==s?void 0:s.clipboard.convert(e);o&&(null==s||s.setContents(o,t))},getText:T,setText:x,reinit:()=>{i((()=>{var e;!a.slots.toolbar&&s&&(null===(e=s.getModule("toolbar"))||void 0===e||e.container.remove()),m()}))}}},render(){var e,t;return[null===(t=(e=this.$slots).toolbar)||void 0===t?void 0:t.call(e),a("div",{ref:"editor",...this.$attrs})]}});export{s as QuillEditor};
