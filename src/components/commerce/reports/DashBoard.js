import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, TouchableHighlight, ScrollView, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import { onCommerceReportValueReset } from '../../../actions';

const imagesRoute = '../../../../assets/';

const chartsData = [
  {
    id: 1,
    title: 'Cantidad de reservas por día',
    image: require(imagesRoute + 'bar-chart.png'),
    screen: 'barChartReport',
    description: 'Visualize la cantidad de reservas que tiene su negocio por dia. ' +
      'Esto lo ayuda a saber la demanda de cada dia y en base a eso poder ' +
      'tomar decisiones.'
  },
  {
    id: 2,
    title: 'Ingresos por mes',
    image: require(imagesRoute + 'earnings-chart.png'),
    screen: 'lineChartMoneyReport',
    description: 'Muestra la cantidad de ingresos percibidos en cada mes de un año. ' +
      'De esta manera puede visualizar la diferencia de ingresos en los ' +
      'diferentes meses o comparando con diferentes años.'
  },
  {
    id: 3,
    title: 'Mis calificaciones',
    image: require(imagesRoute + 'ratings-chart.png'),
    screen: 'lineChartReviewsReport',
    description: 'Haga un seguimiento de las calificaciones de sus clientes. Nos ' +
      'ayuda a observar las fluctuaciones de las calificaciones a lo ' +
      'largo del año.'
  },
  {
    id: 4,
    title: 'Cantidad de turnos cancelados y realizados',
    image: require(imagesRoute + 'reservations-chart.png'),
    screen: 'pieChartReport',
    description: 'Haga una comparación entre la cantidad de reservas realizadas y ' +
      'las canceladas.'
  }
];

class DashBoard extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.isFocused() && !prevProps.isFocused())
      this.props.onCommerceReportValueReset();
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {
          chartsData.map(chart => (
            <TouchableHighlight
              onPress={() => this.props.navigation.navigate(chart.screen)}
              underlayColor="transparent"
              key={chart.id}
            >
              <Card
                image={chart.image}
                containerStyle={styles.cardContainer}
                imageProps={{ resizeMode: 'stretch' }}
              >
                <Text style={styles.cardTitle}>
                  {chart.title}
                </Text>
                <Text style={styles.cardDescription}>
                  {chart.description}
                </Text>
              </Card>
            </TouchableHighlight>
          ))
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingBottom: 15
  },
  cardContainer: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  cardTitle: {
    fontSize: 16,
    textAlign: 'center'
  },
  cardDescription: {
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 5
  }
});

export default connect(null, { onCommerceReportValueReset })(DashBoard);
