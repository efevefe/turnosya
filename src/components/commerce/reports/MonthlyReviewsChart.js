import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { Spinner, IconButton, Button, Picker, Menu, CardSection } from '../../common';
import EmployeesPicker from './EmployeesPicker';
import SendReportAsPDF from './SendReportAsPDF';
import {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  onMonthlyReviewsReadByYear,
  yearsWithReview
} from '../../../actions';

const chartHeight = Math.round(Dimensions.get('window').height) / 1.35;

class MonthlyReviewsChart extends Component {
  constructor(props) {
    super(props);
    props.yearsWithReview(props.commerceId);
    props.onMonthlyReviewsReadByYear(props.commerceId, props.selectedYear);

    this.state = {
      modal: false,
      year: props.selectedYear,
      yearError: '',
      selectedEmployee: { id: null },
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

  onYearValueChange = year => {
    this.setState({ year, yearError: year ? '' : 'Debe seleccionar un año' });
  }

  onGenerateReportPress = () => {
    if (this.state.yearError) return;

    this.props.onMonthlyReviewsReadByYear(this.props.commerceId, this.state.year, this.state.selectedEmployee.id);

    this.props.onCommerceReportValueChange({
      selectedYear: this.state.year,
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
      return `Evolución de las calificaciones de ${this.props.selectedEmployee.name} en ${this.props.selectedYear}.`;

    return `Evolución de mis calificaciones en ${this.props.selectedYear}.`;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Menu
          title="Seleccionar Año"
          isVisible={this.state.modal}
          onBackdropPress={() =>
            this.setState({
              modal: false,
              year: this.props.selectedYear
            })
          }
        >
          <CardSection style={{ paddingTop: 10 }}>
            <Picker
              title='Año'
              value={this.state.year}
              items={this.props.years}
              errorMessage={this.state.yearError}
              onValueChange={this.onYearValueChange}
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
            subject: `[TurnosYa] Calificación Promedio por Mes (${this.props.commerceName})`,
            body: this.getChartTitle()
          }}
          horizontal
        >
          {
            this.props.loading ?
              <Spinner style={{ position: 'relative' }} /> :
              <WebView
                source={{ uri: 'https://proyecto-turnosya.web.app/monthly-reviews-chart' }}
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
  const { data, years, selectedYear, selectedEmployee, loading } = state.commerceReports;
  const { commerceId, name: commerceName } = state.commerceData;

  return {
    data,
    years,
    selectedYear,
    selectedEmployee,
    commerceId,
    commerceName,
    loading
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  onMonthlyReviewsReadByYear,
  yearsWithReview
})(MonthlyReviewsChart);
