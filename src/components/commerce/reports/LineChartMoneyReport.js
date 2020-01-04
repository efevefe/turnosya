import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, ScrollView } from 'react-native';
import {
  LineChart,
  Spinner,
  Menu,
  Picker,
  Button,
  IconButton
} from '../../common';
import {
  onCommerceReportValueChange,
  readEarningsPerMonths,
  yearsOfActivity
} from '../../../actions';

class LineChartMoneyReport extends Component {
  constructor(props) {
    super(props);
    props.yearsOfActivity(props.commerceId);
    props.readEarningsPerMonths(props.commerceId, props.selectedYear);

    this.state = { modal: false, modalYear: false };
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
              this.props.readEarningsPerMonths(
                commerceId,
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
          Evolución de mis Ganancias en {selectedYear}
        </Text>
        <LineChart data={dataLine} yAxisLabel={'$'} />
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
  readEarningsPerMonths,
  yearsOfActivity
})(LineChartMoneyReport);
