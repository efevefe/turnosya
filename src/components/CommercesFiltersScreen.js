import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider, Button, ButtonGroup, Slider } from 'react-native-elements';
import { connect } from 'react-redux';
import { IconButton, Picker } from './common';
import { MAIN_COLOR, MAIN_COLOR_OPACITY } from '../constants';
import { onProvincesNameRead, updateProvinceFilter } from '../actions';

class CommerceFiltersScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      provinceName: props.provinceNameFilter
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

  render() {
    return (
      <View style={windowContainerStyle}>
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
              // onPress={this.onPriceSelect}
              selectedIndex={0}
              buttons={[
                'Deshabilitada',
                'Localización actual',
                'Ubicación en mapa'
              ]}
              selectedButtonStyle={{ backgroundColor: MAIN_COLOR }}
              selectedTextStyle={{ color: 'white' }}
              textStyle={{ color: MAIN_COLOR, textAlign: 'center' }}
              containerStyle={{
                borderColor: 'white',
                height: 45,
                marginTop: 15,
                borderRadius: 8
              }}
              innerBorderStyle={{ color: MAIN_COLOR }}
            />
            <Text style={locationTextStyle}>Radio de búsqueda: 100 km</Text>
            <Slider
              style={locationSlideStyle}
              animationType="spring"
              minimumTrackTintColor={MAIN_COLOR_OPACITY}
              // minimumValue={reservationMinFrom}
              // maximumValue={reservationMinTo}
              // step={reservationMinFrom}
              thumbTouchSize={{ width: 60, height: 60 }}
              thumbTintColor="white"
              // value={reservationMinValue}
              // onSlidingComplete={this.onMinSliderValueChange.bind(this)}
              // onValueChange={val => this.setState({ reservationMinValue: val })}
            />
          </View>
        </View>
      </View>
    );
  }
}

const {
  dividerStyle,
  dividerTextStyle,
  dividerContainerStyle,
  windowContainerStyle,
  windowTopContainerStyle,
  windowContentContainerStyle,
  applyFilterButtonStyle,
  provinceContainerStyle,
  locationContainerStyle,
  locationTextStyle,
  locationSlideStyle
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
  locationContainerStyle: { padding: 5, alignSelf: 'stretch', flex: 1 },
  locationTextStyle: {
    color: 'white',
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 5
  },
  locationSlideStyle: { marginHorizontal: 15 }
});

const mapStateToProps = state => {
  const { provincesList } = state.provinceData;
  const { provinceNameFilter } = state.commercesList;

  return { provincesList, provinceNameFilter };
};

export default connect(
  mapStateToProps,
  { onProvincesNameRead, updateProvinceFilter }
)(CommerceFiltersScreen);
