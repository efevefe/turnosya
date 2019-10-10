import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CardSection, Button, Input } from './common';
import { validateValueType } from '../utils';
import {
  onServiceValueChange,
  onFormOpen,
  serviceCreate,
  serviceUpdate
} from '../actions';

class ServiceForm extends Component {
  state = { nameError: '', durationError: '', priceError: '' };

  componentWillMount() {
    const { params } = this.props.navigation.state;

    if (params) {
      const { service } = params;

      for (prop in service) {
        this.props.onServiceValueChange({ prop, value: service[prop] });
      }
    } else {
      this.props.onFormOpen();
    }
  }

  onButtonPressHandler() {
    if (this.validateMinimumData()) {
      const { name, duration, price, description, navigation, commerceId } = this.props;
      const { params } = this.props.navigation.state;

      if (params) {
        const { id } = this.props.navigation.state.params.service;

        this.props.serviceUpdate(
          {
            name,
            duration,
            price,
            description,
            id,
            commerceId
          },
          navigation
        );
      } else {
        this.props.serviceCreate(
          {
            name,
            duration,
            price,
            description,
            commerceId
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

  renderDurationError = () => {
    if (this.props.duration === '') {
      this.setState({ durationError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('int', this.props.duration)) {
      this.setState({ durationError: 'Debe ingresar un valor numérico' });
      return false;
    } else {
      this.setState({ durationError: '' });
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
      this.renderDurationError() &&
      this.renderPriceError()
    );
  };

  render() {
    const { cardStyle } = styles;

    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={60}>
        <View>
          <Card containerStyle={cardStyle}>
            <CardSection>
              <Input
                label="Nombre:"
                placeholder="Nombre del servicio"
                value={this.props.name}
                errorMessage={this.state.nameError}
                onChangeText={value =>
                  this.props.onServiceValueChange({
                    prop: 'name',
                    value
                  })
                }
                onFocus={() => this.setState({ nameError: '' })}
                onBlur={this.renderNameError}
              />
            </CardSection>
            <CardSection>
              <Input
                label="Duración:"
                placeholder="Duración del servicio"
                keyboardType="numeric"
                value={this.props.duration}
                errorMessage={this.state.durationError}
                onChangeText={value => {
                  this.props.onServiceValueChange({
                    prop: 'duration',
                    value
                  });
                }}
                onFocus={() => this.setState({ durationError: '' })}
                onBlur={this.renderDurationError}
              />
            </CardSection>
            <CardSection>
              <Input
                label="Precio:"
                placeholder="Precio del servicio"
                keyboardType="numeric"
                value={this.props.price}
                errorMessage={this.state.priceError}
                onChangeText={value =>
                  this.props.onServiceValueChange({
                    prop: 'price',
                    value
                  })
                }
                onFocus={() => this.setState({ priceError: '' })}
                onBlur={this.renderPriceError}
              />
            </CardSection>
            <CardSection>
              <Input
                label="Descripción:"
                placeholder="Descripción del servicio"
                multiline={true}
                maxLength={250}
                maxHeight={180}
                onChangeText={value =>
                  this.props.onServiceValueChange({
                    prop: 'description',
                    value
                  })
                }
                value={this.props.description}
              />
            </CardSection>
            <CardSection>
              <Button
                title="Guardar"
                loading={this.props.loading}
                onPress={this.onButtonPressHandler.bind(this)}
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

const mapStateToProps = state => {
  const {
    name,
    duration,
    price,
    description,
    error,
    loading
  } = state.serviceForm;
  const { commerceId } = state.commerceData;

  return { name, duration, price, description, error, loading, commerceId };
};

export default connect(
  mapStateToProps,
  { onServiceValueChange, onFormOpen, serviceCreate, serviceUpdate }
)(ServiceForm);
