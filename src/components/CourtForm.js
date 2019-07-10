import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import {
  onCourtValueChange,
  getCourtAndGroundTypes,
  courtCreate
} from '../actions';
import { CardSection, Input, Picker, Button } from './common';
import { validateValueType } from '../utils';

class CourtForm extends Component {
  constructor() {
    super();

    // this.state = {
    //   indexCourtSelected: null,
    //   nameError: '',
    //   courtError: '',
    //   groundTypeError: '',
    //   priceError: ''
    // };
  }

  state = {
    indexCourtSelected: null,
    nameError: '',
    courtError: '',
    groundTypeError: '',
    priceError: ''
  };

  componentDidMount() {
    this.props.getCourtAndGroundTypes();
  }

  onButtonPressHandler() {
    if (this.validateMinimumData()) {
      const { name, court, ground, price, navigation } = this.props;
      //const { params } = this.props.navigation.state;

      //aca despues hay que ver el bien el tema de hacer todo con el navigation
      this.props.courtCreate({
        name,
        court,
        ground,
        price
      });

      // creo que con lo siguiente reinicas el this.state: " this.setState(this.state) "

      // en realidad despues de crear va a tirar error, porque habria que ir a otra pantalla, pero despues lo vemos
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
      this.setState({ priceError: 'Debe ingresar un valor numerico' });
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

  onCourtTypeChangeHandle = value => {
    this.setState({
      indexCourtSelected: value,
      courtError: ''
    });
    if (value > 0) {
      this.props.onCourtValueChange({
        prop: 'court',
        value: this.props.courts[value - 1].label
      });
    } else {
      this.props.onCourtValueChange({
        prop: 'court',
        value: ''
      });
    }
  };

  onGroundTypeChangeHandle = value => {
    const { indexCourtSelected } = this.state;
    const { grounds, onCourtValueChange } = this.props;

    this.setState({ groundTypeError: '' });

    if (grounds && value > 0) {
      onCourtValueChange({
        prop: 'ground',
        value: grounds[indexCourtSelected - 1].label[value - 1]
      });
    } else {
      onCourtValueChange({ prop: 'ground', value: '' });
    }
  };

  renderGroundItems = () => {
    const { indexCourtSelected } = this.state;

    if (indexCourtSelected > 0) {
      groundType = this.props.grounds[indexCourtSelected - 1].label;

      let i = 0;
      const res = [];
      groundType.forEach(ground => {
        i++;
        return res.push({ value: i, label: ground });
      });

      return res;
    } else {
      return placeHolder;
    }
  };

  render() {
    return (
      <View>
        <Card containerStyle={styles.cardStyle}>
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
              items={this.props.courts}
              onValueChange={this.onCourtTypeChangeHandle}
              errorMessage={this.state.courtError}
            />
          </CardSection>

          <CardSection>
            <Picker
              title={'Tipo de suelo:'}
              placeholder={placeHolder[0]}
              items={this.renderGroundItems()}
              onValueChange={this.onGroundTypeChangeHandle}
              disabled={
                !this.state.indexCourtSelected &&
                this.state.groundTypeError !== ''
              }
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

const placeHolder = [
  {
    label: 'Elija una opcion...',
    value: 0
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
    existedError
  } = state.courtForm;

  return { name, courts, court, grounds, ground, price, existedError };
};

export default connect(
  mapStateToProps,
  { onCourtValueChange, getCourtAndGroundTypes, courtCreate }
)(CourtForm);
