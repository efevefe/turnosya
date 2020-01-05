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
        <IconButton
          icon="md-create"
          onPress={() => this.setState({ modal: true })}
        />
      )
    });
  }

  // onDataEmpty = () => {};

  render() {
    if (this.props.loading) return <Spinner />;
    // if (this.props.isDataEmpty) return this.onDataEmpty();

    const dataLine = {
      labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      datasets: [{ data: this.props.data }]
    };

    return (
      <ScrollView style={{ flex: 1 }}>
        <Menu
          title="Seleccione el año a diagramar"
          onBackdropPress={() =>
            this.setState({ modal: false, modalYear: this.props.selectedYear })
          }
          isVisible={this.state.modal}
          overlayStyle={{ alignItems: 'center' }}
          titleStyle={{ alignSelf: 'center' }}
        >
          <Picker
            value={this.state.modalYear}
            items={this.props.years}
            onValueChange={modalYear => this.setState({ modalYear })}
          />
          <Button
            title={'Generar Reporte'}
            buttonStyle={{ marginVertical: 20 }}
            onPress={() => {
              this.props.readReviewsPerMonths(
                this.props.commerceId,
                this.state.modalYear
              );
              this.props.onCommerceReportValueChange({
                prop: 'selectedYear',
                value: this.state.modalYear
              });
              this.setState({ modal: false });
            }}
          />
        </Menu>
        <Text style={{ fontSize: 30 }}>
          Evolución de mis Calificaciones en {this.props.selectedYear}
        </Text>
        <LineChart data={dataLine} />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const {
    data,
    years,
    selectedYear,
    loading
    // isDataEmpty
  } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    data,
    years,
    selectedYear,
    commerceId,
    loading
    // isDataEmpty
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  readReviewsPerMonths,
  yearsWithReview
})(LineChartReviewsReport);
