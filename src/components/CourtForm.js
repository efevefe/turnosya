import React, { Component } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import { CardSection, Input, Picker } from './common';
import { onCourtValueChange, onFormOpen } from '../actions';

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

  // componentDidMount() {
  //   this.getDataBaseData();
  // }

  getDataBaseData = () => {
    firebase
      .firestore()
      .collection('CourtType')
      .get()
      .then(querySnapshot => {
        let id = ['Elija una opcion ...'];
        let data = [{ '0': 'Elija una opcion ...' }];
        querySnapshot.forEach(doc => {
          id.push(doc.id);
          data.push(doc.data());
        });
        this.setState({ id, data });
      });
  };

  renderPicker = () => {
    return this.state.id.map((item, index) => {
      return <Picker.Item key={index} label={item} value={item} />;
    });
  };

  renderPicker2 = () => {
    if (this.state.indexSelected) {
      const values = this.state.data[this.state.indexSelected];
      const arr = values.groundType;
      return arr.map((item, index) => {
        return <Picker.Item key={index} label={item} value={item} />;
      });
    } else {
      return null;
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

          <Picker items={datos} />

          {/* <CardSection>
            <Picker
              selectedValue={this.state.typeSelected}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({
                  indexSelected: itemIndex,
                  typeSelected: itemValue,
                  pickerEnable: true
                })
              }
            >
              {this.renderPicker()}
            </Picker>
          </CardSection>

          <CardSection>
            <Picker
              enable={this.state.pickerEnable}
              selectedValue={this.state.typeSelected2}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({
                  indexSelected2: itemIndex,
                  typeSelected2: itemValue
                })
              }
            >
              {this.renderPicker2()}
            </Picker>
          </CardSection> */}
        </Card>
      </View>
    );
  }
}
const datos = [{ label: 'tnis', value: 't' }, { label: 'ddd', value: 'aa' }];

const styles = StyleSheet.create({
  cardStyle: {
    padding: 5,
    paddingTop: 10,
    borderRadius: 10
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
