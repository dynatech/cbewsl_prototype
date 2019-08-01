import { Icon } from 'native-base';
import React, { Component } from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import { dashboard } from '../../assets/styles/dashboard_styles';
import { defaults } from '../../assets/styles/default_styles';
import Storage from '../utils/storage';
import Sync from '../utils/syncer';
import Notification from '../utils/alert_notification';
import { spinner_styles } from '../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';

export default class MainDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert_badge: [],
            spinner: true
        };
    }

    // componentDidMount() {
    //     Notification.endOfValidity()
    // }

    static navigationOptions = {
        drawerIcon: ({ tintColor }) => (
            <Icon name="home" style={{ fontSize: 24, color: tintColor }}></Icon>
        )
    };

    navigateMenu(menu) {
        // Notification.endOfValidity()
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

    initializeApp() {
        let offline_data = Storage.getItem("initializeApp");
        offline_data.then(response => {
            if (response == null || response == undefined) {
                let init = Sync.serverToClient()
                init.then(init_response => {
                    console.log(init_response)
                    if (init_response.status == true) {
                        this.setState({ spinner: false })
                    }
                });
            }
        })
    }

    setBadge() {
        let offline_data = Storage.getItem("Pub&CandidAlert");
        offline_data.then(response => {

            let candidate_alerts = JSON.parse(response.candidate_alert);
            console.log(candidate_alerts.leo);
            let current_alerts = response.current_alerts;
            let top_position = -10;
            let temp = []

            if (candidate_alerts.length != 0) {
                temp.push(<Badge
                    status="warning"
                    containerStyle={{ position: 'absolute', top: top_position, left: -10 }}
                    value={
                        <Text style={{ color: 'white', padding: 10, fontSize: 10 }}>
                            <Icon name="ios-warning" style={{ fontSize: 15, color: 'white' }}></Icon> New trigger(s)
                            </Text>
                    }
                />)
                top_position = top_position - 20;
            }

            if (candidate_alerts.leo.latest.length != 0) {
                temp.push(<Badge
                    status="error"
                    containerStyle={{ position: 'absolute', top: top_position, left: -10 }}
                    value={
                        <Text style={{ color: 'white', padding: 10, fontSize: 10 }}>
                            Alert 1
                            </Text>
                    }
                />)
            }

            this.setState({ alert_badge: temp })


            // if (response == null) {
            //     this.setState({alert_badge: [<Badge
            //         status="success"
            //         containerStyle={{ position: 'absolute', top: -10, left: -10 }}
            //         value={<Text style={{color: 'white', padding: 20}}>Alert 0</Text>}
            //     />]})
            // } else if (response.alert_level == "1") {
            //     this.setState({alert_badge: [<Badge
            //         status="error"
            //         containerStyle={{ position: 'absolute', top: -10, left: -10 }}
            //         value={<Text style={{color: 'white', padding: 20}}>Alert 1</Text>}
            //     />]})
            // } else if (response.alert_level == "2") {
            //     this.setState({alert_badge: [<Badge
            //         status="error"
            //         containerStyle={{ position: 'absolute', top: -10, left: -10 }}
            //         value={<Text style={{color: 'white', padding: 20}}>Alert 2</Text>}
            //     />]})
            // } else if (response.alert_level == "3") {
            //     this.setState({alert_badge: [<Badge
            //         status="error"
            //         containerStyle={{ position: 'absolute', top: -10, left: -10 }}
            //         value={<Text style={{color: 'white', padding: 20}}>Alert 3</Text>}
            //     />]})
            // }
        })
    }

    render() {
        return (
            <View style={[dashboard.menuContainer]}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Fetching initial data...'}
                    textStyle={spinner_styles.spinnerTextStyle}
                />

                <NavigationEvents onDidFocus={() => {
                    this.initializeApp()
                    Notification.endOfValidity()
                    this.setBadge()
                }} />
                <View style={[defaults.heading, this.props.style]}>
                    <Icon name="menu" onPress={() => this.props.navigation.openDrawer()} />
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
                            <Image style={dashboard.menuIcons} source={require('../../assets/images/cra.png')} />
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
                            {this.state.alert_badge}
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
