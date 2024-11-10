import { View, Text, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { icons } from '../constants'

const FileCard = ({ fileName, fileUri, onDelete }) => {

  //const isImage = fileUri && fileUri.match(/\.(jpeg|jpg|gif|png)$/);

  const isImage = fileUri && fileUri.match(/\.(jpeg|jpg|gif|png)$/);
  const isPdf = fileName && fileName.match(/\.pdf$/i);
  const isWord = fileName && fileName.match(/\.(docx?|doc)$/i);
  const isPresentation = fileName && fileName.match(/\.(pptx?|ppt)$/i);

  const getFileIcon = () => {
    if (isImage) {
      return (
        <Image
          source={{ uri: fileUri }}
          className="w-full h-full"
          resizeMode="cover"
        />
      );
    }
    if (isPdf) {
      return (
        <Image
          source={icons.pdf} // Add your PDF icon here
          className="w-full h-full"
          resizeMode="contain"
        />
      );
    }
    if (isWord) {
      return (
        <Image
          source={icons.word} // Add your Word document icon here
          className="w-full h-full"
          resizeMode="contain"
        />
      );
    }
    if (isPresentation) {
      return (
        <Image
          source={icons.powerpoint} // Add your PowerPoint icon here
          className="w-full h-full"
          resizeMode="contain"
        />
      );
    }
    return (
      <Text>File Image</Text> // This can be a default placeholder for unknown files
    );
  };

  return (
    <View className="flex-row items-center justify-between py-2 px-3 border border-gray-400/90 rounded-sm">
        <View className='flex-row items-center justify-center'>
            <View className='w-12 h-12 mr-2'>
                {/* {isImage ? (
                  <Image 
                  source={{ uri: fileUri }} 
                  className='w-full h-full'
                  resizeMode="cover" />
                ) : (
                  <Text>File Image</Text> // This can be a placeholder for non-image files
                )} */}
                 {getFileIcon()}
            </View>
            <View className='w-40'>
                <Text className='text-sm font-pregular'>{fileName}</Text>
            </View>
        </View>

      <TouchableOpacity onPress={onDelete}>
        <Image 
            source={icons.close}
            className='w-5 h-5'
            resizeMode='contain'
        />
      </TouchableOpacity>
    </View>
  )
}

export default FileCard