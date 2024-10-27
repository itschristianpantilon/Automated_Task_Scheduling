import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MemberContainer from '../../components/MemberContainer'
import MemberRequest from '../../components/MemberRequest'

const members = () => {
  return (
    <SafeAreaView className="bg-white p-4">
      <View>
        <Text className="text-lg font-medium pb-1 mb-2 border-b border-b-gray-400">Members</Text>
        <ScrollView className="h-[40vh] overflow-y-hidden overflow-scroll">
          <MemberContainer />
          <MemberContainer />

        </ScrollView>

        <Text className="text-lg font-medium pb-1 mb-2 border-b border-b-gray-400">Member Request (2)</Text>
        <ScrollView className="h-[40vh] overflow-y-hidden overflow-scroll">
          <MemberRequest />
          <MemberRequest />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default members