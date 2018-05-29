import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  BackHandler,
  StatusBar ,
  ImageBackground

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
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';

import background from "./src/assets/background.jpg"

import { Client } from 'bugsnag-react-native';
import { Button } from 'react-native-elements';
const bugsnag = new Client();

const reporter = (error) => {
  // Logic for reporting to devs
  // Example : Log issues to github issues using github apis.
  bugsnag.notify(new Error(error));
  console.log(error); // sample
};

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    reporter(e);
    Alert.alert(
        'Unexpected error occurred',
        `We have reported this to our team ! Please close the app and start again!`,
      [{
        text: 'Close',
        onPress: () => {
          BackAndroid.exitApp();
        }
      }]
    );
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

// setJSExceptionHandler(errorHandler, true);

// setNativeExceptionHandler(errorHandler,true);

export default class App extends Component {
 
  constructor(props){
    super(props)
    this.state={
      locationPermission:""
    }
  }
  
  causeJSError = ()=>{
    throw new Error('THIS IS A CUSTOM UNHANDLED JS ERROR');
  }

  componentWillMount(){
    Permissions.check('location').then( response => {
      console.log('Splash check location: ', response);
     if (response !== 'authorized') this._requestPermission()
     else
    this.setState({ locationPermission: String(response) })
    })
  }

  componentDidMount() {
      //  bugsnag.notify(new Error("Test error"));
      SplashScreen.hide();
    
  }
    
  renderView(){
      return(
      <View style={{flex:1}}>
      <ImageBackground source={background} style={{width:"100%",height:"100%"}}>
       <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
      <Text style={{fontFamily:"Roboto",fontSize:20,color:"#FFFFFF"}}>Opps!</Text>
      <Text style={{fontFamily:"Roboto",fontSize:15,color:"#FFFFFF"}}>Can we access your location? :( </Text>
      <Text style={{fontFamily:"Roboto",fontSize:15,color:"#FFFFFF"}}>Please check your permissions</Text> 
      <Text style={{fontFamily:"Roboto",fontSize:15,color:"#FFFFFF"}}> in your devive setting.</Text>
      <Text></Text>
      <Button
        raised
        icon={{name: 'healing'}}
        title='EXIT APP'
        onPress={()=>BackHandler.exitApp()} />
      </View>
      </ImageBackground>
      </View>
     
      )
  }

  _requestPermission = () => {
      Permissions.request('location').then(response => {
        // Returns once the user has chosen to 'allow' or to 'not allow' access
        // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        this.setState({ locationPermission: String(response) })
      })
  }
 
  render() {
    console.log("RENDER :" + this.state.locationPermission)
    return (    
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#333333"
        />
       {this.state.locationPermission!=="authorized"?
       this.state.locationPermission===""?
       null:this.renderView():<MapRE/>}
           
     
      </View>
    );
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FFFFFF',

  },
 
});

