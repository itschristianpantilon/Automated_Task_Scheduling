import { View, Text, Image, Alert, ToastAndroid, Platform, FlatList, ScrollView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { config, createTask, databases } from '../../lib/appwrite'
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


const overview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, taskType, groupId } = route.params || {};
  const { taskId } = useTask(); // Get taskId from context
  const [task, setTask] = useState(null);
  const { database } = useAppwrite();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [assignTask, setAssignTask] = useState(false)
  const [members, setMembers] = useState([]);


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

    fetchMembers();
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

  const handleAssignTaskPress = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
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

      {isModalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View className='flex-1 justify-center items-center bg-black/50'>
            

              <View className="w-[90%] p-5 bg-white rounded-lg min-h-[85vh]">
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
                              onPress={() => setAssignTask(true)}
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
          <View className='flex-1 justify-center items-center bg-black/50'>
            

              <View className="min-w-[90%] p-5 bg-white rounded-lg min-h-[85vh] relative">
                
                <View className='flex-row items-center justify-between'>
                  <Text className='font-psemibold text-lg'>Assign To</Text>

                  <TouchableOpacity onPress={() => setAssignTask(false)}>
                    <Image 
                      source={icons.close}
                      className='w-5 h-5'
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                </View>

                <View className='py-2'>
                  <Text>Member Name</Text>

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
                    title="Assign Task"
                    textStyles="text-base text-white font-psemibold"
                    containerStyles="min-h-[45px] rounded-md"
                    handlePress={handleAssignTaskPress}
                    icon={() => {}}
                    iconStyle=""
                    />
                </View>
              </View>

            
          </View>
        </Modal>
      )}

      <View className={`absolute bottom-0 w-full p-4 bg-white`}>

          <CustomButton 
            title="Assign Task"
            textStyles="text-base text-white font-psemibold"
            containerStyles="min-h-[45px] rounded-md"
            handlePress={handleAssignTaskPress}
            icon={() => {}}
            iconStyle=""
        />
      </View>
    </SafeAreaView>
  )
}

export default overview