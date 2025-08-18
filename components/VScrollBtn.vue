<template>
  <button v-show="showScrollTop" class="scroll-to-top-btn" @click="scrollToTop">
    <img src="/assets/img/arrow-up.svg" alt="Scroll to top" />
  </button>
</template>

<script lang="ts">
const DISPLAY_PX = 200;
export default defineComponent({
  setup() {
    const showScrollTop = ref<Boolean>(false);

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const checkScroll = () => {
      showScrollTop.value = window.scrollY > DISPLAY_PX;
    };

    const handleScroll = () => {
      checkScroll();
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
      checkScroll();
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return {
      showScrollTop,

      scrollToTop,
      handleScroll,
    };
  },
});
</script>

<style lang="scss" scoped>
.scroll-to-top-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 40px;
  height: 40px;
  background: var(--shadow-green);
  color: var(--white);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  img {
    width: 15px;
    height: 15px;
  }

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }
}
</style>
