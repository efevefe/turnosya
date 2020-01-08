import React, { Component } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  BarChart,
  Spinner,
  DatePicker,
  Button,
  CardSection,
  Menu,
  IconButton,
  EmptyList
} from '../../common';
import {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  readDailyReservationsByRange
} from '../../../actions/CommerceReportsActions';

const pickerWidth = Math.round(Dimensions.get('window').width) / 3.1;

class DailyReservationsChart extends Component {
  constructor(props) {
    super(props);
    const { commerceId, startDate, endDate } = props;

    props.readDailyReservationsByRange(commerceId, startDate, endDate);

    this.state = {
      modal: false,
      modalStartDate: startDate,
      modalEndDate: endDate
    };
  }

  static navigationOptions = ({ navigation }) => {
    return { headerRight: navigation.getParam('rightIcon') };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      rightIcon: (
        <IconButton icon="md-create" onPress={() => this.setState({ modal: true })} />
      )
    });
  }

  onGenerateReportPress = () => {
    this.props.readDailyReservationsByRange(
      this.props.commerceId,
      moment(this.state.modalStartDate),
      moment(this.state.modalEndDate)
    );

    this.props.onCommerceReportValueChange({
      prop: 'startDate',
      value: moment(this.state.modalStartDate)
    });

    this.props.onCommerceReportValueChange({
      prop: 'endDate',
      value: moment(this.state.modalEndDate)
    });

    this.setState({ modal: false });
  };

  render() {
    if (this.props.loading) return <Spinner />;

    const dataBar = {
      labels: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      datasets: [{ data: this.props.data }]
    };

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
              onDateChange={modalStartDate =>
                this.setState({ modalStartDate })
              }
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
          <CardSection>
            <Button
              title={'Generar Reporte'}
              onPress={this.onGenerateReportPress}
            />
          </CardSection>
        </Menu>

        <BarChart
          title={
            'CANTIDAD DE RESERVAS POR DÍA ENTRE EL ' +
            this.props.startDate.format('DD/MM/YYYY') +
            ' Y EL ' +
            this.props.endDate.format('DD/MM/YYYY')
          }
          emptyDataMessage='Parece que no hay reservas en el periodo ingresado'
          xlabel='DÍAS DE LA SEMANA'
          data={dataBar}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { data, startDate, endDate, loading } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    data,
    startDate,
    endDate,
    commerceId,
    loading
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  readDailyReservationsByRange
})(DailyReservationsChart);
