import { Image } from "expo-image";
import {
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { Link, router, useSegments } from "expo-router";
import { BlurView } from "expo-blur";
import {
  Heart,
  Search,
  SquareMenu,
  ArrowLeft,
  DollarSign,
} from "lucide-react-native";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDecay,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Sidebar from "@/components/Sidebar";
// 搜索栏组件
const SearchBar = () => {
  const handlePress = () => {
    router.push('/search' as any);
  };
  
  return (
    <TouchableOpacity style={styles.searchContainer} onPress={handlePress} activeOpacity={0.7}>
      <Search size={20} color="#FFFFFF" style={styles.searchIcon} />
      <TextInput
        placeholder="Search NFTs..."
        placeholderTextColor="#FFFFFF"
        style={styles.searchInput}
        editable={false} // 禁用输入，只响应点击
        selectTextOnFocus={false} // 防止聚焦时选中文本
      />
    </TouchableOpacity>
  );
};

// 分类标签组件
const CategoryItem = ({
  title,
  isSelected,
  onPress,
}: {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable
      style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
      onPress={onPress}
    >
      <Text
        style={[styles.categoryText, isSelected && styles.categoryTextSelected]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const nftData = {
  id: "#102 EVOL Chux",
  image: require("@/assets/images/pic1.png"), // 替换为你的 NFT 图片
  owner: "Zizzler",
  highestBid: "28.14 ETH",
};

const Card = ({
  item,
  index,
  currentIndex,
  onSwipeComplete,
  totalCards,
}: {
  item: { id: string; image: any; owner: string; highestBid: string };
  index: number;
  currentIndex: number;
  onSwipeComplete: (index: number) => void;
  totalCards: number;
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const isTopCard = index === currentIndex;
  
  // 使用最新的 Gesture.Pan() 语法
  const panGesture = Gesture.Pan()
    .enabled(isTopCard) // 只有顶层卡片可以滑动
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > 100) {
        // 甩出动画
        translateX.value = withDecay({ velocity: event.velocityX });
        translateY.value = withDecay({ velocity: event.velocityY });

        // 通知父组件切换卡片
        runOnJS(onSwipeComplete)(index);
      } else {
        // 弹回原位
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateZ: `${translateX.value / 20}deg` },
    ],
  }));

  // 计算下一张卡片的索引（考虑循环）
  const nextIndex = (currentIndex + 1) % totalCards;
  const isNextCard = index === nextIndex;
  
  const cardStyle = [
    styles.card,
    isTopCard ? animatedStyle : null,
    { zIndex: isTopCard ? 10 : isNextCard ? 5 : 0 },
    isNextCard && {
      transform: [{ scale: 0.92 }, { translateY: 30 }], // 增加位移让它露出来
      opacity: 0.5,
    },
  ];

  // 只渲染当前卡片或下一张卡片
  if (!isTopCard && !isNextCard) return null;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={cardStyle}>
        <Image source={item.image} style={styles.nftImage} />
        <BlurView intensity={70} tint="default" style={styles.topRightHeart}>
          <TouchableOpacity activeOpacity={0.7}>
            <Heart size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </BlurView>

        <BlurView intensity={70} tint="default" style={[styles.bottomToolbar]}>
          <View style={styles.bidInfo}>
            <DollarSign size={40} color="#FFFFFF" />
            <View style={styles.centerBidInfo}>
              <Text style={styles.currentBidText}>Current Bid</Text>
              <Text style={styles.toolbarBidValue}>{item.highestBid}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.placeBidButton} activeOpacity={0.7} onPress={() => {
            // 清理 ID 以确保它适合用作 URL 参数
            const cleanId = encodeURIComponent(item.id.replace(/[^a-zA-Z0-9-_]/g, '_'));
            router.push(`/nft/${cleanId}`);
          }}>
            <Text style={styles.placeBidButtonText}>Place Bid</Text>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>
    </GestureDetector>
  );
};

