import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
let sockets = [];
let users: ClientProps[] = [
  {
    id: 1,
    name: 'Reverse Bot',
    avatar: 'reverseBot',
    chats: [],
    description: `I'm Reverse Bot `,
    isOnline: true,
    action: function (text, callback) {
      callback(text.split('').reverse().join(''));
    },
  },
  {
    id: 2,
    name: 'Echo Bot',
    avatar: 'echoBot',
    chats: [],
    description: "I'm Echo Bot",
    isOnline: true,
    action: function (msg, callback) {
      setTimeout(() => {
        callback(msg);
      }, 3000);
    },
  },
  {
    id: 3,
    name: 'Spam Bot',
    avatar: 'spamBot',
    chats: [],
    description: "I'm Spam Bot",
    isOnline: true,
    action: function (msg, callback) {
      const timeout = Math.floor(Math.random() * (20 - 5) + 5);
      setTimeout(() => {
        callback('YES!');
        this.action(msg, callback);
      }, timeout * 1000);
    },
  },
  {
    id: 4,
    name: 'Ignore Bot',
    avatar: 'ignoreBot',
    chats: [],
    description: "i'm Ignore Bot",
    isOnline: true,
    action: null,
  },
];
type Message = {
  id: number;
  text: string;
  name: string;
};

type Chat = {
  id: number;
  messages: Message[];
  users: number[];
  action?: (text: string, callback: (text: string) => void) => void;
};
type AddMessageProps = {
  chatId: number;
  name: string;
  text: 'string';
  userId: number;
  receiverID: number;
};

const chats: Chat[] = [];

@WebSocketGateway(8080, {
  cors: { origin: 'http://localhost:3000', credentials: true },
  allowEIO3: true,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('addMessage')
  addMessage(
    client: Socket,
    { chatId, userId, receiverID, name, text }: AddMessageProps,
  ): void {
    const chat = chats.find((chat) => chat.id === chatId);
    chat.messages.push({ id: Date.now(), name, text });
    if (chat.action) {
      chat.action(text, (text) => {
        const user = users.find((user) => user.id === receiverID);
        chat.messages.push({ id: Date.now(), name: user.name, text });
        const data = { id: chat.id, messages: chat.messages };
        client.emit('setChat', data);
      });
    }
    const socket = sockets.find((socket) => socket.id === receiverID);

    const data = { id: chat.id, messages: chat.messages };
    if (socket) this.server.to(socket.socketId).emit('setChat', data);
    client.emit('setChat', data);
  }

  @SubscribeMessage('selectUser')
  onSelectChat(client: Socket, { id, selectedUserId }): void {
    let chat: Chat = chats.find((chat) => {
      return (
        (chat.users[0] === id && selectedUserId === chat.users[1]) ||
        (chat.users[1] === id && selectedUserId === chat.users[0])
      );
    });

    const user = users.find((user) => user.id === selectedUserId);

    if (!chat) {
      const chatId = Date.now();
      let data: Chat = {
        id: chatId,
        messages: [],
        users: [id, selectedUserId],
      };
      const regular = /bot/i;
      if (regular.test(user.name)) {
        data.action = user.action;
      }
      chats.push(data);
      chat = data;
    }

    client.emit('selectUser', {
      name: user.name,
      description: user.description,
      id: user.id,
      avatar: user.avatar,
      chat,
    });
  }

  @SubscribeMessage('connectUser')
  onConnectUser(client: Socket, data) {
    let user = users.find((user) => user.id === data?.id);
    if (!user) {
      user = new Client();
      users.push(user);
    }
    users = users.map((u) => (u.id === user.id ? { ...u, isOnline: true } : u));
    sockets.push({ socketId: client.id, id: user.id });

    client.emit('connectUser', {
      ...user,
      users: users
        .map((user) => ({
          name: user.name,
          id: user.id,
          description: user.description,
          avatar: user.avatar,
          isOnline: user.isOnline,
        }))
        .filter((u) => u.id !== user.id),
    });

    client.broadcast.emit('addUser', {
      name: user.name,
      id: user.id,
      description: user.description,
      avatar: user.avatar,
      isOnline: user.isOnline,
    });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    sockets = sockets.filter((socket) => {
      if (socket.socketId === client.id) {
        users = users.map((user) =>
          user.id === socket.id ? { ...user, isOnline: false } : user,
        );
        this.server.emit('disconectUser', socket.id);
        return false;
      }
      return true;
    });
  }

  handleConnection(client: Socket, ...args: any[]) {}
}

type ClientChats = {
  id: number;
};

interface ClientProps {
  id: number;
  name: string;
  avatar: string;
  chats: ClientChats[];
  description: string;
  isOnline: boolean;
  action?: (msg: string, callback: (text: string) => void) => void;
}

class Client implements ClientProps {
  constructor(public name = 'User ' + Math.floor(Math.random() * 250)) {}
  public id = Date.now();
  public avatar = 'user';
  public chats = [];
  public description = 'My name is ' + this.name;
  public isOnline = true;
}
