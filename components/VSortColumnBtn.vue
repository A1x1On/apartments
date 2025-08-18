<template>
  <div>
    <span class="text">{{ text }}</span>

    <span class="chevron-duo" :class="order === 'DESC' ? 'chevron-duo--desc' : 'chevron-duo--asc'" role="img"></span>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    text: {
      type: String as PropType<string>,
      default: () => "",
      required: true,
    },

    order: {
      type: String as PropType<string>,
      default: () => "",
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.text:hover {
  color: var(--green);
  cursor: pointer;
}

.text:active {
  font-weight: 700;
  opacity: 0.4;
}

.chevron-duo {
  --size: 0.1em; /* общий размер */
  --thick: 0.14em; /* толщина линии */
  --gap: 0em; /* зазор между стрелками */
  --radius: 1px; /* радиус закругления */

  position: relative;
  display: inline-block;
  width: var(--size);
  height: var(--size);
  color: currentColor;

  top: -3px;
  margin-left: 8px;
}

.chevron-duo::before,
.chevron-duo::after {
  content: "";
  position: absolute;
  left: 50%;
  width: 0.4em;
  height: 0.4em;
  border-left: var(--thick) solid currentColor;
  border-bottom: var(--thick) solid currentColor;
  transform: translateX(-50%);
  border-radius: var(--radius);
}

.chevron-duo::before {
  top: var(--gap);
  transform: translateX(-50%) rotate(-45deg);
}

.chevron-duo::after {
  bottom: var(--gap);
  transform: translateX(-50%) rotate(135deg);
  border-radius: var(--radius);
}

.chevron-duo--asc::before {
  color: var(--green);
}

.chevron-duo--desc::after {
  color: var(--green);
}
</style>
