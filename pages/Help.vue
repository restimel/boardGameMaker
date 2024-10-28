<template>
    <div>
        <Text :value="value" />
    </div>
</template>
<script setup lang="ts">

const value = `
# How to format texts?

Most of text in Boardgame-Maker, can be formatted with Markdown.
This is a style where adding characters around text give hints on how to format it.

## Basic format
### Headers
To create headers, use \`#\` symbols. The number of \`#\` defines the level of the header.

\`\`\`markdown
# Header 1
## Header 2
### Header 3
\`\`\`

### Text styles

**Bold text**: Use double asterisks or underscores \`**bold**\` or \`__bold__\`.
**Italic text**: Use single asterisks or underscores \`*italic*\` or \`_italic_\`.
**Stroke text**: Use double tilde \`~~stroke~~\`.

\`\`\`markdown
**This is bold**
*This is italic*
~~This is stroke~~
\`\`\`
**This is bold**
*This is italic*
~~This is stroke~~

### Lists

**Unordered list**: Use dashes \`-\`, plus \`+\`, or asterisks \`*\`.
**Ordered list**: Just use numbers followed by a period.

\`\`\`markdown
- Item 1
- Item 2

1. First item
2. Second item
\`\`\`
- Item 1
- Item 2

1. First item
2. Second item

### Links
To create a link, use \`[text](url)\` syntax:

\`\`\`markdown
[Project Github](https://github.com/restimel)
\`\`\`
[Project Github](https://github.com/restimel)

### Images
To add an image, use \`![alt text](image-url)\`.

\`\`\`markdown
![logo](./logo.svg)
\`\`\`
![logo](./logo.svg)

### Horizontal line

It is possible to draw an horizontal line to mark a separation with \`---\` or \`___\` _(they should be alone on their line and \`---\` should have an empty line before it)_.

---

## Markdown extension

Here are some syntax that are not markdown common syntax but can be used in Boardgame Maker.

### sub / sup

**Sub text**: Use single tilde \`~sub-text~\`. _(Without any space inside)_
**Sup text**: Use single chap \`^sup-text^\`. _(Without any space inside)_

\`\`\`markdown
Text~sub text~
Text^sup text^

Text^with^ ^space^
\`\`\`
Text~sub-text~
Text^sup-text^

Text^with^ ^space^

### Footnotes

Footnotes are used to add references and details to a text, use the \`[^ref]\` pattern to add a footnote, and then at the start of a line use the same reference to add th details.

\`\`\`markdown
Here is a footnote reference[^1], and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple lines.
line2.
\`\`\`

Here is a footnote reference[^1], and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple lines.
line2.

### Task list

This is to display list of items that need to be done or have been done. _These items are not interactive, this is only for texts_.

**Todo**: At the start of a list, use a space in square brackets \`[ ]\`.
**Done**: At the start of a list, use a \`x\` in square brackets \`[x]\`.

\`\`\`markdown
1. [ ] not done
1. [x] done
\`\`\`
1. [ ] not done
1. [x] done

### Common symbols

Some characters will be converted automatically, such as \`(c)\`, \`(TM)\` or \`(R)\` ((c), (TM), (R)).

Some common smileys are automatically converted, such as \`:)\` or \`;)\` (:), ;)).

If you want to keep the original characters, you can always escape one of them with \`\\\`.

\`\\\\:)\` → \\:)

### Emoji and Aliases

Aliases are shortcuts for certain values or symbols, which can be rendered with specific meanings.
Some of them are common in different markdown system such as \`:sunglasses:\` (which will display :sunglasses:).

It is possible to display rounded characters with \`:(1):\` (to display :(1):).

You can add other patterns in the [Alias page](./alias) with your own character or image.

### References

For references, the format \`:ref<attribute>:\` allows you to dynamically insert information that is tied to the material.
It can be used in any material description.
The \`attribute\` is the name of a property in the material description.

### Enumeration

Enumeration are list of presets.
To access one of the value, use \`:enum<enumName, enumKey>:\`.

* \`enumName\` is to reference the enumeration (which can be defined in [Enumeration page](./alias#Enumeration)).
* \`enumKey\` is to reference the value inside the enumeration.

Both \`enumName\` and \`enumKey\` can be set with references.

`;


</script>

<style scoped>

</style>
<style>

</style>
