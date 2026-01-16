import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import {
  SquareMenu,
  ArrowLeft,
  MoreHorizontal,
  User,
  Share
} from "lucide-react-native";
import { router } from "expo-router";

// Header组件
export const Header = ({
  title,
  showMenuButton = false,
  showBackButton = false,
  showMoreButton = false,
  showShareButton = false,
  onBackPress,
  onMorePress,
  onMenuPress,
}: {
  title?: string;
  showMenuButton?: boolean;
  showBackButton?: boolean;
  showMoreButton?: boolean;
  showShareButton?: boolean;
  onBackPress?: () => void;
  onMorePress?: () => void;
  onMenuPress?: () => void;
}) => {
  // 默认的返回上一页功能
  const defaultBackPress = () => {
    router.back();
  };
  
  // 使用传入的 onBackPress 或默认的返回功能
  const handleBackPress = onBackPress || defaultBackPress;
  return (
    <View style={[styles.headerContainer]}>
      <View style={styles.headerLeft}>
        {showBackButton ? (
          <TouchableOpacity style={styles.RadiusButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={handleBackPress}>
              <View style={styles.circle}>
                <User size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Ashley Miller</Text>
              <Text style={styles.userSubInfo}>1.2K News Upload</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.headerCenter}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.headerRight}>
        {showMenuButton ? (
          <TouchableOpacity onPress={onMenuPress}>
            <View style={styles.circle}>
              <SquareMenu size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        ) : null}
        {showMoreButton ? (
          <TouchableOpacity onPress={onMorePress} style={styles.RadiusButton}>
            <MoreHorizontal size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null}
        {showShareButton ? (
          <TouchableOpacity style={styles.RadiusButton}>
            <Share size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null}
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    // Right-aligned content
  },
  headerCenter:{
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    marginRight: 12,
    backgroundColor: "#FFFFFF",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: "#2A2A2A",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  userSubInfo: {
    fontSize: 14,
    color: "#888888",
  },
  RadiusButton: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: "#2A2A2A",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
