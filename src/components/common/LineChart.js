import React, { Component } from 'react';
import { LineChart as RNCLineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height * 0.8;

class LineChart extends Component {
  render() {
    return (
      <RNCLineChart
        {...this.props}
        data={this.props.data}
        width={screenWidth}
        height={screenHeight}
        chartConfig={chartConfig}
        bezier
        yAxisLabel={this.props.yAxisLabel}
        onDataPointClick={data => {
          alert(data.value);
        }}
      />
    );
  }
}

const chartConfig = {
  fillShadowGradientOpacity: 1,
  backgroundGradientFrom: 'white',
  backgroundGradientTo: 'white',
  color: (opacity = 1) => `rgba(199, 44, 65, ${opacity})`,
  barPercentage: 0.8,
  fillShadowGradient: '#c72c41',
  decimalPlaces: 1
};

export { LineChart };
