import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import { LineChart, Spinner, IconButton, Button, Picker, Menu, CardSection } from '../../common';
import {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  onMonthlyReviewsReadByYear,
  yearsWithReview,
} from '../../../actions';

class MonthlyReviewsChart extends Component {
  constructor(props) {
    super(props);
    props.yearsWithReview(props.commerceId);
    props.onMonthlyReviewsReadByYear(props.commerceId, props.selectedYear);

    this.state = { modal: false, modalYear: props.selectedYear };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon'),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      rightIcon: <IconButton icon="md-create" onPress={() => this.setState({ modal: true })} />,
    });
  }

  onGenerateReportPress = () => {
    this.props.onMonthlyReviewsReadByYear(this.props.commerceId, this.state.modalYear);

    this.props.onCommerceReportValueChange({
      selectedYear: this.state.modalYear,
    });

    this.setState({ modal: false });
  };

  render() {
    if (this.props.loading) return <Spinner />;

    const { data } = this.props.data;

    const dataLine = {
      labels: this.props.data.labels,
      datasets: [{ data: data.length ? data : Array(12).fill(0) }],
    };

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Menu
          title="Seleccionar Año"
          isVisible={this.state.modal}
          onBackdropPress={() =>
            this.setState({
              modal: false,
              modalYear: this.props.selectedYear,
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
              buttonStyle={{ marginVertical: 20 }}
              onPress={this.onGenerateReportPress}
            />
          </CardSection>
        </Menu>

        <LineChart
          data={dataLine}
          title={`EVOLUCIÓN DE MIS CALIFICACIONES EN ${this.props.selectedYear}`}
          emptyDataMessage={this.props.error || `Parace que aún no tenes calificaciones en ${this.props.selectedYear}`}
          xlabel="MESES DEL AÑO"
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
    error,
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  onMonthlyReviewsReadByYear,
  yearsWithReview,
})(MonthlyReviewsChart);
