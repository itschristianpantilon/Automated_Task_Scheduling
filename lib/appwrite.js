import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Account, Avatars, Client, Databases, ID, Query, Teams, Storage, Permission, Role } from 'react-native-appwrite';



export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.automated.task',
    projectId: '670e0976002111dc44a6',
    databaseId: '670e0a0e002e9b302a34',
    userCollectionId: '670e0a5200195e36465e',
    taskCollectionId: '6711f75c00201eca940c',
    soloTaskListCollectionId: '6729e342001e7f976939',
    groupAssignedTasksCollectionId: '672b11e9002b7c18ee2e',
    joinRequestCollectionId: '6721edc10009b6e67961',
    commentCollectionId: '672da96400279f49e58d',
    storageId: '6736f68a000406e4d522',
    submitCollectionId: '673c36a800138b7d85ee',
    fileCollectionId: '673c43ec002f9d60e013',
    apiEndpoint: 'standard_266018e451494edff59805d0c0a5c433264a1b7f0c8e8c0a1657881dca1e1f069a77bbc6404c4c2324ca040c5d6f5a3744126392233405f7626b97b9604b0830e1e8bafa6ccbaee4c5984e19e0b10ec35667198048b04083bc8d14e25c8e53f8edc23d3fc7d5a0f711d9f6884c87806a9414418e812982f80be2340e6de7368a'
}



// Init your React Native SDK

const client = new Client();


client
.setEndpoint(config.endpoint) 
.setProject("670e0976002111dc44a6") 
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

export const updateUsername = async (userId, username) => {
    try {
      
      // Update the user profile with the new avatar URL (if available)
      const updatedUser = await databases.updateDocument(
        config.databaseId,
        config.userCollectionId,
        userId,
        { username },
        [
            Permission.read(Role.users()),          // Allows read access to all authenticated users
            Permission.write(Role.user(userId))   // Allows only the member to write
        ]
      );
  
      return updatedUser;
    } catch (error) {
      console.error("Failed to update profile or upload avatar appwrite:", error);
      
      throw error;
    }
}

// export const uploadFile = async (file, memberId) => {
//     if (!file) {
//         throw new Error("No file selected. Please select a file to upload.");
//     }
//     if (!memberId) {
//         throw new Error("User ID is missing. Cannot set write permissions.");
//     }

//     try {
//         const response = await storage.createFile(
//             config.storageId,
//             ID.unique(),
//             file,
//             [
//                 Permission.read(Role.users()),          // Allows read access to all authenticated users
//                 Permission.write(Role.user(memberId))   // Allows only the member to write
//             ]
//         );

//         return response;
//     } catch (error) {
//        console.error('Detailed file upload error appwrite:', error); // Log the full error
//        throw new Error('Failed to upload file appwrite: ' + (error.message || 'Unknown error'));
//     }
// };

export const uploadFile = async (file, type) => {
    if(!file) return;

    
    const asset = { 
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
     };

    console.log('file', file)

    try {
        const uploadedImage = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        )
        // const fileUrl = await getFilePreview(uploadedImage.$id, type);

        // return fileUrl;
        return uploadedImage;
    } catch (error) {
        throw new Error(error);
    }
}

export const submitFile = async (file, form, userId) => {
        if(!file) return;


        const asset = { 
            name: file.fileName,
            type: file.mimeType,
            size: file.fileSize,
            uri: file.uri,
        };

        console.log('file', file)

    try {

        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        )
        // const fileUrl = await getFilePreview(uploadedFile.$id, type);

        // return fileUrl;
        return uploadedFile;

        
        
    } catch (error) {
        throw new Error(error);
    }
}

