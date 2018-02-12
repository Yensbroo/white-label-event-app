import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { HomeScreen, DetailScreen, UserScreen } from './screens';
import { initializeFirebase, subscribeToTrack, listenFirebaseChanges } from './utils/firebaseService';
import { handleUserLogin, handleGoogleLogin } from './utils/authenticationService';
import getShiftData from './utils/shiftService';

const Navigator = StackNavigator({
  Home: { screen: HomeScreen },
  Detail: { screen: DetailScreen },
  User: { screen: UserScreen },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    marginBottom: 250,
    marginTop: 200,
  }
});

export default class App extends Component {
  constructor(props) {
    super(props);

    this.firebaseRefs = {};
    this.state = {
      shiftData: [],
      isLoading: true,
      userInfo: {},
      usersPerSchedule: {},
    };
  }

  componentWillMount() {
    initializeFirebase();
    getShiftData()
      .then((response) => {
        this.setState({ shiftData: response.data, isLoading: false });
        return response.data;
      })
      .then((shiftData) => {
        shiftData.forEach((shiftSchedule) => {
          const firebaseRef = listenFirebaseChanges(shiftSchedule.name);
          firebaseRef.on('value', snapshot => this.onChangeUsers(snapshot, shiftSchedule.name));
          this.firebaseRefs[shiftSchedule.name] = firebaseRef;
        });
      });
  }

  componentWillUnmount() {
    Object.keys(this.firebaseRefs).forEach(trackId => this.firebaseRefs[trackId].off('value', this.onChangeUsers));
  }

  onChangeUsers = (snapshot, trackId) => {
    const visitors = snapshot.val() && snapshot.val().userIds;
    this.setState({
      usersPerSchedule: { ...this.state.usersPerSchedule, [trackId]: visitors },
    });
  };

  handleUserLogin = async () => {
    const userInfo = await handleUserLogin();
    this.setState({ userInfo });
  };

  handleGoogleLogin = async () => {
    const userInfo = await handleGoogleLogin();
    this.setState({ userInfo });
  }

  render() {
    const { userInfo, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <Navigator
          screenProps={{
            shiftData: this.state.shiftData,
            userInfo,
            fbLogin: () => this.handleUserLogin(),
            googleLogin: () => this.handleGoogleLogin(),
            onChangeSubscription: trackId =>
              subscribeToTrack({
                trackId,
                currentUserId: this.state.userInfo.id,
                subscribedUsers: this.state.usersPerSchedule[trackId] || [],
              }),
            userId: this.state.userInfo.id,
            usersPerSchedule: this.state.usersPerSchedule,
          }}
        />
        {isLoading && (
          <ActivityIndicator style={styles.loading} size="large" color="#000000" />
        )}
      </View>
    );
  }
}
