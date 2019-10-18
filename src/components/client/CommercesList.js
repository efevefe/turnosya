import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { InstantSearch, Configure } from 'react-instantsearch/native';
import { IconButton } from '../common';
import getEnvVars from '../../../environment';
import ConnectedHits from './CommercesList.SearchHits';
import ConnectedSearchBox from './CommercesList.SearchBox';
import ConnectedStateResults from './CommercesList.StateResults';
import { readFavoriteCommerces } from '../../actions/CommercesListActions';

const { appId, searchApiKey, commercesIndex } = getEnvVars().algoliaConfig;

class CommercesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      areaName: props.navigation.state.params.areaName,
      searchVisible: false
    };
  }

  componentDidMount() {
    this.props.readFavoriteCommerces();

    this.props.navigation.setParams({
      rightIcons: this.renderRightButtons(),
      header: undefined
    });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Buscar negocios',
      headerRight: navigation.getParam('rightIcons'),
      header: navigation.getParam('header')
    };
  };

  renderRightButtons = () => {
    return (
      <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
        <IconButton icon="md-search" onPress={this.onSearchPress} />
        <IconButton icon="ios-funnel" onPress={this.onFiltersPress} />
      </View>
    );
  };

  onSearchPress = async () => {
    this.props.navigation.setParams({ header: null });
    this.setState({ searchVisible: true });
  };

  onFiltersPress = () => {
    this.props.navigation.navigate('commercesFiltersScreen');
  };

  onCancelPress = () => {
    this.props.navigation.setParams({ header: undefined });
    this.setState({ searchVisible: false });
  };

  renderAlgoliaSearchBar = () => {
    if (this.state.searchVisible) {
      return (
        <ConnectedSearchBox
          autoFocus={true}
          showLoadingIndicator
          onCancel={this.onCancelPress}
        />
      );
    }
  };

  enableAreaFilter = () => {
    return this.state.areaName ? (
      <Configure filters={`areaName:\'${this.state.areaName}\'`} />
    ) : null;
  };

  enableProvinceFilter = () => {
    return this.props.provinceNameFilter ? (
      <Configure
        filters={`provinceName:\'${this.props.provinceNameFilter}\'`}
      />
    ) : null;
  };

  enableCurrentLocationFilter = () => {
    return this.props.locationEnabled ? (
      <Configure
        aroundLatLng={`${this.props.latitude}, ${this.props.longitude}`}
        aroundRadius={Math.round(1000 * this.props.locationRadiusKms)}
      />
    ) : null;
  };

  render() {
    return (
      <InstantSearch
        appId={appId}
        apiKey={searchApiKey}
        indexName={commercesIndex}
        stalledSearchDelay={0}
        root={{
          Root: View, // component to render as the root of InstantSearch
          props: { style: { flex: 1 } } // props that will be applied on the root component aka View
        }}
      >
        {this.renderAlgoliaSearchBar()}
        {this.enableAreaFilter()}
        {this.enableProvinceFilter()}
        {this.enableCurrentLocationFilter()}
        <ConnectedStateResults />
        <ConnectedHits />
      </InstantSearch>
    );
  }
}

const mapStateToProps = state => {
  const {
    refinement,
    favoriteCommerces,
    provinceNameFilter,
    locationEnabled,
    locationRadiusKms
  } = state.commercesList;
  const { latitude, longitude } = state.locationData;

  return {
    refinement,
    favoriteCommerces,
    provinceNameFilter,
    locationEnabled,
    locationRadiusKms,
    latitude,
    longitude
  };
};

export default connect(
  mapStateToProps,
  { readFavoriteCommerces }
)(CommercesList);