export const updateProfile = async (form, userId, username) => {
    try {
        const [ imageUrl ] = await Promise.all([
            uploadImage(form.image, 'image')
        ])

         const currentUser = await getCurrentUser();
         if (!currentUser || !currentUser.$id) {
             throw new Error("User session is invalid or user is not logged in.");
         }

        const profileUpdate = await databases.updateDocument(
            config.databaseId,
            config.userCollectionId,
            userId,
            {
                username,
                avatar: imageUrl
            },

        )
        return profileUpdate;
    } catch (error) {
        throw new Error(error);
    }
}



export const uploadImage = async (file, type) => {
    if(!file) return;

    
    const asset = { 
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
     };

    console.log('file', file)

    try {
        const uploadedImage = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        )
        const fileUrl = await getFilePreview(uploadedImage.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const getFilePreview = async (fileId) => {
    let fileUrl;

    try {
        fileUrl = storage.getFileView(config.storageId, fileId)

        if(!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
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

        const allRequests = await databases.listDocuments(
            config.databaseId,
            config.joinRequestCollectionId,
            [
                Query.equal('taskId', taskId),
                Query.equal('requesterId', currentUser.$id),
            ]
        );

        // Check for any request with status 'pending' or 'accepted'
        const hasExistingRequest = allRequests.documents.some(
            (request) => request.status === 'pending' || request.status === 'accepted'
        );

        if (hasExistingRequest) {
            throw new Error('You already have a pending or accepted request for this task.');
        }

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
        // Handle specific error without console logging
        if (error.message === 'You already have a pending or accepted request for this task.') {
            throw error; // This allows the error to be caught and handled in handleJoinRequest for a user-friendly alert
        }
        // Throw a more generic error if needed
        throw new Error('Failed to send join request.');
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

export const rejectJoinRequest = async (requestId) => {
    try {
        // Update the join request status to 'rejected'
        await databases.updateDocument(
            config.databaseId,
            config.joinRequestCollectionId,
            requestId,
            { status: 'rejected' }
        );
        return true;
    } catch (error) {
        console.error('Failed to reject join request:', error);
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

// export const uploadFile = async (file, memberId) => {

//     if (!file) {
//         throw new Error("No file selected. Please select a file to upload.");
//     }
//     if (!memberId) {
//         throw new Error("User ID is missing. Cannot set write permissions.");
//     }


//     try {
//         const response = await storage.createFile(
//             config.storageId,
//             ID.unique(),
//             file,
//             // [
//             //     Permission.read(Role.users()),   // Allows read access to all authenticated users
//             //     Permission.write(Role.user(memberId))  // Allows only the member to write
//             // ]
//         );
//         return response;
//     } catch (error) {
//         throw new Error('Failed to upload file');
//     }
// };



export const addComment = async (taskId, userId, username, commentText, avatar, memberId, assignedTaskId) => {
    // Validate required parameters
    if (!userId) throw new Error("User ID is missing");
    if (!taskId) throw new Error("Task ID is missing");
    if (!memberId) throw new Error("Member ID is missing");

    try {
        // Create the comment entry in the comment collection (optional for tracking)
        const response = await databases.createDocument(
            config.databaseId,
            config.commentCollectionId,
            ID.unique(),
            {
                taskId,
                comment: commentText,
                userId,
                username,
                avatar,
                memberId,
                assignedTaskId
            }
        );


    } catch (error) {
        console.error('Error adding comment to Appwrite:', error);
        if (error.response) {
            console.error('Error response from Appwrite:', error.response);
        }
        throw new Error('Failed to add comment to Appwrite');
    }
};

export const getComments = async (assignedTaskId) => {
    try {
        const response = await databases.listDocuments(
            config.databaseId, 
            config.commentCollectionId, 
            [Query.equal("assignedTaskId", assignedTaskId)],
            
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

export const updateTaskStatus = async (taskId, newStatus) => {
    try {
        await databases.updateDocument(
            config.databaseId, 
            config.taskCollectionId, 
            taskId, 
            {
            status: newStatus,
            });
    } catch (error) {
        throw new Error('Failed to update task status');
    }
};


  export { client, account, databases, storage }

  