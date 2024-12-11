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
* [x] import/export project
    * [x] import: check that project/version does not already exist and ask to override/skip
    * [ ] match on name, on id or on current project

### Print

* [ ] layer for print (without header)
    * [ ] assert material is displayed entirely in a page

### Material

* [ ] allow to use enum in color
* [x] allow to repeat materials contents looping on enum
* [x] import/export csv

## :exclamation: less important features

* [ ] comments in project
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

* [x] when refreshing the active project is the first instead of the previous one
* [x] hydratation (be nuxt ready)
* [x] at start isChanged is false but buttons are enabled
* [ ] allow to have empty default text value


* [ ] change dimension with rotation
* [X] rotation when height is less than 100
`;

</script>

<style>

</style>
