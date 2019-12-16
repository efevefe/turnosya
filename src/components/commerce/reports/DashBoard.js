import React, { Component } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableHighlight,
  ScrollView
} from 'react-native';
import { Card } from 'react-native-elements';

class DashBoard extends Component {
  render() {
    return (
      <ScrollView>
        <TouchableHighlight
          onPress={() => this.props.navigation.navigate('barChartReport')}
          underlayColor="transparent"
        >
          <Card
            image={require('../../../../assets/bar-chart.png')}
            containerStyle={{ borderRadius: 10, overflow: 'hidden' }}
            imageProps={{ resizeMode: 'stretch' }}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center'
              }}
            >
              Cantidad de reservas por dia
            </Text>
          </Card>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.navigation.navigate('lineChartMoneyReport')}
          underlayColor="transparent"
        >
          <Card
            image={require('../../../../assets/line-chart.png')}
            containerStyle={{
              borderRadius: 10,
              overflow: 'hidden'
            }}
            imageProps={{ resizeMode: 'stretch' }}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center'
              }}
            >
              Ingresos por mes
            </Text>
          </Card>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() =>
            this.props.navigation.navigate('lineChartReviewsReport')
          }
          und
          underlayColor="transparent"
        >
          <Card
            image={require('../../../../assets/line-chart.png')}
            containerStyle={{
              borderRadius: 10,
              overflow: 'hidden'
            }}
            imageProps={{ resizeMode: 'stretch' }}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center'
              }}
            >
              Cantidad de reservas por dia
            </Text>
          </Card>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() =>
            this.props.navigation.navigate('reportScreen', { number: 3 })
          }
          und
          underlayColor="transparent"
        >
          <Card
            image={require('../../../../assets/pie-chart.png')}
            containerStyle={{
              borderRadius: 10,
              overflow: 'hidden'
            }}
            imageProps={{ resizeMode: 'stretch' }}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center'
              }}
            >
              Cantidad de reservas por dia
            </Text>
          </Card>
        </TouchableHighlight>
      </ScrollView>
    );
  }
}

export default DashBoard;
