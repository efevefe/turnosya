import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { View, StyleSheet, Switch } from 'react-native';
import {
  onCourtValueChange,
  getCourtAndGroundTypes,
  courtCreate,
  onCourtFormOpen,
  courtUpdate
} from '../actions';
import { CardSection, Input, Picker, Button } from './common';
import { validateValueType } from '../utils';

import { Spinner } from './common';

class CourtForm extends Component {
  state = {
    indexCourtSelected: null,
    nameError: '',
    courtError: '',
    groundTypeError: '',
    priceError: '',
    isUpdating: false
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;

    if (params) {
      _.each(params.court, (value, prop) => {
        this.props.onCourtValueChange({ prop, value });
      });

      this.setState({ isUpdating: true });
    } else {
      this.props.onCourtFormOpen();
    }
  }

  componentDidMount() {
    this.props.getCourtAndGroundTypes();
  }

  onButtonPressHandler() {
    if (this.validateMinimumData()) {
      const { name, court, ground, price, navigation } = this.props;
      const { params } = this.props.navigation.state;

      if (params) {
        const { id } = this.props.navigation.state.params.court;
        this.props.courtUpdate(
          {
            name,
            court,
            ground,
            price,
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
            price
          },
          navigation
        );
      }

      this.setState({ indexCourtSelected: null });
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

  setPickersValues = () => {
    if (this.props.courts && this.props.courts.length > 0) {
      const { courts, court } = this.props;

      let index = null;

      courts.some(obj => {
        if (obj.label === court) {
          index = obj.key;
          return;
        }
      });
      this.setState({ indexCourtSelected: index });

      this.setState({ isUpdating: false });
    }
  };

  onCourtTypeChangeHandle = (value, key) => {
    if (!this.state.isUpdating) {
      this.setState({
        indexCourtSelected: key - 1,
        courtError: ''
      });
      if (key > 0) {
        this.props.onCourtValueChange({
          prop: 'court',
          value
        });
      } else {
        this.props.onCourtValueChange({
          prop: 'court',
          value: ''
        });
      }
    } else {
      this.setPickersValues();
    }
  };

  onGroundTypeChangeHandle = (value, key) => {
    if (!this.state.isUpdating) {
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
    } else {
      this.setPickersValues();
    }
  };

  renderGroundItems = () => {
    const { indexCourtSelected } = this.state;
    if (indexCourtSelected !== null && indexCourtSelected > -1) {
      return this.props.grounds[indexCourtSelected];
    } else {
      return placeHolder;
    }
  };

  disabledGroundPicker = () => {
    const { indexCourtSelected, groundTypeError } = this.state;

    return (
      (indexCourtSelected === null || indexCourtSelected < 0) &&
      groundTypeError === ''
    );
  };

  render() {
    if (!this.props.grounds) {
      return <Spinner size="large" />;
    } else {
      return (
        <View>
          <Card containerStyle={styles.cardStyle}>
            <Switch disabled={true} />
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
                items={this.renderGroundItems()}
                onValueChange={this.onGroundTypeChangeHandle}
                disabled={this.disabledGroundPicker()}
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
                  this.props.existedError ? 'NOMBRE DE CANCHA YA EXISTENTE' : ''
                }
              />
            </CardSection>
          </Card>
        </View>
      );
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

const mapStateToProps = state => {
  const {
    name,
    courts,
    court,
    grounds,
    ground,
    price,
    loading,
    existedError
  } = state.courtForm;

  return { name, courts, court, grounds, ground, price, loading, existedError };
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
