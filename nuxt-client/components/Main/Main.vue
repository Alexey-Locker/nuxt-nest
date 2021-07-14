<template>
  <section class="main">
    <Chat />
  </section>
</template>

<script>
import Chat from '../Chat/Chat.vue'
export default {
  components: {
    Chat,
  },
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@function convertInVW($value) {
  @return math.div($value * 100vw, 1300);
}
.main {
  width: 100%;
  height: 90vh;
  background: #586670;
  padding: 20px convertInVW(80);
}
</style>
