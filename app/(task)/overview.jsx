import { View, Text, Image, Alert, ToastAndroid, Platform, FlatList, ScrollView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { assignTaskToMember, config, createTask, databases } from '../../lib/appwrite'
import { TouchableOpacity } from 'react-native'
import { icons, images } from '../../constants'
import { router, useNavigation } from 'expo-router'
import { useAppwrite } from '../../context/AppwriteClient'
import { useTask } from '../../context/TaskContext'
import { useRoute } from '@react-navigation/native'
import PopUpMenu from '../../components/PopUpMenu'
import * as Progress from 'react-native-progress';
import * as Clipboard from 'expo-clipboard';
import CustomButton from '../../components/CustomButton'
import OverviewCard from '../../components/OverviewCard'
import MemberContainer from '../../components/MemberContainer';
import CustomInput from '../../components/CustomInput'
import { useGlobalContext } from '../../context/GlobalProvider'
import { ID, Query } from 'react-native-appwrite'
import EmptyContent from '../../components/EmptyContent'
import SubmitForm from '../../components/SubmitForm'


const overview = () => {
  const { user } = useGlobalContext();
  const navigation = useNavigation();
  const route = useRoute();
  const { title, taskType, groupId } = route.params || {};
  const { taskId } = useTask(); // Get taskId from context
  const [task, setTask] = useState(null);
  const { database } = useAppwrite();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [assignTask, setAssignTask] = useState(false)
  const [members, setMembers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [assignTaskTitle, setAssignTaskTitle] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);


//Fetch Task
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

  //Fetch Members
useEffect(() => {
  const cleanMemberData = (member) => ({
      id: String(member.$id), // Convert member's ID to a string
      username: member.username,
      avatar: member.avatar,
  });
  const fetchMemberDetails = async (memberIds) => {
      try {
          const memberDetails = await Promise.all(
              memberIds.map((id) =>
                  databases.getDocument(config.databaseId, config.userCollectionId, String(id))
              )
          );
          // Clean up the member data
          const cleanedMembers = memberDetails.map(cleanMemberData);
          setMembers(cleanedMembers);

          // Log members with full details
          //console.log('Members', cleanedMembers);
      } catch (error) {
          console.error('Failed to fetch member details:', error);
      }
  };
  // New function to fetch only member IDs as an array of strings
  const fetchMemberIdsOnly = async () => {
      try {
          const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);
          const memberIds = (task.members || []).map(String); // Convert each ID to a string
          //console.log('Member IDs', memberIds); // Log only the array of IDs as strings
      } catch (error) {
          console.error('Failed to fetch member IDs:', error);
      }
  };
  // Fetches members with full details for the task by taskId
  const fetchMembers = async () => {
      try {
          const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);
          const memberIds = (task.members || []).map(String); // Convert each ID to a string
          fetchMemberDetails(memberIds); // Fetch full details of each member
          fetchMemberIdsOnly(); // Fetch only IDs as strings
      } catch (error) {
          console.error('Failed to fetch members:', error);
      }
  };

  fetchMembers();
}, [taskId]);

  //Fetch Assign Task
  const fetchAssignedTasks = async () => {
    try {
      const response = await database.listDocuments(
        config.databaseId,
        config.groupAssignedTasksCollectionId,
        [Query.equal("taskId", taskId)]
      );

      // Map response to ensure each task has all needed fields
      const tasksWithDetails = response.documents.map(task => ({
        ...task,
        username: task.username || '',  // Ensure username is present
        avatar: task.avatar || '',      // Ensure avatar is present
        status: task.status || 'Ongoing',  // Default to 'Ongoing' if missing
        memberId: task.memberId,
      }));

      setAssignedTasks(tasksWithDetails);
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
    }
  };
  useEffect(() => {
    fetchAssignedTasks();
  }, [taskId]);
  

const handleAssignTask = async () => {
  if (!selectedMember || !assignTaskTitle) return;

  try {
    const assignedTask = await assignTaskToMember(taskId, selectedMember.id, assignTaskTitle);

    // Ensure these fields are added for proper rendering
    const assignedTaskDetails = {
      ...assignedTask,
      taskTitle: assignTaskTitle,
      username: selectedMember.username,
      avatar: selectedMember.avatar,
      status: 'Ongoing', // Set initial status
    };

    setAssignedTasks((prevTasks) => [...prevTasks, assignedTaskDetails]);
    setAssignTask(false);
    setIsModalVisible(false)
    setAssignTaskTitle('')
  } catch (error) {
    console.error('Error assigning task:', error);
  }
  };

