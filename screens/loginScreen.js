
import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import {Container, Content, Header, Form, Input, Item, Button, Label, Icon} from 'native-base';

import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('db.UserDatabase')

export default class LoginScreen extends Component  {

  constructor(props){
    super(props)

    this.state = ({
      username: '',
      password: '',
      icon:'eye-off',
      passwordHidden:true
    })
  }

  signin = () =>{
    const { username, password } = this.state;
    if (!username) {
        alert('Please fill username');
        return;
      }
      if (!password) {
        alert('Please fill password');
        return;
      }

      db.transaction((tx) => {
        const sql = `SELECT * FROM table_user WHERE username='${username}'`;
        tx.executeSql(sql, [], (tx, results) => {
            const len = results.rows.length;
            if (!len) {
                alert('This account does not exist!');
            } else {
                const row = results.rows.item(0);
                if (password === row.password) {
                   let user_id = row.user_id
                    this.props.navigation.navigate('HomeScreen', {user_id});
                    this.setState({
                      username: '',
                      password:''
                    });
                    return;
                }
                alert('Authentication failed!');
            }
        });
    });
  }

  changeIcon = () => {
    this.setState({
      icon: this.state.icon === 'eye' ? 'eye-off' : 'eye',
      passwordHidden:this.state.passwordHidden === true ? false : true
    })
  }

  render(){
    return (
      <Container style={styles.container}>
        <View style={styles.header}>
            <Image
            source={require('../assets/lock.png')}
            style={styles.logo}
            resizeMode="stretch"
            />
        </View>

        <Form>
          <Item floatingLabel>
            <Label>Username</Label>
            <Input
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={(username) => this.setState({username})}
              value={this.state.username}
            />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              secureTextEntry={this.state.passwordHidden}
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />
            <Icon name={this.state.icon} onPress={this.changeIcon}/>
          </Item>
  
          <Button 
            full 
            rounded 
            success 
            onPress={this.signin}
            style={{marginTop:15}} >
            <Text style={{color:'white'}}>LogIn</Text>
          </Button>
  
          <Button 
            full 
            rounded 
            primary 
            onPress={()=>this.props.navigation.navigate('SignupScreen')}
            style={{marginTop:10}}>
            <Text style={{color:'white'}}>Register</Text>
          </Button>

          <Button 
            full 
            rounded 
            info 
            onPress={()=>this.props.navigation.navigate('ViewAllUserScreen')}
            style={{marginTop:10}}>
            <Text style={{color:'white'}}>View All User</Text>
          </Button>
        </Form>
      </Container>
    );
  }
  
}

const {height} = Dimensions.get("screen");
const height_logo = height * 0.20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center'
},
  logo: {
    width: height_logo,
    height: height_logo
},
});
