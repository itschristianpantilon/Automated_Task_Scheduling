import { View, Text } from 'react-native'
import React from 'react'

const TaskRow = ({ taskType, title, duration}) => {
  return (
    <View className="px-4 space-y-6 bg-slate-200 rounded-xl mb-3 border border-gray-300">
    <View className="justify-between items-start flex-row mb-5 py-4 mt-2">
      <View>
        <Text className="font-psemibold text-s">Group Task</Text>
        <Text className="text-xl font-psemibold">Integrative Programing Project</Text>
        <Text className="font-pmedium text-xs">Role: Leader</Text>
        <Text className="font-pmedium text-xs">Duration: 50 days</Text>
      </View>

      
    </View>
    </View>
  )
}

export default TaskRow