const copyToClipboard = () => {
    if (task?.$id) {
      Clipboard.setString(task.$id); // Copy the task ID to the clipboard
      if (Platform.OS === 'android') {
        ToastAndroid.show('Copied to Clipboard', ToastAndroid.SHORT);
      } else {
        // Implement a custom Toast for iOS or use a library
        console.log('Copied to Clipboard');
      }
    }
  };

  const openAssignTask = () => {
    setIsModalVisible(true);
  };

  const openAssignTaskModal = (member) => {
    setSelectedMember(member) // Set selected member
    setAssignTask(true)
  };

  const openSubmitContainer = (assignedTask) => {
    setSelectedMember(assignedTask) // Set selected member
    setIsSubmit(true)
  };

  const closeModal = () => {
    setIsModalVisible(false)
    setAssignTask(false)
    setAssignTaskTitle('')
  };
  const isSubmitClose = () => {
    setIsSubmit(false);
  }

  const refreshTaskDetails = () => {
    fetchAssignedTasks();
    fetchTask();  // To reload task details
};

  return (
    <SafeAreaView className='bg-white flex-col h-full relative'>
      <View className="pl-4 flex-row items-center justify-between">
                <TouchableOpacity className='' onPress={() => { router.replace('/Home')}}>
                    <Image 
                        source={icons.back}
                        className="w-7 h-7"
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <PopUpMenu icon={images.threeDot} otherStyles="w-5 h-5 mr-4" />
      </View>
      <View className="p-4 flex-col">
        <Text className="text-base font-plight capitalize">{task?.type || taskType} Task</Text>
        <Text className="text-2xl font-psemibold text-secondary-100 mb-2">{task?.title || title}</Text>
        <Text className='text-xs font-pregular mb-1'>Group Code:</Text>
          <View className={`flex-row items-center justify-between border p-2 border-gray-300 rounded-md`}>
            <Text className='text-sm'>{task?.$id}</Text>
            <TouchableOpacity onPress={copyToClipboard}>
              <Image 
                source={icons.copy}
                className="w-7 h-7"
                resizeMode='contain'

              />
            </TouchableOpacity>
          </View>
          <Text className='text-xs font-pregular py-2'>You have {task?.duration} day(s) to finish your activities within this task.</Text>
          <View className='flex-row mt-1'>
              <View className="border rounded-full border-secondary-100 mr-4">
                <Image 
                  source={images.taskManagerLogo}
                  className='w-11 h-10 rounded-full'
                  resizeMode='contain'
                />
              </View>
            <View className='flex-col justify-center'>
                <View className='flex-row justify-between items-center'>
                  <Text className='text-xs font-pregular'>Progress</Text>
                  <Text className='text-sm font-pregular'>0%</Text>
                </View>
                <Progress.Bar 
                  progress={0.01} 
                  width={300} 
                  height={7}
                  color='#FF9001'
                />
            </View>
          </View>

          <View className='mt-3 border-b border-b-gray-300'>
            <Text className='text-lg font-psemibold'>Overview</Text>
          </View>
      </View>

      <View className={`p-2 items-center justify-center`}>
          {assignedTasks.length > 0 ? (
            <ScrollView className='h-[50vh] overflow-scroll'>
              {assignedTasks.map((assignedTask) => (
                    <OverviewCard
                      key={assignedTask?.$id}
                      title={assignedTask.taskTitle}
                      username={assignedTask?.username}
                      userAvatar={{ uri: assignedTask?.avatar }} // Set avatar if available
                      status={assignedTask?.status}
                      onPress={openSubmitContainer}
                    />
                  ))}
            </ScrollView>
          ) : (
              <View className='w-full h-[40vh] items-center justify-center'>
                 <EmptyContent 
                    description="No tasks assigned yet. Assign tasks to team members to get started!"
                    image={images.emptyAssignedTask}
                    textContainer='bg-white'
                  />
              </View>
          )}

      </View>

      {isSubmit && (
        <Modal
        transparent={true}
        animationType="fade"
        visible={isSubmit}
        onRequestClose={isSubmitClose}
        >
        <View className='flex-1 justify-center items-center bg-black/50'>
          

            <View className="w-[95%] p-5 bg-white rounded-lg min-h-[85vh]">
              <View className='flex-row items-center justify-between pb-2 border-b border-b-gray-300'>
                <Text className="text-lg font-psemibold">Your Work</Text>
                <TouchableOpacity onPress={isSubmitClose} className="">
                  <Image 
                    source={icons.close}
                    className='w-6 h-6'
                    resizeMode='contain'
                  />
                </TouchableOpacity>

              </View>

              <View className='relative'>
                <SubmitForm 
                  assignedTaskId={assignedTasks?.$id}
                  isCreator={isCreator}
                  taskId={taskId}
                  refreshTaskDetails={refreshTaskDetails}
                  memberId={selectedMember?.memberId}
                />
              </View>

            </View>

          
        </View>
      </Modal>
      )}

      {isModalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View className='flex-1 justify-center items-center bg-black/50'>
            

              <View className="w-[95%] p-5 bg-white rounded-lg min-h-[85vh]">
                <View className='flex-row items-center justify-between pb-2 border-b border-b-gray-300'>
                  <Text className="text-lg font-psemibold">Assign Task</Text>
                  {/* Your form or additional content goes here */}
                  <TouchableOpacity onPress={closeModal} className="">
                    <Image 
                      source={icons.close}
                      className='w-6 h-6'
                      resizeMode='contain'
                    />
                  </TouchableOpacity>

                </View>

                <View>
                  <ScrollView className="overflow-y-hidden overflow-scroll">

                    {members.length > 0 ? (
                        members.map((member, index) => (
                        <MemberContainer 
                              key={`${member.id}-${index}`} 
                              username={member.username}
                              userAvatar={member.avatar}
                              icon={icons.assign}
                              onPress={() => openAssignTaskModal(member)}
                              name='Assign'
                              style='flex-row items-center justify-center border rounded-md bg-secondary-100 p-1 border-gray-400'
                            />
                        ))
                    ) : (
                        <Text>No members yet.</Text>
                    )}
                    </ScrollView>
                </View>
              </View>

            
          </View>
        </Modal>
      )}

      {assignTask && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={assignTask}
          onRequestClose={() => setAssignTask(false)}
        >
          <View className='flex-1 justify-center items-center bg-black/60'>
            

              <View className="min-w-[95%] p-5 bg-white rounded-lg min-h-[50vh] relative">
                
                <View className='flex-row items-center justify-between'>
                  <Text className='font-psemibold text-lg'>Assign To:</Text>

                  <TouchableOpacity onPress={() => setAssignTask(false)}>
                    <Image 
                      source={icons.close}
                      className='w-5 h-5'
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                </View>

                <View className='py-2'>
                  <View className='flex-row items-center'>
                    <Image 
                      source={{ uri: selectedMember?.avatar}}
                      className='w-7 h-7 rounded-full mr-2'
                      resizeMode='contain'
                    />
                    <Text className='text-sm font-pregular'>{selectedMember?.username}</Text>
                  </View>

                 <CustomInput 
                  title='Name of the Task'
                  value={assignTaskTitle}
                  placeholder=''
                  handleChangeText={setAssignTaskTitle}
                  otherStyles='mt-4'
                  textStyle='text-xs'
                 />
                </View>



                  <View className={`absolute bottom-0 min-w-[100%] p-5`}>

                    <CustomButton 
                      title="Assign Task"
                      textStyles="text-base text-white font-psemibold"
                      containerStyles="min-h-[45px] rounded-md"
                      handlePress={handleAssignTask}
                      icon={() => {}}
                      iconStyle=""
                      />
                  </View>
              </View>

            
          </View>
        </Modal>
      )}

      {isCreator && (
        <View className={`absolute bottom-0 w-full p-4 bg-white`}>

            <CustomButton 
              title="Assign Task"
              textStyles="text-base text-white font-psemibold"
              containerStyles="min-h-[45px] rounded-md"
              handlePress={openAssignTask}
              icon={() => {}}
              iconStyle=""
          />
        </View>
      )}

    </SafeAreaView>
  )
}

export default overview