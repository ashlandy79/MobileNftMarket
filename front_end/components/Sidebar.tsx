import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { router, useSegments } from "expo-router";
import { DollarSign, Bell, Copy } from "lucide-react-native";
interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const screenWidth = Dimensions.get("window").width;
  const sidebarOffset = useSharedValue(screenWidth * 0.7); // 初始值在屏幕右侧外 (70%的屏幕宽度)

  const segments = useSegments();

  // 侧边栏动画样式
  const sidebarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: sidebarOffset.value,
        },
      ],
    };
  });

  // 改进的路由匹配逻辑
  const isRouteActive = (path: string) => {
    if (path === '/') {
      // 对于首页，检查当前是否在 tabs 布局中（首页通常显示在 (tabs) 布局下）
      return segments[0] === '(tabs)';
    }
    
    // 对于其他路由，检查路径的第一部分是否匹配
    const pathSegment = path.split('/')[1]; // 获取路径的第一个部分
    return segments.length > 0 && segments[0] === pathSegment;
  };

  // 更新侧边栏可见性时触发动画
  useEffect(() => {
    if (isVisible) {
      // 从右边滑入（从屏幕右侧外移到0）
      sidebarOffset.value = withTiming(0, { duration: 300 });
    } else {
      // 滑出到右边（从0移到屏幕右侧外）
      sidebarOffset.value = withTiming(screenWidth * 0.7, { duration: 300 });
    }
  }, [isVisible]);

  const closeSidebar = () => {
    onClose();
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeSidebar}
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.sidebarContainer, sidebarAnimatedStyle]}>
          {/* 顶部：资产 */}
          <View style={styles.sidebarTopSection}>
            <View style={styles.assetInfoContainer}>
              <View style={styles.assetEth}>
                <View style={styles.assetLeft}>
                  <DollarSign size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.assetRight}>2.58 ETH</Text>
              </View>
              <Bell size={20} color="#FFFFFF" />
            </View>
            <View style={styles.copyButton}>
              <Text style={styles.copyButtonText}>Address：0x1234567890</Text>
              <TouchableOpacity>
                <Copy size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 中部：核心导航 */}
          <View style={styles.navSection}>
            {[
              { name: "FrontPage", path: "/" },
              { name: "Rankings", path: "/ranking" },
              { name: "Profile", path: "/profile" },
            ].map((navItem, index) => {
              const isActive = isRouteActive(navItem.path); // 使用改进的路由匹配逻辑

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={() => {
                    router.push(navItem.path as any);
                    closeSidebar();
                  }}
                >
                  <Text
                    style={[styles.navText, isActive && styles.navTextActive]}
                  >
                    {navItem.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  sidebarContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "70%",
    height: "100%",
    backgroundColor: "#1A1A1A",
    padding: 0,
    justifyContent: "flex-start",
  },
  sidebarTopSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  sidebarTopTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  assetInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  assetEth: {
    backgroundColor: "#FFFFFF",
    padding: 4,
    borderRadius: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  assetLeft: {
    width: 40,
    height: 40,
    backgroundColor: "#000000",
    borderRadius: "50%",
    borderWidth: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  assetRight: {
    color: "#000000",
    fontSize: 16,
    marginHorizontal: 8,
  },
  assetValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  copyButton: {
    width: "100%",
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  copyButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    // marginRight: 16,
  },
  navSection: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  navSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  navItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  navText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  navItemActive: {
    backgroundColor: "#4A4A4A",
  },
  navTextActive: {
    fontWeight: "bold",
    color: "#FFD500",
  },
});

export default Sidebar;
