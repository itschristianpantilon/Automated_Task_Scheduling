import { View, Text, Modal, SafeAreaView, Animated, Easing, Image } from 'react-native'
import React, { useRef } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router'
import { images } from '../constants'

const PopUpMenu = ({title, }) => {

    const [visible, setVisible] = useState(false);
    const scale = useRef(new Animated.Value(0)).current;
    const options = [
        {
            title: "Create Task",
            links: () => router.push('/create')
        },
        {
            title: "Join Group",
            links: () => router.push('/join')
        }
    ];
    function resizeBox(to){
        to === 1 && setVisible(true);
        Animated.timing(scale, {
            toValue: to,
            useNativeDriver: true,
            duration:200,
            easing: Easing.linear,
        }).start(() => to === 0 && setVisible(false))
    }

  return (
    <>
        <TouchableOpacity onPress={() => resizeBox(1)}>
            {/* <Icon name='plus-circle-outline' size={35} color={"#FFF"} /> */}
            <Image 
                source={images.threeDot}
                className='w-8 h-7'
                resizeMode='contain'
            />
        </TouchableOpacity>
        <Modal transparent visible={visible}>
            <SafeAreaView className="flex-1" onTouchStart={() => resizeBox(0)}>
                <Animated.View className="w-36 h-24 items-center justify-center rounded-lg bg-white absolute top-5 right-5 gap-2 shadow-2xl border border-gray-300">
                    {options.map((items, index) => (
                        <TouchableOpacity key={index} onPress={items.links} className="w-full">
                            <Text className="font-pregular pl-6">{items.title}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            </SafeAreaView>
        </Modal>
    </>
  )
}

export default PopUpMenu