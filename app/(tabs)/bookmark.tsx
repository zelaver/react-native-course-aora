import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import SearchInput from "@/components/SearchInput";
import VideoCard from "@/components/VideoCard";
import { icons } from "@/constants";
import InfoBox from "@/components/InfoBox";
import EmptyState from "@/components/EmptyState";
import useAppwrite from "@/lib/useAppwrite";
import { getAllPost } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

// TODO buat posts nya jadi globalstate biar state nya saling terhubung antara home dan bookmark
const Bookmark = () => {
  // const {data: posts, isLoadingPost, refetch} = useAppwrite(getAllPost);
  // console.log(posts.filter(({likes}) => likes.))
  // console.log(posts[0].likes)

  const { posts, isLoadingPost, user }: any = useGlobalContext();
  
  if (isLoadingPost) {
    return (
      <View className="bg-primary h-full py-12">
        <View className="mb-4 px-4">
            <View>
              <Text className="text-2xl text-white font-psemibold">Saved Videos</Text>
            </View>
            <SearchInput
              otherStyles="mt-4"
              placeholder="Search your saved videos"
            />
          </View>
      </View>
    );
  }

  // console.log(user.$id)
  // console.log(posts[0].likes[0]?.$id)

  const data = posts.filter(posts => posts.likes.some(likes => likes?.$id === user.$id))
  console.log(data)
  return (
    <SafeAreaView className="bg-primary h-full py-12 ">
      <FlatList
        data={data}
        // data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        keyExtractor={(item) => `${item.$id}`}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="mb-4 px-4">
            <View>
              <Text className="text-2xl text-white font-psemibold">Saved Videos</Text>
            </View>
            <SearchInput
              otherStyles="mt-4"
              placeholder="Search your saved videos"
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle={`No Bookmarks found`}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Bookmark;
