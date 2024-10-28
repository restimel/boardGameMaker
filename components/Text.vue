<template>
    <VueMarkdownRender
        :class="componentKey"
        :key="componentKey"
        :source="text"
        :options="options"
        :plugins="plugins"
    />
</template>
<script setup lang="ts">

import VueMarkdownRender from 'vue-markdown-render';
import { full as MarkdownEmoji } from 'markdown-it-emoji';
import MarkdownSub from 'markdown-it-sub';
import MarkdownSup from 'markdown-it-sup';
import MarkdownTasks from 'markdown-it-task-lists';
import { computed } from 'vue';
import projectStore from '~/stores/project';

type Props = {
    value?: string;
    material?: Material;
    content?: MaterialContent | null;
};

const props = defineProps<Props>();
const project = projectStore();

const componentKey = ref<string>(getUid('Text-'));

const text = computed(() => {
    const value = props.value;

    return value ?? '';
});

/* https://github.com/markdown-it/markdown-it?tab=readme-ov-file#init-with-presets-and-options */
const options = {
    html: false,
    xhtmlOut: false,
    breaks: true,
    linkify: false,
    typographer: true,
    quotes: true,
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

const aliases = computed(() => {
    const aliasList = Object.values(project.alias.value);

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
    const plugin = (instance) => instance.use(MarkdownEmoji, {
        defs: {
            ...enclosedChars,
            ...aliases.value,
        }
    });

    return plugin;
});

const plugins = computed(() => [
    MarkdownEmoji,
    emoji.value,
    MarkdownSub,
    MarkdownSup,
    MarkdownTasks,
]);

watch(aliases, () => {
    restartMarkdown();
});

let timer = 0;
function restartMarkdown() {
    clearTimeout(timer);

    timer = window.setTimeout(() => {
        console.log('changedId');
        componentKey.value = getUid('Text-');
    }, 250);
}
</script>
<style>
.alias-icon {
    height: 1em;
    display: inline-block;
}
</style>
