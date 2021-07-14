<template>
  <div class="wrapper">
    <Header />
    <nuxt />
  </div>
</template>
<script>
import Header from '@/components/common/TheHeader/TheHeader'
export default {
  components: { Header },
}
</script>
<style lang="scss" scoped>
.wrapper {
  height: 100vh;
}
</style>
