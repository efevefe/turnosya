import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Tooltip } from 'react-native-elements';
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
import { CardSection, Input, Picker, Button, Spinner } from './common';
import { validateValueType } from '../utils';
import { MAIN_COLOR } from '../constants';

class CourtForm extends Component {
  state = {
    nameError: '',
    courtError: '',
    groundTypeError: '',
    priceError: '',
    selectedGrounds: [],
    save: false
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

  componentDidMount() {
    this.props.getCourtAndGroundTypes();
  }

  onButtonPressHandler() {
    if (this.validateMinimumData()) {
      const { name, court, ground, price, courtState, navigation } = this.props;
      const { params } = this.props.navigation.state;
      this.setState({ save: true });
      if (params) {
        const { id } = this.props.navigation.state.params.court;
        this.props.courtUpdate(
          {
            name,
            court,
            ground,
            price,
            courtState,
            id
          },
          navigation
        );
      } else {
        //Mejorar esa espera que hay entre que apretas el botón y se termine de guardar.
        this.props.courtCreate(
          {
            name,
            court,
            ground,
            price,
            courtState
          },
          navigation
        );
      }
    }
  }

  renderNameError = () => {
    if (this.props.name === '') {
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
    if (this.props.price === '') {
      this.setState({ priceError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('number', this.props.price)) {
      this.setState({ priceError: 'Debe ingresar un valor numérico' });
      return false;
    } else {
      this.setState({ priceError: '' });
      return true;
    }
  };

  validateMinimumData = () => {
    return (
      this.renderNameError() &&
      this.renderCourtError() &&
      this.renderGroundTypeError() &&
      this.renderPriceError()
    );
  };

  onCourtTypeChangeHandle = (value, key) => {
    this.setState({
      courtError: ''
    });
    if (key > 0) {
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

    if (grounds !== null && key > 0) {
      onCourtValueChange({
        prop: 'ground',
        value
      });
    } else {
      onCourtValueChange({ prop: 'ground', value: '' });
    }
  };

  render() {
    if (!this.props.grounds) {
      return <Spinner size="large" />;
    } else {
      if (this.state.save) {
        return <Spinner size="large" />;
      } else {
        return (
          <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={20}>
            <View>
              {console.log('state: ', this.props.courtState)}

              <Card containerStyle={styles.cardStyle}>
                <CardSection style={{ marginTop: 0 }}>
                  <View
                    style={{
                      flexDirection: 'row-reverse'
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
                    placeholder={placeHolder[0]}
                    value={this.props.court}
                    items={this.props.courts}
                    onValueChange={this.onCourtTypeChangeHandle}
                    errorMessage={this.state.courtError}
                  />
                </CardSection>

                <CardSection>
                  <Picker
                    title={'Tipo de suelo:'}
                    placeholder={placeHolder[0]}
                    value={this.props.ground}
                    items={this.state.selectedGrounds}
                    onValueChange={this.onGroundTypeChangeHandle}
                    disabled={this.state.selectedGrounds.length === 0}
                    errorMessage={this.state.groundTypeError}
                  />
                </CardSection>

                <CardSection>
                  <Input
                    label="Precio por turno:"
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
                <CardSection>
                  <Button
                    title="Guardar"
                    onPress={this.onButtonPressHandler.bind(this)}
                    errorMessage={
                      this.props.existedError
                        ? 'NOMBRE DE CANCHA YA EXISTENTE'
                        : ''
                    }
                  />
                </CardSection>
              </Card>
            </View>
          </KeyboardAwareScrollView>
        );
      }
    }
  }
}

const placeHolder = [
  {
    label: 'Elija una opción...',
    value: 'Elija una opción...',
    key: -1
  }
];

const styles = StyleSheet.create({
  cardStyle: {
    padding: 5,
    paddingTop: 10,
    borderRadius: 10
  }
});

const helpText =
  'Cuando esta encendido indica que el estado de la cancha es "Disponible", \
en cambio si esta apagado indica que el estado de la cancha es "No Disponible"';

const mapStateToProps = state => {
  const {
    name,
    courts,
    court,
    grounds,
    ground,
    price,
    loading,
    existedError,
    courtState
  } = state.courtForm;

  return {
    name,
    courts,
    court,
    grounds,
    ground,
    price,
    loading,
    existedError,
    courtState
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
