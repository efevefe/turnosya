import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LineChart, Spinner, Input, DatePicker } from '../../common';
import { readReviewsOnMonths } from '../../../actions/CommerceReportsActions';
import { View, ScrollView } from 'react-native';

class LineChartReviewsReport extends Component {
  componentWillMount() {
    this.props.readReviewsOnMonths();
  }

  render() {
    const data = {
      labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      datasets: [
        {
          data: this.props.data
        }
      ]
    };

    if (this.props.loading) return <Spinner />;
    return (
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}
        >
          <DatePicker
            mode="date"
            label="Desde:"
            placeholder="Opcional"
            //   onDateChange={}
          />
        </View>
        <LineChart data={data} />
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

export default connect(mapStateToProps, { readReviewsOnMonths })(
  LineChartReviewsReport
);
