import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import { CardSection, Input, Picker, Button } from './common';
import {
  onCourtValueChange,
  getCourtAndGroundTypes,
  courtCreate
} from '../actions';

class CourtForm extends Component {
  constructor() {
    super();

    this.state = {
      indexCourtSelected: null,
      indexGroundSelected: null
    };
  }

  componentDidMount() {
    this.props.getCourtAndGroundTypes();
  }

  onButtonPressHandler() {
    const { name, court, ground, price } = this.props;

    this.props.courtCreate({ name, court, ground, price });

    this.setState({ indexCourtSelected: null, indexGroundSelected: null });
  }

  renderGroundItems = () => {
    const { indexCourtSelected } = this.state;

    if (indexCourtSelected) {
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
    console.log('COURT: ', this.props.court, 'GROUND: ', this.props.ground);

    return (
      <View>
        <Card containerStyle={styles.cardStyle}>
          <CardSection>
            <Input
              label="Nombre:"
              placeholder="Cancha 1"
              value={this.props.name}
              onChangeText={value =>
                this.props.onCourtValueChange({
                  prop: 'name',
                  value
                })
              }
            />
          </CardSection>

          <CardSection>
            <Picker
              title={'Tipo de cancha:'}
              placeholder={placeHolder[0]}
              items={this.props.courts}
              onValueChange={value => {
                this.setState({
                  indexCourtSelected: value
                });
                this.props.onCourtValueChange({
                  prop: 'court',
                  value: this.props.courts[value - 1].label
                });
              }}
            />
          </CardSection>

          <CardSection>
            <Picker
              title={'Tipo de suelo:'}
              placeholder={placeHolder[0]}
              items={this.renderGroundItems()}
              onValueChange={value => {
                this.setState({ indexGroundSelected: value });
                this.props.onCourtValueChange({
                  prop: 'ground',
                  value: this.props.grounds[this.state.indexCourtSelected - 1]
                    .label[value - 1]
                });
              }}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Precio:"
              placeholder="Precio de la cancha"
              keyboardType="numeric"
              value={this.props.price}
              onChangeText={value =>
                this.props.onCourtValueChange({
                  prop: 'price',
                  value
                })
              }
            />
          </CardSection>
          <CardSection>
            <Button
              title="Guardar"
              onPress={this.onButtonPressHandler.bind(this)}
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
  const { name, courts, court, grounds, ground, price } = state.courtForm;

  return { name, courts, court, grounds, ground, price };
};

export default connect(
  mapStateToProps,
  { onCourtValueChange, getCourtAndGroundTypes, courtCreate }
)(CourtForm);
