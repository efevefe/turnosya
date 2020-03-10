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
      headerRight: <IconButton icon="md-checkmark" onPress={navigation.getParam('onApplyFiltersPress')} />,
      headerLeft: <IconButton icon="md-close" onPress={navigation.getParam('onCancelPress')} />
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      onApplyFiltersPress: this.onApplyFiltersPress,
      onCancelPress: this.onCancelPress
    });
    this.setState({ selectedLocationBeforechanges: this.props.selectedLocation });
  }

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

const { windowContainerStyle } = StyleSheet.create({ windowContainerStyle: { flex: 1 } });

const mapStateToProps = state => {
  const { selectedLocation } = state.locationData;

  return { selectedLocation };
};

export default connect(mapStateToProps, { onSelectedLocationChange })(CommercesFiltersMap);
