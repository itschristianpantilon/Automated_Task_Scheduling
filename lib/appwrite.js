import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account, Avatars, Client, Databases, ID, Query, Teams, Permission, Role } from 'react-native-appwrite';



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
    storageId: '670e0b190028e05762ea'
}



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
            duration
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

        // Update `members` with only the requesterId
        // const updatedMembers = Array.isArray(task.members) ? [...task.members, requesterId] : [requesterId];
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

// export const assignTaskToMember = async (taskId, memberId, taskTitle) => {
//     try {
//         // Fetch the current task document
//         const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);

//         // Add the memberId to the task's member array if it doesn't already exist
//         const updatedMembers = Array.isArray(task.members) ? [...task.members, memberId] : [memberId];
        
//         // Update the task with the new member and task title
//         const updatedTask = await databases.updateDocument(
//             config.databaseId,
//             config.taskCollectionId,
//             taskId,
//             {
//                 members: updatedMembers,    // Add new member to task
//                 taskTitle: taskTitle,       // Set task title for the member
//             }
//         );

//         return updatedTask;
//     } catch (error) {
//         console.error("Failed to assign task to member:", error);
//         throw error;
//     }
// };

// export const assignTaskToMember = async (taskId, memberId, taskTitle) => {
//     try {
//       const currentUser = await getCurrentUser();
//       const creatorId = currentUser.$id;
  
//       // Create the assigned task in the groupAssignedTasksCollection
//       const assignedTask = await databases.createDocument(
//         config.databaseId,
//         config.groupAssignedTasksCollectionId,
//         ID.unique(),  // Unique ID for the assigned task
//         {
//           taskId: taskId,          // Link to the existing task
//           assignedBy: creatorId,   // Task creator's user ID
//           memberId: memberId,      // Member to whom the task is assigned
//           taskTitle,    // The title of the assigned task
//           status: 'pending'        // Initial status (could be pending, completed, etc.)
//         }
//       );
  
//       // Return the assigned task document
//       return assignedTask;
//     } catch (error) {
//       console.error('Failed to assign task:', error);
//       throw error;
//     }
//   };
// export const assignTaskToMember = async (taskId, memberId, taskTitle) => {
//     try {
//       const currentUser = await getCurrentUser();
//       const creatorId = currentUser.$id;
  
//       // Create the assigned task document in Appwrite
//       const assignedTask = await databases.createDocument(
//         config.databaseId,
//         config.groupAssignedTasksCollectionId,
//         ID.unique(),
//         {
//           taskId,                    // Link to the existing task
//           assignedBy: creatorId,     // ID of the creator
//           memberId,                  // ID of the assigned member
//           taskTitle,                 // Title of the task
//           status: 'Ongoing',         // Initial status
//         }
//       );
  
//       // Fetch the member details based on `memberId`
//       const member = await databases.getDocument(config.databaseId, config.userCollectionId, memberId);
//       const { username, avatar } = member; // Assuming `username` and `avatar` are fields in your user document
  
//       // Return the combined task assignment details
//       return {
//         ...assignedTask,  // Include the assigned task details from Appwrite
//         taskTitle,
//         memberId,
//         username,
//         avatar,
//         status: 'Ongoing',  // Set initial status or use the status returned from Appwrite
//       };
//     } catch (error) {
//       console.error('Failed to assign task:', error);
//       throw error;
//     }
//   };

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
  

  export { client, account, databases }

  