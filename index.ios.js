/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
GoogleSignin.configure({
  iosClientId: "430891231916-hej7na4spktej6ofjofis7gphtlg5op3.apps.googleusercontent.com",
  scopes: ["https://www.googleapis.com/auth/calendar"]
});

var BackgroundGeolocation = require('react-native-background-geolocation');
BackgroundGeolocation.configure({
  desiredAccuracy: 0,
  stationaryRadius: 50,
  distanceFilter: 50,
  disableElasticity: false, // <-- [iOS] Default is 'false'.  Set true to disable speed-based distanceFilter elasticity
  locationUpdateInterval: 5000,
  minimumActivityRecognitionConfidence: 80,   // 0-100%.  Minimum activity-confidence for a state-change
  fastestLocationUpdateInterval: 5000,
  activityRecognitionInterval: 10000,
  stopDetectionDelay: 1,  // <--  minutes to delay after motion stops before engaging stop-detection system
  stopTimeout: 2, // 2 minutes
  activityType: 'AutomotiveNavigation',

  // Application config
  debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.

  // HTTP / SQLite config
  url: 'http://posttestserver.com/post.php?dump&dir=sc-fr-b-geoloc',
  batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
  autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
  maxDaysToPersist: 1
});

// This handler fires whenever bgGeo receives a location update.
  BackgroundGeolocation.on('location', (location) => {
    console.log('- [js]location: ', JSON.stringify(location));
  });

  // This handler fires whenever bgGeo receives an error
  BackgroundGeolocation.on('error', (error) => {
    var type = error.type;
    var code = error.code;
    alert(type + " Error: " + code);
  });

  // This handler fires when movement states changes (stationary->moving; moving->stationary)
  BackgroundGeolocation.on('motionchange', (location) => {
      console.log('- [js]motionchanged: ', JSON.stringify(location));
  });

  BackgroundGeolocation.start(() => {
    console.log('- [js] BackgroundGeolocation started successfully');

    // Fetch current position
    BackgroundGeolocation.getCurrentPosition({timeout: 30}, (location) => {
      console.log('- [js] BackgroundGeolocation received current position: ', JSON.stringify(location));
    }, function(error) {
      alert("Location error: " + error);
    });
  });

class DiaryList extends Component {
  signIn() {
    GoogleSignin.signIn()
    .then((user) => {
      console.log(user);
      this.setState({user: user});
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
  }
  onPressButton() {
    console.log(this)
    fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      headers: {
        "Authorization": "Bearer " + this.state.user.accessToken
      }
    })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      this.setState( {events: json } )
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
        <Text style={styles.instructions}>
          Click the button below to log in with your Google account. If you are already logged in you may not see the Google OAuth popup.
          Your user details should be logged in Chrome.
        </Text>
        <GoogleSigninButton
            style={{width: 48, height: 48}}
            size={GoogleSigninButton.Size.Icon}
            color={GoogleSigninButton.Color.Dark}
            onPress={this.signIn.bind(this)}
        />
        <Text style={styles.instructions}>
          Once logged in, retrieve your primary calendar by clicking below.
          Watch the Chrome JS console to see the result
        </Text>

        <TouchableHighlight onPress={this.onPressButton.bind(this)}>
            <Text style={styles.instructions}>
              Click here to grab calendar events
            </Text>
          </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    margin: 10,
  },
});

AppRegistry.registerComponent('DiaryList', () => DiaryList);
