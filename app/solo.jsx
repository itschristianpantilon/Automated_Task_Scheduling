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

const solo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, taskType, groupId } = route.params || {};
  const { taskId } = useTask(); // Get taskId from context
  const [task, setTask] = useState(null);
  const { database } = useAppwrite();
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        <Text className="text-lg font-plight capitalize">{task?.type || taskType} Task</Text>
        <Text className="text-3xl font-psemibold text-secondary-100 mb-2">{task?.title || title}</Text>
        
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
            <ScrollView className='my-4'>
              <SoloOverviewCard />
            </ScrollView>
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
                      value={() => {}}
                      placeholder=''
                      handleChangeText={() => {}}
                      otherStyles='mt-4'
                      textStyle='text-xs'
                    />

                  </View>


                  <View className={`absolute bottom-0 min-w-[100%] p-5`}>

                    <CustomButton 
                      title="Add Task"
                      textStyles="text-base text-white font-psemibold"
                      containerStyles="min-h-[45px] rounded-md"
                      handlePress={() => {}}
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
    </SafeAreaView>
  )
}

export default solo