// 主推荐卡片组件
const FeaturedCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 示例数据数组
  const nftCards: {
    id: string;
    image: any;
    owner: string;
    highestBid: string;
  }[] = [
    {
      id: "#102 EVOL Chux",
      image: require("@/assets/images/pic1.png"),
      owner: "Zizzler",
      highestBid: "28.04 ETH",
    },
    {
      id: "#103 Starlight",
      image: require("@/assets/images/pic2.png"),
      owner: "Alice",
      highestBid: "32.15 ETH",
    },
    {
      id: "#104 Neon Dreams",
      image: require("@/assets/images/pic3.png"),
      owner: "Bob",
      highestBid: "18.75 ETH",
    },
  ];

  const handleSwipeComplete = (swipedIndex: number) => {
    // 如果是最后一张卡片，则循环回到第一张
    if (swipedIndex === currentIndex) {
      if (currentIndex === nftCards.length - 1) {
        setCurrentIndex(0); // 循环到第一张
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  return (
    <View style={styles.imageContainer}>
      {nftCards.map((item, index) => {
        // 使用模运算实现循环，确保总是显示当前和下一张（循环）
        const actualCurrentIndex = currentIndex % nftCards.length;
        const actualNextIndex = (currentIndex + 1) % nftCards.length;
        
        if (index === actualCurrentIndex || index === actualNextIndex) {
          return (
            <Card
              key={`${item.id}-${index}`}
              item={item}
              index={index}
              currentIndex={actualCurrentIndex}
              onSwipeComplete={handleSwipeComplete}
              totalCards={nftCards.length}
            />
          );
        }
        return null;
      })}
    </View>
  );
};

// Top Sellers项目组件
const TopSellerItem = ({
  name,
  price,
  image,
}: {
  name: string;
  price: string;
  image: any;
}) => {
  return (
    <View style={styles.topSellerItem}>
      <Image source={image} style={styles.topSellerImage} contentFit="cover" />
      <View style={styles.topSellerInfo}>
        <Text style={styles.topSellerName}>{name}</Text>
        <Text style={styles.topSellerPrice}>{price} ETH</Text>
      </View>
      <TouchableOpacity style={styles.topSellerButton}>
        <Text style={styles.topSellerButtonText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const insets = useSafeAreaInsets();

  // 获取当前路由信息
  const segments = useSegments();
  
  // 定义应用的所有路由
  const appRoutes = [
    "/",
    "/search",
    "/profile",
    "/explore",
    "/ranking",
    "/modal",
    "/nft/[id]",
  ];

  // 处理菜单按钮点击
  const handleMenuPress = () => {
    setIsSidebarOpen(true);
  };

  // 关闭侧边栏
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };



  const categories = [
    "All",
    "Music",
    "Domain Names",
    "Virtual Worlds",
    "Trading Cards",
    "Collectibles",
    "Sports",
    "Utility",
  ];

  const topSellers = [
    {
      id: 1,
      name: "Starlight Serenade",
      price: "0.75",
      image: require("@/assets/images/pic1.png"),
    },
    {
      id: 2,
      name: "Neon Dreams",
      price: "1.2",
      image: require("@/assets/images/pic2.png"),
    },
    {
      id: 3,
      name: "Golden Hour",
      price: "0.9",
      image: require("@/assets/images/pic3.png"),
    },
    {
      id: 4,
      name: "Ocean Breeze",
      price: "1.5",
      image: require("@/assets/images/react-logo.png"),
    },
  ];
  
  const onRefresh = () => {
    setRefreshing(true);
    // 模拟数据刷新
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>      
        <View style={styles.headerContainer}>
          <Header showMenuButton={true} onMenuPress={handleMenuPress} />
        </View>

        <ScrollView 
          style={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#007AFF"]} // iOS刷新颜色
              progressBackgroundColor="#1A1A1A" // Android刷新背景色
            />
          }
        >
          {/* Search Bar */}
          <SearchBar />

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <FlatList
              horizontal
              data={categories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <CategoryItem
                  title={item}
                  isSelected={index === selectedCategory}
                  onPress={() => setSelectedCategory(index)}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Collections</Text>
              <TouchableOpacity>
                <Text style={styles.sectionSeeAll}>See All</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Featured Card */}
          <FeaturedCard />

          {/* Top Sellers Section */}
          <View style={styles.topSellersSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Sellers</Text>
              <TouchableOpacity>
                <Text style={styles.sectionSeeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.topSellersList}>
              {topSellers.map((item) => (
                <TopSellerItem
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* 侧边栏弹窗 */}
        <Sidebar isVisible={isSidebarOpen} onClose={closeSidebar} />
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 40,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  categoriesContainer: {},
  categoriesList: {
    paddingRight: 20,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
  },
  categoryItemSelected: {
    backgroundColor: "#FFFFFF",
  },
  categoryText: {
    color: "#888888",
    fontSize: 14,
  },
  categoryTextSelected: {
    color: "#000000",
    fontWeight: "600",
  },
  topSellersSection: {
    // Top sellers section container
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sectionSeeAll: {
    color: "#888888",
    fontSize: 16,
  },
  topSellersList: {
    gap: 16,
  },
  topSellerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 60,
    padding: 12,
  },
  topSellerImage: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginRight: 12,
  },
  topSellerInfo: {
    flex: 1,
  },
  topSellerName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  topSellerPrice: {
    color: "#888888",
    fontSize: 14,
  },
  topSellerButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  topSellerButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: "transparent",
    position: "relative",
    width: "100%",
    height: 415,
    borderRadius: 20,
    overflow: "hidden",
  },
  card: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: 400,
    borderRadius: 20,
    overflow: "hidden"
  },
  nftImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  // NFT 图片红心
  topRightHeart: {
    position: "absolute",
    top: 30,
    right: 20,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  // 底部固定出价工具条 (带毛玻璃效果)
  bottomToolbar: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    transform: [{ translateX: 20 }],
    width: "90%",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 40,
    overflow: "hidden",
  },
  bidInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftBidInfo: {},
  centerBidInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 4,
    marginLeft: 10,
  },
  currentBidText: {
    color: "#888888",
    fontSize: 14,
  },
  toolbarBidValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  placeBidButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 40,
  },
  placeBidButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  routeItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  routeText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
