import { View, Text, ScrollView, Alert, Image, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MemberContainer from '../../components/MemberContainer'
import MemberRequest from '../../components/MemberRequest'
import { acceptJoinRequest, config, databases, getPendingRequests, listPendingRequests, rejectJoinRequest } from '../../lib/appwrite'
import { useTask } from '../../context/TaskContext'
import { icons, images } from '../../constants'
import { useNavigation } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import EmptyContent from '../../components/EmptyContent'
import { useGlobalContext } from '../../context/GlobalProvider'
import { useAppwrite } from '../../context/AppwriteClient'

const members = () => {

    const { user } = useGlobalContext();
    const { taskId } = useTask();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [members, setMembers] = useState([]);
    const navigation = useNavigation();
    const [isCreator, setIsCreator] = useState(false);

    const [task, setTask] = useState(null);
    const { database } = useAppwrite();
    const [refreshing, setRefreshing] = useState(false);
   
  
    const fetchTask = async () => {
      if (!taskId) return;
    
      try {
        const response = await database.getDocument('670e0a0e002e9b302a34', '6711f75c00201eca940c', taskId);
        setTask(response);
                
        if (!isCreator && response.userId === user?.$id) {
          setIsCreator(true);
        }
  
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };
    
    useEffect(() => {
        fetchTask();
    }, [taskId, user?.$id]);


    const fetchPendingRequests = async () => {
        try {
            const requests = await getPendingRequests(taskId);
            setPendingRequests(Array.isArray(requests) ? requests : []);
        } catch (error) {
            console.error('Failed to fetch pending requests:', error);
            setPendingRequests([]);
        }
    };

    const fetchMemberDetails = async (memberIds) => {
        try {
            const memberDetails = await Promise.all(
                memberIds.map((id) => databases.getDocument(config.databaseId, config.userCollectionId, id))
            );
            setMembers(memberDetails);
        } catch (error) {
            console.error('Failed to fetch member details:', error);
        }
    };

    const fetchMembers = async () => {
        try {
            const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);
            const memberIds = task.members || []; // Assuming `task.members` is an array of IDs
            fetchMemberDetails(memberIds); // Fetch full details of each member
          
      
        } catch (error) {
            console.error('Failed to fetch members:', error);
        }
    };
    
  useEffect(() => {
    if (!taskId) {
        console.warn("No taskId provided to Members component.");
        return;
    }

    // Fetches pending join requests for the task
    // const fetchPendingRequests = async () => {
    //     try {
    //         const requests = await getPendingRequests(taskId);
    //         setPendingRequests(Array.isArray(requests) ? requests : []);
    //     } catch (error) {
    //         console.error('Failed to fetch pending requests:', error);
    //         setPendingRequests([]);
    //     }
    // };

  
//     const fetchMemberDetails = async (memberIds) => {
//       try {
//           const memberDetails = await Promise.all(
//               memberIds.map((id) => databases.getDocument(config.databaseId, config.userCollectionId, id))
//           );
//           setMembers(memberDetails);
//       } catch (error) {
//           console.error('Failed to fetch member details:', error);
//       }
//   };

  // Fetches members for the task by taskId
//   const fetchMembers = async () => {
//       try {
//           const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);
//           const memberIds = task.members || []; // Assuming `task.members` is an array of IDs
//           fetchMemberDetails(memberIds); // Fetch full details of each member
        
    
//       } catch (error) {
//           console.error('Failed to fetch members:', error);
//       }
//   };

    fetchPendingRequests();
    fetchMembers();
}, [taskId]);

  
const handleAcceptRequest = async (requestId, requesterId) => {
  try {
      
      const joinRequest = await databases.getDocument(config.databaseId, config.joinRequestCollectionId, requestId);

      
      const { username, avatar } = joinRequest;
      if (!username || !avatar) {
          throw new Error('Join request is missing required fields: username or avatar.');
      }

      
      const updatedMembers = await acceptJoinRequest(requestId, taskId, requesterId, username, avatar);
      
      
      Alert.alert('Accepted', 'Member added successfully.');
      setPendingRequests((prevRequests) => prevRequests.filter((req) => req.$id !== requestId));
      setMembers(updatedMembers); 
  } catch (error) {
      console.error('Failed to accept request:', error);
      Alert.alert('Error', 'Failed to accept join request.');
  }
};

const handleRejectRequest = async (requestId) => {
    try {
        await rejectJoinRequest(requestId);
        
        
        setPendingRequests((prevRequests) => prevRequests.filter((req) => req.$id !== requestId));

        Alert.alert('Rejected', 'The join request has been rejected.');
    } catch (error) {
        console.error('Failed to reject request:', error);
        Alert.alert('Error', 'Failed to reject join request.');
    }
};

const handleRemoveMember = async (memberId) => {
    try {
        // Fetch the current task document from the database
        const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);

        // Ensure that members is an array and that the memberId exists in the array
        if (task.members && Array.isArray(task.members)) {
            // Filter out the memberId from the members array
            const updatedMembers = task.members.filter((member) => member !== memberId);
            
            // Only update the task if the members array has been modified
            if (updatedMembers.length !== task.members.length) {
                // Update the task document with the new members array
                await databases.updateDocument(config.databaseId, config.taskCollectionId, taskId, {
                    members: updatedMembers, // Provide the updated list of member IDs
                });

                // Update the local state (members list)
                setMembers((prevMembers) => prevMembers.filter((member) => member.$id !== memberId));

                Alert.alert('Removed', 'The member has been removed from the task.');
            } else {
                Alert.alert('Error', 'Member not found in the task.');
            }
        } else {
            console.error('Invalid members array structure in task document');
            Alert.alert('Error', 'Failed to retrieve members for the task.');
        }
    } catch (error) {
        console.error('Failed to remove member:', error);
        Alert.alert('Error', 'Failed to remove member.');
    }
};



    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchTask();
        await fetchPendingRequests();
        await fetchMembers();
        setRefreshing(false);
    }, [taskId]);


  return (
    <SafeAreaView className="bg-white h-full">
    <View className="px-4 flex-row items-center ">
        <TouchableOpacity className='' onPress={() => navigation.goBack()}>
            <Image 
                source={icons.back}
                className="w-7 h-7"
                resizeMode='contain'
            />
        </TouchableOpacity>
    </View>

      <View className='p-4'>

        <View>
            <Text className="text-lg font-medium pb-1 mb-2 border-b border-b-gray-400">Members <Text>(</Text>{members.length}<Text>)</Text></Text>
            <ScrollView 
                className={`h-[40vh] overflow-y-hidden overflow-scroll ${task?.userId !== user?.$id ? 'h-[78vh]' : ''}`}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >

                    {members.length > 0 ? (
                        members.map((member, index) => (
                            <MemberContainer 
                            key={`${member.id}-${index}`} 
                            username={member.username}
                            userAvatar={member.avatar}
                            icon={icons.remove}
                            isCreator={member.isCreator}
                            isCurrentUserCreator={isCreator}
                            onPress={() => handleRemoveMember(member.$id)}
                            LeaderOrMember={task?.userId === member.$id ? 'Leader' : 'Member'}
                            isHidden={task?.userId === member.$id ? 'hidden' : ''}
                            />
                        ))
                    ) : (
                        <Text>No members yet.</Text>
                    )}
            </ScrollView>
        </View>
        
        <View className={`${task?.userId !== user?.$id ? 'hidden' : ''}`}>

            <Text className="text-lg font-medium pb-1 mb-2 border-b border-b-gray-400">Member Request <Text>(</Text>{pendingRequests.length}<Text>)</Text></Text>
        
                {pendingRequests.length > 0 ? (
                    <ScrollView 
                        className={`h-[40vh] overflow-y-hidden overflow-scroll`} 
                        refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                    {pendingRequests.map((request) => (
                            <MemberRequest
                                key={request.$id}
                                request={request}
                                onAccept={() => handleAcceptRequest(request.$id, request.requesterId)}
                                onReject={() => handleRejectRequest(request.$id)}
                            />
                        ))}
                    </ScrollView>
                    ) : (
                        <View className='w-full h-[40vh] items-center justify-center'>
                            <EmptyContent 
                                description="No Pending Request!!"
                                image={icons.noPending}
                                textContainer='bg-white p-0'
                                containerStyle='bg-white p-0'
                            />
                        </View>
                    )}
                    
        </View>
      </View>
    </SafeAreaView>
  )
}

export default members