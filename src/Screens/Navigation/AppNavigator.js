import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from '../HomePage';
import LoginPage from '../Loginpage';
import CartScreen from '../CartScreen';
import SearchResultsScreen from '../SearchResultsScreen';
import Register from '../Register';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginPage} options={{headerShown:false}}/>
      <Stack.Screen name="Register" component={Register} options={{headerShown:false}}/>
     <Stack.Screen name="Home" component={HomePage} options={{headerShown:false}}/>
      <Stack.Screen name="Cart" component={CartScreen} options={{headerShown:false}} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{headerShown:false}} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
