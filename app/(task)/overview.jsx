import { View, Text, Image, Alert, ToastAndroid, Platform, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createTask } from '../../lib/appwrite'
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
        <Text className='text-xs font-pregular mb-1'>Group Code:</Text>
          <View className={`${task?.type === 'solo' ? 'hidden' : ''} flex-row items-center justify-between border p-2 border-gray-300 rounded-lg`}>
            <Text className='text-base'>{task?.$id}</Text>
            <TouchableOpacity onPress={copyToClipboard}>
              <Image 
                source={icons.copy}
                className="w-7 h-7"
                resizeMode='contain'

              />
            </TouchableOpacity>
          </View>

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
      </View>

      <View className={`p-2 `}>
        <ScrollView className='h-[50vh] overflow-scroll'>
          <OverviewCard />
          <OverviewCard />
          <OverviewCard />
          <OverviewCard />
          <OverviewCard />
          <OverviewCard />
          <OverviewCard />
          <OverviewCard />
        </ScrollView>
      </View>

      <View className=''>
        <FlatList 
          data={() => {}}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View className='px-2'>
              
            </View>
          )}
          // ListHeaderComponent={() => (
          //   <View className={`p-2`}>
          //     <ScrollView>
          //     <OverviewCard />
          //     <OverviewCard />
          //     <OverviewCard />
          //     <OverviewCard />
          //     <OverviewCard />
          //     <OverviewCard />

          //     </ScrollView>
          //   </View>
            
          // )}
          ListEmptyComponent={() => (
            <View>
              <Text></Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View className=''>
            </View>
          )}
        />
      </View>

      <View className={`absolute bottom-0 w-full p-4 bg-white`}>

          <CustomButton 
            title="Assign Task"
            textStyles="text-base text-white font-psemibold"
            containerStyles="min-h-[45px] rounded-md"
            handlePress={() => {}}
            icon={() => {}}
            iconStyle=""
        />
      </View>
    </SafeAreaView>
  )
}

export default overview