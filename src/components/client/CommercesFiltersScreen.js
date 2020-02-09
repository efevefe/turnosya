import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider, Button, Slider } from 'react-native-elements';
import { connect } from 'react-redux';
import { IconButton, Picker, ButtonGroup, Toast } from '../common';
import { MAIN_COLOR, MAIN_COLOR_DISABLED } from '../../constants';
import {
  onProvincesNameRead,
  onCommercesListValueChange,
  onLocationValueChange,
  onSelectedLocationChange,
  onCommerceHitsUpdate
} from '../../actions';
import LocationMessages from '../common/LocationMessages';

class CommerceFiltersScreen extends Component {
  state = {
    provinceName: this.props.provinceNameFilter,
    locationRadiusKms: this.props.locationRadiusKms, // Must transform to meters
    locationUpdating: false,
    oldData: {
      selectedLocation: this.props.selectedLocation,
      markers: this.props.markers,
      locationButtonIndex: this.props.locationButtonIndex
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
        titleStyle={{ color: 'white' }}
        onPress={this.onApplyFiltersPress.bind(this)}
        containerStyle={applyFilterButtonStyle}
      />
    );
  };

  renderCloseButton = () => {
    return <IconButton icon="md-close" onPress={this.onClosePress.bind(this)} />;
  };

  onClosePress() {
    if (!this.state.locationUpdating) {
      this.props.onSelectedLocationChange(this.state.oldData.selectedLocation);
      this.props.onCommerceHitsUpdate(this.state.oldData.markers);
      this.props.onCommercesListValueChange({ locationButtonIndex: this.state.oldData.locationButtonIndex });

      this.props.navigation.goBack(null);
    }
  }

  onApplyFiltersPress() {
    if (!this.state.locationUpdating) {
      if (this.props.locationButtonIndex !== 0 && !this.props.selectedLocation.latitude) {
        return Toast.show({ text: 'Seleccione una ubicación o encienda el GPS' });
      }

      this.props.onCommercesListValueChange({
        provinceNameFilter: this.state.provinceName,
        locationRadiusKms: this.state.locationRadiusKms
      });

      this.props.navigation.goBack(null);
    }
  }

  onLocationOptionPress(buttonIndex) {
    this.props.onCommercesListValueChange({ locationButtonIndex: buttonIndex });

    switch (buttonIndex) {
      case 0:
        this.props.onSelectedLocationChange();
        break;
      case 1:
        break;
      case 2:
        this.props.navigation.navigate('commercesFiltersMap', { navigation: this.props.navigation });
        break;
    }
  }

  onCurrentLocationFound = ({ updating, location }) => {
    if (!updating && !location) return this.setState({ locationUpdating: false });

    if (updating && !location) return this.setState({ locationUpdating: true });

    if (location) {
      this.setState({ locationUpdating: true }, async () => {
        await this.props.onLocationValueChange({ selectedLocation: { ...location }, userLocation: { ...location } });

        this.setState({ locationUpdating: false });
      });
    }
  };

  renderLocationMessage() {
    if (this.props.locationButtonIndex === 1) return <LocationMessages onLocationFound={this.onCurrentLocationFound} />;
  }

  renderRadiusSlider = () =>
    this.props.locationButtonIndex !== 0 ? (
      <View style={{ flex: 1 }}>
        <Text style={locationTextStyle}>{`Radio de búsqueda: ${Math.round(this.state.locationRadiusKms)} km.`}</Text>
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
              placeholder={{ value: '', label: 'Todas' }}
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
              selectedIndex={this.props.locationButtonIndex}
              buttons={['Deshabilitada', 'Ubicación actual', 'Ubicación en mapa']}
              containerStyle={locationBGContainerStyle}
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
  locationBGContainerStyle,
  locationContainerStyle,
  locationTextStyle,
  locationSliderStyle
} = StyleSheet.create({
  dividerStyle: {
    backgroundColor: 'white',
    flex: 1,
    alignSelf: 'center',
    marginHorizontal: 5
  },
  dividerTextStyle: { color: 'white', padding: 5 },
  dividerContainerStyle: { flexDirection: 'row', justifyContent: 'center' },
  windowContainerStyle: { flex: 1, backgroundColor: MAIN_COLOR },
  windowContentContainerStyle: { flex: 1, alignItems: 'center' },
  applyFilterButtonStyle: { paddingRight: 10 },
  provinceContainerStyle: {
    alignSelf: 'stretch',
    paddingBottom: 20,
    paddingHorizontal: 10
  },
  locationBGContainerStyle: {
    borderColor: 'white',
    marginTop: 15,
    height: 35
  },
  locationContainerStyle: { padding: 5, alignSelf: 'stretch', flex: 1 },
  locationTextStyle: {
    color: 'white',
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 5
  },
  locationSliderStyle: { marginHorizontal: 15 }
});
//#endregion

const mapStateToProps = state => {
  const { provincesList } = state.provinceData;
  const { provinceNameFilter, locationButtonIndex, locationRadiusKms, markers } = state.commercesList;
  const { selectedLocation, userLocation } = state.locationData;

  return {
    provincesList,
    provinceNameFilter,
    locationButtonIndex,
    locationRadiusKms,
    selectedLocation,
    userLocation,
    markers
  };
};

export default connect(mapStateToProps, {
  onProvincesNameRead,
  onCommercesListValueChange,
  onLocationValueChange,
  onSelectedLocationChange,
  onCommerceHitsUpdate
})(CommerceFiltersScreen);
