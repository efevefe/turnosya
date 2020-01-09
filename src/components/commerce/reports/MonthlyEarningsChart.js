import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
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
  onCommerceReportValueReset,
  readMonthlyEarningsByYear,
  yearsOfActivity
} from '../../../actions';

class MonthlyEarningsChart extends Component {
  constructor(props) {
    super(props);
    props.yearsOfActivity(props.commerceId);
    props.readMonthlyEarningsByYear(props.commerceId, props.selectedYear);

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
    this.props.readMonthlyEarningsByYear(
      this.props.commerceId,
      this.state.modalYear
    );

    this.props.onCommerceReportValueChange({
      prop: 'selectedYear',
      value: this.state.modalYear
    });

    this.setState({ modal: false });
  };

  render() {
    if (this.props.loading) return <Spinner />;

    const dataLine = {
      labels: this.props.data.labels,
      datasets: [{ data: this.props.data.data }]
    };

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Menu
          title="Seleccionar Año"
          isVisible={this.state.modal}
          onBackdropPress={() =>
            this.setState({
              modal: false,
              modalYear: this.props.selectedYear
            })
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
          emptyDataMessage={
            this.props.error ||
            `Parace que aún no tenes ganancias en ${this.props.selectedYear}`
          }
          xlabel="MESES DEL AÑO"
          yAxisLabel={'$ '}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { data, years, selectedYear, loading, error } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    data,
    years,
    selectedYear,
    commerceId,
    loading,
    error
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  readMonthlyEarningsByYear,
  yearsOfActivity
})(MonthlyEarningsChart);
