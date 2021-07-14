<template>
  <div class="messages">
    <div v-chat-scroll class="messages__wrapper">
      <div
        v-for="message in selectedUser.chat.messages"
        :key="message.id"
        class="messages__card"
        :class="message.name === user.name ? 'messages__card-right' : ''"
      >
        <p class="messages__header">{{ message.name }}</p>
        <p class="messages__text">{{ message.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    selectedUser() {
      return this.$store.state.selectedUser
    },
    user() {
      return this.$store.state.user
    },
  },
}
</script>
<style lang="scss" scoped>
@use "sass:math";
@function convertToPercentage($value, $sizeBlock) {
  @return math.div($value * 100%, $sizeBlock);
}
$width: 1140;

.messages {
  width: 100%;
  height: 76%;
  padding-right: 11px;
  &__wrapper {
    padding: 20px 19px;
    width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 10px;
      height: 20px;
    }
    &::-webkit-scrollbar-track {
      margin-top: 20px;
      background: #becbd9;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #9daab9;
      border-radius: 10px;
    }
  }
  &__card {
    position: relative;
    width: convertToPercentage(634, $width);
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 10px #becbd9;
    border-radius: 7px;
    height: max-content;
    margin-bottom: 20px;
    align-self: flex-start;
    &-right {
      align-self: flex-end;
      & .messages__header {
        background: #f0cbb3;
      }
      & .messages__text {
        &:after {
          position: absolute;
          left: unset;
          right: -9px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          content: '';
          width: 18px;
          height: 18px;
          background: white;
        }
      }
    }
  }
  & p {
    padding: 10px 12px;
  }
  &__text {
    background: white;
    position: relative;
    border-radius: 0 0 7px 7px;
    &:after {
      position: absolute;
      left: -9px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      content: '';
      width: 18px;
      height: 18px;
      background: white;
    }
  }
  &__header {
    background: #becbd9;
    border-radius: 7px 7px 0 0;
  }
}
</style>
