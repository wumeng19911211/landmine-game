<template>
  <div class="grid-mask">
      <slot><slot>
  </div>
</template>

<script>
export default {
    name:'gridmask',
    data() {
        return {}
    }
}
</script>

<style lang="less">
.grid-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    background-color: #ccc;
    .flag {
        width: 100%;
        height: 100%;
    }
}
</style>