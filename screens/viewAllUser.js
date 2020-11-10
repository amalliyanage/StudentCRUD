import React, { Component } from 'react'
import { Text, View, SafeAreaView, FlatList } from 'react-native'

import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('db.UserDatabase')
var data = []
export class ViewAllUser extends Component {

    constructor(props){
        super(props)

        this.state = ({
            flatListItems: data,
          })

          db.transaction((tx) => {
            tx.executeSql(
              'SELECT * FROM table_user',
              [],
              (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                  temp.push(results.rows.item(i));
                  console.log(temp)
                  this.setState({ flatListItems: temp });
               
              }
            );
          });
    }

    listViewItemSeparator = () => {
        return (
          <View
            style={{
              height: 2,
              width: '100%',
              backgroundColor: '#808080'
            }}
          />
        );
      };

    listItemView = ({item}) => {
        return (
          <View
            key={item.user_id}
            style={{ backgroundColor: 'white', padding: 20 }}>
            <Text>Id: {item.user_id}</Text>
            <Text>First Name: {item.f_name}</Text>
            <Text>Last Name: {item.l_name}</Text>
            <Text>DOB: {item.date}</Text>
            <Text>Username: {item.username}</Text>
            <Text>Password: {item.password}</Text>
          </View>
        );
      };

    render() {
        return (
          
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{ flex: 1 }}>
                      <FlatList
                        data={this.state.flatListItems}
                        ItemSeparatorComponent={this.listViewItemSeparator}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => this.listItemView({item})}
                      />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

export default ViewAllUser;
