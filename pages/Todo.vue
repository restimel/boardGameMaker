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
* [x] can select between different project
    * [ ] What happen when save minor/major/build when not on last?
    * [x] Should confirm to drop changes when changing to a version (and there are changes)
* [ ] import/export project
    * [ ] import: check that project/version does not already exist and ask to override/skip

### Print

* [ ] layer for print (without header)
    * [ ] assert material is displayed entirely in a page

### Material

* [ ] allow to use enum in color

## :exclamation: less important features

* [ ] clean up Formats
* [ ] draw shape circle
* [x] references: index & total
* [ ] reference to material
* [ ] Do a save with Nuxt
* [ ] print all
    * [ ] print back + front
* [ ] material: board
* [ ] check when removing an item it is not used (for example attributes used in description)

## :bug: Bugs

* [ ] when refreshing the active project is the first instead of the previous one
* [ ] hydratation (be nuxt ready)
* [ ] at start isChanged is false but buttons are enabled

`;

</script>

<style>

</style>
