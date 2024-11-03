import { View, Text, ScrollView, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MemberContainer from '../../components/MemberContainer'
import MemberRequest from '../../components/MemberRequest'
import { acceptJoinRequest, config, databases, getPendingRequests, listPendingRequests } from '../../lib/appwrite'
import { useTask } from '../../context/TaskContext'
import { icons, images } from '../../constants'
import { useNavigation } from 'expo-router'
import { TouchableOpacity } from 'react-native'

const members = () => {


    const { taskId } = useTask();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [members, setMembers] = useState([]);
    const navigation = useNavigation();


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

  // Fetches members for the task by taskId
  const fetchMembers = async () => {
      try {
          const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);
          const memberIds = task.members || []; // Assuming `task.members` is an array of IDs
          fetchMemberDetails(memberIds); // Fetch full details of each member
      } catch (error) {
          console.error('Failed to fetch members:', error);
      }
  };

    fetchPendingRequests();
    fetchMembers();
}, [taskId]);

  
const handleAcceptRequest = async (requestId, requesterId) => {
  try {
      // Fetch the join request to get additional user details like username and avatar
      const joinRequest = await databases.getDocument(config.databaseId, config.joinRequestCollectionId, requestId);

      // Extract username and avatar and validate they exist
      const { username, avatar } = joinRequest;
      if (!username || !avatar) {
          throw new Error('Join request is missing required fields: username or avatar.');
      }

      // Accept the join request, adding the member to the task
      const updatedMembers = await acceptJoinRequest(requestId, taskId, requesterId, username, avatar);
      
      // Show success alert and update members state to reflect new member
      Alert.alert('Accepted', 'Member added successfully.');
      setPendingRequests((prevRequests) => prevRequests.filter((req) => req.$id !== requestId));
      setMembers(updatedMembers); // Ensure `updatedMembers` is the updated array of members
  } catch (error) {
      console.error('Failed to accept request:', error);
      Alert.alert('Error', 'Failed to accept join request.');
  }
};




  return (
    <SafeAreaView className="bg-white">
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
        <Text className="text-lg font-medium pb-1 mb-2 border-b border-b-gray-400">Members <Text>(</Text>{members.length}<Text>)</Text></Text>
        <ScrollView className="h-[40vh] overflow-y-hidden overflow-scroll">

                {members.length > 0 ? (
                    members.map((member, index) => (
                        <MemberContainer 
                          key={`${member.id}-${index}`} 
                          username={member.username}
                          userAvatar={member.avatar}
                          />
                    ))
                ) : (
                    <Text>No members yet.</Text>
                )}
        </ScrollView>

        <Text className="text-lg font-medium pb-1 mb-2 border-b border-b-gray-400">Member Request <Text>(</Text>{pendingRequests.length}<Text>)</Text></Text>
        <ScrollView className="h-[40vh] overflow-y-hidden overflow-scroll">
    
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