import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import { CardSection, Input, Picker } from './common';
import { onCourtValueChange, getCourtAndGroundTypes } from '../actions';

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

  renderGroundItems = () => {
    const { indexCourtSelected } = this.state;

    if (indexCourtSelected) {
      const groundType = this.props.grounds[indexCourtSelected - 1].label;
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
                /* habria que tirar un console.log de value, para ver que te trae, o en vez de que traiga value solo */
                /* hacer la funcion con dos parametros. Algo como: (value, label) => {...} y ver que valores traen */
                this.setState({ indexCourtSelected: value });
                /* hay que ver la forma de que el 'value' te de el label que es el que vamos a guardar */
                /* this.props.onCourtValueChange({ prop: 'court', value: value.label(oalgo asi) }); */
              }}
            />
          </CardSection>

          <CardSection>
            <Picker
              title={'Tipo de suelo:'}
              placeholder={placeHolder[0]}
              items={this.renderGroundItems()}
              onValueChange={value => {
                /* aca lo mismo que con el de arriba */
                this.setState({ indexGroundSelected: value });
                /* this.props.onCourtValueChange({ prop: 'court', value: value.label(oalgo asi) }); */
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
  { onCourtValueChange, getCourtAndGroundTypes }
)(CourtForm);
