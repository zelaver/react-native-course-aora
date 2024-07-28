import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ViewToken,
} from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { icons } from "@/constants";
import { Video, ResizeMode } from "expo-av";

const zoomIn: Animatable.CustomAnimation = {
  0: {
    scaleX: 0.9,
    scaleY: 0.9,
    
  },
  1: {
    scaleX: 1.1,
    scaleY: 1.1,
  },
};

const zoomOut: Animatable.CustomAnimation = {
  0: {
    scaleX: 1.1,
    scaleY: 1.1,
  },
  1: {
    scaleX: 0.9,
    scaleY: 0.9,
  },
};
const TrendingItem = ({ activeItem, item }: any) => {
  const [play, setPlay] = useState(false);
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={200}
    >
      {play ? (
        <Video
          source={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status : any) => {
            if(status.didJustFinish) {
              setPlay(false)
            }
          }}
          
        // <Text>njir</Text>  
        />
      ) : (
        <TouchableOpacity
          className=" justify-center items-center relative"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

type Posts = {
  $id: number;
  title: string;
};

type Trending = {
  posts: Array<Posts>;
};

const Trending = ({ posts }: any) => {
  const [activeItem, setActiveItem] = useState(posts[1]);
  // console.log(posts[1])
  const viewableItemsChanges = ({
    viewableItems,
  }: {
    viewableItems: ViewToken<Posts>[];
    changed: ViewToken<Posts>[];
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => `${item.$id}`}
      renderItem={({ item }) => (
        <TrendingItem
          activeItem={activeItem}
          item={item}
        />
      )}
      onViewableItemsChanged={viewableItemsChanges}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ y: 0, x: 170 }}
      horizontal
    />
  );
};

export default Trending;
