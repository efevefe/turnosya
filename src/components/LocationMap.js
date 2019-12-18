import React from 'react';
import { connect } from 'react-redux';
import { HeaderBackButton } from 'react-navigation-stack';
import { onLocationChange } from '../actions';
import Map from './common/Map';
import { IconButton } from './common';

class LocationMap extends React.Component {
  state = { stateBeforeChanges: null };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon'),
      headerLeft: navigation.getParam('leftIcon')
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      rightIcon: this.renderSaveButton(),
      leftIcon: this.renderBackButton()
    });

    const {
      address,
      city,
      provinceName,
      country,
      latitude,
      longitude
    } = this.props;
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

  renderSaveButton = () => (
    <IconButton
      icon="md-checkmark"
      onPress={() => this.props.navigation.goBack()}
    />
  );

  renderBackButton = () => (
    <HeaderBackButton onPress={() => this.onBackPress()} tintColor="white" title='Back' />
  );

  onBackPress = () => {
    this.props.onLocationChange(this.state.stateBeforeChanges);

    this.props.navigation.state.params.onProvinceNameChange &&
      this.props.navigation.state.params.onProvinceNameChange(
        this.state.stateBeforeChanges.provinceName
      );

    this.props.navigation.goBack();
  };

  render() {
    return (
      <Map
        searchBar={true}
        onProvinceNameChange={
          this.props.navigation.state.params.onProvinceNameChange
        }
      />
    );
  }
}

const mapStateToProps = state => {
  const {
    address,
    city,
    provinceName,
    country,
    latitude,
    longitude
  } = state.locationData;

  return { address, city, provinceName, country, latitude, longitude };
};

export default connect(
  mapStateToProps,
  { onLocationChange }
)(LocationMap);
