import React, { Component } from 'react';
import { BarChart as RNCBarChart } from 'react-native-chart-kit';
import { Dimensions, View, StyleSheet, Text } from 'react-native';
import { MAIN_COLOR } from '../../constants';

const chartWidth = Dimensions.get('window').width - 10;
const chartHeight = Dimensions.get('window').height * 0.6;
// const initialX = Dimensions.get('window').width * 0.19;

class BarChart extends Component {
  state = { chartPosition: null };

  renderTitle = () => {
    if (this.props.title)
      return (
        <Text style={StyleSheet.flatten([styles.title, this.props.titleStyle])}>
          {this.props.title}
        </Text>
      );
  };

  renderXLabel = () => {
    const { chartPosition } = this.state;

    if (this.props.xlabel && chartPosition) {
      return (
        <View
          style={{
            ...styles.chartTextContainer,
            fontSize: 12,
            top: chartPosition.y + chartHeight * 0.9,
            left: chartPosition.x + chartWidth / 11,
            width: chartWidth - chartWidth / 11
          }}
        >
          <Text
            style={{
              ...styles.chartText,
              fontSize: 12
            }}
          >
            {this.props.xlabel}
          </Text>
        </View>
      );
    }
  };

  renderEmptyDataMessage = () => {
    const { chartPosition } = this.state;

    if (!this.props.data.datasets[0].data.length && chartPosition) {
      return (
        <View
          style={{
            ...styles.chartTextContainer,
            top: chartPosition.y + chartHeight / 3,
            left: chartPosition.x + chartWidth / 10,
            width: chartWidth - chartWidth / 10,
            paddingHorizontal: chartWidth / 6.5
          }}
        >
          <Text style={styles.chartText}>{this.props.emptyDataMessage}</Text>
        </View>
      );
    }
  };

  // renderToolTips = () => {
  //   // beta / stand by
  //   const { chartPosition } = this.state;

  //   if (chartPosition && this.props.showBarValues) {
  //     return this.props.data.datasets[0].data.map((value, index) => (
  //       <View
  //         style={StyleSheet.flatten([
  //           styles.toolTipContainer, {
  //             top: // y position,
  //             left: // x position,
  //           }])
  //         }
  //         key={index}
  //       >
  //         <Text style={styles.toolTipText}>
  //           {(this.props.yAxisLabel ?
  //             this.props.yAxisLabel : '')
  //             + value.toString()}
  //         </Text>
  //       </View >
  //     ));
  //   }
  // }

  render() {
    return (
      <View styles={{ alignItems: 'center' }}>
        {this.renderTitle()}
        <View
          onLayout={({ nativeEvent }) => {
            this.setState({
              chartPosition: {
                x: nativeEvent.layout.x,
                y: nativeEvent.layout.y
              }
            });
          }}
        >
          <RNCBarChart
            {...this.props}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            showLegend
            fromZero
            // style={{
            //   borderWidth: 1,
            //   borderColor: 'black'
            // }}
          />
        </View>
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
  barPercentage: 0.5,
  fillShadowGradient: MAIN_COLOR,
  decimalPlaces: 1
};

const styles = StyleSheet.create({
  // toolTipContainer: {
  //   position: 'absolute',
  //   height: 16,
  //   width: 'auto',
  //   paddingHorizontal: 4,
  //   borderRadius: 3,
  //   backgroundColor: 'transparent'
  // },
  // toolTipText: {
  //   fontSize: 12,
  //   color: MAIN_COLOR
  // },
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
});

export { BarChart };
