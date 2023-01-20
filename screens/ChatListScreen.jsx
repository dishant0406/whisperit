import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ChatListScreen = (props) => {
  return (
    <View style={styles.container}>
      <Button title='Chat' onPress={() => props.navigation.navigate('Chat')}/>
    </View>
  )
}

export default ChatListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})