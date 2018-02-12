import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Avatar, Button } from 'react-native-elements';

import { Header } from '../components';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteText: {
    color: 'white',
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 60,
  },
  button: {
    marginBottom: 10,
    width: 200,
  },
  facebookLogin: {
    backgroundColor: '#4468B0',
  },
});

class UserScreen extends Component {
  renderLoginButton() {
    const prop = this.props.screenProps;
    const { fbLogin } = prop;
    const { googleLogin } = prop;

    return (
      <View style={styles.container}>
        <Text style={styles.whiteText}>
          Have a great day at Shift! Please login to subscribe for talks & sessions troughout the day.
        </Text>
        <Button title="Login with Facebook"  style={styles.button} onPress={() => fbLogin()} />
        <Button title="Login with Google" style={styles.button} onPress={() => googleLogin()}/>
      </View>
    );
  }

  renderProfile() {
    const { userInfo } = this.props.screenProps;
    return (
      <View style={styles.container}>
        <Avatar
          xlarge
          rounded
          source={{ uri: userInfo.picture.data.url }}
        />
        <Text style={styles.whiteText}>
          Have a great day at Shift {userInfo.first_name}!
        </Text>
      </View>
    );
  }

  render() {
    const { userInfo } = this.props.screenProps;
    console.log(userInfo);
    if (!userInfo.id) {
      return this.renderLoginButton();
    }
    return this.renderProfile();
  }
}

UserScreen.navigationOptions = ({ navigation, screenProps }) => ({
  title: screenProps.userInfo ? screenProps.userInfo.name : 'Login',
  header: <Header navigate={navigation.navigate} goBack={navigation.goBack} user />,
});

export default UserScreen;
