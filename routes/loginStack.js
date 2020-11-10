import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import LoginScreen from '../screens/loginScreen'
import SignupScreen from '../screens/signupScreen'
import HomeScreen from '../screens/homeScreen'
import ViewAllUser from '../screens/viewAllUser';

const Stack = createStackNavigator();

const LoginStack = ({ navigation }) => {
    return(
    
            <Stack.Navigator headerMode='none'>

                <Stack.Screen 
                    name="LoginScreen" 
                    component={LoginScreen} />

                <Stack.Screen 
                    name="SignupScreen" 
                    component={SignupScreen} />

                <Stack.Screen 
                    name="ViewAllUserScreen" 
                    component={ViewAllUser} />

                <Stack.Screen 
                    name="HomeScreen" 
                    component={HomeScreen} />
            </Stack.Navigator>
      
    );
}
export default LoginStack;