import { View, Text, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage'; 


const SoloOverviewCard = ({ title, duration, deadline, status, onPress, disabled }) => {



  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const initializeTimer = async () => {
      try {
        const storedEndTime = await AsyncStorage.getItem(`${title}_endTime`);

        let endTime;
        if (storedEndTime) {
          endTime = moment(parseInt(storedEndTime, 10));
        } else {
          
          endTime = moment().add(duration, 'days');
          await AsyncStorage.setItem(`${title}_endTime`, endTime.valueOf().toString());
        }

        updateRemainingTime(endTime);

        const timer = setInterval(() => {
          updateRemainingTime(endTime, timer);
        }, 1000);

        return () => clearInterval(timer); 
      } catch (error) {
        console.error('Error initializing timer:', error);
      }
    };

    initializeTimer();
  }, [status]);

  const updateRemainingTime = (endTime, timer = null) => {
    const now = moment();
    const timeLeft = moment.duration(endTime.diff(now)).asSeconds();

    if (timeLeft <= 0) {
      setRemainingTime(0);
      if (timer) clearInterval(timer); 
      return;
    }

    setRemainingTime(Math.floor(timeLeft));
  };

  const formatTime = (timeInSeconds) => {
    const days = Math.floor(timeInSeconds / (24 * 60 * 60));
    const hours = Math.floor((timeInSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeInSeconds % (60 * 60)) / 60);
    const seconds = timeInSeconds % 60;

    if (timeInSeconds <= 0) return 'Expired';
    return `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`;
  };
  return (
    <View className={`border border-gray-400/70 flex-row items-center justify-between p-4 rounded-md mb-3 ${status === 'Finished' ? 'opacity-30' : ''} ${remainingTime === 'Expired' ? 'opacity-30' : ''}`} >
        <View className='flex-1'>
            <Text className='text-lg font-pmedium mb-1'>{title}</Text>
            <View className='flex-row items-center'>
              <Text className='text-xs mr-2'>Duration: {duration} day(s)</Text>
              <Text className='text-xs'>Deadline: {moment(deadline).format('YYYY-MM-DD')}</Text>
            </View>
            <Text className={`text-xs mt-1 ${remainingTime === 0 ? 'text-red-500' : 'text-gray-500'}`}>
          Time Left: {status === 'Finished' ? 'Done' : formatTime(remainingTime || 0)}
        </Text>

        </View>

        <View className='items-center justify-center'>
          <TouchableOpacity 
            className='border border-gray-400 p-1 rounded-full' 
            onPress={onPress}
            disabled={disabled}
            >
              <Image 
                  source={icons.complete}
                  className='w-7 h-7'
                  resizeMode='contain'
              />
          </TouchableOpacity>
          <Text className='text-[10px] font-pregular mt-1'>{status}</Text>
        </View>
    </View>
  )
}

export default SoloOverviewCard