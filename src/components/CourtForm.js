import React, { Component } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { View, StyleSheet, Text } from 'react-native';
import { CardSection, Input, Picker } from './common';
import { onCourtValueChange, onFormOpen } from '../actions';
import { MAIN_COLOR } from '../constants';

class CourtForm extends Component {
  constructor() {
    super();
    this.state = {
      id: [],
      data: [],
      indexSelected: null,
      typeSelected: null,
      pickerEnable: false,
      typeSelected2: null,
      indexSelected2: null
    };
  }

  componentDidMount() {
    this.getDataBaseData();
  }

  getDataBaseData = () => {
    firebase
      .firestore()
      .collection('CourtType')
      .get()
      .then(querySnapshot => {
        let id = [];
        let data = [];
        let i = 1;
        querySnapshot.forEach(doc => {
          id.push({ value: i, label: doc.id });
          data.push({ value: i, label: doc.data().groundType });
          i++;
        });
        this.setState({ id, data });
      });
  };

  renderGroundItems = () => {
    if (this.state.indexSelected) {
      const grounds = this.state.data[this.state.indexSelected - 1].label;
      let i = 0;
      const res = [];
      grounds.forEach(ground => {
        i++;
        return res.push({ value: i, label: ground });
      });
      return res;
    } else {
      console.log(placeHolder[0])
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
            <Text style={styles.textStyle}>Tipo de cancha:</Text>
            <Picker
              placeholder={placeHolder[0]}
              items={this.state.id}
              onValueChange={value => {
                this.setState({ indexSelected: value });
              }}
            />
          </CardSection>
          <CardSection>
            <Text style={styles.textStyle}>Tipo de suelo:</Text>

            <Picker
              placeholder={placeHolder[0]}
              items={this.renderGroundItems()}
              onValueChange={value => {
                this.setState({ indexSelected2: value });
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

const placeHolder = [{
  label: 'Elija una opcion...',
  value: 0
}];
const styles = StyleSheet.create({
  cardStyle: {
    padding: 5,
    paddingTop: 10,
    borderRadius: 10
  },
  textStyle: {
    fontSize: 14,
    fontWeight: 'normal',
    color: MAIN_COLOR,
    marginRight: 10,
    marginLeft: 10
    //padding: 5
  }
});

const mapStateToProps = state => {
  const { name, typeCourt, typeGround, price, loading } = state.courtForm;

  return { name, typeCourt, typeGround, price, loading };
};

export default connect(
  mapStateToProps,
  { onCourtValueChange, onFormOpen }
)(CourtForm);
