import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View, 
 
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
export default class App extends Component {
  constructor(props){
    super(props)

  }

  
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (    
      <View style={styles.container}>
     <MapRE/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',

  },
 
});

