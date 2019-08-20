import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Tooltip, CheckBox } from 'react-native-elements';
import { View, StyleSheet, Switch, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  onCourtValueChange,
  getCourtAndGroundTypes,
  courtCreate,
  onCourtFormOpen,
  courtUpdate
} from '../actions';
import { CardSection, Input, Picker, Button } from './common';
import { validateValueType, trimString } from '../utils';
import { MAIN_COLOR, MAIN_COLOR_DISABLED, GREY_DISABLED } from '../constants';

class CourtForm extends Component {
  state = {
    nameError: '',
    courtError: '',
    groundTypeError: '',
    priceError: '',
    lightPriceError: '',
    selectedGrounds: [],
    lightPriceOpen: false
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;

    if (params) {
      const { court } = params;

      for (prop in params.court) {
        this.props.onCourtValueChange({ prop, value: court[prop] });
      }
    } else {
      this.props.onCourtFormOpen();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.grounds !== prevProps.grounds) {
      const firstIndex = this.props.courts.findIndex(
        item => item.value === this.props.court
      );
      if (firstIndex > -1)
        this.setState({ selectedGrounds: this.props.grounds[firstIndex] });
    }
  }

  async componentDidMount() {
    await this.props.getCourtAndGroundTypes();
    this.setState({ lightPriceOpen: this.props.lightPrice !== '' });
  }

  onButtonPressHandler = () => {
    if (this.validateMinimumData()) {
      const {
        name,
        court,
        ground,
        price,
        lightPrice,
        courtState,
        commerceId,
        navigation
      } = this.props;

      const { params } = this.props.navigation.state;
      if (params) {
        const { id } = this.props.navigation.state.params.court;
        this.props.courtUpdate(
          {
            name,
            court,
            ground,
            price,
            lightPrice,
            courtState,
            id,
            commerceId
          },
          navigation
        );
      } else {
        this.props.courtCreate(
          {
            name,
            court,
            ground,
            price,
            lightPrice,
            courtState,
            commerceId
          },
          navigation
        );
      }
    }
  };

  renderNameError = () => {
    const { name, onCourtValueChange } = this.props;
    const value = trimString(name);
    onCourtValueChange({ prop: 'name', value });

    if (value === '') {
      this.setState({ nameError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ nameError: '' });
      return true;
    }
  };

  renderCourtError = () => {
    if (this.props.court === '') {
      this.setState({ courtError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ courtError: '' });
      return true;
    }
  };

  renderGroundTypeError = () => {
    if (this.props.ground === '') {
      this.setState({ groundTypeError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ groundTypeError: '' });
      return true;
    }
  };

