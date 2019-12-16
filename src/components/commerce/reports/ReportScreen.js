import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Tooltip, CheckBox } from 'react-native-elements';
import { View, StyleSheet, Switch, Text, ScrollView } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Input, Spinner, BarChart } from '../../common';
import moment from 'moment';
import { TouchableHighlight } from 'react-native-gesture-handler';
const screenWidth = Dimensions.get('window').width;

const screenHeight = Dimensions.get('window').height * 0.8;
const days = [0, 0, 0, 0, 0, 0, 0];
const months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const data = {
  labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
  datasets: [
    {
      data: days
    }
  ]
};

const dataLine = {
  labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  datasets: [
    {
      data: months
      // data: [20, 45, 28, 200, 30, 79, 12, 100, 90, 10, 11, 0]
    }
  ]
};

const dataPie = [
  {
    name: 'Lunes',
    population: days[0],
    color: 'rgba(199, 44, 65, 1)'
  },
  {
    name: 'Martes',
    population: days[1],
    color: 'rgba(199, 44, 65, 0.8)'
  },
  {
    name: 'Miercoles',
    population: days[2],
    color: 'rgba(199, 44, 65, 0.6)'
  },
  {
    name: 'Jueves',
    population: days[3],
    color: 'rgba(199, 44, 65, 0.4)'
  },
  {
    name: 'Viernes',
    population: days[4],
    color: 'rgba(199, 44, 65, 0.2)'
  },
  {
    name: 'Sabado',
    population: days[5],
    color: 'rgba(199, 44, 65, 0.1)'
  },
  {
    name: 'Domingo',
    population: days[6],
    color: 'rgba(199, 44, 65, 0.5)'
  }
];
class ReportScreen extends Component {
  state = { loading: false };

  componentDidMount() {
    days.fill(0, 0, 7);
    months.fill(0, 0, 12);

    this.read();
  }

