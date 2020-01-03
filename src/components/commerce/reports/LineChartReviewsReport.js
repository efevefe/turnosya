import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, ScrollView } from 'react-native';
import {
  LineChart,
  Spinner,
  IconButton,
  Button,
  Picker,
  Menu
} from '../../common';
import {
  onCommerceReportValueChange,
  readReviewsOnMonths,
  yearsWithReview
} from '../../../actions/CommerceReportsActions';
import moment from 'moment';

class LineChartReviewsReport extends Component {
  constructor(props) {
    super(props);
    props.yearsWithReview(props.commerceId);
    props.readReviewsOnMonths(props.commerceId, moment().format('YYYY'));

    this.state = { modal: false, modalYears: false };
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

  render() {
    const { loading, data, commerceId, years, selectedYear } = this.props;

    const dataLine = {
      labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      datasets: [{ data }]
    };
    if (loading) return <Spinner />;

    return (
      <ScrollView style={{ flex: 1 }}>
        <Menu
          title="Seleccione el año a diagramar"
          onBackdropPress={() =>
            this.setState({ modal: false, modalYears: selectedYear })
          }
          isVisible={this.state.modal}
          overlayStyle={{ alignItems: 'center' }}
          titleStyle={{ alignSelf: 'center' }}
        >
          <Picker
            value={this.state.modalYears || selectedYear}
            items={years}
            onValueChange={modalYears => this.setState({ modalYears })}
          />
          <Button
            title={'Generar Reporte'}
            buttonStyle={{ marginVertical: 20 }}
            onPress={() => {
              this.props.readReviewsOnMonths(commerceId, this.state.modalYears);
              this.props.onCommerceReportValueChange({
                prop: 'selectedYear',
                value: this.state.modalYears
              });
              this.setState({ modal: false });
            }}
          />
        </Menu>
        <Text style={{ fontSize: 30 }}>
          Evolución de mis Calificaciones en {selectedYear}
        </Text>
        <LineChart data={dataLine} />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const {
    data,
    startDate,
    years,
    selectedYear,
    loading
  } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    data,
    startDate,
    years,
    selectedYear,
    commerceId,
    loading
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  readReviewsOnMonths,
  yearsWithReview
})(LineChartReviewsReport);
