import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { Lock, ChevronsRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SlideButtonProps {
  login?: boolean;
  bid?: boolean;
  onSlideComplete?: () => void;
}

export const SlideButton = ({ login = false, bid = false, onSlideComplete }: SlideButtonProps) => {
  // 滑动解锁状态
  const translateX = useSharedValue(0);
  const arrowOpacity = useSharedValue(1);
  
  const SLIDE_THRESHOLD = SCREEN_WIDTH * 0.8 * 0.9; // 滑动解锁阈值，考虑到轨道宽度是0.9

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
        if (onSlideComplete) {
          runOnJS(onSlideComplete)();
        }
      } else {
        // 未达到阈值，回弹
        translateX.value = withTiming(0, { duration: 300 });
      }
    });

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

  // 箭头闪烁动画
  useEffect(() => {
    arrowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1, // 无限循环
      true
    );
  }, []);

  // 根据属性确定显示的文本
  let buttonText = "Slide to Get Started";
  if (bid) {
    buttonText = "Place Bid";
  } else if (login) {
    buttonText = "Slide to Login";
  }

  return (
    <View style={styles.slideButtonContainer}>
      {/* 滑动轨道 */}
      <View style={styles.slideTrack}>
        <Text style={styles.trackText}>{buttonText}</Text>
      </View>

      {/* 可拖拽的滑块 */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.slider, sliderAnimatedStyle]}>
          <View style={styles.iconCircle}>
            <Lock color="#000000" size={24} />
          </View>
        </Animated.View>
      </GestureDetector>

      {/* 右侧闪烁箭头 */}
      <Animated.View style={[styles.arrowsContainer, arrowAnimatedStyle]}>
        <ChevronsRight color="#FFFFFF" size={24} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#424242",
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
    backgroundColor: "#FFFFFF",
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

export default SlideButton;