  read() {
    const db = firebase.firestore();
    const reservations = [];
    // const days = [0, 0, 0, 0, 0, 0, 0];

    return (
      db
        .collection(`Commerces/1tLaEd9YbnmUZ9p7W1Ve/Reservations`)
        // .collection(`Commerces/${this.props.commerceId}/Reservations`)
        .where('state', '==', null)
        .onSnapshot(snapshot => {
          snapshot.forEach(doc => {
            reservations.push({
              id: doc.id,
              ...doc.data(),
              startDate: moment(doc.data().startDate.toDate()),
              endDate: moment(doc.data().endDate.toDate())
            });
          });

          reservations.forEach(reservation => {
            if (moment(reservation.startDate).format('dddd') === 'Monday') {
              days.fill(days[0] + 1, 0, 1);
            } else if (
              moment(reservation.startDate).format('dddd') === 'Tuesday'
            ) {
              days.fill(days[1] + 1, 1, 2);
            } else if (
              moment(reservation.startDate).format('dddd') === 'Wednesday'
            ) {
              days.fill(days[2] + 1, 2, 3);
            } else if (
              moment(reservation.startDate).format('dddd') === 'Thursday'
            ) {
              days.fill(days[3] + 1, 3, 4);
            } else if (
              moment(reservation.startDate).format('dddd') === 'Friday'
            ) {
              days.fill(days[4] + 1, 4, 5);
            } else if (
              moment(reservation.startDate).format('dddd') === 'Saturday'
            ) {
              days.fill(days[5] + 1, 5, 6);
            } else if (
              moment(reservation.startDate).format('dddd') === 'Sunday'
            ) {
              days.fill(days[6] + 1, 6, 7);
            }
          });

          // return days;

          reservations.forEach(reservation => {
            if (moment(reservation.startDate).format('MMMM') === 'January') {
              months.fill(months[0] + parseFloat(reservation.price), 0, 1);
            } else if (
              moment(reservation.startDate).format('MMMM') === 'February'
            ) {
              months.fill(months[1] + parseFloat(reservation.price), 1, 2);
            } else if (
              moment(reservation.startDate).format('MMMM') === 'March'
            ) {
              months.fill(months[2] + parseFloat(reservation.price), 2, 3);
            } else if (
              moment(reservation.startDate).format('MMMM') === 'April'
            ) {
              months.fill(months[3] + parseFloat(reservation.price), 3, 4);
            } else if (moment(reservation.startDate).format('MMMM') === 'May') {
              months.fill(months[4] + parseFloat(reservation.price), 4, 5);
            } else if (
              moment(reservation.startDate).format('MMMM') === 'June'
            ) {
              months.fill(months[5] + parseFloat(reservation.price), 5, 6);
            } else if (
              moment(reservation.startDate).format('MMMM') === 'July'
            ) {
              months.fill(months[6] + parseFloat(reservation.price), 6, 7);
            } else if (
              moment(reservation.startDate).format('MMMM') === 'August'
            ) {
              months.fill(months[7] + parseFloat(reservation.price), 7, 8);
            } else if (
              moment(reservation.startDate).format('MMMM') === 'September'
            ) {
              months.fill(months[8] + parseFloat(reservation.price), 8, 9);
            } else if (
              moment(reservation.startDate).format('MMMM') === 'October'
            ) {
              months.fill(months[9] + parseFloat(reservation.price), 9, 10);
            } else if (
              moment(reservation.startDate).format('MMMM') === 'November'
            ) {
              months.fill(months[10] + parseFloat(reservation.price), 10, 11);
            } else if (
              moment(reservation.startDate).format('MMMM') === 'December'
            ) {
              months.fill(months[11] + parseFloat(reservation.price), 11, 12);
            }
          });
          this.setState({ loading: true });
        })
    );
  }
  render() {
    if (this.state.loading === false) return <Spinner />;
    if (this.props.navigation.state.params.number === 1) {
      return (
        <ScrollView
          style={{
            marginTop: 50
          }}
        >
          <BarChart
            data={data}
            width={screenWidth}
            height={screenHeight}
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            style={{
              borderRadius: 8
            }}
            fromZero={true}
            withInnerLines={true}
          />
        </ScrollView>
      );
    } else if (this.props.navigation.state.params.number === 2) {
      return (
        <ScrollView
          style={{
            marginTop: 50
          }}
        >
          <LineChart
            data={dataLine}
            width={screenWidth}
            height={screenHeight}
            chartConfig={chartConfig}
            bezier
            yAxisLabel={'$'}
            onDataPointClick={data => {
              alert(data.value);
            }}
          />
        </ScrollView>
      );
    } else if (this.props.navigation.state.params.number === 3) {
      return (
        <PieChart
          data={[
            {
              name: 'Lunes',
              population: days[0],
              color: 'rgba(199, 44, 65, 1)'
            },
            {
              name: 'Martes',
              population: days[1],
              color: 'rgba(199, 44, 65, 0.85)'
            },
            {
              name: 'Miercoles',
              population: days[2],
              color: 'rgba(199, 44, 65, 0.70)'
            },
            {
              name: 'Jueves',
              population: days[3],
              color: 'rgba(199, 44, 65, 0.55)'
            },
            {
              name: 'Viernes',
              population: days[4],
              color: 'rgba(199, 44, 65, 0.40)'
            },
            {
              name: 'Sabado',
              population: days[5],
              color: 'rgba(199, 44, 65, 0.25)'
            },
            {
              name: 'Domingo',
              population: days[6],
              color: 'rgba(199, 44, 65, 0.05)'
            }
          ]}
          width={screenWidth - 20}
          height={200}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(199, 44, 65, ${opacity})`,
            fillShadowGradient: '#c72c41'
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="10"
          absolute
          hasLegend={true}
        />
      );
    }
    {
      /* <Input
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
        /> */
    }
  }
}

const chartConfig = {
  backgroundColor: '#1cc910',

  // backgroundGradientFrom: '#c72c41',
  // backgroundGradientTo: '#c72c41',
  fillShadowGradientOpacity: 1,
  backgroundGradientFrom: 'white',
  backgroundGradientTo: 'white',
  color: (opacity = 1) => `rgba(199, 44, 65, ${opacity})`,
  // strokeWidth: 0,
  barPercentage: 0.8,
  fillShadowGradient: '#c72c41',
  decimalPlaces: 1
};

const mapStateToProps = state => {
  const { reservations } = state.courtReservationsList;
  const { commerceId } = state.commerceData;

  return {
    reservations,
    commerceId
  };
};

export default connect(mapStateToProps, {})(ReportScreen);
