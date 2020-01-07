import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, ScrollView } from 'react-native';
import {
  LineChart,
  Spinner,
  IconButton,
  Button,
  Picker,
  Menu,
  CardSection,
  EmptyList
} from '../../common';
import {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  readMonthlyReviewsByYear,
  yearsWithReview
} from '../../../actions';

class MonthlyReviewsChart extends Component {
  constructor(props) {
    super(props);
    props.yearsWithReview(props.commerceId);
    props.readMonthlyReviewsByYear(props.commerceId, props.selectedYear);

    this.state = { modal: false, modalYear: props.selectedYear };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      rightIcon: (
        <IconButton icon="md-create" onPress={() => this.onEditPress()} />
      )
    });
  }

  onEditPress = () => {
    this.setState({ modal: true });

    if (!this.props.data.length || this.props.error) {
      const years = this.props.years;
      this.props.onCommerceReportValueReset();
      this.props.onCommerceReportValueChange({ prop: 'years', value: years });
    }
  };

  onGenerateReportPress = () => {
    this.props.readMonthlyReviewsByYear(
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

    if (this.props.data.length && !this.props.error) {
      const dataLine = {
        labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        datasets: [{ data: this.props.data }]
      };

      return (
        <ScrollView style={{ flex: 1 }}>
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
                buttonStyle={{ marginVertical: 20 }}
                onPress={this.onGenerateReportPress}
              />
            </CardSection>
          </Menu>

          <LineChart
            data={dataLine}
            title={`EVOLUCIÓN DE MIS CALIFICACIONES EN ${this.props.selectedYear}`}
          />
        </ScrollView>
      );
    }
    const title = this.props.error
      ? this.props.error
      : `PARECE QUE NO HAY CALIFICACIONES EN ${this.props.selectedYear}`;

    return <EmptyList title={title} />;
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
  readMonthlyReviewsByYear,
  yearsWithReview
})(MonthlyReviewsChart);
