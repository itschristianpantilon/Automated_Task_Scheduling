import { View, Text, Modal, Image, ScrollView, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { icons, images } from '../constants'
import { useGlobalContext } from '../context/GlobalProvider';
import { useNavigation } from 'expo-router';
import { useTask } from '../context/TaskContext';
import { useAppwrite } from '../context/AppwriteClient';
import { Query } from 'react-native-appwrite';
import EmptyContent from './EmptyContent';
import TaskRow from './TaskRow';
import moment from 'moment';

const HistoryCard = ({ title, status, dateCreated }) => (
    <View className={`flex-row justify-between items-center mb-2 border-y border-y-gray-400/50 h-10 ${status === 'Active' ? 'hidden': ''}`}>
        <Text className='text-xs font-pregular w-[45%]'>{title}</Text>
        <Text className='text-xs font-pregular'>{status}</Text>
        <Text className='text-xs font-pregular w-[25%] text-center'>{moment(dateCreated).format('YYYY-MM-DD')}</Text>
    </View>
);

const History = ({ visible, onRequestClose, onPress }) => {

  const {user, setUser, setIsLoggedIn} = useGlobalContext();
  const navigation = useNavigation();

  const [tasks, setTasks] = useState([]);
  const { database } = useAppwrite();

  const { setTaskId } = useTask();

  const [openModal, setOpenModal] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!user || !user.$id) return;
    try {
      const response = await database.listDocuments(
        '670e0a0e002e9b302a34',
        '6711f75c00201eca940c',
        [Query.search('members', user.$id)],
        [Query.equal('userId', user.$id)], 

      );
      //setTasks(response.documents);
       // Sort tasks by $createdAt in descending order
       const sortedTasks = response.documents.sort((a, b) => {
        return new Date(b.$createdAt) - new Date(a.$createdAt);
      });

      setTasks(sortedTasks);
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
    <Modal
          transparent={true}
          animationType="fade"
          visible={visible}
          onRequestClose={onRequestClose}
        >
          <View className='w-full h-full flex-1 justify-center items-center bg-black/60'>
            

              <View className="min-w-[95%] p-5 bg-white rounded-lg min-h-[90vh] relative">
                <View className='flex-row items-center justify-between'>
                    <Text className='text-lg font-psemibold'>History</Text>
                    <TouchableOpacity onPress={onPress}>
                        <Image 
                            source={icons.close}
                            className='w-6 h-6'
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>

                <View className='flex-row justify-between items-center mt-4'>
                    <Text className='text-xs font-pregular w-[40%]'>Title</Text>
                    <Text className='text-xs font-pregular'>Status</Text>
                    <Text className='text-xs font-pregular'>Date Created</Text>
                </View>
               
               
                <FlatList 
                  data={tasks}
                  keyExtractor={(item) => item.$id}
                  renderItem={({ item }) => (
                    <View className=''>



                      <ScrollView className=''>
                        <HistoryCard 
                          title={item?.title}
                          status={item?.status}
                          dateCreated={item?.$createdAt}
                        />
                       
                      </ScrollView>
                    

                    </View>
                  )}
                  ListEmptyComponent={() => (
                    <View className='w-full h-[70vh] p-4 items-center justify-center'>
                      <EmptyContent 
                        description="No History"
                        image={images.emptyPage}
                        textContainer='bg-secondary-100/5'
                      />
                    </View>
                  )}
                  
                />
                
               
              </View>


            
          </View>
    </Modal>
  )
}

export default History