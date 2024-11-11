import { View, Text, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useCallback, useEffect, useState } from 'react'
import { icons, images } from '../../constants'
import { useGlobalContext } from '../../context/GlobalProvider'
import TaskRow from '../../components/TaskRow';
import PopUpMenu from '../../components/PopUpMenu';
import { router, useNavigation } from 'expo-router'
import { useAppwrite } from '../../context/AppwriteClient'
import { useTask } from '../../context/TaskContext'
import { Query } from 'react-native-appwrite'
import EmptyContent from '../../components/EmptyContent'
import PopUpRemove from '../../components/PopUpRemove'



const Home = () => {
  
  const {user, setUser, setIsLoggedIn} = useGlobalContext();
  const navigation = useNavigation();

  const [tasks, setTasks] = useState([]);
  const { database } = useAppwrite();

  const { setTaskId } = useTask();

  const [openModal, setOpenModal] = useState(false);

  const onTouchClose = () => {
    setOpenModal(false);
}

  const OpenModal = () => {
    setOpenModal(true);
  }

  const fetchTasks = useCallback(async () => {
    if (!user || !user.$id) return;
    try {
      const response = await database.listDocuments(
        '670e0a0e002e9b302a34',
        '6711f75c00201eca940c',
        [Query.search('members', user.$id)],
        [Query.equal('userId', user.$id)], 
        
      );
      setTasks(response.documents);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [database, user]);

  useEffect(() => {
    if (user && user.$id) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user, fetchTasks]);

  
  return (
    <SafeAreaView className="w-full h-full bg-white">

      <View className="flex-row w-full py-2 items-center justify-between px-4 border-b border-b-gray-300 mb-3">
        <View className='flex-row items-center gap-2'>
            <View className="w-8 h-8 rounded-full">
              <Image 
                source={images.taskManagerLogo}
                className="w-full h-full rounded-full"
                resizeMode='contain'
              />            
            </View>
          <Text className="font-psemibold text-base text-secondary-100">Automated Task Manager</Text>
        </View>

        <View className='flex-1 flex-row items-center justify-end'>
          <TouchableOpacity className="rounded-full border-[2px] border-gray-400 border-spacing-5 w-9 h-9 items-center justify-center mr-4" onPress={() => router.push('/profile')}>
                <Image 
                  source={{ uri: user?.avatar }}
                  className="w-full h-full rounded-full bg-white"
                  resizeMode='contain'
                />
          </TouchableOpacity>
          <PopUpMenu 
            icon={icons.plus}
            otherStyles="w-7 h-6"
          />
        </View>
      </View>
      
      <FlatList 
        data={tasks}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View className='px-2'>



            <ScrollView className=''>
              <TaskRow 
                title={item?.title}
                taskType={item?.type}
                duration={item?.duration}
                threeDotBtn={OpenModal}
                onPress={() => {
                  if(item?.type === 'group'){
                    setTaskId(item?.$id);
                    navigation.navigate('(task)')
                  } else {
                    setTaskId(item?.$id);
                    navigation.navigate('solo')
                  }
                }
                }
              />
            </ScrollView>
           

          </View>
        )}
        ListEmptyComponent={() => (
          <View className='w-full h-[70vh] p-4 items-center justify-center'>
            <EmptyContent 
              description="You currently have no tasks. Tap 'Create Task' to add your first task and start planning!"
              image={images.emptyPage}
              textContainer='bg-secondary-100/5'
            />
          </View>
        )}
        
      />
      <PopUpRemove 
        onPress={openModal}
        setOnpress={setOpenModal}
        onTouchClose={onTouchClose}
      />
    </SafeAreaView>
  )
}

export default Home