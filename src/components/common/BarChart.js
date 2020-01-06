import React, { Component } from 'react';
import { BarChart as RNCBarChart } from 'react-native-chart-kit';
import { Dimensions, View, StyleSheet, Text } from 'react-native';
import { MAIN_COLOR } from '../../constants';

const chartWidth = Dimensions.get('window').width - 10;
const chartHeight = Dimensions.get('window').height * 0.7;
const initialX = Dimensions.get('window').width * 0.19;

class BarChart extends Component {
  state = { chartPosition: null };

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

  renderToolTips = () => {
    // beta
    const { chartPosition } = this.state;

    if (chartPosition) {
      return this.props.data.datasets[0].data.map((value, index) => (
        <View
          style={StyleSheet.flatten([
            styles.toolTipContainer, {
              top: (chartPosition.y * 0.77) - (value * chartPosition.y * 0.0265),
              left: chartPosition.x + (index * chartWidth * 0.117),
            }])
          }
          key={index}
        >
          <Text style={styles.toolTipText}>
            {(this.props.yAxisLabel ?
              this.props.yAxisLabel : '')
              + value.toString()}
          </Text>
        </View >
      ));
    }
  }

  render() {
    return (
      <View styles={{ alignItems: 'center' }}>
        {this.renderTitle()}
        <View
          onLayout={({ nativeEvent }) => {
            this.setState({
              chartPosition: {
                x: nativeEvent.layout.x + initialX,
                y: nativeEvent.layout.y + chartHeight
              }
            })
          }}
        >
          <RNCBarChart
            {...this.props}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            showLegend
            fromZero
          />
        </View>
        {this.renderToolTips()}
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
  toolTipContainer: {
    position: 'absolute',
    height: 16,
    width: 'auto',
    paddingHorizontal: 4,
    borderRadius: 3,
    backgroundColor: 'transparent'
  },
  toolTipText: {
    fontSize: 12,
    color: MAIN_COLOR
  },
  title: {
    fontSize: 14,
    padding: 15,
    color: 'black',
    textAlign: 'center'
  }
})

export { BarChart };
