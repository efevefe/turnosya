import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { ScrollView, Dimensions } from 'react-native';
import { PieChart, Spinner, Button, DatePicker, IconButton, Menu, CardSection, EmptyList, PermissionsAssigner } from '../../common';
import EmployeesPicker from './EmployeesPicker';
import { ROLES } from '../../../constants';
import {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  onReservedAndCancelledShiftReadByRange
} from '../../../actions/CommerceReportsActions';
import { MAIN_COLOR, MAIN_COLOR_DISABLED } from '../../../constants';

const pickerWidth = Math.round(Dimensions.get('window').width) / 3.1;
const colors = [MAIN_COLOR, MAIN_COLOR_DISABLED];

class ReservedAndCancelledShiftChart extends Component {
  constructor(props) {
    super(props);
    const { commerceId, startDate, endDate } = props;

    props.onReservedAndCancelledShiftReadByRange(commerceId, startDate, endDate);

    this.state = {
      modal: false,
      modalStartDate: startDate,
      modalEndDate: endDate,
      selectedEmployee: { id: null }
    };
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
    this.props.onReservedAndCancelledShiftReadByRange(
      this.props.commerceId,
      moment(this.state.modalStartDate),
      moment(this.state.modalEndDate),
      this.state.selectedEmployee.id
    );

    this.props.onCommerceReportValueChange({
      startDate: moment(this.state.modalStartDate),
      endDate: moment(this.state.modalEndDate),
      selectedEmployee: this.state.selectedEmployee
    });

    this.setState({ modal: false });
  };

  getChartTitle = () => {
    let title = 'Turnos reservados y cancelados '

    if (this.props.selectedEmployee.id)
      title += `de ${this.props.selectedEmployee.name} `;

    return title + 'entre el ' + this.props.startDate.format('DD/MM/YYYY') +
      ' y el ' + this.props.endDate.format('DD/MM/YYYY');
  }

  renderChart = () => {
    if (this.props.data.data.length) {
      let dataPie = [];
      for (let i = 0; i < this.props.data.data.length; i++) {
        dataPie.push({
          name: this.props.data.labels[i],
          count: this.props.data.data[i],
          color: colors[i],
          legendFontColor: 'black',
          legendFontSize: 15
        });
      }

      return (
        <PieChart
          title={this.getChartTitle()}
          data={dataPie}
        />
      );
    }

    return (
      <EmptyList
        title={
          'Parece que no hay reservas entre el ' +
          this.props.startDate.format('DD/MM/YYYY') +
          ' y el ' +
          this.props.endDate.format('DD/MM/YYYY')
        }
      />
    );
  };

  render() {
    if (this.props.loading) return <Spinner />;

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Menu
          title="Seleccionar Periodo"
          isVisible={this.state.modal}
          onBackdropPress={() =>
            this.setState({
              modal: false,
              modalStartDate: this.props.startDate,
              modalEndDate: this.props.endDate
            })
          }
        >
          <CardSection
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingTop: 10
            }}
          >
            <DatePicker
              date={this.state.modalStartDate}
              mode="date"
              label="Desde:"
              placeholder="Fecha desde"
              pickerWidth={pickerWidth}
              onDateChange={modalStartDate => this.setState({ modalStartDate })}
            />
            <DatePicker
              date={this.state.modalEndDate}
              mode="date"
              label="Hasta:"
              placeholder="Opcional"
              pickerWidth={pickerWidth}
              onDateChange={modalEndDate => this.setState({ modalEndDate })}
            />
          </CardSection>

          <PermissionsAssigner requiredRole={ROLES.ADMIN}>
            <EmployeesPicker
              value={this.state.selectedEmployee.id}
              onPickerValueChange={selectedEmployee => this.setState({ selectedEmployee })}
            />
          </PermissionsAssigner>

          <CardSection>
            <Button title={'Generar Reporte'} onPress={this.onGenerateReportPress} />
          </CardSection>
        </Menu>

        {this.renderChart()}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { data, startDate, endDate, selectedEmployee, loading } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    data,
    startDate,
    endDate,
    selectedEmployee,
    commerceId,
    loading
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  onReservedAndCancelledShiftReadByRange
})(ReservedAndCancelledShiftChart);
