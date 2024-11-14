import { View, Text, Image } from 'react-native'
import React from 'react'

const CommentCard = ({ username, commentText, userAvatar, onHide }) => {
  return (
    <View className={`flex-row items-center py-1 px-2 ${onHide}`}>
      <View className='flex-row items-center mr-1'>
        <View className='border w-5 h-5 mr-1 rounded-full'>
            <Image 
                source={{ uri: userAvatar}}
                className='w-full h-full rounded-full'
                resizeMode='contain'
            />
        </View>
        <Text className='text-[11px] font-pregular'>{username}: </Text>
      </View>
      <Text className='text-xs font-pregular'>{commentText}</Text>
    </View>
  )
}

export default CommentCard