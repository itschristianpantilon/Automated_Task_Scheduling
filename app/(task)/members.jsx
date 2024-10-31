import { View, Text, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MemberContainer from '../../components/MemberContainer'
import MemberRequest from '../../components/MemberRequest'
import { acceptJoinRequest, config, databases, getPendingRequests, listPendingRequests } from '../../lib/appwrite'
import { useTask } from '../../context/TaskContext'

const members = () => {

  // Render list of pending requests
// const renderPendingRequests = async () => {
//   const requests = await listPendingRequests(taskId); // Fetch pending requests by taskId
//   return requests.map(request => (
//       <MemberRequest 
//           key={request.$id} 
//           request={request}
//           onAccept={() => handleAcceptRequest(request.$id, request.userId)}
//       />
//   ));
// };

// // Handle accepting a join request
// const handleAcceptRequest = async (requestId, userId) => {
//   try {
//       await acceptJoinRequest(requestId, taskId, userId);
//       Alert.alert("Request Accepted", "Member has been added to the task.");
//   } catch (error) {
//       console.error("Failed to accept request:", error);
//   }
// };

// const renderAcceptedMembers = async () => {
//   // Fetch all users with the current task in their 'tasks' list
//   const members = await databases.listDocuments(
//       config.databaseId,
//       config.userCollectionId,
//       [Query.search('tasks', taskId)]
//   );
//   return members.documents.map(member => (
//       <MemberContainer key={member.$id} member={member} />
//   ));
// };
    const { taskId } = useTask();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [members, setMembers] = useState([]);

  //   useEffect(() => {
  //     console.log("Fetching pending requests for taskId:", taskId);
  //     if (!taskId) {
  //       console.error("Error: taskId is undefined");
  //       setPendingRequests([]);
  //       return;
  //     }
  //     const fetchPendingRequests = async () => {
  //         try {
  //             const requests = await getPendingRequests(taskId);
  //             setPendingRequests(Array.isArray(requests) ? requests : []);
  //         } catch (error) {
  //             console.error('Failed to fetch pending requests:', error);
  //             setPendingRequests([]);
  //         }
  //     };
      
  //     fetchPendingRequests();
    
  // }, [taskId]);

  useEffect(() => {
    if (!taskId) {
        console.warn("No taskId provided to Members component.");
        return;
    }

    // Fetches pending join requests for the task
    const fetchPendingRequests = async () => {
        try {
            const requests = await getPendingRequests(taskId);
            setPendingRequests(Array.isArray(requests) ? requests : []);
        } catch (error) {
            console.error('Failed to fetch pending requests:', error);
            setPendingRequests([]);
        }
    };

    // Fetches members for the task by taskId
    const fetchMembers = async () => {
        try {
            const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);
            setMembers(task.members || []); // Ensuring members is an array
        } catch (error) {
            console.error('Failed to fetch members:', error);
        }
    };

    fetchPendingRequests();
    fetchMembers();
}, [taskId]);

  // const handleAcceptRequest = async (requestId, requesterId) => {
  //     try {
  //         await acceptJoinRequest(requestId, taskId, requesterId);
  //         Alert.alert('Accepted', 'Member added successfully.');
  //         setPendingRequests(pendingRequests.filter((req) => req.$id !== requestId));
  //     } catch (error) {
  //         console.error('Failed to accept request:', error);
  //     }
  // };

  // Accepts a member request and updates lists
//   const handleAcceptRequest = async (requestId, requesterId) => {
//     try {
//         const updatedMembers = await acceptJoinRequest(requestId, taskId, requesterId);
//         Alert.alert('Accepted', 'Member added successfully.');
//         setPendingRequests((prev) => prev.filter((req) => req.$id !== requestId));
//         setMembers(updatedMembers); // Assuming acceptJoinRequest returns the updated members list
//     } catch (error) {
//         console.error('Failed to accept request:', error);
//     }
// };

const handleAcceptRequest = async (requestId, requesterId) => {
  try {
      const updatedMembers = await acceptJoinRequest(requestId, taskId, requesterId);
      Alert.alert('Accepted', 'Member added successfully.');
      setPendingRequests(pendingRequests.filter((req) => req.$id !== requestId));
      setMembers(updatedMembers); // Update the member list with the new members array
  } catch (error) {
      console.error('Failed to accept request:', error);
      Alert.alert('Error', 'Failed to accept join request.');
  }
};



  return (
    <SafeAreaView className="bg-white p-4">
      <View>
        <Text className="text-lg font-medium pb-1 mb-2 border-b border-b-gray-400">Members</Text>
        <ScrollView className="h-[40vh] overflow-y-hidden overflow-scroll">
        {/* {members.map((member) => (
                    <MemberContainer key={member.$id} member={member} />
                ))} */}

                {members.length > 0 ? (
                    members.map((member, index) => (
                        <MemberContainer key={`${member.id}-${index}`} member={member} />
                    ))
                ) : (
                    <Text>No members yet.</Text>
                )}
        </ScrollView>

        <Text className="text-lg font-medium pb-1 mb-2 border-b border-b-gray-400">Member Request (2)</Text>
        <ScrollView className="h-[40vh] overflow-y-hidden overflow-scroll">
        {/* {pendingRequests.map((request) => (
                    <MemberRequest
                        key={request.$id}
                        request={request}
                        onAccept={() => handleAcceptRequest(request.$id, request.requesterId)}
                    />
                ))} */}

              {pendingRequests.length > 0 ? (
                    pendingRequests.map((request) => (
                        <MemberRequest
                            key={request.$id}
                            request={request}
                            onAccept={() => handleAcceptRequest(request.$id, request.requesterId)}
                        />
                    ))
                ) : (
                    <Text>No pending requests.</Text>
                )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default members