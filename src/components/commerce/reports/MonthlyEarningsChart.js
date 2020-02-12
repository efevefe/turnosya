import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { Spinner, Menu, Picker, Button, IconButton, CardSection } from '../../common';
import EmployeesPicker from './EmployeesPicker';
import SendReportAsPDF from './SendReportAsPDF';
import {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  onMonthlyEarningsReadByYear,
  yearsOfActivity
} from '../../../actions';

const chartHeight = Math.round(Dimensions.get('window').height) / 1.35;

class MonthlyEarningsChart extends Component {
  constructor(props) {
    super(props);
    props.yearsOfActivity(props.commerceId);
    props.onMonthlyEarningsReadByYear(props.commerceId, props.selectedYear);

    this.state = { modal: false, modalYear: this.props.selectedYear, selectedEmployee: { id: null }, html: '' };
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

  onChartDataLoad = () => {
    const setData = `document.getElementById("data").innerHTML = '${JSON.stringify(this.props.data)}';`
    const setTitle = `document.getElementById("title").innerHTML = '${this.getChartTitle()}';`
    const setHeight = `document.getElementById("height").innerHTML = '${chartHeight.toString()}';`
    const drawChart = 'google.charts.setOnLoadCallback(drawChart);'
    return setData + setTitle + setHeight + drawChart;
  }

  getChartTitle = () => {
    if (this.props.selectedEmployee.id)
      return `Evolución de las ganancias de ${this.props.selectedEmployee.name} en ${this.props.selectedYear}.`;

    return `Evolución de mis ganancias en ${this.props.selectedYear}.`;
  }

  render() {
    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
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

        <SendReportAsPDF
          html={this.state.html}
          mailOptions={{
            subject: `[TurnosYa] Cantidad de Ingresos por Mes (${this.props.commerceName})`,
            body: this.getChartTitle()
          }}
          horizontal
        >
          <WebView
            source={{ uri: 'https://proyecto-turnosya.web.app/monthly-earnings-chart' }}
            style={{ flex: 1 }}
            domStorageEnabled={true}
            javaScriptEnabled={true}
            scrollEnabled={false}
            injectedJavaScript={this.onChartDataLoad()}
            onMessage={event => this.setState({ html: event.nativeEvent.data })}
          />
        </SendReportAsPDF>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { data, years, selectedYear, selectedEmployee, loading, error } = state.commerceReports;
  const { commerceId, name: commerceName } = state.commerceData;

  return {
    data,
    years,
    selectedYear,
    selectedEmployee,
    commerceId,
    commerceName,
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
