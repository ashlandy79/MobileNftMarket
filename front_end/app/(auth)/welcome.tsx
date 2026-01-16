import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Lock, ChevronsRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useFonts } from "@/hooks/use-fonts";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/stores/auth-store";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  runOnJS,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { useColorScheme } from 'nativewind';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 轮播图数据
const CAROUSEL_DATA = [
  { id: 1, image: require("@/assets/images/pic1.png"), bgColor: "#E5E5E5" },
  { id: 2, image: require("@/assets/images/pic2.png"), bgColor: "#FFE5E5" },
  { id: 3, image: require("@/assets/images/pic3.png"), bgColor: "#E5FFE5" },
];

// 轮播图视差效果常量
const CARD_WIDTH = 280; // 卡片宽度
const CARD_HEIGHT = 340; // 卡片高度
const CARD_SPACING = 30; // 卡片间距
const SIDE_CARD_SCALE = 0.85; // 侧边卡片缩放比例
const CENTER_CARD_SCALE = 1.0; // 中心卡片缩放比例

const SLIDE_THRESHOLD = SCREEN_WIDTH * 0.8 * 0.9; // 滑动解锁阈值

export default function OnboardingScreen() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuthStore();
  const { fontsLoaded } = useFonts();

  // 轮播图状态
  const [activeIndex, setActiveIndex] = useState(0);
  const animatedIndex = useSharedValue(0); // 动画索引，支持小数以实现平滑过渡

  // 滑动解锁状态
  const translateX = useSharedValue(0);
  const arrowOpacity = useSharedValue(1);

  // 自动轮播定时器
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 滑动解锁成功回调
  const handleUnlockSuccess = () => {
    // 更新登录状态
    setIsLoggedIn(true);
    // 跳转到主页面
    router.replace("/(tabs)");
  };

  // 手势处理
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // 只允许向右滑动，且不超过阈值
      translateX.value = Math.max(
        0,
        Math.min(event.translationX, SLIDE_THRESHOLD)
      );
    })
    .onEnd((event) => {
      // 判断是否达到解锁阈值
      if (translateX.value >= SLIDE_THRESHOLD) {
        // 解锁成功
        translateX.value = withTiming(SLIDE_THRESHOLD, { duration: 200 });
        runOnJS(handleUnlockSuccess)();
      } else {
        // 未达到阈值，回弹
        translateX.value = withTiming(0, { duration: 300 });
      }
    });

  // 生成每张卡片的动画样式（支持所有卡片同时渲染）
  const getCardAnimatedStyle = (cardIndex: number) => {
    return useAnimatedStyle(() => {
      // 处理循环：计算卡片相对于当前激活索引的实际位置
      let position = cardIndex - animatedIndex.value;
      
      // 修正循环边界，确保平滑过渡
      // 当位置差距大于数组长度的一半时，说明是循环边界
      const halfLength = CAROUSEL_DATA.length / 2;
      if (position > halfLength) {
        position -= CAROUSEL_DATA.length;
      } else if (position < -halfLength) {
        position += CAROUSEL_DATA.length;
      }

      // 位置偏移：左侧 -> 中心 -> 右侧
      const translateX = interpolate(
        position,
        [-1, 0, 1],
        [
          -(CARD_WIDTH + CARD_SPACING), // 左侧位置
          0,                             // 中心位置
          (CARD_WIDTH + CARD_SPACING),  // 右侧位置
        ],
        Extrapolate.CLAMP
      );

      // 缩放比例：侧边小 -> 中心大 -> 侧边小
      const scale = interpolate(
        position,
        [-1, 0, 1],
        [
          SIDE_CARD_SCALE,   // 左侧缩放
          CENTER_CARD_SCALE, // 中心缩放
          SIDE_CARD_SCALE,   // 右侧缩放
        ],
        Extrapolate.CLAMP
      );

      // 透明度：侧边半透明 -> 中心不透明 -> 侧边半透明
      const opacity = interpolate(
        position,
        [-1, 0, 1],
        [0.6, 1, 0.6],
        Extrapolate.CLAMP
      );

      // 层级（zIndex）：中心最高
      const zIndex = interpolate(
        Math.abs(position),
        [0, 1],
        [10, 0],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ translateX }, { scale }],
        opacity,
        zIndex: Math.round(zIndex),
      };
    });
  };

  // 为每张卡片创建动画样式
  const card0Style = getCardAnimatedStyle(0);
  const card1Style = getCardAnimatedStyle(1);
  const card2Style = getCardAnimatedStyle(2);

  // 滑块动画样式
  const sliderAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // 箭头动画样式
  const arrowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: arrowOpacity.value,
    };
  });

  // ✅ 所有 Hooks 必须在条件判断之前调用完毕
  // 轮播图自动播放逻辑
  useEffect(() => {
    if (!fontsLoaded) return; // 字体未加载时不执行

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = (prev + 1) % CAROUSEL_DATA.length;
        // 平滑动画到下一个索引
        animatedIndex.value = withSpring(nextIndex, {
          damping: 20,
          stiffness: 90,
        });
        return nextIndex;
      });
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fontsLoaded]);

  // 箭头闪烁动画
  useEffect(() => {
    if (!fontsLoaded) return; // 字体未加载时不执行

    arrowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1, // 无限循环
      true
    );
  }, [fontsLoaded]);

  // 字体加载完成前不渲染内容
  if (!fontsLoaded) {
    return null;
  }

  // ✅ 所有 Hooks 已在此之前调用完毕，现在可以安全返回 JSX
  return (
    <GestureHandlerRootView style={styles.flex1}>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {/* 顶部轮播图区域 ~55% */}
        <View style={styles.carouselSection}>
          {/* 轮播图卡片容器 */}
          <View style={styles.carouselContainer}>
            {/* 渲染所有卡片，通过动画控制位置和缩放 */}
            <Animated.View style={[styles.carouselCard, card0Style]}>
              <Image
                source={CAROUSEL_DATA[0].image}
                style={styles.cardImage}
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.View style={[styles.carouselCard, card1Style]}>
              <Image
                source={CAROUSEL_DATA[1].image}
                style={styles.cardImage}
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.View style={[styles.carouselCard, card2Style]}>
              <Image
                source={CAROUSEL_DATA[2].image}
                style={styles.cardImage}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          {/* 分页指示器 */}
          <View style={styles.pagination}>
            {CAROUSEL_DATA.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeIndex ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* 中间文本内容区 ~25% */}
        <View style={styles.textSection}>
          <Text style={styles.headline}>
            Find, Collect and Sell{"\n"}Amazing NFTs
          </Text>
          <Text style={styles.subheadline}>
            Explore the top collection of NFTs and{"\n"}buy and sell your NFTs
            as well
          </Text>
        </View>

        {/* 底部操作按钮区 ~20% */}
        <View style={styles.actionSection}>
          <View style={styles.slideButtonContainer}>
            {/* 滑动轨道 */}
            <View style={styles.slideTrack}>
              <Text style={styles.trackText}>Slide to Get Started</Text>
            </View>

            {/* 可拖拽的滑块 */}
            <GestureDetector gesture={panGesture}>
              <Animated.View style={[styles.slider, sliderAnimatedStyle]}>
                <View style={styles.iconCircle}>
                  <Lock color="#FFFFFF" size={24} />
                </View>
              </Animated.View>
            </GestureDetector>

            {/* 右侧闪烁箭头 */}
            <Animated.View style={[styles.arrowsContainer, arrowAnimatedStyle]}>
              <ChevronsRight color="#FFFFFF" size={24} />
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden", // 防止内容溢出
  },

  // 顶部轮播图区域 ~55%
  carouselSection: {
    flex: 0.55,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: SCREEN_WIDTH,
    overflow: "hidden", // 防止卡片溢出
  },

  // 轮播图容器
  carouselContainer: {
    width: SCREEN_WIDTH,
    height: CARD_HEIGHT + 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden", // 裁剪超出部分
  },

  // 轮播卡片样式
  carouselCard: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 40,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  // 分页指示器
  pagination: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    zIndex: 100,
  },
  dot: {
    borderRadius: 10,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "transparent",
  },
  inactiveDot: {
    width: 8,
    height: 8,
    backgroundColor: "#000000",
  },

  // 中间文本内容区 ~25%
  textSection: {
    flex: 0.25,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    width: SCREEN_WIDTH,
  },
  headline: {
    fontSize: 30,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 12,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: "400",
    color: "#666666",
    textAlign: "center",
    lineHeight: 22.5,
    width: "80%",
  },

  // 底部操作按钮区 ~20%
  actionSection: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
    width: SCREEN_WIDTH,
  },

  // 滑动解锁容器
  slideButtonContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: 70,
    position: "relative",
  },

  // 滑动轨道
  slideTrack: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },

  trackText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.6,
  },

  // 可拖拽滑块
  slider: {
    position: "absolute",
    left: 8,
    top: 5,
    zIndex: 10,
  },

  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },

  // 右侧箭头容器
  arrowsContainer: {
    position: "absolute",
    right: 20,
    top: 23,
    zIndex: 5,
  },
});
