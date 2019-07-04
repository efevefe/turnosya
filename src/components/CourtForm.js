import React, { Component } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import { CardSection, Button, Input, Picker } from './common';
import { onCourtValueChange, onFormOpen } from '../actions';

class CourtForm extends Component {
  constructor() {
    super();
    this.state = { id: [], data: [] };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('CourteType')
      .get()
      .then(querySnapshot => {
        let id = [];
        let data = [];
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, ' => ', doc.data());
          id.push(doc.id);
          data.push(doc.data());
        });
        this.setState({ id, data });
        //console.log('ID: ', this.state.id);
        console.log('DATA: ', this.state.data);
      });
  }

  renderPicker = () => {
    return (
      <Picker>
        {this.state.id.map((item, index) => {
          return <Picker.Item key={index} label={item} value={item} />;
        })}
      </Picker>
    );
    /*  <Picker>
        <Picker.Item label={this.state.id[0]} value="js" />
        <Picker.Item label={this.state.id[1]} value="js" />
      </Picker> */
  };

  render() {
    return (
      <View>
        {console.log('ID: ', this.state.id)}

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
            <Input
              label="Tipo de cancha:"
              placeholder="Futbol"
              value={this.props.typeCourt}
              onChangeText={value =>
                this.props.onCourtValueChange({
                  prop: 'typeCourt',
                  value
                })
              }
            />
          </CardSection>
          <CardSection>{this.renderPicker()}</CardSection>
        </Card>
      </View>
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
  const { name, typeCourt, typeGround, price, loading } = state.courtForm;

  return { name, typeCourt, typeGround, price, loading };
};

export default connect(
  mapStateToProps,
  { onCourtValueChange, onFormOpen }
)(CourtForm);
