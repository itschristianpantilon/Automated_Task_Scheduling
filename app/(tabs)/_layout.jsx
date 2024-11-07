import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router'

import { icons } from '../../constants'
import { StatusBar } from 'expo-status-bar'

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image 
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className="w-7 h-5"
      />

      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color }}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
   <>
    <Tabs 
    screenOptions={{
      tabBarShowLabel: false,
      tabBarActiveTintColor: '#FF9C01',
      tabBarInactiveTintColor: '#1E1E2D',
      tabBarStyle: {
        backgroundColor: '#FFF',
        borderTopWidth: 0.2,
        borderTopColor: '#808080',
        height: 70
      }
    }}
    >
      <Tabs.Screen 
        name='Home'
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
            />
          )
        }}
      />

        
      <Tabs.Screen 
        name='profile'
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              icon={icons.profile}
              color={color}
              name="Profile"
              focused={focused}
            />
          )
        }}
      />

    </Tabs>

    <StatusBar backgroundColor='#FFF' style='dark' />
   </>
  )
}

export default TabsLayout