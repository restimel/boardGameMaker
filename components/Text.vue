<template>
    <Error>
        <VueMarkdownRender
            :class="componentKey"
            :key="componentKey"
            :source="text"
            :options="options"
            :plugins="plugins"
        />
    </Error>
</template>
<script setup lang="ts">

import VueMarkdownRender from 'vue-markdown-render';
import { full as MarkdownEmoji } from 'markdown-it-emoji';
import MarkdownSub from 'markdown-it-sub';
import MarkdownSup from 'markdown-it-sup';
import MarkdownTasks from 'markdown-it-task-lists';
import MarkdownFootnote from 'markdown-it-footnote';
import { computed } from 'vue';

type MarkdownIt = any;
type MDContent = {
    content: string;
};

type Props = {
    value?: string;
    context?: MaterialContext;
};

const props = defineProps<Props>();

const componentKey = ref<string>(getUid('Text-'));

/* https://github.com/markdown-it/markdown-it?tab=readme-ov-file#init-with-presets-and-options */
const options = {
    html: false,
    xhtmlOut: false,
    breaks: true,
    linkify: false,
    typographer: true,
    quotes: '“”‘’', /* ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for french */
};

const enclosedChars = {
  '(0)': '⓪',
  '(1)': '①',
  '(2)': '②',
  '(3)': '③',
  '(4)': '④',
  '(5)': '⑤',
  '(6)': '⑥',
  '(7)': '⑦',
  '(8)': '⑧',
  '(9)': '⑨',
  '(10)': '⑩',
  '(11)': '⑪',
  '(12)': '⑫',
  '(13)': '⑬',
  '(14)': '⑭',
  '(15)': '⑮',
  '(16)': '⑯',
  '(17)': '⑰',
  '(18)': '⑱',
  '(19)': '⑲',
  '(20)': '⑳',
  '(A)': 'Ⓐ',
  '(B)': 'Ⓑ',
  '(C)': 'Ⓒ',
  '(D)': 'Ⓓ',
  '(E)': 'Ⓔ',
  '(F)': 'Ⓕ',
  '(G)': 'Ⓖ',
  '(H)': 'Ⓗ',
  '(I)': 'Ⓘ',
  '(J)': 'Ⓙ',
  '(K)': 'Ⓚ',
  '(L)': 'Ⓛ',
  '(M)': 'Ⓜ',
  '(N)': 'Ⓝ',
  '(O)': 'Ⓞ',
  '(P)': 'Ⓟ',
  '(Q)': 'Ⓠ',
  '(R)': 'Ⓡ',
  '(S)': 'Ⓢ',
  '(T)': 'Ⓣ',
  '(U)': 'Ⓤ',
  '(V)': 'Ⓥ',
  '(W)': 'Ⓦ',
  '(X)': 'Ⓧ',
  '(Y)': 'Ⓨ',
  '(Z)': 'Ⓩ',
  '(a)': 'ⓐ',
  '(b)': 'ⓑ',
  '(c)': 'ⓒ',
  '(d)': 'ⓓ',
  '(e)': 'ⓔ',
  '(f)': 'ⓕ',
  '(g)': 'ⓖ',
  '(h)': 'ⓗ',
  '(i)': 'ⓘ',
  '(j)': 'ⓙ',
  '(k)': 'ⓚ',
  '(l)': 'ⓛ',
  '(m)': 'ⓜ',
  '(n)': 'ⓝ',
  '(o)': 'ⓞ',
  '(p)': 'ⓟ',
  '(q)': 'ⓠ',
  '(r)': 'ⓡ',
  '(s)': 'ⓢ',
  '(t)': 'ⓣ',
  '(u)': 'ⓤ',
  '(v)': 'ⓥ',
  '(w)': 'ⓦ',
  '(x)': 'ⓧ',
  '(y)': 'ⓨ',
  '(z)': 'ⓩ'
};

const text = computed(() => {
    const value = props.value;

    return value ?? '';
});

const refOptions = computed<MaterialContext | undefined>(() => {
    let context = props.context;

    if (!context && activeProject.value) {
        context = createContext(
            activeProject.value,
        );
    }

    return context;
});

const aliases = computed(() => {
    const aliasList = Object.values(activeProject.value.alias);

    return aliasList.reduce((list, alias) => {
        let value: string;

        if (alias.image) {
            const src = alias.image.replace(/"/g, '\\"');
            value = `<img class="alias-icon" src="${src}">`;
        } else {
            value = alias.value.replace(/</g, '&lt;');
        }

        list[alias.alias] = value;
        return list;
    }, {} as Record<string, string>);
});

const emoji = computed(() => {
    const plugin = (instance: any) => instance.use(MarkdownEmoji, {
        defs: {
            ...enclosedChars,
            ...aliases.value,
        },
    });

    return plugin;
});

const plugins = computed(() => [
    MarkdownEmoji,
    emoji.value,
    enumValuePlugin,
    MarkdownSub,
    MarkdownSup,
    MarkdownTasks,
    MarkdownFootnote,
]);

watch(aliases, () => {
    restartMarkdown();
});

// function refValuePlugin(md: MarkdownIt) {
//     md.renderer.rules.text = (tokens: MDContent[], idx: number) => {
//         let patternContent = tokens[idx].content;

//         patternContent = replaceRef(patternContent);

//         return md.utils.escapeHtml(patternContent);
//     };
// }

function enumValuePlugin(md: MarkdownIt) {
    md.renderer.rules.text = (tokens: MDContent[], idx: number) => {
        /* XXX: option should be read inside the function otherwise it is not reactive */
        const option = refOptions.value ?? {};
        let patternContent = tokens[idx].content;

        patternContent = replaceRef(patternContent, option);
        patternContent = replaceEnum(patternContent, option);

        return md.utils.escapeHtml(patternContent);
    };
}

let timer = 0;
function restartMarkdown() {
    clearTimeout(timer);

    timer = window.setTimeout(() => {
        componentKey.value = getUid('Text-');
    }, 250);
}

</script>
<style>
.alias-icon {
    height: 1em;
    display: inline-block;
}

pre {
    background-color: #f0f0f0;
    padding: 5px;
}

code {
    font-family: 'Courier New', Courier, monospace;
    color: #505550;
}
</style>
