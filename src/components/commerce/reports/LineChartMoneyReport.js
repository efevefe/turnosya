import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, ScrollView } from 'react-native';
import { Overlay, Card } from 'react-native-elements';
import {
  LineChart,
  Spinner,
  Menu,
  Picker,
  Button,
  IconButton,
  CardSection
} from '../../common';
import {
  onCommerceReportValueChange,
  readEarningsPerMonths,
  yearsOfActivity
} from '../../../actions';

class LineChartMoneyReport extends Component {
  constructor(props) {
    super(props);
    props.yearsOfActivity(props.commerceId);
    props.readEarningsPerMonths(props.commerceId, props.selectedYear);

    this.state = { modal: false, modalYear: this.props.selectedYear };
  }

  static navigationOptions = ({ navigation }) => {
    return { headerRight: navigation.getParam('rightIcon') };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      rightIcon: (
        <IconButton
          icon="md-create"
          onPress={() => this.setState({ modal: true })}
        />
      )
    });
  }

  onGenerateReportPress = () => {
    this.props.readEarningsPerMonths(
      this.props.commerceId,
      this.state.modalYear
    );

    this.props.onCommerceReportValueChange({
      prop: 'selectedYear',
      value: this.state.modalYear
    });

    this.setState({ modal: false });
  }

  // onDataEmpty = () => {};

  render() {
    if (this.props.loading) return <Spinner />;
    // if (this.props.isDataEmpty) return this.onDataEmpty();

    const dataLine = {
      labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      datasets: [{ data: this.props.data }]
    };

    return (
      <ScrollView style={{ flex: 1 }}>
        <Menu
          title='Seleccionar Año'
          isVisible={this.state.modal}
          onBackdropPress={() =>
            this.setState({ modal: false, modalYear: this.props.selectedYear })
          }
        >
          <CardSection>
            <Picker
              value={this.state.modalYear}
              items={this.props.years}
              onValueChange={modalYear => this.setState({ modalYear })}
            />
          </CardSection>
          <CardSection>
            <Button
              title={'Generar Reporte'}
              onPress={this.onGenerateReportPress}
            />
          </CardSection>
        </Menu>

        <LineChart
          data={dataLine}
          title={`EVOLUCIÓN DE MIS GANANCIAS EN ${this.props.selectedYear}`}
          yAxisLabel={'$ '}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const {
    data,
    years,
    selectedYear,
    loading
    // isDataEmpty
  } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    data,
    years,
    selectedYear,
    commerceId,
    loading
    // isDataEmpty
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  readEarningsPerMonths,
  yearsOfActivity
})(LineChartMoneyReport);
