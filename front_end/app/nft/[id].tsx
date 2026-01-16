import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Header } from "@/components/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { Heart, Clock, DollarSign } from "lucide-react-native";
import SlideButton from "@/components/SlideButton";

export default function NFTDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const nftData = {
    id: id as string,
    name: "EVOL Chux #102",
    image: require("@/assets/images/pic1.png"),
    owner: "Zizzler",
    highestBid: "28.04 ETH",
    description: "An exclusive digital collectible in the EVOL collection.An exclusive digital collectible in the EVOL collection.An exclusive digital collectible in the EVOL collection.An exclusive digital collectible in the EVOL collection.An exclusive digital collectible in the EVOL collection.An exclusive digital collectible in the EVOL collection.An exclusive digital collectible in the EVOL collection.",
    attributes: [
      { trait_type: "Rarity", value: "Epic" },
      { trait_type: "Collection", value: "EVOL Series" },
      { trait_type: "Edition", value: "#102/1000" },
    ],
  };

  // Tab state
  const [activeTab, setActiveTab] = useState("Details");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.headerContainer}>
          <Header
            showBackButton={true}
            title={nftData.name}
            showMoreButton={true}
          />
        </View>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.card}>
            <Image source={nftData.image} style={styles.nftImage} />
          </View>

          {/* Collection Info Row */}
          <View style={styles.collectionInfoRow}>
            <View style={styles.avatarContainer}>
              <Image source={nftData.image} style={styles.avatar} />
              <View style={styles.verifiedBadge}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#FFFFFF",
                  }}
                />
              </View>
            </View>

            <View style={styles.collectionTextContainer}>
              <Text style={styles.collectionName}>D'EVOLs</Text>
              <Text style={styles.ownerText}>Owned by {nftData.owner}</Text>
            </View>

            <View style={styles.spacer} />

            <TouchableOpacity style={styles.heartButton}>
              <Heart size={24} color="#FF4D4D" />
            </TouchableOpacity>
          </View>

          {/* Stats Grid (Bid & Time) */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <DollarSign size={36} color="#FFFFFF" style={styles.cardIcon} />
              <View>
                <Text style={styles.statLabel}>Highest Bid</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.statValue}>{nftData.highestBid}</Text>
                </View>
              </View>
            </View>

            <View style={styles.statCard}>
              <Clock size={36} color="#FFFFFF" style={styles.cardIcon} />
              <View>
                <Text style={styles.statLabel}>Ending In</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.statValue}>2h 4m 32s</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tabs Section */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === "Details" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Details")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Details" && styles.activeTabText,
                ]}
              >
                Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === "Owners" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Owners")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Owners" && styles.activeTabText,
                ]}
              >
                Owners
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === "Bids" && styles.activeTab]}
              onPress={() => setActiveTab("Bids")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Bids" && styles.activeTabText,
                ]}
              >
                Bids
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === "History" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("History")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "History" && styles.activeTabText,
                ]}
              >
                History
              </Text>
            </TouchableOpacity>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{nftData.description}</Text>
          </View>
        </ScrollView>
        
        {/* 滑动付费组件，固定定位在距离页面底部20像素的位置 */}
        <View style={styles.slideButtonFixedPosition}>
          <SlideButton bid={true} />
        </View>
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
  card: {
    width: "100%",
    height: 400,
    borderRadius: 20,
    overflow: "hidden",
  },
  nftImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  collectionInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeIcon: {
    width: 10,
    height: 10,
  },
  collectionTextContainer: {},
  collectionName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  ownerText: {
    fontSize: 14,
    color: "#888888",
  },
  spacer: {
    flex: 1,
  },
  heartButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#252525",
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 50,
    padding: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#888888",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardIcon: {
    marginHorizontal: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
  },
  tabItem: {
    paddingBottom: 4,
    width: "25%",
    alignSelf: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#2a2a2a",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FFFFFF",
  },
  tabText: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  descriptionContainer: {
    marginTop: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#A0A0A0",
    lineHeight: 22,
  },
  slideButtonFixedPosition: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
