import { View, Text } from 'react-native'
import React from 'react'
import PopUpMenu from './PopUpMenu'
import { images } from '../constants'
import { TouchableOpacity } from 'react-native';




const TaskRow = ({ taskType, title, duration, onPress }) => {


  return (
    <TouchableOpacity onPress={onPress}>
      <View className="px-4 space-y-6 bg-gray-200/20 rounded-xl mb-2 border border-gray-400 hover:border-secondary-100">
        <View className="justify-between items-start flex-row mb-5 py-4 mt-2">
          <View>
            <Text className="font-psemibold text-s capitalize">{taskType} Task</Text>
            <Text className="text-xl font-psemibold text-secondary-100">{title}</Text>
            <Text className="font-pmedium text-xs">Role: Leader</Text>
            <Text className="font-pmedium text-xs">Duration: {duration} days</Text>

          </View>

          <View>
            <PopUpMenu icon={images.threeDot} otherStyles="w-5 h-5" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default TaskRow