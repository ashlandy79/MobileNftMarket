import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/auth-store";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  Settings,
  LogOut,
  Copy,
  ChevronDown,
  Heart,
  TrendingUp,
  Package,
} from "lucide-react-native";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("Collected");
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/welcome");
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Mock data
  const userData = {
    name: "Helo Pamaddog",
    walletAddress: "0x8a3CfF...4b2d",
    stats: {
      items: 24,
      balance: "4.2",
      tradedVolume: "12.5",
    },
  };

  const nftData = [
    {
      id: 1,
      name: "Azuki #999",
      price: "12.5 ETH",
      image: require("@/assets/images/pic1.png"),
    },
    {
      id: 2,
      name: "Bored Ape #456",
      price: "45.2 ETH",
      image: require("@/assets/images/pic2.png"),
    },
    {
      id: 3,
      name: "CryptoPunk #789",
      price: "120.0 ETH",
      image: require("@/assets/images/pic3.png"),
    },
    {
      id: 4,
      name: "Doodle #321",
      price: "8.7 ETH",
      image: require("@/assets/images/pic1.png"),
    },
    {
      id: 5,
      name: "Cool Cat #654",
      price: "6.3 ETH",
      image: require("@/assets/images/pic2.png"),
    },
    {
      id: 6,
      name: "WorldWide #987",
      price: "15.8 ETH",
      image: require("@/assets/images/pic3.png"),
    },
  ];

  const activityData = [
    {
      id: 1,
      action: "Bought",
      nftName: "Azuki #999",
      amount: "12 ETH",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Sold",
      nftName: "Bored Ape #456",
      amount: "45 ETH",
      time: "1 day ago",
    },
    {
      id: 3,
      action: "Listed",
      nftName: "CryptoPunk #789",
      amount: "120 ETH",
      time: "3 days ago",
    },
  ];

  const copyToClipboard = () => {
    // In a real app, you would use Clipboard.setString(userData.walletAddress)
    console.log("Copied:", userData.walletAddress);
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 150], [1, 0]);

    return {
      opacity,
    };
  });

  const renderTabContent = () => {
    if (activeTab === "Collected") {
      return (
        <View style={styles.gridContainer}>
          {nftData.map((nft) => (
            <TouchableOpacity key={nft.id} style={styles.nftCard}>
              <Image source={nft.image} style={styles.nftImage} />
              <Text style={styles.nftName}>{nft.name}</Text>
              <Text style={styles.nftPrice}>{nft.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else if (activeTab === "Activity") {
      return (
        <View style={styles.activityContainer}>
          {activityData.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                {activity.action === "Bought" && (
                  <Package size={20} color="#007AFF" />
                )}
                {activity.action === "Sold" && (
                  <TrendingUp size={20} color="#FF4D4D" />
                )}
                {activity.action === "Listed" && (
                  <Heart size={20} color="#FFD700" />
                )}
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityAction}>
                  {activity.action}{" "}
                  <Text style={styles.activityNftName}>{activity.nftName}</Text>
                </Text>
                <Text style={styles.activityAmount}>{activity.amount}</Text>
              </View>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))}
        </View>
      );
    } else {
      return (
        <View style={styles.favoritesContainer}>
          <Text style={styles.sectionPlaceholder}>
            Favorites content coming soon...
          </Text>
        </View>
      );
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom }
        ]}
      >
        <View style={[styles.headerContainer, { paddingTop: insets.top + 20, paddingBottom: insets.bottom}]}>
          <Header showBackButton={true} showShareButton={true} />
        </View>
        <Animated.ScrollView
          style={styles.scrollContainer}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header Image (Banner) */}
          <View style={styles.bannerContainer}>
            <Image
              source={require("@/assets/images/pic1.png")}
              style={styles.bannerImage}
              blurRadius={2}
            />
            <LinearGradient
              colors={["transparent", "#1A1A1A"]}
              style={styles.bannerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />

            {/* Settings/Logout button */}
            {/* <TouchableOpacity style={styles.settingsButton} onPress={() => {}}>
            <Settings size={24} color="#FFFFFF" />
          </TouchableOpacity> */}
          </View>

          {/* User Identity Section */}
          <View style={styles.profileInfoContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={require("@/assets/images/pic2.png")}
                style={styles.avatar}
              />
              <TouchableOpacity
                style={styles.copyButton}
                onPress={copyToClipboard}
              >
                <Copy size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.profileName}>{userData.name}</Text>
            <TouchableOpacity
              style={styles.walletAddressContainer}
              onPress={copyToClipboard}
            >
              <Text style={styles.walletAddress}>{userData.walletAddress}</Text>
              <Copy size={14} color="#888888" />
            </TouchableOpacity>

            {/* Stats Card (Glassmorphism) */}
            <BlurView intensity={80} tint="dark" style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userData.stats.items}</Text>
                <Text style={styles.statLabel}>Items</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {userData.stats.balance} ETH
                </Text>
                <Text style={styles.statLabel}>Balance</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {userData.stats.tradedVolume} ETH
                </Text>
                <Text style={styles.statLabel}>Volume</Text>
              </View>
            </BlurView>
          </View>

          {/* Content Tabs (Sticky) */}
          <View style={styles.tabsContainer}>
            {["Collected", "Activity", "Favorited"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
                {activeTab === tab && (
                  <View style={styles.activeTabIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Content Views */}
          <View style={styles.contentContainer}>{renderTabContent()}</View>

          <View style={styles.spacer} />
        </Animated.ScrollView>

        {/* Logout Button */}
        {/* <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FF4D4D" />
          <Text style={styles.logoutButtonText}>Disconnect Wallet</Text>
        </TouchableOpacity>
      </View> */}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    position: "relative",
  },
  headerContainer: {
    width: "100%",
    position: "absolute",
    zIndex: 10,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  bannerContainer: {
    height: 220,
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  bannerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  settingsButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  profileInfoContainer: {
    marginTop: -50,
    paddingHorizontal: 20,
    zIndex: 5,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#1A1A1A",
    backgroundColor: "#2A2A2A",
  },
  copyButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  walletAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 20,
  },
  walletAddress: {
    fontSize: 14,
    color: "#888888",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#888888",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
    position: "relative",
  },
  activeTab: {
    // Styles for active tab handled in component
  },
  tabText: {
    fontSize: 16,
    color: "#888888",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    width: 20,
    height: 3,
    backgroundColor: "#FF4D4D",
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  nftCard: {
    width: (SCREEN_WIDTH - 40 - 10) / 2, // Account for padding and gap
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  nftImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  nftName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    padding: 10,
  },
  nftPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  activityContainer: {
    flex: 1,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityAction: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  activityNftName: {
    color: "#007AFF",
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
  },
  activityTime: {
    fontSize: 12,
    color: "#888888",
  },
  favoritesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  sectionPlaceholder: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
  },
  spacer: {
    height: 100, // Add space at the bottom to account for logout button
  },
  logoutContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 77, 77, 0.1)",
    borderWidth: 1,
    borderColor: "#FF4D4D",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF4D4D",
  },
});
