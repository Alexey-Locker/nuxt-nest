<template>
  <Main />
</template>
<script>
export default {
  sockets: {
    connect() {
      // eslint-disable-next-line no-console
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        this.$socket.emit('connectUser', user)
      } else {
        this.$socket.emit('connectUser')
      }
    },
  },
}
</script>
>
