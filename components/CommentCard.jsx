import { View, Text, Image } from 'react-native'
import React from 'react'

const CommentCard = ({ username, commentText, userAvatar }) => {
  return (
    <View className='flex-row items-center border py-1 px-2'>
      <View className='flex-row items-center mr-1'>
        <View className='border w-6 h-6 mr-1 rounded-full'>
            <Image 
                source={{ uri: userAvatar}}
                className='w-full h-full rounded-full'
                resizeMode='contain'
            />
        </View>
        <Text className='text-xs font-pregular'>{username}: </Text>
      </View>
      <Text className='text-sm font-pregular'>{commentText}</Text>
    </View>
  )
}

export default CommentCard