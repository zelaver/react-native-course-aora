import { Easing } from "react-native";
import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
  ImageGravity,
} from "react-native-appwrite";

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
const storage = new Storage(client);

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

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, ImageGravity.Top, 100);
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (e) {
    if (e instanceof Error) {
      throw e.message;
    }
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(storageId, ID.unique(), asset);

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl
  } catch (e) {
    if (e instanceof Error) {
      throw e.message;
    }
  }
};

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);
    
  

    const newPost = await databases.createDocument(databaseId, videoCollectionId, ID.unique(), {
      title: form.title,
      video: videoUrl,
      thumbnail: thumbnailUrl,
      prompt: form.prompt,
      creator: form.userId,
    });
    console.log(form.userId)
    return newPost;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message)
    }
  }
};
