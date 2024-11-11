import { View, Text, Modal, Image, ScrollView } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { icons } from '../constants'

const HistoryCard = () => (
    <View className='flex-row justify-between items-center mb-2 border-y border-y-gray-400/50'>
        <Text className='text-xs font-pregular w-[40%]'>ITP Integrative Programming</Text>
        <Text className='text-xs font-pregular'>Ongoing</Text>
        <Text className='text-xs font-pregular'>10/10/2024</Text>
    </View>
);

const History = ({ visible, onRequestClose, onPress }) => {
  return (
    <Modal
          transparent={true}
          animationType="fade"
          visible={visible}
          onRequestClose={onRequestClose}
        >
          <View className='w-full h-full flex-1 justify-center items-center bg-black/60'>
            

              <View className="min-w-[90%] p-5 bg-white rounded-lg min-h-[90vh] relative">
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
               
               <ScrollView className='py-2'>
                <HistoryCard />
                <HistoryCard />
                <HistoryCard />
               </ScrollView>
              </View>

            
          </View>
    </Modal>
  )
}

export default History