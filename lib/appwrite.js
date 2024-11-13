import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account, Avatars, Client, Databases, ID, Query, Teams, Storage } from 'react-native-appwrite';



export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.native.application',
    projectId: '670e0976002111dc44a6',
    databaseId: '670e0a0e002e9b302a34',
    userCollectionId: '670e0a5200195e36465e',
    taskCollectionId: '6711f75c00201eca940c',
    soloTaskListCollectionId: '6729e342001e7f976939',
    groupAssignedTasksCollectionId: '672b11e9002b7c18ee2e',
    joinRequestCollectionId: '6721edc10009b6e67961',
    commentCollectionId: '672da96400279f49e58d',
    storageId: '670e0b190028e05762ea',
    apiEndpoint: 'standard_266018e451494edff59805d0c0a5c433264a1b7f0c8e8c0a1657881dca1e1f069a77bbc6404c4c2324ca040c5d6f5a3744126392233405f7626b97b9604b0830e1e8bafa6ccbaee4c5984e19e0b10ec35667198048b04083bc8d14e25c8e53f8edc23d3fc7d5a0f711d9f6884c87806a9414418e812982f80be2340e6de7368a'
}



// Init your React Native SDK

const client = new Client();


client
.setEndpoint(config.endpoint) 
.setProject(config.projectId) 
.setPlatform(config.platform)


const account = new Account(client);

const avatars = new Avatars(client);

const databases = new Databases(client);

const storage = new Storage(client);

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

export const updateUserProfile = async (userId, newAvatarUri, username) => {
    try {
      let avatarUrl = null;
  
      // Only proceed with avatar upload if a new avatar is provided
      if (newAvatarUri) {
        // Fetch the image data and convert it to a Blob
        const response = await fetch(newAvatarUri);
        const blob = await response.blob(); // Convert the URI to a Blob object
  
        // Log the Blob to confirm it's being created
        console.log("Blob object created:", blob);
  
        // Generate a unique file ID
        const fileId = ID.unique();
  
        // Upload the Blob directly to Appwrite storage
        const file = await storage.createFile(
          config.storageId,
          fileId,
          blob,
          ["*"] // Set the permissions (if needed)
        );
  
        // Ensure file upload succeeded
        if (file && file.$id) {
          avatarUrl = storage.getFileView(config.storageId, file.$id).href;
          console.log("File uploaded successfully with URL:", avatarUrl);
        } else {
          console.error("File upload failed: Invalid file object.");
          throw new Error("File upload failed: Invalid file object.");
        }
      }
  
      // Update the user profile with the new avatar URL (if available)
      const updatedUser = await databases.updateDocument(
        config.databaseId,
        config.userCollectionId,
        userId,
        { username, avatar: avatarUrl }
      );
  
      return updatedUser;
    } catch (error) {
      console.error("Failed to update profile or upload avatar:", error);
      
      throw error;
    }
};
  
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

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

    return session;
    } catch (error) {
        
    }
}

export const createTask = async (title, taskType, deadline, duration, status ) => {


    try {
        let groupId = null;
        
    
        // If the task is of type 'group', generate a unique groupId and create a group
        if (taskType === 'group' && title) {
          groupId = ID.unique();  // Generate unique group ID
          //await teams.create(groupId, 'Task Group');  // Create the group in Appwrite with the generated ID

        } else if (taskType === 'solo' && title) {
            groupId = '';
        }

        const currentUser = await getCurrentUser();
        const userId = currentUser.$id;
    
        // Create the task document in Appwrite with groupId (null for solo tasks)
        const newTask = await databases.createDocument(
          config.databaseId,
          config.taskCollectionId,
          ID.unique(),  // Unique task ID
          {
            title,  // Task title
            type: taskType,  // Task type (solo or group)
            groupId: groupId,  // groupId will be null for solo tasks
            userId: userId,
            members: [userId],
            deadline,
            duration,
            status: 'Active'
          },

        );
    
        // Return the task details along with the generated groupId if it's a group task
        return newTask;

      } catch (error) {
        console.error('Failed to create task:', error);
        throw error;
      }
}

