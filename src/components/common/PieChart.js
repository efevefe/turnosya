import React, { Component } from 'react';
import { PieChart as RNCPieChart } from 'react-native-chart-kit';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { MAIN_COLOR } from '../../constants';

const chartWidth = Dimensions.get('window').width - 30;

class PieChart extends Component {
  renderTitle = () => {
    if (this.props.title)
      return <Text style={StyleSheet.flatten([styles.title, this.props.titleStyle])}>{this.props.title}</Text>;
  };

  render() {
    return (
      <View styles={{ alignItems: 'center' }}>
        {this.renderTitle()}
        <RNCPieChart
          {...this.props}
          data={this.props.data}
          width={chartWidth}
          height={200}
          chartConfig={chartConfig}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="20"
          absolute
        />
      </View>
    );
  }
}

const chartConfig = {
  backgroundColor: 'white',
  backgroundGradientFrom: 'white',
  backgroundGradientTo: 'white',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(199, 44, 65, ${opacity})`,
  fillShadowGradient: MAIN_COLOR
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 20,
    color: 'black',
    textAlign: 'center'
  }
});

export { PieChart };
