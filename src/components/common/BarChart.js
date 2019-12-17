import React, { Component } from 'react';
import { BarChart as RNCBarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width - 10;
const screenHeight = Dimensions.get('window').height * 0.7;

class BarChart extends Component {
  render() {
    return (
      <RNCBarChart
        {...this.props}
        data={this.props.data}
        width={screenWidth}
        height={screenHeight}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero={true}
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

export { BarChart };
