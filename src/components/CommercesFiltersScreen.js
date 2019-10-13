import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider, Button, ButtonGroup, Slider } from 'react-native-elements';
import { connect } from 'react-redux';
import { IconButton, Picker } from './common';
import { MAIN_COLOR, MAIN_COLOR_DISABLED } from '../constants';
import { onProvincesNameRead, updateProvinceFilter } from '../actions';
import LocationMessages from './common/LocationMessages'; // Poner a LocationMessages en index.js

class CommerceFiltersScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      provinceName: props.provinceNameFilter,
      locationButtonIndex: 0,
      locationRadius: 20 // Kilometers (Algolia accepts meters)
    };
  }

  componentDidMount = () => {
    this.props.onProvincesNameRead();
  };

  onClosePress = () => {
    this.props.navigation.goBack();
  };

  onApplyFiltersPress() {
    this.props.updateProvinceFilter(this.state.provinceName);
    this.props.navigation.goBack();
  }

  onLocationOptionPress(buttonIndex) {
    this.setState({ locationButtonIndex: buttonIndex });

    // o puedo simplemente aca hacer la logica en el switch - ver
  }

  renderLocationMessage = () =>
    this.state.locationButtonIndex === 1 ? <LocationMessages /> : null;

  render() {
    return (
      <View style={windowContainerStyle}>
        {this.renderLocationMessage()}
        <View style={windowTopContainerStyle}>
          <IconButton icon="md-close" onPress={this.onClosePress} />
          <Button
            title="Aplicar Filtros"
            type="clear"
            titleStyle={{ color: 'white' }}
            onPress={this.onApplyFiltersPress.bind(this)}
            style={applyFilterButtonStyle}
          />
        </View>
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
              selectedIndex={this.state.locationButtonIndex}
              buttons={[
                'Deshabilitada',
                'Localización actual',
                'Ubicación en mapa'
              ]}
              selectedButtonStyle={{ backgroundColor: MAIN_COLOR }}
              selectedTextStyle={{ color: 'white' }}
              textStyle={locationBGTextStyle}
              containerStyle={locationBGContainerStyle}
              innerBorderStyle={{ color: MAIN_COLOR }}
            />
            <Text style={locationTextStyle}>{`Radio de búsqueda: ${Math.round(
              this.state.locationRadius
            )} km.`}</Text>
            <Slider
              style={locationSliderStyle}
              animationType="spring"
              minimumTrackTintColor="white"
              minimumValue={1}
              maximumTrackTintColor={MAIN_COLOR_DISABLED}
              maximumValue={100}
              // step={reservationMinFrom}
              thumbTouchSize={{ width: 60, height: 60 }}
              thumbTintColor="white"
              value={this.state.locationRadius}
              // onSlidingComplete={this.onMinSliderValueChange.bind(this)}
              onValueChange={value => this.setState({ locationRadius: value })}
            />
          </View>
        </View>
      </View>
    );
  }
}

//#region Styles
const {
  dividerStyle,
  dividerTextStyle,
  dividerContainerStyle,
  windowContainerStyle,
  windowTopContainerStyle,
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
    backgroundColor: 'white',
    flex: 1,
    alignSelf: 'center',
    marginHorizontal: 5
  },
  dividerTextStyle: { color: 'white', padding: 5 },
  dividerContainerStyle: { flexDirection: 'row', justifyContent: 'center' },
  windowContainerStyle: { flex: 1, backgroundColor: MAIN_COLOR },
  windowTopContainerStyle: {
    paddingTop: 20,
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  windowContentContainerStyle: { flex: 1, alignItems: 'center' },
  applyFilterButtonStyle: { marginRight: 10, padding: 5 },
  provinceContainerStyle: {
    alignSelf: 'stretch',
    paddingBottom: 20,
    paddingHorizontal: 10
  },
  locationBGTextStyle: {
    color: MAIN_COLOR,
    textAlign: 'center',
    fontSize: 12
  },
  locationBGContainerStyle: {
    borderColor: 'white',
    height: 45,
    marginTop: 15,
    borderRadius: 8
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
  const { provinceNameFilter } = state.commercesList;

  return { provincesList, provinceNameFilter };
};

export default connect(
  mapStateToProps,
  { onProvincesNameRead, updateProvinceFilter }
)(CommerceFiltersScreen);
