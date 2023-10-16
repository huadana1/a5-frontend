import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Chat, CollaborativeMode, Friend, Gallery, Trash, User, WebSession } from "./app";
import { BadValuesError } from "./concepts/errors";
import { FriendNotFoundError } from "./concepts/friend";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  // sync deleting friend with deleting private chat
  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    if (friend == null) {
      throw new BadValuesError("Friend cannot be empty!");
    }

    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    await Chat.deleteChat(user, friendId);
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  // sync adding friend and making new private message chat
  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string, message: string, messageType: string) {
    if (to == null || message == null || messageType == null) {
      throw new BadValuesError("All fields must be filled out!");
    }

    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;

    await Chat.createChat(user, toId);
    const sentMessage = await Chat.sendMessage(user, toId, message);
    await Gallery.addItem(user, messageType, message);

    return { msg: sentMessage.msg + (await Friend.sendRequest(user, toId)).msg };
  }

  // don't need to create private chat when accepting a friend request because chat was already created when request was sent
  // can't view messages or send messages in chat until friend request is accepted
  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    if (from == null) {
      throw new BadValuesError("From cannot be empty!");
    }

    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  // sync rejecting friend request with deleting chat
  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    if (from == null) {
      throw new BadValuesError("From cannot be empty!");
    }

    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    await Chat.deleteChat(user, fromId);
    return await Friend.rejectRequest(fromId, user);
  }

  // get chat messages between logged in user and user2
  @Router.get("/chats/chat/:username?")
  async getChatMessages(session: WebSessionDoc, username: string) {
    if (username == null) {
      throw new BadValuesError("Username cannot be empty!");
    }

    const user = WebSession.getUser(session);
    const u2Id = (await User.getUserByUsername(username))._id;

    if (!(await Friend.isFriends(user, u2Id))) {
      throw new FriendNotFoundError(user, u2Id);
    }

    return await Chat.getAllMessages(user, u2Id);
  }

  // get the available chats, NOT getting the message
  @Router.get("/chats")
  async getAllChats(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Chat.getAllChats(user);
  }

  @Router.post("/chats/chat/:to")
  async sendChatMessage(session: WebSessionDoc, to: string, message: string, messageType: string) {
    if (to == null || message == null || messageType == null) {
      throw new BadValuesError("All fields must be filled out!");
    }

    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;

    if (!(await Friend.isFriends(user, toId))) {
      throw new FriendNotFoundError(user, toId);
    }

    const sentMessage = await Chat.sendMessage(user, toId, message);
    await Gallery.addItem(user, messageType, message);

    return sentMessage.msg;
  }

  // turn on collaborative mode for a private chat
  @Router.post("/collaborativeModes")
  async startCollaborativeMode(session: WebSessionDoc, username: string, message: string) {
    if (username == null || message == null) {
      throw new BadValuesError("All fields must be filled out!");
    }

    const user = WebSession.getUser(session);
    const user2 = (await User.getUserByUsername(username))._id;

    if (!(await Friend.isFriends(user, user2))) {
      throw new FriendNotFoundError(user, user2);
    }

    await CollaborativeMode.startCollab(user, user2);
    return await CollaborativeMode.collab(user, user2, message);
  }

  // add a message to the cumulativeMessage content for the collabroative mode in the specific chat
  @Router.patch("/collaborativeModes")
  async collaborate(session: WebSessionDoc, username: string, message: string) {
    if (username == null || message == null) {
      throw new BadValuesError("All fields must be filled out!");
    }

    const user = WebSession.getUser(session);
    const user2 = (await User.getUserByUsername(username))._id;

    if (!(await Friend.isFriends(user, user2))) {
      throw new FriendNotFoundError(user, user2);
    }

    return await CollaborativeMode.collab(user, user2, message);
  }

  @Router.delete("/collaborativeModes")
  async finishCollaborativeMode(session: WebSessionDoc, username: string) {
    if (username == null) {
      throw new BadValuesError("Username cannot be empty!");
    }

    const user = WebSession.getUser(session);
    const user2 = (await User.getUserByUsername(username))._id;

    if (!(await Friend.isFriends(user, user2))) {
      throw new FriendNotFoundError(user, user2);
    }

    return await CollaborativeMode.finishCollab(user, user2);
  }

  // get the cumulativeMessage content
  @Router.get("/collaborativeMode/content")
  async getCollabContent(session: WebSessionDoc, username: string) {
    if (username == null) {
      throw new BadValuesError("Username cannot be empty!");
    }

    const user = WebSession.getUser(session);
    const user2 = (await User.getUserByUsername(username))._id;

    if (!(await Friend.isFriends(user, user2))) {
      throw new FriendNotFoundError(user, user2);
    }

    return await CollaborativeMode.getCollabContent(user, user2);
  }

  @Router.get("/collaborativeMode")
  async getCollabMode(session: WebSessionDoc, username: string) {
    if (username == null) {
      throw new BadValuesError("Username cannot be empty!");
    }

    const user = WebSession.getUser(session);
    const user2 = (await User.getUserByUsername(username))._id;

    if (!(await Friend.isFriends(user, user2))) {
      throw new FriendNotFoundError(user, user2);
    }

    return await CollaborativeMode.getCollabMode(user, user2);
  }

  @Router.get("/galleries/gallery/items/:itemId?")
  async getOneGalleryItem(session: WebSessionDoc, itemId: string) {
    if (itemId == null) {
      throw new BadValuesError("ItemId cannot be empty!");
    }

    const user = WebSession.getUser(session);
    return await Gallery.getSingleItem(user, itemId);
  }

  @Router.get("/galleries/gallery/:galleryName?")
  async getAllGalleryItems(session: WebSessionDoc, galleryName: string) {
    if (galleryName == null) {
      throw new BadValuesError("GalleryName cannot be empty!");
    }

    const user = WebSession.getUser(session);
    return await Gallery.getGalleryItemsByGalleryName(user, galleryName);
  }

  @Router.get("/galleries")
  async getAllUserGalleries(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Gallery.getAllUserGalleries(user);
  }

  @Router.delete("/galleries/gallery/items")
  async deleteGalleryItem(session: WebSessionDoc, itemId: string) {
    if (itemId == null) {
      throw new BadValuesError("ItemId cannot be empty!");
    }

    const user = WebSession.getUser(session);
    return await Gallery.deleteItem(user, itemId);
  }

  @Router.get("/trash/item/:itemId?")
  async getOneTrashItem(session: WebSessionDoc, itemId: ObjectId) {
    if (itemId == null) {
      throw new BadValuesError("ItemId cannot be empty!");
    }

    const user = WebSession.getUser(session);
    return await Trash.getSingleItem(user, itemId);
  }

  @Router.get("/trash")
  async getAllTrashItems(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Trash.getAllItems(user);
  }

  @Router.delete("/trash/item/:itemId?")
  async deleteForever(session: WebSessionDoc, itemId: ObjectId) {
    if (itemId == null) {
      throw new BadValuesError("ItemId cannot be empty!");
    }

    const user = WebSession.getUser(session);
    return await Trash.deleteForver(user, itemId);
  }

  @Router.post("/trash")
  async addItem(session: WebSessionDoc, item: string) {
    if (item == null) {
      throw new BadValuesError("Item cannot be empty!");
    }

    const user = WebSession.getUser(session);
    return await Trash.addItem(user, item);
  }
}

export default getExpressRouter(new Routes());
