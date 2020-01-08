import React, { Component } from 'react';
import { LineChart as RNCLineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { MAIN_COLOR } from '../../constants';

const chartWidth = Dimensions.get('window').width - 10;
const chartHeight = Dimensions.get('window').height * 0.7;

class LineChart extends Component {
  state = { selectedPoint: null, chartPosition: null };

  renderToolTip = () => {
    const { selectedPoint, chartPosition } = this.state;

    if (selectedPoint && chartPosition)
      return (
        <View
          style={StyleSheet.flatten([
            styles.toolTipContainer, {
              top: selectedPoint.y + chartPosition.y - 28,
              left: selectedPoint.x + chartPosition.x - 8,
            }])
          }>
          <Text style={styles.toolTipText}>
            {(this.props.yAxisLabel ?
              this.props.yAxisLabel : '')
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

  renderXLabel = () => {
    const { chartPosition } = this.state;

    if (this.props.xlabel && chartPosition) {
      return (
        <View
          style={{
            ...styles.chartTextContainer,
            fontSize: 12,
            top: chartPosition.y + (chartHeight * 0.9),
            left: chartPosition.x + (chartWidth / 11),
            width: chartWidth - (chartWidth / 11)
          }}
        >
          <Text style={{
            ...styles.chartText, fontSize: 12
          }}>
            {this.props.xlabel}
          </Text>
        </View >
      );
    }
  }

  renderEmptyDataMessage = () => {
    const { chartPosition } = this.state;

    const dataSum = this.props.data.datasets[0].data.reduce((a, b) => a + b);

    if (!dataSum && chartPosition) {
      return (
        <View style={{
          ...styles.chartTextContainer,
          top: chartPosition.y + (chartHeight / 3),
          left: chartPosition.x + (chartWidth / 10),
          width: chartWidth - (chartWidth / 10),
          paddingHorizontal: chartWidth / 6.5
        }}>
          <Text style={styles.chartText}>
            {this.props.emptyDataMessage}
          </Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{ alignItems: 'center' }}>
        {this.renderTitle()}
        <View
          onLayout={({ nativeEvent }) => {
            this.setState({
              chartPosition: {
                x: nativeEvent.layout.x,
                y: nativeEvent.layout.y
              }
            })
          }}
        >
          <RNCLineChart
            {...this.props}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            onDataPointClick={p => this.setState({ selectedPoint: p })}
            bezier
          />
        </View>
        {this.renderToolTip()}
        {this.renderEmptyDataMessage()}
        {this.renderXLabel()}
      </View>
    );
  }
}

const chartConfig = {
  fillShadowGradientOpacity: 1,
  backgroundGradientFrom: 'white',
  backgroundGradientTo: 'white',
  color: (opacity = 1) => `rgba(199, 44, 65, ${opacity})`,
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
  },
  chartText: {
    fontSize: 14,
    color: MAIN_COLOR,
    textAlign: 'center'
  },
  chartTextContainer: {
    position: 'absolute',
    alignItems: 'center'
  }
})

export { LineChart };
