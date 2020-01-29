import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { onSelectedLocationChange } from '../../actions';
import CommercesMap from '../common/CommercesMap';
import { Toast } from '../common';

class CommercesFiltersMap extends Component {
  state = { selectedLocationBeforechanges: null };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightButton'),
      headerLeft: navigation.getParam('leftButton')
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ rightButton: this.renderApplyFiltersButton(), leftButton: this.renderButton() });
    this.setState({ selectedLocationBeforechanges: this.props.selectedLocation });
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

  renderButton = () => {
    return (
      <Button
        title="Cancelar"
        type="clear"
        titleStyle={{ color: 'white' }}
        onPress={this.onCancelButtonPress}
        containerStyle={cancelFilterButtonStyle}
      />
    );
  };

  onApplyFiltersPress = () => {
    this.props.selectedLocation.latitude
      ? this.props.navigation.goBack()
      : Toast.show({ text: 'Debe seleccionar una ubicación manteniendo presionado sobre el mapa' });
  };

  onCancelButtonPress = () => {
    this.props.onSelectedLocationChange(this.state.selectedLocationBeforechanges);
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={windowContainerStyle}>
        <CommercesMap searchBar={true} />
      </View>
    );
  }
}

const { windowContainerStyle, applyFilterButtonStyle, cancelFilterButtonStyle } = StyleSheet.create({
  windowContainerStyle: { flex: 1 },
  applyFilterButtonStyle: { paddingRight: 10 },
  cancelFilterButtonStyle: { paddingLeft: 10 }
});

const mapStateToProps = state => {
  const { selectedLocation } = state.locationData;

  return { selectedLocation };
};

export default connect(mapStateToProps, { onSelectedLocationChange })(CommercesFiltersMap);
