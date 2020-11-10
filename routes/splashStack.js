import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import SplashScreen from '../screens/splashScreen'
import LoginStack from './loginStack'

const Stack = createStackNavigator();

const SplashStack = ({ navigation }) => {
    return(
    
            <Stack.Navigator headerMode='none'>
                <Stack.Screen 
                    name="SplashScreen" 
                    component={SplashScreen} />

                <Stack.Screen 
                    name="LoginScreen" 
                    component={LoginStack} />
            </Stack.Navigator>
      
    );
}
export default SplashStack;