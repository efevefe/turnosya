import React, { Component } from 'react';
import { PieChart as RNCPieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width - 10;

class PieChart extends Component {
  render() {
    return (
      <RNCPieChart
        {...this.props}
        data={this.props.data}
        width={screenWidth - 20}
        height={200}
        chartConfig={chartConfig}
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="10"
        absolute
        hasLegend={true}
      />
    );
  }
}

const chartConfig = {
  backgroundColor: '#1cc910',
  backgroundGradientFrom: '#eff3ff',
  backgroundGradientTo: '#efefef',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(199, 44, 65, ${opacity})`,
  fillShadowGradient: '#c72c41'
};

export { PieChart };
