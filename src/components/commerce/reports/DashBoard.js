import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, TouchableHighlight, ScrollView, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import { withNavigationFocus } from 'react-navigation';
import { onCommerceReportValueReset } from '../../../actions';

const imagesRoute = '../../../../assets/charts-placeholders/';

const chartsData = [
  {
    id: 1,
    title: 'Cantidad de Reservas por Día',
    image: require(imagesRoute + 'daily-reserv-chart.png'),
    screen: 'dailyReservationsChart',
    description:
      'Visualize la cantidad de reservas que recibe su negocio por día. ' +
      'Ayuda a organizar sus horarios, servicios, empleados en base a ' +
      'las necesidades y gustos de sus clientes.'
  },
  {
    id: 2,
    title: 'Ingresos Mensuales',
    image: require(imagesRoute + 'earnings-chart.png'),
    screen: 'monthlyEarningsChart',
    description:
      'Muestra la cantidad de ingresos percibidos en cada mes de un año. ' +
      'De esta manera puede visualizar el progreso de ingresos a lo ' +
      'largo de un determinado año, conociendo el comportamiento de ' +
      'las distintas etapas del año.'
  },
  {
    id: 3,
    title: 'Mis Calificaciones',
    image: require(imagesRoute + 'ratings-chart.png'),
    screen: 'monthlyReviewsChart',
    description:
      'Haga un seguimiento de las calificaciones que recibe de sus ' +
      'clientes. Nos ayuda a observar las fluctuaciones de las ' +
      'opiniones y gustos a lo largo del año.'
  },
  {
    id: 4,
    title: 'Turnos Cancelados/Realizados',
    image: require(imagesRoute + 'reservations-chart.png'),
    screen: 'reservedAndCancelledShiftChart',
    description: 'Haga una comparación entre la cantidad de reservas realizadas y ' + 'las canceladas.'
  },
  {
    id: 5,
    title: 'Mis Horarios más Populares',
    image: require(imagesRoute + 'popular-shifts-chart.png'),
    screen: 'mostPopularShiftsChart',
    description:
      'Determine en qué horario recibe la mayor cantidad de demanda de ' +
      'turnos. Podrá así mejorar sus horarios de atención y tener mejor ' +
      'control de decisión'
  }
];

class DashBoard extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.isFocused && !prevProps.isFocused) this.props.onCommerceReportValueReset();
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {chartsData.map(chart => (
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate(chart.screen)}
            underlayColor="transparent"
            key={chart.id}
          >
            <Card image={chart.image} containerStyle={styles.cardContainer} imageProps={{ resizeMode: 'stretch' }}>
              <Text style={styles.cardTitle}>{chart.title}</Text>
              <Text style={styles.cardDescription}>{chart.description}</Text>
            </Card>
          </TouchableHighlight>
        ))}
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

export default connect(null, { onCommerceReportValueReset })(withNavigationFocus(DashBoard));
