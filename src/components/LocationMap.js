import React from 'react';
import { connect } from 'react-redux';
import { HeaderBackButton } from 'react-navigation-stack';
import { onLocationValueChange } from '../actions';
import CommerceLocationMap from './common/CommerceLocationMap';
import { IconButton } from './common';

class LocationMap extends React.Component {
  state = { stateBeforeChanges: null };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <IconButton icon="md-checkmark" onPress={navigation.goBack} />,
      headerLeft: <HeaderBackButton onPress={navigation.getParam('onBackPress')} tintColor="white" title="Back" />
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      onBackPress: this.onBackPress
    });

    const { address, city, provinceName, country, latitude, longitude } = this.props;
    this.setState({
      stateBeforeChanges: {
        address,
        city,
        provinceName,
        country,
        latitude,
        longitude
      }
    });
  }

  onBackPress = () => {
    this.props.onLocationValueChange(this.state.stateBeforeChanges);

    //se puede evitar este metodo
    this.props.navigation.state.params.onProvinceNameChange &&
      this.props.navigation.state.params.onProvinceNameChange(this.state.stateBeforeChanges.provinceName);

    this.props.navigation.goBack();
  };

  render() {
    return (
      <CommerceLocationMap
        searchBar={true}
        onProvinceNameChange={this.props.navigation.state.params.onProvinceNameChange}
        findAddress={true}
      />
    );
  }
}

const mapStateToProps = state => {
  const { address, city, provinceName, country, latitude, longitude } = state.locationData;

  return { address, city, provinceName, country, latitude, longitude };
};

export default connect(mapStateToProps, { onLocationValueChange })(LocationMap);
