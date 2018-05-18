import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  BackHandler,
  StatusBar 

 
} from 'react-native';
console.disableYellowBox=true;
//import Map from './src/Components/Map'
// In list marker
//import MapTest from './src/Components/MapTest'
// In list marker tu FireBase
//import MapFireBase from './src/Components/MapFireBase'
// Dinh vi va get dia chi (Quận + Thành Phố)
//import MapGPS from './src/Components/MapGPS'
import MapRE from './src/Components/MapRE'
import SplashScreen from 'react-native-splash-screen'
import Permissions from 'react-native-permissions'


export default class App extends Component {
  constructor(props){
    super(props)
    this.state={
      locationPermission:""
    }
  }

  
  componentDidMount() {
    
      SplashScreen.hide();
      Permissions.check('location').then(response => {
        // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        this.setState({ photoPermission: response })
      })
    }
    
    _requestPermission = () => {
      Permissions.request('location').then(response => {
        // Returns once the user has chosen to 'allow' or to 'not allow' access
        // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        this.setState({ locationPermission: response })
      })
    }

  render() {
    return (    
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#FFFFFF"
        />
   
     
      </View>
    );
  }

  _alertForLocationsPermission() {
    if(this.state.photoPermission!=="authorized")
     return Alert(
      'Can we access your location?',
       [
        {
          text: 'No way',
          onPress: () => BackHandler.exitApp(),
          style: 'cancel',
        },
        this.state.photoPermission == 'undetermined'
          ? { text: 'OK', onPress: this._requestPermission }
          : { text: 'Open Settings', onPress: Permissions.openSettings },
      ],
    )
  }

  renderView(){
    return this.state.photoPermission=="authorized"?  <MapRE/>:null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',

  },
 
});

