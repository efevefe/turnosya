import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BarChart, Spinner, Toast, DatePicker, Button } from '../../common';
import {
  readReservationsOnDays,
  onCommerceReportValueChange
} from '../../../actions/CommerceReportsActions';
import { View, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { formattedMoment } from '../../../utils';
import moment from 'moment';
class BarChartReport extends Component {
  constructor(props) {
    super(props);
    const { commerceId, startDate, endDate } = props;

    props.readReservationsOnDays(commerceId, startDate, endDate);

    state = {
      cardVisible: false
    };
  }

  // componentWillMount() {
  //   const { commerceId, startDate, endDate } = this.props;
  //   this.props.readReservationsOnDays(commerceId, startDate, endDate);
  // }

  renderCard = () => {
    // Esta es la otra opcion que muestre el bioton y se esconda el card
    const { commerceId, startDate, endDate } = this.props;
    if (this.state.cardVisible) {
      return (
        <Card
          title={'Elegir fechas'}
          containerStyle={{
            borderRadius: 10
          }}
        >
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <DatePicker
              mode="date"
              label="Desde:"
              placeholder="Fecha Desde"
              date={startDate}
              onDateChange={startDate =>
                this.props.onCommerceReportValueChange({
                  prop: 'startDate',
                  value: moment(startDate)
                })
              }
            />
            <DatePicker
              mode="date"
              label="Hasta:"
              placeholder="Fecha Hasta"
              date={endDate}
              onDateChange={endDate =>
                this.props.onCommerceReportValueChange({
                  prop: 'endDate',
                  value: moment(endDate)
                })
              }
            />
          </View>
          <Button
            title={'Generar Reporte'}
            onPress={() => {
              this.props.readReservationsOnDays(commerceId, startDate, endDate);
              this.setState({ cardVisible: false });
            }}
          />
        </Card>
      );
    } else {
      return (
        <Button
          title={'Cambiar fechas'}
          onPress={() => this.setState({ cardVisible: true })}
        />
      );
    }
  };

  onEndDateValueChange = endDate => {
    endDate = moment(endDate);

    if (endDate > formattedMoment()) {
      return Toast.show({
        text: 'No puede ingresar una fecha mayor a la actual'
      });
    }

    this.props.onCommerceReportValueChange({
      prop: 'endDate',
      value: endDate
    });
  };

  render() {
    const data = {
      labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      datasets: [
        {
          data: this.props.data
        }
      ]
    };
    const { commerceId, startDate, endDate } = this.props;
    if (this.props.loading) return <Spinner />;
    return (
      <ScrollView style={{ flex: 1 }}>
        {/* {this.renderCard()} */}
        <View
          style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}
        >
          <DatePicker
            mode="date"
            label="Desde:"
            placeholder="Fecha Desde"
            date={startDate}
            onDateChange={startDate =>
              this.props.onCommerceReportValueChange({
                prop: 'startDate',
                value: moment(startDate)
              })
            }
          />
          <DatePicker
            mode="date"
            label="Hasta:"
            placeholder="Fecha Hasta"
            date={endDate}
            onDateChange={endDate => this.onEndDateValueChange(endDate)}
          />
        </View>
        <Button
          title={'Generar Reporte'}
          onPress={() => {
            this.props.readReservationsOnDays(commerceId, startDate, endDate);
          }}
        />
        <BarChart data={data} style={{ marginTop: 10 }} />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { data, startDate, endDate, loading } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    data,
    startDate,
    endDate,
    commerceId,
    loading
  };
};

export default connect(mapStateToProps, {
  readReservationsOnDays,
  onCommerceReportValueChange
})(BarChartReport);
