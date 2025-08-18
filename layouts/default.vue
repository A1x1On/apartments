<template>
  <section class="wrapper">
    <slot />
  </section>
</template>

<script lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Главная` : "";
  },
});
</script>
