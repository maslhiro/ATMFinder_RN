import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default class MarkerCustom extends Marker {
  constructor(props) {
    super(props);
    this.state = {
      marker: {
        latitude: parseFloat(this.props.latitude),
        longitude: parseFloat(this.props.longitude)
      }
    };
  }

  render() {
    console.log(this.props.latitude + " / " + this.props.longitude);
    console.log(this.state.marker);
    return <Marker coordinate={this.state.marker} />;
  }
}
