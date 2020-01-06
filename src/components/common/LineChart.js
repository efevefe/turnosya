import React, { Component } from 'react';
import { LineChart as RNCLineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { MAIN_COLOR } from '../../constants';

const chartWidth = Dimensions.get('window').width - 10;
const chartHeight = Dimensions.get('window').height * 0.7;

class LineChart extends Component {
  state = { selectedPoint: null };

  renderToolTip = () => {
    const { selectedPoint } = this.state;

    if (selectedPoint)
      return (
        <View
          style={StyleSheet.flatten([
            styles.toolTipContainer, {
              top: selectedPoint.y + (this.props.title ? 25 : -25),
              left: selectedPoint.x + 1,
            }])
          }>
          <Text style={styles.toolTipText}>
            {this.props.yAxisLabel ?
              this.props.yAxisLabel : ''
              + selectedPoint.value.toString()}
          </Text>
        </View>
      );
  }

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
      <View style={{ alignItems: 'center' }}>
        {this.renderTitle()}
        <RNCLineChart
          {...this.props}
          width={chartWidth}
          height={chartHeight}
          chartConfig={chartConfig}
          onDataPointClick={p => this.setState({ selectedPoint: p })}
          bezier
        />
        {this.renderToolTip()}
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
  decimalPlaces: 1,
  strokeWidth: 1,
  propsForDots: {
    r: "3",
    strokeWidth: "2",
    stroke: MAIN_COLOR
  }
};

const styles = StyleSheet.create({
  toolTipContainer: {
    position: 'absolute',
    height: 18,
    width: 'auto',
    paddingHorizontal: 4,
    borderRadius: 3,
    backgroundColor: '#333333'
  },
  toolTipText: {
    fontSize: 12,
    color: 'white'
  },
  title: {
    fontSize: 14,
    padding: 15,
    color: 'black',
    textAlign: 'center'
  }
})

export { LineChart };
