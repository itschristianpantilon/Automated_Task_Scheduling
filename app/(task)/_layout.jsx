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
        className="w-7 h-7"
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
        borderTopWidth: 1,
        borderTopColor: '#6B7280',
        height: 70
      }
    }}
    >
      <Tabs.Screen 
        name='overview'
        options={{
          title: "Overview",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              icon={icons.overview}
              color={color}
              name="Overview"
              focused={focused}
            />
          )
        }}
      />

        
      <Tabs.Screen 
        name='members'
        options={{
          title: "members",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              icon={icons.members}
              color={color}
              name="Members"
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