import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Header } from '@/components/Header';

export default function RankingScreen() {
  const insets = useSafeAreaInsets();
  
  // Mock data for top sellers
  const topSellers = [
    {
      id: 1,
      name: 'Zizzler',
      price: '28.04 ETH',
      image: require('@/assets/images/pic1.png'),
    },
    {
      id: 2,
      name: 'Another Seller',
      price: '22.15 ETH',
      image: require('@/assets/images/pic2.png'),
    },
    {
      id: 3,
      name: 'Third Seller',
      price: '18.75 ETH',
      image: require('@/assets/images/pic3.png'),
    },
    {
      id: 4,
      name: 'Fourth Seller',
      price: '15.25 ETH',
      image: require('@/assets/images/pic1.png'),
    },
    {
      id: 5,
      name: 'Fifth Seller',
      price: '12.50 ETH',
      image: require('@/assets/images/pic2.png'),
    },
    {
      id: 6,
      name: 'Sixth Seller',
      price: '9.80 ETH',
      image: require('@/assets/images/pic3.png'),
    },
  ];
  
  const [followedUsers, setFollowedUsers] = useState<number[]>([]);
  
  const toggleFollow = (userId: number) => {
    if (followedUsers.includes(userId)) {
      setFollowedUsers(followedUsers.filter(id => id !== userId));
    } else {
      setFollowedUsers([...followedUsers, userId]);
    }
  };
  
  const TopSellerItem = ({ name, price, image, rank, id }: { name: string; price: string; image: any; rank: number; id: number }) => {
    const isFollowed = followedUsers.includes(id);
    
    return (
      <TouchableOpacity style={styles.topSellerItem}>
        <Text style={styles.rankNumber}>{rank}</Text>
        <Image source={image} style={styles.sellerAvatar} />
        <View style={styles.sellerInfoContainerWithButton}>
          <View style={styles.sellerInfoContainer}>
            <Text style={styles.sellerName}>{name}</Text>
            <Text style={styles.sellerPrice}>{price}</Text>
          </View>
          <TouchableOpacity 
            style={isFollowed ? styles.followingButton : styles.followButton}
            onPress={() => toggleFollow(id)}
          >
            <Text style={isFollowed ? styles.followingButtonText : styles.followButtonText}>
              {isFollowed ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>      
        <View style={styles.headerContainer}>
          <Header showBackButton={true} title="Ranking" showShareButton={true} />
        </View>
        
        <ScrollView style={styles.contentContainer}>
          <View style={styles.topSellersSection}>
            
            <View style={styles.topSellersList}>
              {topSellers.map((item, index) => (
                <TopSellerItem
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  rank={index + 1}
                  id={item.id}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#1A1A1A',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topSellersSection: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionSeeAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  topSellersList: {
    flexDirection: 'column',
  },
  topSellerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    marginBottom: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  sellerInfoContainerWithButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  followButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  followingButton: {
    backgroundColor: '#888888',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followingButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  sellerInfoContainer: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sellerPrice: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});