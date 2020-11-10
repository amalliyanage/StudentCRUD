
import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Keyboard, Alert } from 'react-native';
import {Container, Content, Header, Form, Input, Item, Button, Label, Icon} from 'native-base';
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment-with-locales-es6";
import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('db.UserDatabase')

export default class HomeScreen extends Component  {

  constructor(props){
    super(props)

    this.state = ({
      user_id:this.props.route.params.user_id,  
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
    
    const { user_id } = this.state;
    
     db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM table_user where user_id = ?',
          [user_id],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              let res = results.rows.item(0);
              this.setState({firstname:res.f_name, 
                         lastname:res.l_name, 
                         dateOfBirthValue:res.date, 
                         username:res.username, 
                         password:res.password
                        });
            } else {
              alert('No user found');
              this.setState({firstname:'', 
                         lastaname:'', 
                         dateOfBirthValue:'', 
                         username:'', 
                         password:''
                       });
            }
          }
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

update = () =>{

    const { firstname, lastname, dateOfBirthValue, username, password, user_id } = this.state;

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
  
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE table_user set f_name=?, l_name=?, date=?, username=?, password=? where user_id=?',
          [firstname, lastname, dateOfBirthValue, username, password, user_id],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert(
                'Success',
                'User updated successfully',
                [
                  {
                    text: 'Ok',
                    onPress: () => this.props.navigation.navigate('HomeScreen'),
                  },
                ],
                { cancelable: false }
              );
            } else alert('Updation Failed');
          }
        );
      });    
}

delete = () =>{

    const { user_id } = this.state;

    db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM  table_user where user_id=?',
          [user_id],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert(
                'Success',
                'User deleted successfully',
                [
                  {
                    text: 'Ok',
                    onPress: () => this.props.navigation.navigate('LoginScreen'),
                  },
                ],
                { cancelable: false }
              );
            } else {
              alert('Please insert a valid User Id');
            }
          }
        );
      });
}

logout = () =>{
  this.props.navigation.navigate('LoginScreen')
}

  render(){

    const { show, date, mode } = this.state;
    return (
      <Container style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this.logout}>
            <Image
            source={require('../assets/logout.png')}
            style={styles.logo}
            resizeMode="stretch"
            />
            </TouchableOpacity>
        </View>
        <Form>
            <Item floatingLabel>
                <Label>First Name</Label>
                <Input
                autoCorrect={false}
                autoCapitalize='none'
                onChangeText={(firstname) => this.setState({firstname})}
                value={this.state.firstname}
                />
            </Item>
            <Item floatingLabel>
                <Label>Last Name</Label>
                <Input
                autoCorrect={false}
                autoCapitalize='none'
                onChangeText={(lastname) => this.setState({lastname})}
                value={this.state.lastname}
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
            primary 
            onPress={this.update}
            style={{marginTop:10}}>
            <Text style={{color:'white'}}>Update</Text>
          </Button>

          <Button 
            full 
            rounded 
            danger 
            onPress={this.delete}
            style={{marginTop:10}}>
            <Text style={{color:'white'}}>Delete</Text>
          </Button>
        </Form>
      </Container>
    );
  }
  
}

const {height} = Dimensions.get("screen");
const height_logo = height * 0.15;

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