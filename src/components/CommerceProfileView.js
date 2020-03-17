import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { Avatar, Text, Divider, Image, Button, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PictureView, Spinner, AreaComponentRenderer } from './common';
import {
  onCommerceRead,
  onFavoriteCommerceRegister,
  onFavoriteCommerceDelete,
  onLocationValueChange,
  onCommerceCourtTypesRead,
  onEmailVerifyReminded
} from '../actions';
import { MAIN_COLOR } from '../constants';
import CommerceCourtTypes from './client/CommerceCourtTypes';
import CommerceServicesEmployees from './client/CommerceServicesEmployees';

const screenWidth = Math.round(Dimensions.get('window').width);
const headerPictureHeight = Math.round(Dimensions.get('window').height * 0.2);
const avatarSize = Math.round(Dimensions.get('window').width * 0.4);

class CommerceProfileView extends Component {
  state = { favorite: false, pictureVisible: false };

  componentDidMount() {
    let { commerceId } = this.props;

    if (this.props.navigation.getParam('commerceId')) commerceId = this.props.navigation.getParam('commerceId');
    else if (this.props.navigation.state.routeName === 'commerceProfileView') commerceId = this.props.commerce.objectID;

    this.setCommercePropsByID(commerceId);

    this.props.onEmailVerifyReminded();
  }

  componentDidUpdate() {
    if (this.props.navigation.state.routeName === 'commerceProfileView') {
      if (this.props.commerceId && !this.props.loadingProfile && this.props.commerce.objectID !== this.props.commerceId) {
        this.setCommercePropsByID(this.props.commerce.objectID);
      }
    }
  }

  setCommercePropsByID = commerceId => {
    this.setState({ favorite: this.props.favoriteCommerces.includes(commerceId) });
    this.props.onCommerceRead(commerceId);
    this.props.onCommerceCourtTypesRead(commerceId);
  };

  renderDescription = () => {
    if (this.props.description)
      return (
        <View style={styles.descriptionStyle}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>{this.props.description}</Text>
        </View>
      );
  };

  renderLocation = () => {
    const { address, city } = this.props;
    const { provinceId, name } = this.props.province;

    if (address || city || provinceId) {
      const { locationContainerStyle } = styles;

      return (
        <TouchableOpacity onPress={() => this.onMapPress()} style={locationContainerStyle}>
          <Ionicons name="md-pin" type="ionicon" size={16} />

          <Text style={{ textAlign: 'center', paddingLeft: 5 }}>{`${address}, ${city}, ${name}`}</Text>
        </TouchableOpacity>
      );
    }
  };

  onFavoritePress = commerceId => {
    this.state.favorite
      ? this.props.onFavoriteCommerceDelete(commerceId)
      : this.props.onFavoriteCommerceRegister(commerceId);

    this.setState({ favorite: !this.state.favorite });
  };

  onMapPress = () => {
    this.props.onLocationValueChange({
      address: this.props.address,
      city: this.props.city,
      provinceName: this.props.province.name,
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      userLocation: { ...this.props.userLocation, latitude: null, longitude: null }
    });

    this.props.navigation.navigate('commerceLocationMap');
  };

  onPicturePress = () => {
    this.setState({ pictureVisible: !this.state.pictureVisible });
  };

  getRatingValue = () => {
    const { total, count } = this.props.rating;
    return total ? total / count : 0;
  };

