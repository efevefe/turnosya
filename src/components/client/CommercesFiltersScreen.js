import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Divider, Button, ButtonGroup, Slider } from "react-native-elements";
import { connect } from "react-redux";
import { IconButton, Picker } from "../common";
import { MAIN_COLOR, MAIN_COLOR_DISABLED } from "../../constants";
import {
  onProvincesNameRead,
  updateAllFilters,
  onLocationChange,
  onSpecificLocationEnabled
} from "../../actions";
import LocationMessages from "../common/LocationMessages";

class CommerceFiltersScreen extends Component {
  state = {
    provinceName: this.props.provinceNameFilter,
    locationButtonIndex: this.props.locationButtonIndex,
    locationRadiusKms: this.props.locationRadiusKms, // Must transform to meters
    locationEnabled: this.props.locationEnabled,
    oldData: {
      specificLocationEnabled: this.props.specificLocationEnabled,
      address: this.props.address,
      city: this.props.city,
      provinceName: this.props.provinceName,
      country: this.props.country,
      latitude: this.props.latitude,
      longitude: this.props.longitude
    }
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightButton'),
      headerLeft: navigation.getParam('leftButton')
    };
  };

  componentDidMount = () => {
    this.props.navigation.setParams({
      rightButton: this.renderApplyFiltersButton(),
      leftButton: this.renderCloseButton()
    });

    this.props.onProvincesNameRead();
  };

  renderApplyFiltersButton = () => {
    return (
      <Button
        title="Aplicar Filtros"
        type="clear"
        titleStyle={{ color: "white" }}
        onPress={this.onApplyFiltersPress.bind(this)}
        containerStyle={applyFilterButtonStyle}
      />
    );
  }

  renderCloseButton = () => {
    return (
      <IconButton icon="md-close" onPress={this.onClosePress.bind(this)} />
    );
  }

  onApplyFiltersPress() {
    this.props.updateAllFilters({
      provinceNameFilter: this.state.provinceName,
      locationEnabled: this.state.locationEnabled,
      locationButtonIndex: this.state.locationButtonIndex,
      locationRadiusKms: this.state.locationRadiusKms
    });

    this.props.navigation.goBack(null);
  }

  onClosePress() {
    this.props.onSpecificLocationEnabled(true);

    this.props.onLocationChange({
      address: this.props.address,
      city: this.props.city,
      provinceName: this.props.provinceName,
      country: this.props.country,
      latitude: this.state.oldData.latitude,
      longitude: this.state.oldData.longitude
    });

    this.props.onSpecificLocationEnabled(
      this.state.oldData.specificLocationEnabled
    );

    this.props.navigation.goBack(null);
  }

  onLocationOptionPress(buttonIndex) {
    this.props.onSpecificLocationEnabled(buttonIndex !== 1);

    this.setState({ locationButtonIndex: buttonIndex });

    buttonIndex === 0
      ? this.setState({ locationEnabled: false })
      : this.setState({ locationEnabled: true });

    if (buttonIndex === 2) {
      this.props.navigation.navigate("commercesFiltersMap");
    }
  }

  setLocationEstablishedOnMap = value => {
    return this.props.navigation.state.params.locationEstablished(value);
  };

  renderLocationMessage() {
    return this.state.locationButtonIndex === 1 ? <LocationMessages /> : null;
  }

  renderRadiusSlider = () =>
    this.state.locationEnabled ? (
      <View style={{ flex: 1 }}>
        <Text style={locationTextStyle}>{`Radio de búsqueda: ${Math.round(
          this.state.locationRadiusKms
        )} km.`}</Text>
        <Slider
          style={locationSliderStyle}
          animationType="spring"
          minimumTrackTintColor="white"
          minimumValue={1}
          maximumTrackTintColor={MAIN_COLOR_DISABLED}
          maximumValue={10}
          thumbTouchSize={{ width: 60, height: 60 }}
          thumbTintColor="white"
          value={this.state.locationRadiusKms}
          onValueChange={value => this.setState({ locationRadiusKms: value })}
        />
      </View>
    ) : null;

  render() {
    return (
      <View style={windowContainerStyle}>
        {this.renderLocationMessage()}
        <View style={windowContentContainerStyle}>
          {/* Divisor */}
          <View style={dividerContainerStyle}>
            <Divider style={dividerStyle} />
            <Text style={dividerTextStyle}>Provincia</Text>
            <Divider style={dividerStyle} />
          </View>
          {/* Divisor */}

          <View style={provinceContainerStyle}>
            <Picker
              placeholder={{ value: "", label: "Todas" }}
              value={this.state.provinceName}
              items={this.props.provincesList}
              onValueChange={value => this.setState({ provinceName: value })}
              color="white"
              textColor="white"
            />
          </View>

          {/* Divisor */}
          <View style={dividerContainerStyle}>
            <Divider style={dividerStyle} />
            <Text style={dividerTextStyle}>Localización</Text>
            <Divider style={dividerStyle} />
          </View>
          {/* Divisor */}

          <View style={locationContainerStyle}>
            <ButtonGroup
              onPress={this.onLocationOptionPress.bind(this)}
              selectedIndex={this.state.locationButtonIndex}
              buttons={[
                "Deshabilitada",
                "Ubicación actual",
                "Ubicación en mapa"
              ]}
              selectedButtonStyle={{ backgroundColor: MAIN_COLOR }}
              selectedTextStyle={{ color: "white" }}
              textStyle={locationBGTextStyle}
              containerStyle={locationBGContainerStyle}
              innerBorderStyle={{ color: MAIN_COLOR }}
            />
            {this.renderRadiusSlider()}
          </View>
        </View>
      </View>
    );
  }
}

