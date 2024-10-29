import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createTask } from '../../lib/appwrite'
import { TouchableOpacity } from 'react-native'
import { icons } from '../../constants'
import { router, useNavigation } from 'expo-router'
import { useAppwrite } from '../../context/AppwriteClient'
import { useTask } from '../../context/TaskContext'
import TabsLayout from './_layout'
import { useRoute } from '@react-navigation/native'

const overview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, taskType, groupId } = route.params || {};
  const { taskId } = useTask(); // Get taskId from context
  const [task, setTask] = useState(null);
  const { database } = useAppwrite();

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;

      try {
        const response = await database.getDocument('670e0a0e002e9b302a34', '6711f75c00201eca940c', taskId);
        setTask(response);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };
    
    fetchTask();
  }, [taskId]);
  
  return (
    <SafeAreaView className='bg-white flex-col h-full'>
      <View className="pl-4">
                <TouchableOpacity className='' onPress={() => { router.replace('/Home')}}>
                    <Image 
                        source={icons.back}
                        className="w-7 h-7"
                        resizeMode='contain'
                    />
                </TouchableOpacity>
      </View>
      <View className="p-4 flex-col">
        <Text className="text-lg font-plight capitalize">{task?.type || taskType} Task</Text>
        <Text className="text-3xl font-psemibold text-secondary-100 mb-2">{task?.title || title}</Text>
        <Text className='text-xs font-pregular mb-1'>Group Code:</Text>
          <View className={`${task?.type === 'solo' ? 'hidden' : ''} flex-row items-center justify-between border p-2 border-gray-300 rounded-lg`}>
            <Text className='text-base'>{task?.$id}</Text>
            <TouchableOpacity>
              <Image 
                source={icons.copy}
                className="w-7 h-7"
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
        <Text>Creator</Text>
        <Text>Members</Text>
      </View>
    </SafeAreaView>
  )
}

export default overview