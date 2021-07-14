<template>
  <header class="header">
    <p>Chat Bots 2.0</p>
  </header>
</template>
<style lang="scss" scoped>
@use "sass:math";
@function convertInVW($value) {
  @return math.div($value * 100vw, 1300);
}
.header {
  height: 10vh;
  padding: 0 convertInVW(80) 0 convertInVW(80);
  display: flex;
  align-items: center;
  & p {
    font-size: 32px;
    font-weight: 700;
  }
}
</style>
