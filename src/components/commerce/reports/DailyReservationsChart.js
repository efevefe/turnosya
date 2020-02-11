import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import moment from 'moment';
import { Spinner, DatePicker, Button, CardSection, Menu, IconButton } from '../../common';
import EmployeesPicker from './EmployeesPicker';
import SendReportAsPDF from './SendReportAsPDF';
import {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  onDailyReservationsReadByRange
} from '../../../actions/CommerceReportsActions';

const chartHeight = Math.round(Dimensions.get('window').height) / 1.35;
const pickerWidth = Math.round(Dimensions.get('window').width) / 3.1;

class DailyReservationsChart extends Component {
  constructor(props) {
    super(props);
    const { commerceId, startDate, endDate } = props;

    props.onDailyReservationsReadByRange(commerceId, startDate, endDate);

    this.state = {
      modal: false,
      modalStartDate: startDate,
      modalEndDate: endDate,
      selectedEmployee: { id: null },
      html: ''
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
    this.props.onDailyReservationsReadByRange(
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

  onChartDataLoad = () => {
    const setData = `document.getElementById("data").innerHTML = '${JSON.stringify(this.props.data)}';`
    const setTitle = `document.getElementById("title").innerHTML = '${this.getChartTitle()}';`
    const setHeight = `document.getElementById("height").innerHTML = '${chartHeight.toString()}';`
    const drawChart = 'google.charts.setOnLoadCallback(drawChart);'
    return setData + setTitle + setHeight + drawChart;
  }

  getChartTitle = () => {
    let title = 'Cantidad de reservas por día '

    if (this.props.selectedEmployee.id)
      title += `de ${this.props.selectedEmployee.name} `;

    return title + 'entre el ' + this.props.startDate.format('DD/MM/YYYY') +
      ' y el ' + this.props.endDate.format('DD/MM/YYYY');
  }

  render() {
    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
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

          <EmployeesPicker
            value={this.state.selectedEmployee.id}
            onPickerValueChange={selectedEmployee => this.setState({ selectedEmployee })}
          />

          <CardSection>
            <Button title={'Generar Reporte'} onPress={this.onGenerateReportPress} />
          </CardSection>
        </Menu>

        <SendReportAsPDF html={this.state.html}>
          <WebView
            source={{ uri: 'http://10.0.2.2:5000/daily-reservations-chart' }}
            style={{ flex: 1 }}
            domStorageEnabled={true}
            javaScriptEnabled={true}
            injectedJavaScript={this.onChartDataLoad()}
            onMessage={event => this.setState({ html: event.nativeEvent.data })}
          />
        </SendReportAsPDF>
      </View>
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
    commerceId,
    selectedEmployee,
    loading
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  onDailyReservationsReadByRange
})(DailyReservationsChart);
