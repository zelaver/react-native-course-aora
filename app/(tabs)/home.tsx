import { View, Text, SafeAreaView, FlatList, Image, RefreshControlComponent, RefreshControl, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { getAllPost, getLatestPost } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";

const Home = () => {
  // const {data: posts, isLoadingPost, refetch} = useAppwrite(getAllPost);
  const {posts, isLoadingPost, refetch} : any = useGlobalContext();

  const {data: latestPosts } = useAppwrite(getLatestPost);
  
  // console.log(posts[0].likes)

  const [refreshing, setRefreshing] = useState<boolean>(false)
  const onRefresh = async () => {
    setRefreshing(true)
    // re call videos -> if any new videos
    await refetch();
    setRefreshing(false)
  }

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

  return (
    <SafeAreaView className="bg-primary border-2 h-full">
      <FlatList
        data={posts}
        // posts={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        keyExtractor={(item) => `${item.$id}`}
        renderItem={({ item }) => <VideoCard video={item}/>}
        ListHeaderComponent={() => (
          <View className="my-12 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Welcome Back</Text>
                <Text className="text-2xl font-psemibold text-white">Jegal Rousaver</Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />  
              </View>
            </View>
            <SearchInput placeholder="Search for a video topic" />

            <View className={`w-full flex-1 pt-5 pb-8`}>
              <Text className="text-gray-100 text-lg font-pregular mb-3"> Latest Videos</Text>
              <Trending posts={latestPosts}/>
            </View>
          </View>
        )}
        

        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Try to make your own video"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  );
};

export default Home;
