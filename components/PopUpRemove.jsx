import { View, Text, Modal } from 'react-native'
import React, { useState } from 'react'

const PopUpRemove = ({ onPress, setOnpress, onTouchClose }) => {
    


  return (

    <Modal
          transparent={true}
          animationType="fade"
          visible={onPress}
          onRequestClose={setOnpress}
        >
          <View className='w-full h-full flex-1 justify-center items-center bg-black/60' onTouchStart={onTouchClose}>
            

              <View className="min-w-[95%] p-5 bg-white rounded-lg min-h-[50vh] relative">
                
               
              </View>

            
          </View>
        </Modal>
  )
}

export default PopUpRemove