import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import moment from 'moment';
import { Spinner, Button, CardSection, Menu, IconButton } from '../../common';
import EmployeesPicker from './EmployeesPicker';
import SendReportAsPDF from './SendReportAsPDF';
import ReportPeriodPicker from './ReportPeriodPicker';
import {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  onDailyReservationsReadByRange
} from '../../../actions/CommerceReportsActions';

const chartHeight = Math.round(Dimensions.get('window').height) / 1.42;

class DailyReservationsChart extends Component {
  constructor(props) {
    super(props);
    const { commerceId, startDate, endDate } = props;

    props.onDailyReservationsReadByRange(commerceId, startDate, endDate);

    this.state = {
      modal: false,
      startDate: startDate,
      endDate: endDate,
      periodError: false,
      selectedEmployee: { id: null },
      loadingHTML: false,
      html: ''
    };
  }

  static navigationOptions = ({ navigation }) => {
    return { headerRight: <IconButton icon="md-create" onPress={navigation.getParam('onEditReportPress')} /> };
  };

  componentDidMount() {
    this.props.navigation.setParams({ onEditReportPress: this.onEditReportPress });
  }

  onEditReportPress = () => this.setState({ modal: true });

  onGenerateReportPress = () => {
    if (this.state.periodError) return;

    this.props.onDailyReservationsReadByRange(
      this.props.commerceId,
      moment(this.state.startDate),
      moment(this.state.endDate),
      this.state.selectedEmployee.id
    );

    this.props.onCommerceReportValueChange({
      startDate: moment(this.state.startDate),
      endDate: moment(this.state.endDate),
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
  };

  getChartTitle = () => {
    let title = 'Cantidad de reservas por día '

    if (this.props.selectedEmployee.id)
      title += `de ${this.props.selectedEmployee.name} `;

    return title + 'entre el ' + this.props.startDate.format('DD/MM/YYYY') +
      ' y el ' + this.props.endDate.format('DD/MM/YYYY') + '.';
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Menu
          title="Seleccionar Periodo"
          isVisible={this.state.modal}
          onBackdropPress={() =>
            this.setState({
              modal: false,
              startDate: this.props.startDate,
              endDate: this.props.endDate
            })
          }
        >
          <ReportPeriodPicker
            startDate={this.state.startDate}
            onStartDateChange={startDate => this.setState({ startDate })}
            endDate={this.state.endDate}
            onEndDateChange={endDate => this.setState({ endDate })}
            onValueChange={periodError => this.setState({ periodError })}
          />
          <EmployeesPicker
            value={this.state.selectedEmployee.id}
            onPickerValueChange={selectedEmployee => this.setState({ selectedEmployee })}
          />
          <CardSection>
            <Button title={'Generar Reporte'} onPress={this.onGenerateReportPress} />
          </CardSection>
        </Menu>

        <SendReportAsPDF
          html={this.state.html}
          mailOptions={{
            subject: `[TurnosYa] Cantidad de Reservas por Día (${this.props.commerceName})`,
            body: this.getChartTitle()
          }}
        >
          {
            this.props.loading ?
              <Spinner style={{ position: 'relative' }} /> :
              <WebView
                source={{ uri: 'https://proyecto-turnosya.web.app/daily-reservations-chart' }}
                style={{ flex: 1 }}
                startInLoadingState={true}
                renderLoading={() => <Spinner />}
                domStorageEnabled={true}
                javaScriptEnabled={true}
                scrollEnabled={false}
                injectedJavaScript={this.onChartDataLoad()}
                onMessage={event => this.setState({ html: event.nativeEvent.data })}
              />
          }
        </SendReportAsPDF>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { data, startDate, endDate, selectedEmployee, loading } = state.commerceReports;
  const { commerceId, name: commerceName } = state.commerceData;

  return {
    data,
    startDate,
    endDate,
    commerceId,
    commerceName,
    selectedEmployee,
    loading
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  onDailyReservationsReadByRange
})(DailyReservationsChart);
