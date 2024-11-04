import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account, Avatars, Client, Databases, ID, Query, Teams, Permission, Role } from 'react-native-appwrite';



export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.native.application',
    projectId: '670e0976002111dc44a6',
    databaseId: '670e0a0e002e9b302a34',
    userCollectionId: '670e0a5200195e36465e',
    taskCollectionId: '6711f75c00201eca940c',
    joinRequestCollectionId: '6721edc10009b6e67961',
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



export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

    return session;
    } catch (error) {
        
    }
}

export const createTask = async (title, taskType, deadline, duration) => {


    try {
        let groupId = null;
        
    
        // If the task is of type 'group', generate a unique groupId and create a group
        if (taskType === 'group' && title) {
          groupId = ID.unique();  // Generate unique group ID
          await teams.create(groupId, 'Task Group');  // Create the group in Appwrite with the generated ID

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
            duration
          },
          //[Permission.read(Role.any()), Permission.update(Role.user(userId))]
        //   [
        //     Permission.read(Role.user(userId)),
        //     Permission.update(Role.user(userId)),
        //     Permission.delete(Role.user(userId)),
        //     Permission.read(Role.any()),
        //     Permission.create(Role.any()),
        //     ]
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

// export const acceptJoinRequest = async (requestId, taskId, requesterId, username, avatar) => {
//     // Validate inputs
//     if (!requestId || !taskId || !requesterId) {
//         throw new Error('One or more required parameters are undefined: requestId, taskId, requesterId.');
//     }

//     try {
//         // Update join request status
//         await databases.updateDocument(
//             config.databaseId,
//             config.joinRequestCollectionId, // Replace with your join requests collection ID
//             requestId,
//             { 
//                 status: 'accepted',
//                 taskId,
//                 requesterId, // Correctly include requesterId
//                 username,
//                 avatar
//             }
//         );

//         // Fetch the current task to get the existing members
//         const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);
        
//         // Ensure task.members exists and is an array before updating
//         const updatedMembers = Array.isArray(task.members) ? [...task.members, requesterId, username, avatar] : [{requesterId, username, avatar}];

//         await databases.updateDocument(
//             config.databaseId,
//             config.taskCollectionId,
//             taskId,
//             { members: updatedMembers }
//         );

//         return updatedMembers; // Return updated members list or just true as needed
//     } catch (error) {
//         console.error('Failed to accept join request:', error);
//         throw error; // Rethrow error to allow handling in the calling function
//     }
// };

// export const acceptJoinRequest = async (requestId, taskId, requesterId) => {
//     try {
//         // Update join request status
//         await databases.updateDocument(
//             config.databaseId,
//             config.joinRequestCollectionId, // Replace with your join requests collection ID
//             requestId,
//             { status: 'accepted',
//                 taskId,
//                 requestId
//              }
//         );

//         // Add the user to the task's member list
//         const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);
//         const updatedMembers = [...task.members, requesterId];

//         await databases.updateDocument(
//             config.databaseId,
//             config.taskCollectionId,
//             taskId,
//             { members: updatedMembers }
//         );

//         return true;
//     } catch (error) {
//         console.error('Failed to accept join request:', error);
//         throw error;
//     }
// };

// Get pending join requests for the task creator

// export const acceptJoinRequest = async (requestId, taskId, requesterId, username, avatar) => {
//     // Validate inputs
//     if (!requestId || !taskId || !requesterId || !username || !avatar) {
//         throw new Error('One or more required parameters are undefined: requestId, taskId, requesterId, username, avatar.');
//     }

//     try {
//         // Update join request status to 'accepted'
//         await databases.updateDocument(
//             config.databaseId,
//             config.joinRequestCollectionId,
//             requestId,
//             { 
//                 status: 'accepted',
//                 taskId,
//                 requesterId,
//                 username,
//                 avatar
//             }
//         );

//         // Fetch the current task document to get the existing members list
//         const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);
        
//         // Ensure `members` is an array of objects with correct structure before updating
//         const updatedMembers = Array.isArray(task.members) ? [...task.members, { requesterId, username, avatar }] : [{ requesterId, username, avatar }];

//         // Update the task document with the new `members` array
//         await databases.updateDocument(
//             config.databaseId,
//             config.taskCollectionId,
//             taskId,
//             { members: updatedMembers }
//         );

//         return updatedMembers; // Return the updated members list
//     } catch (error) {
//         console.error('Failed to accept join request:', error);
//         throw error; // Rethrow error to allow handling in the calling function
//     }
// };

// export const acceptJoinRequest = async (requestId, taskId, requesterId, username, avatar) => {
//     // Validate inputs
//     if (!requestId || !taskId || !requesterId) {
//         throw new Error('One or more required parameters are undefined: requestId, taskId, requesterId.');
//     }

//     try {
//         // Update join request status
//         await databases.updateDocument(
//             config.databaseId,
//             config.joinRequestCollectionId, // Replace with your join requests collection ID
//             requestId,
//             { status: 'accepted' }
//         );

//         // Fetch the current task to get the existing members
//         const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);
        
//         // Ensure task.members exists and is an array, and add requesterId as a string
//         const updatedMembers = Array.isArray(task.members)
//             ? [...task.members, { requesterId, username, avatar }]
//             : [{ requesterId, username, avatar }];

//         await databases.updateDocument(
//             config.databaseId,
//             config.taskCollectionId,
//             taskId,
//             { members: updatedMembers }
//         );

//         return updatedMembers;
//     } catch (error) {
//         console.error('Failed to accept join request:', error);
//         throw error;
//     }
// };


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

        // Update `members` with only the requesterId
        const updatedMembers = Array.isArray(task.members) ? [...task.members, requesterId] : [requesterId];

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



//   export const joinGroup = async (taskId, userId) => {
//     try {
//         // Store join requests in a separate collection, e.g., "JoinRequests"
//         const joinRequest = await databases.createDocument(
//             config.databaseId,
//             'JoinRequests', // This is a separate collection for handling requests
//             ID.unique(),
//             {
//                 taskId: taskId, // Reference to the task document ID
//                 userId: userId, // ID of the user requesting to join
//                 status: 'pending' // Set initial status to pending
//             }
//         );
//         return joinRequest;
//     } catch (error) {
//         console.error("Failed to send join request:", error);
//     }
// };

// // Fetch all pending join requests for a given task
// export const listPendingRequests = async (taskId) => {
//     try {
//         const requests = await databases.listDocuments(
//             config.databaseId,
//             'JoinRequests',
//             [Query.equal('taskId', taskId), Query.equal('status', 'pending')]
//         );
//         return requests.documents;
//     } catch (error) {
//         console.error("Failed to fetch pending requests:", error);
//     }
// };

// // Accept a join request, changing the status to 'accepted' and linking to the task
// export const acceptJoinRequest = async (requestId, taskId, userId) => {
//     try {
//         // Update the join request document's status to "accepted"
//         await databases.updateDocument(
//             config.databaseId,
//             'JoinRequests',
//             requestId,
//             { status: 'accepted' }
//         );

//         // Create relationship in user collection for task assignment
//         await databases.updateDocument(
//             config.databaseId,
//             config.userCollectionId,
//             userId,
//             {
//                 tasks: Query.push(taskId) // Update with relationship to task
//             }
//         );
//     } catch (error) {
//         console.error("Failed to accept join request:", error);
//     }
// };

//   export const listGroupMembers = async (groupId) => {
//     try {
//       const members = await teams.list(groupId);
//       return members;
//     } catch (error) {
//       console.error(error);
//     }
//   };

  export { client, account, databases }

  