import React, { Component } from 'react';
import { View, Text , TouchableOpacity, Image, Linking} from 'react-native';
import { dashboard } from '../../assets/styles/dashboard_styles'
import { defaults } from '../../assets/styles/default_styles'
import { Header, Left, Right, Icon} from 'native-base'

export default class MainDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  static navigationOptions = {
      drawerIcon: ({tintColor}) => (
          <Icon name="home" style={{fontSize: 24, color: tintColor}}></Icon>
      )
  };

  navigateMenu(menu) {
    console.info(menu)
    switch (menu) {
        case 'risk_assessment':
            this.props.navigation.navigate('riskAssessment')
            break;
        case 'field_survey':
            this.props.navigation.navigate('fieldSurvey')
            break;
        case 'sensor_maintenance':
            this.props.navigation.navigate('sensorMaintenance')
            break;
        case 'surficial_data':
            this.props.navigation.navigate('surficialData')
            break;
        case 'ewi':
            this.props.navigation.navigate('ewi')
            break;
        case 'reports':
            this.props.navigation.navigate('reports')
            break;
        case 'call':
            Linking.openURL('tel:')
            break;
        case 'sms':
            Linking.openURL(`sms:?addresses=null&body=`);
            break;
        case 'situation_report':
            this.props.navigation.navigate('situationReport')
            break;
        default:
            console.info("Invalid menu... skipping...")
            break;
    }
  }

  render() {
    return (
        <View style={[dashboard.menuContainer]}>
            <View style={[defaults.heading, this.props.style]}>
                <Icon name="menu" onPress={() => this.props.navigation.openDrawer()}/>
                <View style={dashboard.menulogo}>
                    <Image style={dashboard.logo} source={require('../../assets/images/mdrrmo_logo.png')}></Image>
                    <Image style={dashboard.logo} source={require('../../assets/images/dost-phivolcs-logo.png')}></Image>
                    <Image style={dashboard.logo} source={require('../../assets/images/dews-l-logo.png')}></Image>
                </View>
                <View style={dashboard.title}>
                    <Text style={dashboard.titleText}>Early Warning System for Deep-seated Landslides</Text>
                </View>
            </View>
            <View style={[dashboard.menu]}>
                <View style={dashboard.rowMenu}>
                    <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("risk_assessment")}>
                        <Image style={dashboard.menuIcons} source={require('../../assets/images/cra.png')}  />
                        <Text style={dashboard.menuTexts}>Risk Assessment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("field_survey")}>
                        <Image style={dashboard.menuIcons} source={require('../../assets/images/field_survey.png')} />
                        <Text style={dashboard.menuTexts}>Field Survey</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("situation_report")}>
                        <Image style={dashboard.menuIcons} source={require('../../assets/images/situation_report.png')} />
                        <Text style={dashboard.menuTexts}>Situation Report</Text>
                    </TouchableOpacity>
                </View>
                <View style={dashboard.rowMenu}>
                    <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("sensor_maintenance")}>
                        <Image style={dashboard.menuIcons} source={require('../../assets/images/sensor_maintenance.png')} />
                        <Text style={dashboard.menuTexts}> Sensor Maintenance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("surficial_data")}>
                        <Image style={dashboard.menuIcons} source={require('../../assets/images/surficial.png')} />
                        <Text style={dashboard.menuTexts}>Surficial Data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("ewi")}>
                        <Image style={dashboard.menuIcons} source={require('../../assets/images/ewi.png')} />
                        <Text style={dashboard.menuTexts}>EWI</Text>
                    </TouchableOpacity>
                </View>
                <View style={dashboard.rowMenu}>
                    <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("reports")}>
                        <Image style={dashboard.menuIcons} source={require('../../assets/images/reports.png')} />
                        <Text style={dashboard.menuTexts}>Reports</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("call")}>
                        <Image style={dashboard.menuIcons} source={require('../../assets/images/call.png')} />
                        <Text style={dashboard.menuTexts}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("sms")}>
                        <Image style={dashboard.menuIcons} source={require('../../assets/images/messaging.png')} />
                        <Text style={dashboard.menuTexts}>SMS</Text>
                    </TouchableOpacity>           
                </View>
            </View>
        </View>
    );
  }
}
