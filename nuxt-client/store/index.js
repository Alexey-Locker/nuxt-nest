export const state = () => ({
  user: {},
  selectedUser: {
    id: -1,
    name: '',
    description: '',
    avatar: '',
    chat: { id: -1, messages: [] },
  },
  users: [],
})

export const mutations = {
  SOCKET_setChat(state, chat) {
    if (state.selectedUser.chat.id === chat.id) {
      state.selectedUser.chat = chat
    }
  },
  SOCKET_setUsers(state, users) {
    state.users = users
  },
  SOCKET_selectUser(state, data) {
    state.selectedUser = data
  },
  SOCKET_connectUser(state, data) {
    state.users = data.users
    state.user = { id: data.id, name: data.name }
    localStorage.setItem(
      'user',
      JSON.stringify({ id: data.id, name: data.name })
    )
  },
  SOCKET_addUser(state, data) {
    const user = state.users.find((user) => user.id === data.id)
    if (!user) {
      state.users.push(data)
    } else {
      user.isOnline = true
    }
  },
  SOCKET_disconectUser(state, id) {
    state.users = state.users.map((user) =>
      user.id === id ? { ...user, isOnline: false } : user
    )
  },
}
