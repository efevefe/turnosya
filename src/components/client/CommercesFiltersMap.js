import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import CommercesMap from '../common/CommercesMap';
import { Toast } from '../common';

class CommercesFiltersMap extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightButton'),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      rightButton: this.renderApplyFiltersButton(),
    });
  }

  renderApplyFiltersButton = () => {
    return (
      <Button
        title="Aceptar"
        type="clear"
        titleStyle={{ color: 'white' }}
        onPress={this.onApplyFiltersPress}
        containerStyle={applyFilterButtonStyle}
      />
    );
  };

  onApplyFiltersPress = () => {
    if (this.props.latitude) {
      this.props.navigation.goBack();
    } else {
      Toast.show({ text: 'Debe seleccionar una ubicación manteniendo presionado sobre el mapa' });
    }
  };

  render() {
    return (
      <View style={windowContainerStyle}>
        <CommercesMap searchBar={true} longPressAllowed={true} />
      </View>
    );
  }
}

const { windowContainerStyle, applyFilterButtonStyle } = StyleSheet.create({
  windowContainerStyle: { flex: 1 },
  applyFilterButtonStyle: { paddingRight: 10 },
});

const mapStateToProps = state => {
  const { latitude } = state.locationData.selectedLocation;
  return { latitude };
};

export default connect(mapStateToProps, {})(CommercesFiltersMap);
