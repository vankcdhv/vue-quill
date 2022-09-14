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
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Quill = require('quill');
var quillDelta = require('quill-delta');
var vue = require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

var Quill__default = /*#__PURE__*/_interopDefaultLegacy(Quill);
var quillDelta__default = /*#__PURE__*/_interopDefaultLegacy(quillDelta);

const toolbarOptions = {
    essential: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
        ['blockquote', 'code-block', 'link'],
        [{ color: [] }, 'clean'],
    ],
    minimal: [
        [{ header: 1 }, { header: 2 }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
    ],
    full: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['link', 'video', 'image'],
        ['clean'], // remove formatting button
    ],
};

const QuillEditor = vue.defineComponent({
    name: 'QuillEditor',
    inheritAttrs: false,
    props: {
        content: {
            type: [String, Object],
            default: () => { },
        },
        contentType: {
            type: String,
            default: 'delta',
            validator: (value) => {
                return ['delta', 'html', 'text'].includes(value);
            },
        },
        enable: {
            type: Boolean,
            default: true,
        },
        readOnly: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            required: false,
        },
        theme: {
            type: String,
            default: 'snow',
            validator: (value) => {
                return ['snow', 'bubble', ''].includes(value);
            },
        },
        toolbar: {
            type: [String, Array, Object],
            required: false,
            validator: (value) => {
                if (typeof value === 'string' && value !== '') {
                    return value.charAt(0) === '#'
                        ? true
                        : Object.keys(toolbarOptions).indexOf(value) !== -1;
                }
                return true;
            },
        },
        modules: {
            type: Object,
            required: false,
        },
        options: {
            type: Object,
            required: false,
        },
        globalOptions: {
            type: Object,
            required: false,
        },
    },
    emits: [
        'textChange',
        'selectionChange',
        'editorChange',
        'update:content',
        'focus',
        'blur',
        'ready',
    ],
    setup: (props, ctx) => {
        vue.onMounted(() => {
            initialize();
        });
        vue.onBeforeUnmount(() => {
            quill = null;
        });
        let quill;
        let options;
        const editor = vue.ref();
        // Initialize Quill
        const initialize = () => {
            var _a;
            if (!editor.value)
                return;
            options = composeOptions();
            // Register modules
            if (props.modules) {
                if (Array.isArray(props.modules)) {
                    for (const module of props.modules) {
                        Quill__default.register(`modules/${module.name}`, module.module);
                    }
                }
                else {
                    Quill__default.register(`modules/${props.modules.name}`, props.modules.module);
                }
            }
            // Create new Quill instance
            quill = new Quill__default(editor.value, options);
            // Set editor content
            setContents(props.content);
            // Set event handlers
            quill.on('text-change', handleTextChange);
            quill.on('selection-change', handleSelectionChange);
            quill.on('editor-change', handleEditorChange);
            // Remove editor class when theme changes
            if (props.theme !== 'bubble')
                editor.value.classList.remove('ql-bubble');
            if (props.theme !== 'snow')
                editor.value.classList.remove('ql-snow');
            // Fix clicking the quill toolbar is detected as blur event
            (_a = quill
                .getModule('toolbar')) === null || _a === void 0 ? void 0 : _a.container.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });
            // Emit ready event
            ctx.emit('ready', quill);
        };
        // Compose Options
        const composeOptions = () => {
            const clientOptions = {};
            if (props.theme !== '')
                clientOptions.theme = props.theme;
            if (props.readOnly)
                clientOptions.readOnly = props.readOnly;
            if (props.placeholder)
                clientOptions.placeholder = props.placeholder;
            if (props.toolbar && props.toolbar !== '') {
                clientOptions.modules = {
                    toolbar: (() => {
                        if (typeof props.toolbar === 'object') {
                            return props.toolbar;
                        }
                        else if (typeof props.toolbar === 'string') {
                            const str = props.toolbar;
                            return str.charAt(0) === '#'
                                ? props.toolbar
                                : toolbarOptions[props.toolbar];
                        }
                        return;
                    })(),
                };
            }
            if (props.modules) {
                const modules = (() => {
                    var _a, _b;
                    const modulesOption = {};
                    if (Array.isArray(props.modules)) {
                        for (const module of props.modules) {
                            modulesOption[module.name] = (_a = module.options) !== null && _a !== void 0 ? _a : {};
                        }
                    }
                    else {
                        modulesOption[props.modules.name] = (_b = props.modules.options) !== null && _b !== void 0 ? _b : {};
                    }
                    return modulesOption;
                })();
                clientOptions.modules = Object.assign({}, clientOptions.modules, modules);
            }
            return Object.assign({}, props.globalOptions, props.options, clientOptions);
        };
        const handleTextChange = (delta, oldContents, source) => {
            // Update v-model:content when text changes
            ctx.emit('update:content', getContents());
            ctx.emit('textChange', { delta, oldContents, source });
        };
        const isEditorFocus = vue.ref();
        const handleSelectionChange = (range, oldRange, source) => {
            // Set isEditorFocus if quill.hasFocus()
            isEditorFocus.value = (quill === null || quill === void 0 ? void 0 : quill.hasFocus()) ? true : false;
            ctx.emit('selectionChange', { range, oldRange, source });
        };
        vue.watch(isEditorFocus, (focus) => {
            if (focus)
                ctx.emit('focus', editor);
            else
                ctx.emit('blur', editor);
        });
        const handleEditorChange = (...args) => {
            if (args[0] === 'text-change')
                ctx.emit('editorChange', {
                    name: args[0],
                    delta: args[1],
                    oldContents: args[2],
                    source: args[3],
                });
            if (args[0] === 'selection-change')
                ctx.emit('editorChange', {
                    name: args[0],
                    range: args[1],
                    oldRange: args[2],
                    source: args[3],
                });
        };
        const getEditor = () => {
            return editor.value;
        };
        const getToolbar = () => {
            var _a;
            return (_a = quill === null || quill === void 0 ? void 0 : quill.getModule('toolbar')) === null || _a === void 0 ? void 0 : _a.container;
        };
        const getQuill = () => {
            if (quill)
                return quill;
            else
                throw `The quill editor hasn't been instantiated yet, 
                  make sure to call this method when the editor ready
                  or use v-on:ready="onReady(quill)" event instead.`;
        };
        const getContents = (index, length) => {
            if (props.contentType === 'html') {
                return getHTML();
            }
            else if (props.contentType === 'text') {
                return getText(index, length);
            }
            return quill === null || quill === void 0 ? void 0 : quill.getContents(index, length);
        };
        const setContents = (content, source = 'api') => {
            if (props.contentType === 'html') {
                setHTML(content);
            }
            else if (props.contentType === 'text') {
                setText(content, source);
            }
            else {
                quill === null || quill === void 0 ? void 0 : quill.setContents(content, source);
            }
        };
        const getText = (index, length) => {
            var _a;
            return (_a = quill === null || quill === void 0 ? void 0 : quill.getText(index, length)) !== null && _a !== void 0 ? _a : '';
        };
        const setText = (text, source = 'api') => {
            quill === null || quill === void 0 ? void 0 : quill.setText(text, source);
        };
        const getHTML = () => {
            var _a;
            return (_a = quill === null || quill === void 0 ? void 0 : quill.root.innerHTML) !== null && _a !== void 0 ? _a : '';
        };
        const setHTML = (html) => {
            if (quill)
                quill.root.innerHTML = html;
        };
        const pasteHTML = (html, source = 'api') => {
            const delta = quill === null || quill === void 0 ? void 0 : quill.clipboard.convert(html);
            if (delta)
                quill === null || quill === void 0 ? void 0 : quill.setContents(delta, source);
        };
        const reinit = () => {
            vue.nextTick(() => {
                var _a;
                if (!ctx.slots.toolbar && quill)
                    (_a = quill.getModule('toolbar')) === null || _a === void 0 ? void 0 : _a.container.remove();
                initialize();
            });
        };
        // watch(
        //   () => props.content,
        //   (newContent, oldContents) => {
        //     if (!quill || !newContent || newContent === oldContents) return
        //     setContents(newContent)
        //   }
        // )
        vue.watch(() => props.enable, (newValue) => {
            if (quill)
                quill.enable(newValue);
        });
        return {
            editor,
            getEditor,
            getToolbar,
            getQuill,
            getContents,
            setContents,
            getHTML,
            setHTML,
            pasteHTML,
            getText,
            setText,
            reinit,
        };
    },
    render() {
        var _a, _b;
        return [
            (_b = (_a = this.$slots).toolbar) === null || _b === void 0 ? void 0 : _b.call(_a),
            vue.h('div', { ref: 'editor', ...this.$attrs }),
        ];
    },
});

exports.Quill = Quill__default;
exports.Delta = quillDelta__default;
exports.QuillEditor = QuillEditor;