  renderPriceError = () => {
    const { price, onCourtValueChange } = this.props;
    onCourtValueChange({ prop: 'price', value: price.trim() });
    if (price.trim() === '') {
      this.setState({ priceError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('number', price.trim())) {
      this.setState({ priceError: 'Debe ingresar un valor numérico' });
      return false;
    } else {
      this.setState({ priceError: '' });
      return true;
    }
  };

  renderLightPriceError = () => {
    if (this.state.lightPriceOpen) {
      const { lightPrice, onCourtValueChange } = this.props;
      onCourtValueChange({ prop: 'lightPrice', value: lightPrice.trim() });

      if (lightPrice.trim() === '') {
        this.setState({ lightPriceError: 'Dato requerido' });
        return false;
      } else if (!validateValueType('number', lightPrice.trim())) {
        this.setState({ lightPriceError: 'Debe ingresar un valor numérico' });
        return false;
      }
    }

    this.setState({ lightPriceError: '' });
    return true;
  };

  validateMinimumData = () => {
    return (
      this.renderNameError() &&
      this.renderCourtError() &&
      this.renderGroundTypeError() &&
      this.renderPriceError() &&
      this.renderLightPriceError()
    );
  };

  onCourtTypeChangeHandle = (value, key) => {
    this.setState({
      courtError: ''
    });
    if (key > 0) {
      if (this.props.grounds.length)
        this.setState({ selectedGrounds: this.props.grounds[key - 1] });
      this.props.onCourtValueChange({
        prop: 'court',
        value
      });
    } else {
      this.setState({ selectedGrounds: [] });
      this.props.onCourtValueChange({
        prop: 'court',
        value: ''
      });
    }
  };

  onGroundTypeChangeHandle = (value, key) => {
    const { grounds, onCourtValueChange } = this.props;

    this.setState({ groundTypeError: '' });

    grounds !== null && key > 0
      ? onCourtValueChange({
        prop: 'ground',
        value
      })
      : onCourtValueChange({ prop: 'ground', value: '' });
  };

  onCheckBoxPress = () => {
    if (this.state.lightPriceOpen)
      this.props.onCourtValueChange({ prop: 'lightPrice', value: '' });

    this.setState({ lightPriceOpen: !this.state.lightPriceOpen });
  };

  renderLightPriceInput() {
    if (this.state.lightPriceOpen) {
      return (
        <CardSection>
          <Input
            label="Precio por turno (con luz):"
            placeholder="Precio de la cancha"
            keyboardType="numeric"
            value={this.props.lightPrice}
            errorMessage={this.state.lightPriceError}
            onChangeText={value =>
              this.props.onCourtValueChange({
                prop: 'lightPrice',
                value
              })
            }
            onFocus={() => this.setState({ lightPriceError: '' })}
            onBlur={this.renderLightPriceError}
          />
        </CardSection>
      );
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={20}>
        <View>
          <Card containerStyle={styles.cardStyle}>
            <CardSection style={{ marginTop: 0 }}>
              <View
                style={{
                  flexDirection: 'row-reverse',
                  paddingLeft: 5
                }}
              >
                <Switch
                  style={{ alignSelf: 'flex-end' }}
                  onValueChange={value =>
                    this.props.onCourtValueChange({
                      prop: 'courtState',
                      value
                    })
                  }
                  value={this.props.courtState}
                  trackColor={{
                    false: GREY_DISABLED,
                    true: MAIN_COLOR_DISABLED
                  }}
                  thumbColor={this.props.courtState ? MAIN_COLOR : 'grey'}
                />
                <Tooltip
                  popover={
                    <Text style={{ color: 'white', textAlign: 'justify' }}>
                      {helpText}
                    </Text>
                  }
                  height={120}
                  width={250}
                  backgroundColor={MAIN_COLOR}
                  withOverlay={false}
                >
                  <Icon
                    name="help"
                    size={22}
                    color={MAIN_COLOR}
                    style={{
                      marginRight: 6,
                      marginTop: 3,
                      padding: 0
                    }}
                  />
                </Tooltip>
              </View>
            </CardSection>

            <CardSection>
              <Input
                label="Nombre:"
                placeholder="Cancha 1"
                value={this.props.name}
                errorMessage={this.state.nameError}
                onChangeText={value =>
                  this.props.onCourtValueChange({
                    prop: 'name',
                    value
                  })
                }
                onFocus={() => this.setState({ nameError: '' })}
                onBlur={this.renderNameError}
              />
            </CardSection>

            <CardSection>
              <Picker
                title={'Tipo de cancha:'}
                placeholder={{ value: null, label: 'Elija una opción...' }}
                value={this.props.court}
                items={this.props.courts}
                onValueChange={this.onCourtTypeChangeHandle}
                errorMessage={this.state.courtError}
              />
            </CardSection>

            <CardSection>
              <Picker
                title={'Tipo de suelo:'}
                placeholder={{ value: null, label: 'Elija una opción...' }}
                value={this.props.ground}
                items={this.state.selectedGrounds}
                onValueChange={this.onGroundTypeChangeHandle}
                disabled={this.state.selectedGrounds.length === 0}
                errorMessage={this.state.groundTypeError}
              />
            </CardSection>

            <CardSection>
              <Input
                label="Precio por turno (sin luz):"
                placeholder="Precio de la cancha"
                keyboardType="numeric"
                value={this.props.price}
                errorMessage={this.state.priceError}
                onChangeText={value =>
                  this.props.onCourtValueChange({
                    prop: 'price',
                    value
                  })
                }
                onFocus={() => this.setState({ priceError: '' })}
                onBlur={this.renderPriceError}
              />
            </CardSection>

            {this.renderLightPriceInput()}

            <CardSection>
              <CheckBox
                containerStyle={{
                  marginTop: 5,
                  marginLeft: 8,
                  marginRight: 8,
                  marginBottom: 0
                }}
                title="Agregar precio con luz"
                iconType="material"
                checkedIcon="clear"
                uncheckedIcon="add"
                uncheckedColor={MAIN_COLOR}
                checkedColor={MAIN_COLOR}
                checkedTitle="Borrar precio con luz"
                checked={this.state.lightPriceOpen}
                onPress={this.onCheckBoxPress}
              />
            </CardSection>

            <CardSection>
              <Button
                title="Guardar"
                loading={this.props.loading}
                onPress={this.onButtonPressHandler}
                errorMessage={
                  this.props.existedError ? 'Nombre de cancha existente' : ''
                }
              />
            </CardSection>
          </Card>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    padding: 5,
    paddingTop: 10,
    borderRadius: 10
  }
});

const helpText =
  'Encendido indica que el estado de la cancha es "Disponible", \
en cambio, apagado indica que el estado de la cancha es "No Disponible"';

const mapStateToProps = state => {
  const {
    name,
    courts,
    court,
    grounds,
    ground,
    price,
    lightPrice,
    loading,
    existedError,
    courtState
  } = state.courtForm;

  const { commerceId } = state.commerceData;

  return {
    name,
    courts,
    court,
    grounds,
    ground,
    price,
    lightPrice,
    loading,
    existedError,
    courtState,
    commerceId
  };
};

export default connect(
  mapStateToProps,
  {
    onCourtValueChange,
    getCourtAndGroundTypes,
    courtCreate,
    courtUpdate,
    onCourtFormOpen
  }
)(CourtForm);
