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

* [ ] project version
* [ ] can select between different project
* [ ] import/export project

### Print

* [ ] layer for print (without header)

### Material

* [ ] allow to use enum in color

## :exclamation: less important features

* [ ] shape circle
* [ ] Do a save with Nuxt
* [ ] print all
* [ ] material: board

## :bug: Bugs

* [ ] hydratation (be nuxt ready)

`;

</script>

<style>

</style>
