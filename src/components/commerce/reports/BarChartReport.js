import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BarChart, Spinner, Input, DatePicker, Button } from '../../common';
import {
  readReservationOnDays,
  onCommerceReportValueChange
} from '../../../actions/CommerceReportsActions';
import { View, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';

class BarChartReport extends Component {
  componentWillMount() {
    // this.props.readReservationOnDays();
  }

  renderCard = () => {
    <Card
      title={'Elegir fechas'}
      containerStyle={{
        borderRadius: 10
      }}
    >
      <View
        style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}
      >
        <DatePicker
          mode="date"
          label="Desde:"
          placeholder="Opcional"
          date={this.props.date}
          onDateChange={value => {
            this.props.onCommerceReportValueChange({
              prop: 'date',
              value: value
            });
          }}
        />
        <DatePicker
          mode="date"
          label="Hasta:"
          placeholder=""
          //   onDateChange={}
        />
      </View>
      <Button
        title={'Generar Reporte'}
        onPress={() => this.props.readReservationOnDays()}
      />
    </Card>;
  };

  reportShow = () => {
    const data = {
      labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      datasets: [
        {
          data: this.props.data
        }
      ]
    };
    return <BarChart data={data} style={{ marginTop: 20 }} />;
  };

  render() {
    console.log(this.props.date);
    if (this.props.loading) return <Spinner />;
    return (
      <ScrollView style={{ flex: 1 }}>
        {this.renderCard()}
        {/* <Card
          title={'Elegir fechas'}
          containerStyle={{
            borderRadius: 10
          }}
        >
          <View
            style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}
          >
            <DatePicker
              mode="date"
              label="Desde:"
              placeholder="Opcional"
              date={this.props.date}
              onDateChange={value => {
                this.props.onCommerceReportValueChange({
                  prop: 'date',
                  value: value
                });
              }}
            />
            <DatePicker
              mode="date"
              label="Hasta:"
              placeholder=""
              //   onDateChange={}
            />
          </View>
          <Button
            title={'Generar Reporte'}
            onPress={() => this.props.readReservationOnDays()}
          />
        </Card> */}
        {this.reportShow()}
        {/* <BarChart data={data} style={{ marginTop: 20 }} /> */}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { data, loading } = state.commerceReports;

  return {
    data,
    loading
  };
};

export default connect(mapStateToProps, {
  readReservationOnDays,
  onCommerceReportValueChange
})(BarChartReport);
