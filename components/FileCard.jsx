import { View, Text, Image, Alert } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { icons } from '../constants';
import * as FileSystem from 'expo-file-system';

const FileCard = ({ fileName, fileUri, onDelete, onDownload, isCreator }) => {

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

  const handleDownload = async () => {
    try {
      if (!fileUri) {
        Alert.alert('Error', 'No file URL found.');
        return;
      }
  
      // Define the destination file URI where the file will be saved locally
      const fileUriPath = `${FileSystem.documentDirectory}${fileName}`;
  
      // Start downloading the file using the Appwrite file URL (make sure it's accessible)
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUri, // Appwrite's file view URL
        fileUriPath // Local path where the file should be saved
      );
  
      const { uri } = await downloadResumable.downloadAsync();
      Alert.alert('Download Successful', `File saved to: ${uri}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', 'Failed to download the file. Please try again.');
    }
  };
  

  return (
    <View className="flex-row items-center justify-between py-1 px-3 border border-gray-400/50 rounded-md">
        <View className='flex-row items-center justify-center'>
            <View className='w-9 h-9 mr-2'>
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
                <Text className='text-[9px] font-pregular'>{fileName}</Text>
            </View>
        </View>

      {isCreator ? (
        <TouchableOpacity onPress={handleDownload}>
        <Image 
            source={icons.download}
            className='w-5 h-5'
            resizeMode='contain'
        />
      </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onDelete}>
          <Image 
              source={icons.close}
              className='w-5 h-5'
              resizeMode='contain'
          />
        </TouchableOpacity>
      )}

      
    </View>
  )
}

export default FileCard