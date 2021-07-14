<template>
  <div class="chat">
    <div class="chat__field">
      <div class="chat__header">
        <div class="chat__image-wrapper">
          <img :src="getImgUrl(currentChat.avatar)" />
        </div>
        <div class="chat__descriptions">
          <h2>{{ currentChat.name }}</h2>
          <p>
            {{ currentChat.description }}
          </p>
        </div>
      </div>
      <Messages />
      <div v-if="currentChat.id >= 0" class="chat__inputs">
        <input
          v-model="text"
          placeholder="Start chatting!"
          :class="errorSubmit ? 'chat__error' : ''"
          @keyup.enter="submit"
        />
        <input type="button" value="Send message" @click="submit" />
      </div>
    </div>
    <Sidebar class-name="chat__sidebar" />
  </div>
</template>

<script>
import Messages from './Messages/Messages.vue'
import Sidebar from './Sidebar/Sidebar.vue'
export default {
  components: {
    Messages,
    Sidebar,
  },

  data() {
    return {
      text: '',
      errorSubmit: false,
      filter: 'Online',
    }
  },
  computed: {
    users() {
      if (this.filter === 'All') {
        return this.$store.state.users
      } else {
        return this.$store.state.users.filter((user) => user.isOnline)
      }
    },
    currentChat() {
      return this.$store.state.selectedUser
    },
  },
  methods: {
    submit() {
      if (!this.text || !this.text.trim()) {
        this.errorSubmit = true
        return
      }
      this.$socket.emit('addMessage', {
        chatId: this.$store.state.selectedUser.chat.id,
        name: this.$store.state.user.name,
        text: this.text,
        userId: this.$store.state.user.id,
        receiverID: this.$store.state.selectedUser.id,
      })
      this.errorSubmit = false
      this.text = ''
    },

    getImgUrl(pet) {
      if (pet) {
        const images = require('@/assets/images/chat/' + pet + '.png')
        return images
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@function convertToPercentage($value, $sizeBlock) {
  @return math.div($value * 100%, $sizeBlock);
}
$heigh: 651;
$width: 1140;

.chat {
  height: 100%;
  background: #d7dfe7;
  display: flex;
  &__image-wrapper {
    height: 100%;
    margin-right: 25px;
    & img {
      height: 100%;
      object-fit: cover;
    }
  }
  &__header {
    padding-right: 39px;
    height: 16%;
    width: 100%;
    background: #becbd9;
    display: flex;
  }

  &__field {
    width: convertToPercentage(879, $width);
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
  }
  &__sidebar {
    width: convertToPercentage(261, $width);
    min-height: 100%;
    background: white;
  }

  &__inputs {
    padding-left: 10px;
    padding-right: 36px;
    display: grid;
    grid-template-columns: convertToPercentage(631, 879) convertToPercentage(
        193,
        879
      );
    justify-content: space-between;
    & input {
      font-size: 14px;
      padding: 13px 12px;
      width: 100%;
      border: 1px solid #347dbc;
      &:focus {
        box-shadow: 0px 0px 4px #347dbc;
        outline: none;
      }
      &[type='button'] {
        box-shadow: none;
        background: #428bca;
        color: white;
        cursor: pointer;
        &:active {
          background: #3d81bd;
        }
      }
    }
    &__error {
      box-shadow: 0px 0px 4px #bc3434;
    }
  }
  &__descriptions {
    display: flex;
    flex-direction: column;
    width: 100%;
    & h2 {
      font-size: 24px;
    }
    & p {
      font-size: 14px;
    }
  }
}
</style>