// region Styles
const {
  dividerStyle,
  dividerTextStyle,
  dividerContainerStyle,
  windowContainerStyle,
  windowContentContainerStyle,
  applyFilterButtonStyle,
  provinceContainerStyle,
  locationBGTextStyle,
  locationBGContainerStyle,
  locationContainerStyle,
  locationTextStyle,
  locationSliderStyle
} = StyleSheet.create({
  dividerStyle: {
    backgroundColor: "white",
    flex: 1,
    alignSelf: "center",
    marginHorizontal: 5
  },
  dividerTextStyle: { color: "white", padding: 5 },
  dividerContainerStyle: { flexDirection: "row", justifyContent: "center" },
  windowContainerStyle: { flex: 1, backgroundColor: MAIN_COLOR },
  windowContentContainerStyle: { flex: 1, alignItems: "center" },
  applyFilterButtonStyle: { paddingRight: 10 },
  provinceContainerStyle: {
    alignSelf: "stretch",
    paddingBottom: 20,
    paddingHorizontal: 10
  },
  locationBGTextStyle: {
    color: MAIN_COLOR,
    textAlign: "center",
    fontSize: 12
  },
  locationBGContainerStyle: {
    borderColor: "white",
    height: 35,
    marginTop: 15,
    borderRadius: 8
  },
  locationContainerStyle: { padding: 5, alignSelf: "stretch", flex: 1 },
  locationTextStyle: {
    color: "white",
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 5
  },
  locationSliderStyle: { marginHorizontal: 15 }
});
//#endregion

const mapStateToProps = state => {
  const { provincesList } = state.provinceData;
  const {
    provinceNameFilter,
    locationEnabled,
    locationButtonIndex,
    locationRadiusKms
  } = state.commercesList;
  const {
    specificLocationEnabled,
    address,
    city,
    provinceName,
    country,
    latitude,
    longitude
  } = state.locationData;

  return {
    provincesList,
    provinceNameFilter,
    locationEnabled,
    locationButtonIndex,
    locationRadiusKms,
    specificLocationEnabled,
    address,
    city,
    provinceName,
    country,
    latitude,
    longitude
  };
};

export default connect(
  mapStateToProps,
  {
    onProvincesNameRead,
    updateAllFilters,
    onLocationChange,
    onSpecificLocationEnabled
  }
)(CommerceFiltersScreen);
