import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import SplashStack from './routes/splashStack'
 
const App = () =>{
  return(
    <NavigationContainer>
        <SplashStack/>
    </NavigationContainer>
  
  );
}

export default App

