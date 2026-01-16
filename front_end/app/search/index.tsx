import { Image } from "expo-image";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Pressable,
} from "react-native";
import { Search, ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

// 搜索结果项类型
type SearchResult = {
  id: number;
  name: string;
  price: string;
  image: any;
  owner: string;
  highestBid: string;
};

// 模拟NFT数据
const mockNFTData: SearchResult[] = [
  {
    id: 1,
    name: "Cosmic Dream",
    price: "1.25 ETH",
    image: require("@/assets/images/pic1.png"),
    owner: "Zizzler",
    highestBid: "1.25 ETH",
  },
  {
    id: 2,
    name: "Neon Dreams",
    price: "0.95 ETH",
    image: require("@/assets/images/pic2.png"),
    owner: "Alice",
    highestBid: "0.95 ETH",
  },
  {
    id: 3,
    name: "Golden Hour",
    price: "1.5 ETH",
    image: require("@/assets/images/pic3.png"),
    owner: "Bob",
    highestBid: "1.5 ETH",
  },
  {
    id: 4,
    name: "Ocean Breeze",
    price: "0.75 ETH",
    image: require("@/assets/images/react-logo.png"),
    owner: "Charlie",
    highestBid: "0.75 ETH",
  },
  {
    id: 5,
    name: "Starlight Serenade",
    price: "2.1 ETH",
    image: require("@/assets/images/pic1.png"),
    owner: "David",
    highestBid: "2.1 ETH",
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const insets = useSafeAreaInsets();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    
    // 模拟搜索逻辑
    const results = mockNFTData.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.owner.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  };

  const handleBack = () => {
    // 导航返回上一页
    router.back();
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <Pressable style={styles.resultItem}>
      <Image source={item.image} style={styles.resultImage} contentFit="cover" />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultPrice}>{item.price}</Text>
        <Text style={styles.resultOwner}>Owner: {item.owner}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* 搜索栏 */}
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#888888" style={styles.searchIcon} />
          <TextInput
            placeholder="Search NFTs..."
            placeholderTextColor="#888888"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
      </View>

      {/* 搜索结果列表 */}
      {searchQuery ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSearchResult}
          style={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Enter a keyword to search NFTs</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1A1A1A",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  resultPrice: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  resultOwner: {
    color: "#888888",
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    color: "#888888",
    fontSize: 16,
    textAlign: "center",
  },
});