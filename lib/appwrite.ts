import { Easing } from "react-native";
import { Client, Account, ID, Avatars, Databases, Query } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "669e4ab7001938457059",
  databaseId: "669e4c050007515ddc21",
  userCollectionId: "669e4c36003ca932b369",
  videoCollectionId: "669e4c67002b1ca933e0",
  storageId: "669e4e90002dc5af66d1",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

type User = {
  email: string;
  password: string;
  username?: string;
};

export const createUser = async ({ email, password, username }: User) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);
    await signIn({ email, password });
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};

export const signIn = async ({ email, password }: User) => {
  try {
    const newSession = await account.createEmailPasswordSession(email, password);
    return newSession;

  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      throw err;
    }
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(config.databaseId, config.userCollectionId, [
      Query.equal("accountId", currentAccount.$id),
    ]);

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
  }
};

export const getAllPost = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);

    return posts.documents;
  } catch (e) {
    if (e instanceof Error) {
      throw e.message;
    }
  }
};

export const getLatestPost = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(3),
    ]);

    return posts.documents;
  } catch (e) {
    if (e instanceof Error) {
      throw e.message;
    }
  }
};

export const searchPost = async (query: string | string[] | undefined) => {
  if (typeof query !== "string") throw "input value must typeof string";
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);

    return posts.documents;
  } catch (e) {
    if (e instanceof Error) {
      throw e.message;
    }
  }
};

export const getUserPost = async (userId: string) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
    ]);
    return posts.documents;
  } catch (e) {
    if (e instanceof Error) {
      throw e.message;
    }
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (e) {
    if (e instanceof Error) {
      throw e.message;
    }
  }
};
