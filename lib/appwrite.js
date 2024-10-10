import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';


export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.native.application',
    projectId: '66e983b30039a123a2a5',
    databaseId: '66e9858400311adc752a',
    userCollectionId: '66e985a5002948b17ffc',
    videoCollectionId: '66e985e00026c46b3c25',
    groupsCollectionId: '670651310004e04617e3',
    groupRequestCollectionId: '6706515b0037f73375ad',
    storageId: '66e9878900004a26c0de'
}

//const { endpoint, platform, projectId, databaseId, userCollectionId, videoCollectionId, storageId } = config;

// Init your React Native SDK
const client = new Client();


client
.setEndpoint(config.endpoint) 
.setProject(config.projectId) 
.setPlatform(config.platform);


const account = new Account(client);

const avatars = new Avatars(client);

const databases = new Databases(client);

// Register User
export const createUser = async (email, password, username) => {
    try {

    const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
    )

    if(!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password);

    const newUser = await databases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl
        }
    );
    return newUser;
        
    } catch (error) {
        throw new Error(error);
    }

}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export const getAllPost = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId
        )
    return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getLatestPost = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
    return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search('title', query)]
        )
    return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.equal('users', userId)]
        )
    return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

    return session;
    } catch (error) {
        
    }
}

export { client, databases, ID }