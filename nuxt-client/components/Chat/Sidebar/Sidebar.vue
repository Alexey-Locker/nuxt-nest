<template>
  <div :class="className" class="sidebar">
    <div class="sidebar__wrapper">
      <div class="sidebar__header">
        <p
          :class="filter === 'Online' ? 'sidebar__header-active' : null"
          @click="() => selectFilter('Online')"
        >
          Online
        </p>
        <p
          :class="filter === 'All' ? 'sidebar__header-active' : null"
          @click="() => selectFilter('All')"
        >
          All
        </p>
      </div>
      <div class="sidebar__chats">
        <div
          v-for="user in users"
          :key="user.id"
          class="sidebar__card"
          @click="() => selectChat(user.id)"
        >
          <div
            :class="user.isOnline ? 'sidebar__image-wrapper-active' : null"
            class="sidebar__image-wrapper"
          >
            <img :src="getImgUrl(user.avatar)" alt="Reverse Bot" />
          </div>
          <div class="sidebar__descriptions">
            <h3>{{ user.name }}</h3>
            <p>{{ user.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="sidebar__search">
      <input v-model="search" placeholder="Search..." />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    className: {
      type: String,
      default() {
        return ''
      },
    },
  },
  data() {
    return {
      filter: 'Online',
      search: '',
    }
  },
  computed: {
    users() {
      const regular = new RegExp(this.search, 'i')
      if (this.filter === 'All') {
        return this.$store.state.users.filter((user) => regular.test(user.name))
      } else {
        return this.$store.state.users.filter(
          (user) => user.isOnline && regular.test(user.name)
        )
      }
    },
  },
  methods: {
    selectFilter(filter) {
      this.filter = filter
    },
    selectChat(selectedUserId) {
      this.$socket.emit('selectUser', {
        id: this.$store.state.user.id,
        selectedUserId,
      })
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
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &__wrapper {
    height: 75%;
  }
  &__search {
    padding: 14px 20px;
    & input {
      width: 100%;
      padding: 14px 13px;
      border: 1px solid #cbcbcb;
    }
  }
  &__header {
    width: 100%;
    display: grid;
    grid-template-columns: 50% 50%;
    & p {
      cursor: pointer;
      width: 100%;
      text-align: center;
      border-bottom: 1px solid #dddddd;
      padding-top: 19px;
      padding-bottom: 10px;
      background: #f8f8f8;
      &:last-child {
        border-left: 1px solid #dddddd;
      }
    }
  }
  & img {
    border-radius: 5px;
    width: 60px;
    height: 60px;
    object-fit: cover;
  }
  &__descriptions {
    overflow: hidden;
  }
  &__image-wrapper {
    position: relative;
    margin-right: 16px;
    width: 60px;
    height: 60px;
    &-active {
      &:before {
        display: inline-block;
        content: '';
        width: 15px;
        height: 15px;
        border-radius: 50%;
        position: absolute;
        background: #20d63e;
        z-index: 10;
        right: -2px;
        bottom: 0px;
      }
    }
  }
  &__header-active {
    border-bottom: 0 !important;
    background: white !important;
  }
  &__chats {
    padding: 14px;
    padding-bottom: 0;
    max-height: 100%;
    overflow: auto;
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
    display: flex;
    margin-bottom: 10px;
    cursor: pointer;

    & h3 {
      font-size: 16px;
      font-weight: 600;
    }
    & p {
      font-size: 14px;
      font-weight: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre;
    }
  }
}
</style>
