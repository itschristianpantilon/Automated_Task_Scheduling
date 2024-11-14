import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../context/GlobalProvider';
import { icons, images } from '../constants';
import { TouchableOpacity } from 'react-native';
import { useTask } from '../context/TaskContext';
import { useAppwrite } from '../context/AppwriteClient';


const MemberContainer = ({ username, userAvatar, icon, onPress, style, isCreator, isCurrentUserCreator, LeaderOrMember, isHidden }) => {

    const { user } = useGlobalContext();
    const { taskId } = useTask(); // Get taskId from context
    const [task, setTask] = useState(null);
    const { database } = useAppwrite();
    const [hideButtonForTaskOwner, setHideButtonForTaskOwner] = useState(false);

  const fetchTask = async () => {
    if (!taskId) return;
  
    try {
      const response = await database.getDocument('670e0a0e002e9b302a34', '6711f75c00201eca940c', taskId);
      setTask(response);
              
      if (response.userId === user?.$id) {
        setHideButtonForTaskOwner(true);
      }

    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };
  
  useEffect(() => {
      fetchTask();
  }, [taskId, user?.$id]);




  return (
    <View className="relative flex-row py-2 items-center justify-between border-b border-b-gray-100/40">
        <View className="flex-row items-center flex-1">
            <View className="w-9 h-9 rounded-full">
                <Image 
                    source={{ uri: userAvatar }}
                    className="w-full h-full rounded-full"
                    resizeMode='contain'
                />
            </View>
            <View className='flex-col ml-3'>
                <Text className="text-base font-pregular">{username}</Text>
                <Text className="text-xs font-pregular">{LeaderOrMember}</Text>
            </View>
        </View>
        

                {isCurrentUserCreator && !isCreator  ? (
                    <View className={`items-center justify-center ${isHidden}`}>
                        <TouchableOpacity onPress={onPress} className={`${style}`}>
                            <Image 
                                source={icon}
                                className='w-7 h-7'
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    </View>
                ) : null}

    </View>
  )
}

export default MemberContainer