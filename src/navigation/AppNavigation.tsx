import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import ModelSelectionScreen from '../screens/ModelSelectionScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
  ChatList: undefined;
  Chat: { conversationId?: string; modelId?: string; title?: string };
  ModelSelection: { currentModelId?: string };
  Settings: undefined;
};

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<RootStackParamList>();
const ChatStack = createNativeStackNavigator<RootStackParamList>();
const SettingsStack = createNativeStackNavigator<RootStackParamList>();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#FFFFFF',
      }}
    >
      <HomeStack.Screen 
        name="ChatList" 
        component={ChatListScreen} 
        options={{ title: 'チャット履歴' }}
      />
      <HomeStack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={({ route }) => ({ 
          title: route.params?.title || 'チャット',
        })}
      />
    </HomeStack.Navigator>
  );
};

const ChatStackNavigator = () => {
  return (
    <ChatStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#FFFFFF',
      }}
    >
      <ChatStack.Screen 
        name="ModelSelection" 
        component={ModelSelectionScreen} 
        options={{ title: 'AIモデル選択' }}
      />
      <ChatStack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ title: '新しいチャット' }}
      />
    </ChatStack.Navigator>
  );
};

const SettingsStackNavigator = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#FFFFFF',
      }}
    >
      <SettingsStack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: '設定' }}
      />
    </SettingsStack.Navigator>
  );
};

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;

            if (route.name === 'ホーム') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'チャット') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === '設定') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="ホーム" component={HomeStackNavigator} />
        <Tab.Screen name="チャット" component={ChatStackNavigator} />
        <Tab.Screen name="設定" component={SettingsStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
