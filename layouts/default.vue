<template>
  <section class="wrapper">
    <slot />
  </section>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Главная` : "";
  },
});
</script>
