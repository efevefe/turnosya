import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { onSelectedLocationChange } from '../../actions';
import CommercesMap from '../common/CommercesMap';
import { Toast, IconButton } from '../common';

class CommercesFiltersMap extends Component {
  state = { selectedLocationBeforechanges: null };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightButton'),
      headerLeft: navigation.getParam('leftButton')
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ rightButton: this.renderSaveButton(), leftButton: this.renderCancelButton() });
    this.setState({ selectedLocationBeforechanges: this.props.selectedLocation });
  }

  renderSaveButton = () => {
    return <IconButton icon="md-checkmark" onPress={this.onApplyFiltersPress} />;
  };

  renderCancelButton = () => {
    return <IconButton icon="md-close" onPress={this.onCancelPress} />;
  };

  onApplyFiltersPress = () => {
    this.props.selectedLocation.latitude
      ? this.props.navigation.goBack()
      : Toast.show({ text: 'Debe seleccionar una ubicación manteniendo presionado sobre el mapa' });
  };

  onCancelPress = () => {
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

const { windowContainerStyle } = StyleSheet.create({
  windowContainerStyle: { flex: 1 }
});

const mapStateToProps = state => {
  const { selectedLocation } = state.locationData;

  return { selectedLocation };
};

export default connect(mapStateToProps, { onSelectedLocationChange })(CommercesFiltersMap);
