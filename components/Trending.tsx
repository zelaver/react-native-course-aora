import { View, Text, FlatList } from 'react-native'
import React from 'react'

type Posts = {
  id: number
}

type Trending = {
  posts: Array<Posts>
}

const Trending = ({posts} : Trending) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => `${item.id}`}
      renderItem={({item}) => (
        <Text className="text-3xl text-white">{item.id}</Text>
      )}
      horizontal
    />
  )
}

export default Trending