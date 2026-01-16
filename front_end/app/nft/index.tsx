import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Header } from "@/components/Header";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Image } from 'expo-image';

export default function NFTListScreen() {
  const insets = useSafeAreaInsets();
  
  // 示例 NFT 数据
  const nfts = [
    {
      id: "#102_EVOL_Chux",
      name: "EVOL Chux #102",
      image: require('@/assets/images/pic1.png'),
      price: "28.04 ETH",
    },
    {
      id: "#103_Starlight",
      name: "Starlight #103", 
      image: require('@/assets/images/pic2.png'),
      price: "32.15 ETH",
    },
    {
      id: "#104_Neon_Dreams",
      name: "Neon Dreams #104",
      image: require('@/assets/images/pic3.png'), 
      price: "18.75 ETH",
    }
  ];

  const handleNFTPress = (id: string) => {
    router.push(`/nft/${id}`);
  };

  const renderNFT = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.nftItem} 
      onPress={() => handleNFTPress(item.id)}
    >
      <Image source={item.image} style={styles.nftItemImage} />
      <View style={styles.nftItemInfo}>
        <Text style={styles.nftItemName}>{item.name}</Text>
        <Text style={styles.nftItemPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>      
        <View style={styles.headerContainer}>
          <Header showBackButton={false} title="NFTs" />
        </View>
        
        <FlatList
          data={nfts}
          renderItem={renderNFT}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1A1A1A",
  },
  contentContainer: {
    paddingBottom: 80,
  },
  headerContainer: {
    paddingVertical: 20,
    backgroundColor: "#1A1A1A",
  },
  list: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nftItem: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    width: '48%', // 为两列布局留出空间
    marginBottom: 16,
  },
  nftItemImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  nftItemInfo: {
    alignItems: 'flex-start',
  },
  nftItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  nftItemPrice: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});