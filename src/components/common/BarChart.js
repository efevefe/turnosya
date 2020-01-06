import React, { Component } from 'react';
import { BarChart as RNCBarChart } from 'react-native-chart-kit';
import { Dimensions, View, StyleSheet, Text } from 'react-native';
import { MAIN_COLOR } from '../../constants';

const chartWidth = Dimensions.get('window').width - 10;
const chartHeight = Dimensions.get('window').height * 0.7;

class BarChart extends Component {
  renderTitle = () => {
    if (this.props.title)
      return (
        <Text style={StyleSheet.flatten([
          styles.title, this.props.titleStyle
        ])}>
          {this.props.title}
        </Text>
      )
  }

  render() {
    return (
      <View styles={{ alignItems: 'center' }}>
        {this.renderTitle()}
        <RNCBarChart
          {...this.props}
          width={chartWidth}
          height={chartHeight}
          chartConfig={chartConfig}
          fromZero={true}
        />
      </View>
    );
  }
}

const chartConfig = {
  fillShadowGradientOpacity: 1,
  backgroundGradientFrom: 'white',
  backgroundGradientTo: 'white',
  color: (opacity = 1) => `rgba(199, 44, 65, ${opacity})`,
  barPercentage: 0.5,
  fillShadowGradient: MAIN_COLOR,
  decimalPlaces: 1
};

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    padding: 15,
    color: 'black',
    textAlign: 'center'
  }
})

export { BarChart };
