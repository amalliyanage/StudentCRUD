
import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Keyboard, Alert } from 'react-native';

import {Container, Content, Header, Form, Input, Item, Button, Label, Icon} from 'native-base';
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment-with-locales-es6";
import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('db.UserDatabase')

export default class SignupScreen extends Component  {

  constructor(props){
    super(props)

    this.state = ({
      firstname:'',
      lastname:'',
      date: new Date(),
      mode: "date",
      show: false,
      formatedDate: "",
      dateOfBirthValue: "",
      username: '',
      password: '',
      icon:'eye-off',
      passwordHidden:true
    })

     // Check if the user table exists if not create it
     db.transaction(function (txn) {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
          [],
          function (tx, res) {
            console.log('user:', res.rows.length);
            if (res.rows.length == 0) {
              txn.executeSql('DROP TABLE IF EXISTS table_user', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, f_name VARCHAR(20), l_name VARCHAR(20), date VARCHAR(15), username VARCHAR(20), password VARCHAR(20))',
                [],
              );
            }
          },
        );
      });
  }

  show = mode => {
    this.setState({
        show: true,
        mode
    });
};

  setDate = (event, date) => {
    date = date || this.state.date;
    let day = moment(date, "DD-MM-YYYY");
    this.setState({
        date: date,
        formatedDate: moment(day).format("DD-MM-YYYY"),
        dateOfBirthValue: moment(day).format("DD-MM-YYYY"),
        show: false
    });
};

  datepicker = () => {
    this.show("date");
};

  showDatepicker() {
    Keyboard.dismiss();
    this.setState({ show: true });
}

  changeIcon = () => {
  this.setState({
    icon: this.state.icon === 'eye' ? 'eye-off' : 'eye',
    passwordHidden:this.state.passwordHidden === true ? false : true
  })
}

signup = () =>{

  const { firstname, lastname, dateOfBirthValue, username, password} = this.state;

      if (!firstname) {
        alert('Please fill first name');
        return;
      }
      if (!lastname) {
        alert('Please fill last name');
        return;
      }
      if (!dateOfBirthValue) {
        alert('Please fill Date');
        return;
      }
      if (!username) {
        alert('Please fill username');
        return;
      }
      if (!password) {
        alert('Please fill password');
        return;
      }
  
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO table_user (f_name, l_name, date, username, password) VALUES (?,?,?,?,?)',
          [firstname, lastname, dateOfBirthValue, username, password],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert(
                'Success',
                'You are Registered Successfully',
                [
                  {
                    text: 'Ok',
                    onPress: () => this.props.navigation.navigate('LoginScreen'),
                  },
                ],
                { cancelable: false }
              );
            } else alert('Registration Failed');
          }
        );
      }.bind(this));
    
    
}

  render(){

    const { show, date, mode } = this.state;
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
                <Label>First Name</Label>
                <Input
                autoCorrect={false}
                autoCapitalize='none'
                onChangeText={(firstname) => this.setState({firstname})}
                />
            </Item>
            <Item floatingLabel>
                <Label>Last Name</Label>
                <Input
                autoCorrect={false}
                autoCapitalize='none'
                onChangeText={(lastname) => this.setState({lastname})}
                />
            </Item>
            <Item floatingLabel>
                <Label>DOB</Label>
                <Input
                autoCorrect={false}
                autoCapitalize='none'
                onFocus={this.showDatepicker.bind(this)}
                onChangeText={(dateOfBirthValue) => this.setState({dateOfBirthValue})}
                value={this.state.dateOfBirthValue}
                />
            </Item>
            {show && (
							<DateTimePicker
								value={date}
								mode={mode}
								is24Hour={true}
                display="default"
								onChange={this.setDate}
							/>
						)}
            <Item floatingLabel>
                <Label>Username</Label>
                <Input
                autoCorrect={false}
                autoCapitalize='none'
                onChangeText={(username) => this.setState({username})}
                />
            </Item>
            <Item floatingLabel>
                <Label>Password</Label>
                <Input
                secureTextEntry={this.state.passwordHidden}
                autoCorrect={false}
                autoCapitalize='none'
                onChangeText={(password) => this.setState({password})}
                />
                <Icon name={this.state.icon} onPress={this.changeIcon}/>
            </Item>

          <Button 
            full 
            rounded 
            success 
            onPress={this.signup}
            style={{marginTop:10}}>
            <Text style={{color:'white'}}>SignUp</Text>
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
