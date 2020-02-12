import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import { LineChart, Spinner, Menu, Picker, Button, IconButton, CardSection } from '../../common';
import EmployeesPicker from './EmployeesPicker';
import {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  onMonthlyEarningsReadByYear,
  yearsOfActivity
} from '../../../actions';

class MonthlyEarningsChart extends Component {
  constructor(props) {
    super(props);
    props.yearsOfActivity(props.commerceId);
    props.onMonthlyEarningsReadByYear(props.commerceId, props.selectedYear);

    this.state = { modal: false, modalYear: this.props.selectedYear, selectedEmployee: { id: null } };
  }

  static navigationOptions = ({ navigation }) => {
    return { headerRight: navigation.getParam('rightIcon') };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      rightIcon: <IconButton icon="md-create" onPress={() => this.setState({ modal: true })} />
    });
  }

  onGenerateReportPress = () => {
    this.props.onMonthlyEarningsReadByYear(this.props.commerceId, this.state.modalYear, this.state.selectedEmployee.id);

    this.props.onCommerceReportValueChange({
      selectedYear: this.state.modalYear,
      selectedEmployee: this.state.selectedEmployee
    });

    this.setState({ modal: false });
  };

  getChartTitle = () => {
    if (this.props.selectedEmployee.id)
      return `Evolución de las ganancias de ${this.props.selectedEmployee.name} en ${this.props.selectedYear}`;

    return `Evolución de mis ganancias en ${this.props.selectedYear}`;
  }

  render() {
    if (this.props.loading) return <Spinner />;

    const { data } = this.props.data;

    const dataLine = {
      labels: this.props.data.labels,
      datasets: [{ data: data.length ? data : Array(12).fill(0) }]
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
          <CardSection style={{ paddingTop: 10 }}>
            <Picker
              title='Año'
              value={this.state.modalYear}
              items={this.props.years}
              onValueChange={modalYear => this.setState({ modalYear })}
            />
          </CardSection>

          <EmployeesPicker
            value={this.state.selectedEmployee.id}
            onPickerValueChange={selectedEmployee => this.setState({ selectedEmployee })}
          />

          <CardSection>
            <Button title={'Generar Reporte'} onPress={this.onGenerateReportPress} />
          </CardSection>
        </Menu>

        <LineChart
          data={dataLine}
          title={this.getChartTitle()}
          emptyDataMessage={this.props.error || `Parace que aún no hay ganancias en ${this.props.selectedYear}`}
          xlabel="MESES DEL AÑO"
          yAxisLabel={'$ '}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { data, years, selectedYear, selectedEmployee, loading, error } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    data,
    years,
    selectedYear,
    selectedEmployee,
    commerceId,
    loading,
    error
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  onMonthlyEarningsReadByYear,
  yearsOfActivity
})(MonthlyEarningsChart);
