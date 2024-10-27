import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account, Avatars, Client, Databases, ID, Query, Teams } from 'react-native-appwrite';



export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.native.application',
    projectId: '670e0976002111dc44a6',
    databaseId: '670e0a0e002e9b302a34',
    userCollectionId: '670e0a5200195e36465e',
    taskCollectionId: '6711f75c00201eca940c',
    storageId: '670e0b190028e05762ea'
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

const teams = new Teams(client);

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

export const createTask = async (title, taskType) => {


    try {
        let groupId = null;
    
        // If the task is of type 'group', generate a unique groupId and create a group
        if (taskType === 'group' && title) {
          groupId = ID.unique();  // Generate unique group ID
          await teams.create(groupId, 'Task Group');  // Create the group in Appwrite with the generated ID
        } else if (taskType === 'solo' && title) {
            groupId = '';
        }
    
        // Create the task document in Appwrite with groupId (null for solo tasks)
        const newTask = await databases.createDocument(
          config.databaseId,
          config.taskCollectionId,
          ID.unique(),  // Unique task ID
          {
            title,  // Task title
            type: taskType,  // Task type (solo or group)
            groupId: groupId,  // groupId will be null for solo tasks
          }
        );
    
        // Return the task details along with the generated groupId if it's a group task
        return newTask;

      } catch (error) {
        console.error('Failed to create task:', error);
        throw error;
      }
  }

  export const joinGroup = async (groupId) => {
    try {
      const teamMembership = await teams.createMembership(
        groupId, 
        'email@example.com', // Member's email
        ['member'], 
        'http://example.com/callback'
      );
      return teamMembership;
    } catch (error) {
      console.error(error);
    }
  };

  export const listGroupMembers = async (groupId) => {
    try {
      const members = await teams.list(groupId);
      return members;
    } catch (error) {
      console.error(error);
    }
  };

  