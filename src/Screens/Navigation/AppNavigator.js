import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from '../HomePage';

import CartScreen from '../CartScreen';
import SearchResultsScreen from '../SearchResultsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
     <Stack.Screen name="Home" component={HomePage} options={{headerShown:false}}/>
      <Stack.Screen name="Cart" component={CartScreen} options={{headerShown:false}} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{headerShown:false}} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