  render() {
    const { headerContainerStyle, avatarContainerStyle, avatarStyle } = styles;

    const {
      profilePicture,
      headerPicture,
      name,
      commerceId,
      navigation,
      loadingProfile,
      loadingCourtTypes
    } = this.props;

    if (loadingProfile || loadingCourtTypes) return <Spinner />;

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshingProfile || this.props.refreshingCourtTypes}
            colors={[MAIN_COLOR]}
            onRefresh={() => {
              this.props.onCommerceRead(this.props.commerceId, 'refreshing');
              this.props.onCommerceCourtTypesRead(this.props.commerceId, 'refreshing');
            }}
          />
        }
      >
        <View>
          <Image style={styles.headerPictureStyle} source={headerPicture ? { uri: headerPicture } : null} />

          <View style={{ flexDirection: 'row-reverse' }}>
            <Button
              type="clear"
              icon={<Ionicons name="md-information-circle-outline" color={'white'} size={30} />}
              onPress={() => navigation.navigate('commerceProfileInfo')}
            />

            <Button
              type="clear"
              icon={
                this.state.favorite ? (
                  <Icon name="favorite" color={'red'} size={30} />
                ) : (
                    <Icon name="favorite-border" color={'white'} size={30} />
                  )
              }
              onPress={() => this.onFavoritePress(commerceId)}
            />

            <Button
              type="clear"
              icon={<Ionicons name="md-text" color={'white'} size={30} />}
              onPress={() =>
                this.props.navigation.navigate('commerceReviewsList', {
                  commerceId: this.props.commerceId
                })
              }
            />
          </View>

          <View style={headerContainerStyle}>
            <View style={avatarContainerStyle}>
              <Avatar
                rounded
                source={profilePicture ? { uri: profilePicture } : null}
                size={avatarSize}
                icon={{ name: 'store' }}
                containerStyle={avatarStyle}
                onPress={() => this.onPicturePress()}
              />
            </View>

            <Text h4>{name}</Text>

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('commerceReviewsList', {
                  commerceId: this.props.commerceId
                })
              }
            >
              {/* Este componente Rating tira error de update en el render */}
              <Rating style={{ padding: 8 }} readonly imageSize={22} startingValue={this.getRatingValue()} />
            </TouchableOpacity>

            {this.renderLocation()}
          </View>

          <View>{this.renderDescription()}</View>
          <Divider
            style={{
              backgroundColor: 'grey',
              marginTop: 15,
              marginBottom: 0,
              marginLeft: 15,
              marginRight: 15
            }}
          />
        </View>

        <AreaComponentRenderer
          area={this.props.areaId}
          sports={<CommerceCourtTypes navigation={navigation} />}
          hairdressers={<CommerceServicesEmployees navigation={navigation} />}
        />

        <PictureView
          isVisible={this.state.pictureVisible}
          onClosePress={this.onPicturePress}
          picture={this.props.profilePicture}
          width={screenWidth}
          height={screenWidth}
        />
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignSelf: 'stretch'
  },
  headerContainerStyle: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: headerPictureHeight / 2 - 49
  },
  headerPictureStyle: {
    height: headerPictureHeight,
    width: screenWidth,
    position: 'absolute'
  },
  avatarContainerStyle: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  avatarStyle: {
    borderWidth: 4,
    borderColor: MAIN_COLOR,
    marginBottom: 10
  },
  locationContainerStyle: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    margin: 10,
    marginLeft: 15,
    marginRight: 15
  },
  descriptionStyle: {
    alignItems: 'center',
    marginHorizontal: 15
  }
});

const mapStateToProps = state => {
  const { commerce } = state.reservation;
  const { favoriteCommerces } = state.commercesList;
  const { loading: loadingCourtTypes, refreshing: refreshingCourtTypes } = state.commerceCourtTypes;
  const { cards } = state.commerceSchedule;
  const {
    name,
    description,
    address,
    city,
    province,
    profilePicture,
    headerPicture,
    commerceId,
    latitude,
    longitude,
    rating,
    refreshing: refreshingProfile,
    loading: loadingProfile,
    area: { areaId }
  } = state.commerceData;

  const { userLocation } = state.locationData;
  return {
    name,
    description,
    address,
    city,
    province,
    profilePicture,
    headerPicture,
    commerceId,
    latitude,
    longitude,
    rating,
    commerce,
    favoriteCommerces,
    cards,
    loadingCourtTypes,
    refreshingCourtTypes,
    loadingProfile,
    refreshingProfile,
    areaId,
    userLocation
  };
};

export default connect(mapStateToProps, {
  onCommerceRead,
  onFavoriteCommerceRegister,
  onFavoriteCommerceDelete,
  onLocationValueChange,
  onCommerceCourtTypesRead,
  onEmailVerifyReminded
})(CommerceProfileView);
