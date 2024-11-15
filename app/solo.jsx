import { View, Text, Image, Modal, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import { icons, images } from '../constants'
import { router, useNavigation } from 'expo-router'
import { useAppwrite } from '../context/AppwriteClient'
import { useTask } from '../context/TaskContext'
import { useRoute } from '@react-navigation/native'
import PopUpMenu from '../components/PopUpMenu'
import * as Progress from 'react-native-progress';
import CustomButton from '../components/CustomButton'
import CustomInput from '../components/CustomInput'
import SoloOverviewCard from '../components/SoloOverviewCard'
import { Query } from 'react-native-appwrite'
import EmptyContent from '../components/EmptyContent'
import moment from 'moment/moment'
import { getCurrentUser } from '../lib/appwrite'
import PopUpRemove from '../components/PopUpRemove'

const solo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, taskType, groupId } = route.params || {};
  const { taskId } = useTask(); // Get taskId from context
  const [task, setTask] = useState(null);
  const { database } = useAppwrite();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState(''); // State for new task title
  const [soloTasks, setSoloTasks] = useState([]); // State for list of solo tasks
  const [openModal, setOpenModal] = useState(false);

  const onTouchClose = () => {
    setOpenModal(false);
  }
  
  const OpenModal = () => {
    setOpenModal(true);
  }
  
  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;

      try {
        const response = await database.getDocument(
        '670e0a0e002e9b302a34', 
        '6711f75c00201eca940c', taskId);
        setTask(response);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };
    
    fetchTask();
  }, [taskId]);
  
  const fetchSoloTasks = async () => {
    if (!taskId) return;

    try {
      const response = await database.listDocuments(
        '670e0a0e002e9b302a34', 
        '6729e342001e7f976939', // Collection ID for solo tasks
        [Query.equal('taskId', `${taskId}`)] // Filter by taskId
      );
      setSoloTasks(response.documents); // Set solo tasks with fetched documents
    } catch (error) {
      console.error('Error fetching solo tasks:', error);
    }
  };

  useEffect(() => {
    fetchSoloTasks();
  }, [taskId]);


  // Function to add a new solo task to "solotasklist" collection
  const addSoloTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {

      // Calculate the solo task duration and deadline based on the main task

      const currentUser = await getCurrentUser();

      const mainTaskDeadline = task?.deadline;
      const mainTaskDuration = task?.duration;
      let soloTaskDeadline = mainTaskDeadline;
      let soloTaskDuration = mainTaskDuration;

      if (mainTaskDeadline) {
        // Set solo task deadline as a fraction of the main task deadline if needed
        soloTaskDeadline = moment(mainTaskDeadline).subtract(1, 'days').format('YYYY-MM-DD');
      }

      if (mainTaskDuration) {
        // Set solo task duration as a fraction of main task duration if needed
        soloTaskDuration = Math.floor(mainTaskDuration / 2); // For example, half the duration
      }

      const newSoloTask = {
        title: newTaskTitle,
        taskId: taskId, // Link solo task to parent taskId
        status: 'Ongoing',
        creator: currentUser.$id,
        deadline: soloTaskDeadline,
        duration: soloTaskDuration,
      };

      // Store the new solo task in the "solotasklist" collection
      const response = await database.createDocument(
        '670e0a0e002e9b302a34', 
        //'6711f75c00201eca940c',
        '6729e342001e7f976939', // Collection ID for solo tasks
        'unique()', // Generate unique ID for the document
        newSoloTask
      );

      setSoloTasks([...soloTasks, response]); // Add new task to local state
      setNewTaskTitle('');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding solo task:', error);
    }
  };

   // Function to update the status of a solo task to "Finished"
   const updateSoloTaskStatus = async (soloTaskId) => {
    try {
      const response = await database.updateDocument(
        '670e0a0e002e9b302a34',
        '6729e342001e7f976939', // Collection ID for solo tasks
        soloTaskId,
        { status: 'Finished' } // Update the status to "Finished"
      );

      // Update the local state to reflect the change
      setSoloTasks(soloTasks.map(task => 
        task.$id === soloTaskId ? { ...task, status: 'Finished' } : task
      ));
    } catch (error) {
      console.error('Error updating solo task status:', error);
    }
  };

  return (
    <SafeAreaView className='bg-white flex-col h-full relative'>
      <View className="px-4 flex-row items-center justify-between">
                <TouchableOpacity className='' onPress={() => { router.replace('/Home')}}>
                    <Image 
                        source={icons.back}
                        className="w-7 h-7"
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={OpenModal}>
                  <Image
                    source={images.threeDot}
                    className='w-5 h-5'
                    resizeMode='contain'
                  />
                </TouchableOpacity>
      </View>
      <View className="p-4 flex-col">
        <Text className="text-lg font-plight capitalize">{task?.type || taskType} Task</Text>
        <Text className="text-3xl font-psemibold text-secondary-100 mb-2">{task?.title || title}</Text>
        <Text className='text-xs font-pregular'>You have {task?.duration} day(s) to finish your activities within this task.</Text>
          <View className='flex-row mt-3'>
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
                  width={330} 
                  height={7}
                  color='#FF9001'
                />
            </View>
          </View>

          <View className='mt-4 border-b border-b-gray-300'>
            <Text className='text-lg font-psemibold'>Overview</Text>
          </View>

          <View>
              {soloTasks.length > 0 ? (
                <ScrollView className='my-4'>
                  {soloTasks.map((soloTask) => (
                    <SoloOverviewCard 
                      key={soloTask.$id} 
                      title={soloTask.title} 
                      duration={soloTask.duration}
                      deadline={soloTask.deadline}
                      status={soloTask.status}
                      onPress={() => updateSoloTaskStatus(soloTask.$id)}
                      disabled={soloTask.status === 'Finished'}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View className='items-center justify-center h-[60vh]'>
                  <EmptyContent 
                    image={images.emptyAssignedTask}
                    description='No activities/tasks'
                  />
                </View>
              )}
          </View>

          <View>
            {isModalVisible && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View className='flex-1 justify-center items-center bg-black/50'>
              

            <View className="min-w-[90%] p-5 bg-white rounded-lg min-h-[50vh] relative">
                  
                  <View className='flex-row items-center justify-between'>
                    <Text className='font-psemibold text-lg'>Add Tasks</Text>

                    <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                      <Image 
                        source={icons.close}
                        className='w-5 h-5'
                        resizeMode='contain'
                      />
                    </TouchableOpacity>
                  </View>

                  <View className='py-2'>
                    
                    <CustomInput 
                      title='Name of the Task'
                      value={newTaskTitle}
                      placeholder=''
                      handleChangeText={setNewTaskTitle}
                      otherStyles='mt-4'
                      textStyle='text-xs'
                    />

                  </View>


                  <View className={`absolute bottom-0 min-w-[100%] p-5`}>

                    <CustomButton 
                      title="Add Task"
                      textStyles="text-base text-white font-psemibold"
                      containerStyles="min-h-[45px] rounded-md"
                      handlePress={addSoloTask}
                      icon={() => {}}
                      iconStyle=""
                      />
                  </View>
                </View>

              
            </View>
          </Modal>
            )}
          </View>
      </View>


      <View className={`absolute bottom-0 w-full p-4 bg-white`}>

          <CustomButton 
            title="List Your Tasks"
            textStyles="text-base text-white font-psemibold"
            containerStyles="min-h-[45px] rounded-md"
            handlePress={() => setIsModalVisible(true)}
            icon={() => {}}
            iconStyle=""
        />
      </View>

      {openModal && (
          <PopUpRemove 
            onPress={openModal}
            setOnpress={setOpenModal}
            onTouchClose={onTouchClose}
          />
      )}
    </SafeAreaView>
  )
}

export default solo