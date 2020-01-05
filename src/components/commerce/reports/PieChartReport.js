import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  PieChart,
  Spinner,
  Button,
  DatePicker,
  IconButton,
  Menu,
  CardSection
} from '../../common';
import {
  readStateTurnsReservations,
  onCommerceReportValueChange
} from '../../../actions/CommerceReportsActions';
import { Text, ScrollView } from 'react-native';
import moment from 'moment';

class PieChartReport extends Component {
  constructor(props) {
    super(props);
    const { commerceId, startDate, endDate } = props;

    props.readStateTurnsReservations(commerceId, startDate, endDate);

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
        <IconButton
          icon="md-create"
          onPress={() => this.setState({ modal: true })}
        />
      )
    });
  }

  render() {
    if (this.props.loading) return <Spinner />;

    const { modal, modalStartDate, modalEndDate } = this.state;

    const dataPie = this.props.data[1]
      ? [
          {
            name: 'Realizados',
            count: this.props.data[0],
            color: 'rgba(199, 44, 65, 1)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15
          },
          {
            name: 'Cancelados',
            count: this.props.data[1],
            color: 'rgba(199, 44, 65, 0.5)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15
          }
        ]
      : [];

    return (
      <ScrollView>
        <Menu
          title="Seleccione el periodo a diagramar"
          onBackdropPress={() =>
            this.setState({
              modal: false,
              modalStartDate: this.props.startDate,
              modalEndDate: this.props.endDate
            })
          }
          isVisible={modal}
          overlayStyle={{ alignItems: 'center' }}
          titleStyle={{ alignSelf: 'center' }}
        >
          <CardSection
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-around',
              paddingBottom: 10
            }}
          >
            <DatePicker
              date={modalStartDate}
              mode="date"
              label="Desde:"
              placeholder="Fecha desde"
              onDateChange={modalStartDate => this.setState({ modalStartDate })}
            />
            <DatePicker
              date={modalEndDate}
              mode="date"
              label="Hasta:"
              placeholder="Opcional"
              onDateChange={modalEndDate => this.setState({ modalEndDate })}
            />
          </CardSection>
          <Button
            title={'Generar Reporte'}
            onPress={() => {
              this.props.readStateTurnsReservations(
                this.props.commerceId,
                moment(modalStartDate),
                moment(modalEndDate)
              );

              this.props.onCommerceReportValueChange({
                prop: 'startDate',
                value: moment(modalStartDate)
              });
              this.props.onCommerceReportValueChange({
                prop: 'endDate',
                value: moment(modalEndDate)
              });
              this.setState({ modal: false });
            }}
          />
        </Menu>
        <Text style={{ fontSize: 30 }}>
          Reservas por día entre el {moment(this.props.startDate).format('L')} y{' '}
          {moment(this.props.endDate).format('L')}
        </Text>
        <PieChart data={dataPie} />
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
  readStateTurnsReservations,
  onCommerceReportValueChange
})(PieChartReport);