export const requestJoinTask = async (taskId) => {
    try {
        const currentUser = await getCurrentUser();
        const joinRequest = await databases.createDocument(
            config.databaseId,
            config.joinRequestCollectionId, // Replace with your collection ID for join requests
            ID.unique(),
            {
                taskId,
                requesterId: currentUser.$id,
                username: currentUser.username,
                avatar: currentUser.avatar,
                status: 'pending'
            }
        );
        return joinRequest;
    } catch (error) {
        console.error('Failed to request join:', error);
        throw error;
    }
};

export const acceptJoinRequest = async (requestId, taskId, requesterId) => {
    try {
        // Update join request status
        await databases.updateDocument(
            config.databaseId,
            config.joinRequestCollectionId,
            requestId,
            { 
                status: 'accepted',
                taskId,
                requesterId
            }
        );

        // Fetch the current task document to get existing member IDs
        const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);

       
        const updatedMembers = [...(task.members || []), requesterId];

        // Update the task document with the updated `members` array (IDs only)
        await databases.updateDocument(
            config.databaseId,
            config.taskCollectionId,
            taskId,
            { members: updatedMembers }
        );

        return updatedMembers;
    } catch (error) {
        console.error('Failed to accept join request:', error);
        throw error;
    }
};


export const getPendingRequests = async (taskId) => {
    try {
        const requests = await databases.listDocuments(
            config.databaseId,
            config.joinRequestCollectionId,
            [
                Query.equal('taskId', taskId), 
                Query.equal('status', 'pending')
            ]
        );
        return requests.documents;
    } catch (error) {
        console.error('Failed to fetch pending requests:', error);
    }
};

export const assignTaskToMember = async (taskId, memberId, taskTitle) => {
    try {
      const currentUser = await getCurrentUser();
      const creatorId = currentUser.$id;
  
      // Fetch member details before creating the document
      const member = await databases.getDocument(config.databaseId, config.userCollectionId, memberId);
      const { username, avatar } = member;
  
      // Create the assigned task document in Appwrite with all required fields
      const assignedTask = await databases.createDocument(
        config.databaseId,
        config.groupAssignedTasksCollectionId,
        ID.unique(),
        {
          taskId,
          assignedBy: creatorId,
          memberId,
          taskTitle,
          username,  // Save username to database
          avatar,    // Save avatar to database
          status: 'Ongoing'  // Initial status
        }
      );
  
      // Return the task data with the member info
      return {
        ...assignedTask,
        username,
        avatar,
        status: 'Ongoing'
      };
    } catch (error) {
      console.error('Failed to assign task:', error);
      throw error;
    }
};

export const uploadFile = async (file, memberId) => {

    if (!file) {
        throw new Error("No file selected. Please select a file to upload.");
    }
    if (!memberId) {
        throw new Error("User ID is missing. Cannot set write permissions.");
    }


    try {
        const response = await storage.createFile(
            config.storageId,
            ID.unique(),
            file,
            // [
            //     Permission.read(Role.users()),   // Allows read access to all authenticated users
            //     Permission.write(Role.user(memberId))  // Allows only the member to write
            // ]
        );
        return response;
    } catch (error) {
        throw new Error('Failed to upload file');
    }
};

export const addComment = async (taskId, userId, username, commentText, avatar, memberId) => {
    if (!userId || !taskId || !memberId) throw new Error("User or Task information is missing");

    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.commentCollectionId,
            ID.unique(),
            {
                taskId,
                comment: commentText,
                userId,
                username,  // Add username to the comment data
                avatar,
                memberId,
            }
        );
        console.log("Comment added successfully:", response);
    } catch (error) {
        console.error('Error adding comment appwrite:', error);
        if (error.response) {
            console.error('Error response from Appwrite:', error.response);
        }
        
        throw new Error('Failed to add comment appwrite');
    }
};

export const getComments = async (taskId) => {
    try {
        const response = await databases.listDocuments(
            config.databaseId, 
            config.commentCollectionId, 
            [Query.equal("taskId", taskId)],
            
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error; // re-throw the error to handle it in the component
    }
};


export const updateAssignedTaskStatus = async (assignedTaskId, newStatus) => {
    try {
        await databases.updateDocument(
            config.databaseId, 
            config.groupAssignedTasksCollectionId, 
            assignedTaskId, 
            {
            status: newStatus,
            });
    } catch (error) {
        throw new Error('Failed to update task status');
    }
};


  export { client, account, databases, storage }

  