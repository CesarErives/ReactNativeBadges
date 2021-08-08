import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BadgesStack from './BadgesStack.js'
import FavoritesStack from '../Favorites/FavoritesStack.js';
import Colors from '../../res/Colors.js';

const Tabs = createBottomTabNavigator();

const BadgesTabNavigator = () => {
    return (
        <Tabs.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#43FF0D',
                tabBarInactiveTintColor: Colors.white,
                tabBarStyle: { backgroundColor: Colors.zircon },
            }}
        >
            <Tabs.Screen
                name="Badge"
                component={BadgesStack}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Image
                            style={{ tintColor: color, width: size, height: size }}
                            source={require('../../assets/home.png')}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="Favorites"
                component={FavoritesStack}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Image
                            style={{ tintColor: color, width: size, height: size }}
                            source={require('../../assets/notFavorite.png')}
                        />
                    ),
                }}
            />
        </Tabs.Navigator>
    );
};

export default BadgesTabNavigator;