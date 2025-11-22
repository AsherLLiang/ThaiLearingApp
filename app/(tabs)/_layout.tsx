// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { Home, BookOpen, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface TabButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function TabButton({ icon: Icon, label, isActive, onPress }: TabButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.tabButton}>
      <Icon
        size={22}
        strokeWidth={isActive ? 2 : 1.5}
        color={isActive ? Colors.ink : Colors.taupe}
      />
      <Text 
        style={[
          styles.tabLabel,
          { 
            color: isActive ? Colors.ink : Colors.taupe,
            fontFamily: Typography.notoSerifRegular,
          }
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

function CustomTabBar({ state, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
        }
      ]}
    >
      {Platform.OS === 'ios' && (
        <BlurView
          intensity={80}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
      )}

      <View style={styles.tabBarContent}>
        {/* Left: Learn */}
        <TabButton
          icon={BookOpen}
          label="学习"
          isActive={state.index === 1}
          onPress={() => navigation.navigate('courses')}
        />

        {/* Center: Home (Protruding) */}
        <View style={[styles.centerButtonContainer, { bottom: 24 }]}>
          <Pressable
            onPress={() => navigation.navigate('index')}
            style={[
              styles.centerButton,
              {
                backgroundColor: state.index === 0 ? Colors.ink : Colors.white,
              }
            ]}
          >
            <Home
              size={26}
              strokeWidth={2}
              color={state.index === 0 ? Colors.white : Colors.taupe}
            />
          </Pressable>
        </View>

        {/* Right: Profile */}
        <TabButton
          icon={User}
          label="我的"
          isActive={state.index === 2}
          onPress={() => navigation.navigate('profile')}
        />
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="courses" />
      {/* profile 路由由文件系统自动创建，无需手动声明 */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.sand,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : Colors.white,
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.5,
  },
  centerButtonContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -32,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.paper,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});