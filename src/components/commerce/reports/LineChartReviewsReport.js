import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  LineChart,
  Spinner,
  Button,
  DatePicker,
  Picker,
  CardSection
} from '../../common';
import {
  onCommerceReportValueChange,
  readReviewsOnMonths,
  yearsWithReview
} from '../../../actions/CommerceReportsActions';
import { View, ScrollView } from 'react-native';
import moment from 'moment';

class LineChartReviewsReport extends Component {
  constructor(props) {
    super(props);
    props.yearsWithReview(props.commerceId);
    props.readReviewsOnMonths(props.commerceId, moment().format('YYYY'));
  }

  render() {
    const {
      startDate,
      loading,
      data,
      commerceId,
      years,
      selectedYear
    } = this.props;

    const dataLine = {
      labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      datasets: [{ data }]
    };
    if (loading) return <Spinner />;

    return (
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'auto',
            alignItems: 'stretch',
            margin: 10
          }}
        >
          {/* <DatePicker
            mode="date"
            label="Año"
            format="YYYY"
            date={startDate}
            onDateChange={startDate =>
              this.props.onCommerceReportValueChange({
                prop: 'startDate',
                value: startDate
              })
            }
            style={{ margin: 8 }}
          /> */}
          {/* {console.log('start: ', moment(startDate).format('YYYY'))} */}
          <CardSection>
            <Picker
              title={'Año:'}
              value={selectedYear}
              items={years}
              onValueChange={selectedYear => {
                console.log('starttt: ', selectedYear);
                this.props.onCommerceReportValueChange({
                  prop: 'selectedYear',
                  value: selectedYear
                });
                this.props.readReviewsOnMonths(commerceId, selectedYear);
              }}
            />
          </CardSection>
          {/* <Button
            title={'Generar Reporte'}
            buttonStyle={{ width: 225, margin: 0, marginHorizontal: 20 }}
            onPress={() => {
              this.props.readReviewsOnMonths(commerceId, startDate);
            }}
          /> */}
        </View>
        <LineChart data={dataLine} />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const {
    data,
    startDate,
    years,
    selectedYear,
    loading
  } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    data,
    startDate,
    years,
    selectedYear,
    commerceId,
    loading
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  readReviewsOnMonths,
  yearsWithReview
})(LineChartReviewsReport);
