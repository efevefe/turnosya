import React, { Component } from "react";
import { View } from "react-native";
import Map from "../common/Map";

class CommercesFiltersMap extends Component {
  render() {
    return (
      // este componente capaz ni hace falta, traia unas props pero ni las usaba y retorna solo un Map
      // antes agregaba unos botones pero los reemplace cuando le puse un Header (Nico)

      <View style={{ flex: 1 }}>
        <Map />
      </View>
    );
  }
}
export default CommercesFiltersMap;
