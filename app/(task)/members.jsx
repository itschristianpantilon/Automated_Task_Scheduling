import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MemberContainer from '../../components/MemberContainer'
import MemberRequest from '../../components/MemberRequest'
import { acceptJoinRequest, listPendingRequests } from '../../lib/appwrite'

const members = () => {

  // Render list of pending requests
const renderPendingRequests = async () => {
  const requests = await listPendingRequests(taskId); // Fetch pending requests by taskId
  return requests.map(request => (
      <MemberRequest 
          key={request.$id} 
          request={request}
          onAccept={() => handleAcceptRequest(request.$id, request.userId)}
      />
  ));
};

// Handle accepting a join request
const handleAcceptRequest = async (requestId, userId) => {
  try {
      await acceptJoinRequest(requestId, taskId, userId);
      Alert.alert("Request Accepted", "Member has been added to the task.");
  } catch (error) {
      console.error("Failed to accept request:", error);
  }
};

const renderAcceptedMembers = async () => {
  // Fetch all users with the current task in their 'tasks' list
  const members = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.search('tasks', taskId)]
  );
  return members.documents.map(member => (
      <MemberContainer key={member.$id} member={member} />
  ));
};

  return (
    <SafeAreaView className="bg-white p-4">
      <View>
        <Text className="text-lg font-medium pb-1 mb-2 border-b border-b-gray-400">Members</Text>
        <ScrollView className="h-[40vh] overflow-y-hidden overflow-scroll">
          <MemberContainer />
          <MemberContainer />

        </ScrollView>

        <Text className="text-lg font-medium pb-1 mb-2 border-b border-b-gray-400">Member Request (2)</Text>
        <ScrollView className="h-[40vh] overflow-y-hidden overflow-scroll">
          
          <MemberRequest />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default members