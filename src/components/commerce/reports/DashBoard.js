import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { Text, TouchableHighlight, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { onCommerceReportValueReset } from '../../../actions';

class DashBoard extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.isFocused && !prevProps.isFocused)
      this.props.onCommerceReportValueReset();
  }

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
            <Text
              style={{
                fontSize: 12,
                fontWeight: '300',
                textAlign: 'center',
                marginTop: 5
              }}
            >
              Visualize la cantidad de reservas que tiene su negocio por dia.
              Esto lo ayuda a saber la demanda de cada dia y en base a eso poder
              tomar decisiones.
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
            <Text
              style={{
                fontSize: 12,
                fontWeight: '300',
                textAlign: 'center',
                marginTop: 5
              }}
            >
              Muestra la cantidad de ingresos percibidos en cada mes de un año.
              De esta manera puede visualizar la diferencia de ingresos en los
              diferentes meses o comparando con diferentes años.
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
              Mis Calificaciones
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '300',
                textAlign: 'center',
                marginTop: 5
              }}
            >
              Haga un seguimiento de las calificaciones de sus clientes. Nos
              ayuda a observar las fluctuaciones de las calificaciones a lo
              largo del año.
            </Text>
          </Card>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.navigation.navigate('pieChartReport')}
          underlayColor="transparent"
        >
          <Card
            image={require('../../../../assets/pie-chart.png')}
            containerStyle={{
              borderRadius: 10,
              overflow: 'hidden',
              marginBottom: 10
            }}
            imageProps={{ resizeMode: 'stretch' }}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center'
              }}
            >
              Cantidad de turnos cancelados y realizados
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '300',
                textAlign: 'center',
                marginTop: 5
              }}
            >
              Haga una comparación entre la cantidad de reservas realizadas y
              las canceladas.
            </Text>
          </Card>
        </TouchableHighlight>
      </ScrollView>
    );
  }
}

export default connect(null, { onCommerceReportValueReset })(
  withNavigationFocus(DashBoard)
);
