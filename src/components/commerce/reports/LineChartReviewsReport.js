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
  readReviewsPerMonths,
  yearsWithReview
} from '../../../actions';

class LineChartReviewsReport extends Component {
  constructor(props) {
    super(props);
    props.yearsWithReview(props.commerceId);
    props.readReviewsPerMonths(props.commerceId, props.selectedYear);

    this.state = { modal: false, modalYear: false };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon'),
      headerLeft: navigation.getParam('leftIcon')
    };
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
            this.setState({ modal: false, modalYear: selectedYear })
          }
          isVisible={this.state.modal}
          overlayStyle={{ alignItems: 'center' }}
          titleStyle={{ alignSelf: 'center' }}
        >
          <Picker
            value={this.state.modalYear || selectedYear}
            items={years}
            onValueChange={modalYear => this.setState({ modalYear })}
          />
          <Button
            title={'Generar Reporte'}
            buttonStyle={{ marginVertical: 20 }}
            onPress={() => {
              this.props.readReviewsPerMonths(commerceId, this.state.modalYear);
              this.props.onCommerceReportValueChange({
                prop: 'selectedYear',
                value: this.state.modalYear
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
  const { data, years, selectedYear, loading } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    data,
    years,
    selectedYear,
    commerceId,
    loading
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  readReviewsPerMonths,
  yearsWithReview
})(LineChartReviewsReport);
