<template>
    <div>
        <Text :value="value" />
    </div>
</template>
<script setup lang="ts">

const value = `
# Roadmap

## :warning: Important features (for 1.0.0)

### Project

* [x] project version
* [ ] can select between different project
    * [ ] What happen when save minor/major/build when not on last?
* [ ] import/export project

### Print

* [ ] layer for print (without header)

### Material

* [ ] allow to use enum in color

## :exclamation: less important features

* [ ] clean up Formats
* [ ] shape circle
* [ ] Do a save with Nuxt
* [ ] print all
* [ ] material: board

## :bug: Bugs

* [ ] hydratation (be nuxt ready)
* [ ] at start isChanged is false but buttons are enabled

`;

</script>

<style>

</style>
