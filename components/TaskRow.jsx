import { View, Text, Modal } from 'react-native'
import React, { useState } from 'react'
import PopUpMenu from './PopUpMenu'
import { images } from '../constants'
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';




const TaskRow = ({ taskType, title, duration, onPress, threeDotBtn }) => {

  

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="px-4 space-y-6 rounded-md mb-2 border border-gray-400 hover:border-secondary-100 min-h-[15vh]">
        <View className="justify-between items-start flex-row mb-5 py-2 mt-2">
          <View>
            <Text className="font-psemibold text-xs capitalize">{taskType} Task</Text>
            <Text className="text-lg font-psemibold text-secondary-100">{title}</Text>
            
            <Text className="font-pregular text-[12px] text-black/60">Duration: {duration} days</Text>

          </View>

          <View className=''>
            <TouchableOpacity onPress={threeDotBtn}>
              <Image
                source={images.threeDot}
                className='w-5 h-5'
                resizeMode='contain'
              />
            </TouchableOpacity>

        
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default TaskRow