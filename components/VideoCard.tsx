import { View, Text, Image, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";
import { toggleBookmark } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const VideoCard = ({
  video: {
    $id,
    title,
    thumbnail,
    prompt,
    video,
    creator: { username, avatar },
    likes,
  },
}: any) => {
  const [play, setPlay] = useState(false);
  const [currentlikes, setCurrentLikes] = useState(likes)
  const { user, setUser, setIsLoggedIn, refetch }: any = useGlobalContext();
  const [isLiked, setIsLiked] = useState(
    likes.some(({ $id }: { $id: string }) => $id === user.$id)
  );
  


  // console.log(likes)

  const [refreshing, setRefreshing] = useState<boolean>(false)
  const onRefresh = async () => {
    setRefreshing(true)
    // re call videos -> if any new videos
    await refetch();
    setRefreshing(false)
  }
  

  const onLike = async () => {
    try {
      const result = await toggleBookmark($id, currentlikes, user.$id, isLiked);
      setCurrentLikes(result?.likes)
      setIsLiked(!isLiked);
      onRefresh()
      // console.log('kocak');
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message)
      }
    } finally {
      
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{
                uri: avatar
                  ? avatar
                  : "https://avatars.githubusercontent.com/u/59755634?s=400&u=e730ebf29670a903ca24281bf13e0c05fbc7d435&v=4",
              }}
              className="w-full h-full rounded-lg "
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular">
              {username ? username : "unknown user"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="pt-2"
          onPress={onLike}
        >
          <Image
            source={isLiked ? icons.heartFill : icons.heartLine}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View className="pt-2">
          <Image
            source={icons.menu}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </View>
      </View>

      {play ? (
        <Video
          source={{
            uri: video ? video : "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
          }}
          className="w-full h-60 rounded-xl"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status: any) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}

          // <Text>njir</Text>
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{
              uri: thumbnail
                ? thumbnail
                : "https://avatars.githubusercontent.com/u/59755634?s=400&u=e730ebf29670a903ca24281bf13e0c05fbc7d435&v=4",
            }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
