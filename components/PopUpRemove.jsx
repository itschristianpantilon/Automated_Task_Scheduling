import { View, Text, Modal, Animated, Easing, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTask } from '../context/TaskContext';
import { useAppwrite } from '../context/AppwriteClient';
import { useGlobalContext } from '../context/GlobalProvider';
import CustomButton from './CustomButton';
import { config, databases, updateTaskStatus } from '../lib/appwrite';

const PopUpRemove = ({ onPress, setOnpress, onTouchClose, leave }) => {

  const { user } = useGlobalContext();
  const { taskId } = useTask(); // Get taskId from context
  const [task, setTask] = useState(null);
  const { database } = useAppwrite();
  const [isCreator, setIsCreator] = useState(false);
  const [members, setMembers] = useState([]);

  const fetchTask = async () => {
    if (!taskId) return;
  
    try {
      const response = await database.getDocument('670e0a0e002e9b302a34', '6711f75c00201eca940c', taskId);
      setTask(response);
            
      if (!isCreator && response.userId === user?.$id) {
        setIsCreator(true);
      }
      console.log('Task Id: ', taskId)
      console.log('MemberID', task?.$id)
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };
  
  useEffect(() => {
      fetchTask();
  }, [taskId, user?.$id]);

  const scale = useRef(new Animated.Value(0)).current;
    
  function resizeBox(to){
    to === 1 && setOnpress(true);
    Animated.timing(scale, {
        toValue: to,
        useNativeDriver: true,
        duration:200,
        easing: Easing.linear,
    }).start(() => to === 0 && setOnpress(false))
}

const leaveTask = async () => {
  if (!taskId || !user?.$id) return;

  try {
    // Fetch the task from the database
    const task = await databases.getDocument(config.databaseId, config.taskCollectionId, taskId);
    
    // Make sure the current user is not the creator (they cannot leave)
    if (task.userId === user.$id) {
      Alert.alert('Error', 'The creator cannot leave the task.');
      return;
    }

    // Remove the current user's ID from the task's members list
    const updatedMembers = task.members.filter(memberId => memberId !== user.$id);

    // Update the task document in the database
    await databases.updateDocument(config.databaseId, config.taskCollectionId, taskId, {
      members: updatedMembers,
    });

    // Remove the user from the local state as well
    setMembers(prevMembers => prevMembers.filter(member => member.$id !== user.$id));

    // Optionally, navigate back or show a success message
    Alert.alert('Success', 'You have left the task.');
    navigation.goBack();

  } catch (error) {
    console.error('Error leaving task:', error);
    Alert.alert('Error', 'Failed to leave the task.');
  }
};

  return (

    <Modal
          transparent={true}
          animationType="fade"
          visible={onPress}
          onRequestClose={setOnpress}
        >
          <View className='w-full h-full flex-1 justify-center items-center bg-black/60' onTouchStart={() => resizeBox(0)}>
            

              <Animated.View className="w-[95%] p-5 bg-white rounded-lg min-h-[35vh] relative items-center">
                <View className='w-full items-start'>
                  <Text className='capitalize text-sm font-pregular text-black-100/70'>{task?.type} Task</Text>
                  <Text className='text-2xl font-psemibold mb-3 text-secondary-100'>{task?.title}</Text>

                  <Text className='text-lg font-plight text-black-100/80'>Is this task finished?</Text>
                </View>

                <View className={`absolute bottom-0 w-full py-4`}>
                  {isCreator && (
                    <CustomButton 
                      title="Mark as done"
                      textStyles="text-base text-white font-psemibold"
                      containerStyles="min-h-[45px] rounded-md"
                      handlePress={() => updateTaskStatus(taskId, 'Finished')}
                      icon={() => {}}
                      iconStyle=""
                    />
                  )}
                  
                  <View className='flex-row items-center justify-between mt-2'>

                    {task?.type === 'group' ? (
                      <CustomButton 
                        title="Leave"
                        textStyles="text-sm font-pregular"
                        containerStyles={`${isCreator ? 'hidden' : '' } min-h-[40px] rounded-md w-[49%] border bg-white border-black/30`}
                        handlePress={leaveTask}
                        icon={() => {}}
                        iconStyle=""
                      />
                    ): (
                      <CustomButton 
                        title="Remove"
                        textStyles="text-sm font-pregular"
                        containerStyles={`min-h-[40px] rounded-md w-[49%] border bg-white border-black/30`}
                        handlePress={() => updateTaskStatus(taskId, "Inactive")}
                        icon={() => {}}
                        iconStyle=""
                      />
                    )}

                    <CustomButton 
                      title="Cancel"
                      textStyles="text-sm font-pregular"
                      containerStyles={`min-h-[40px] rounded-md w-[49%] border bg-white border-black/30 ${isCreator && task?.type === 'group' ? 'w-full' : '' }`}
                      handlePress={onTouchClose}
                      iconStyle=""
                    />
                  </View>

                </View>
              </Animated.View>

            
          </View>
        </Modal>
  )
}

export default PopUpRemove