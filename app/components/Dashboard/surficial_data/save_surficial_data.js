import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-datepicker'
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles'
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'
import { NavigationEvents } from 'react-navigation'
import moment from "moment"

export default class SaveSurficialData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            crack_a: "",
            crack_b: "",
            crack_c: "",
            datetime: "",
            type_of_feature: "",
            description: "",
            name_of_feature: ""
        };
    }

    saveSurficialData() {

    }

    render() {
        return (
            <ScrollView style={surficial_data_styles.container}>
                <View style={surficial_data_styles.contentContainer}>
                    <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Measurements {<Text style={{fontSize: 15, color: 'red'}}>(No available markers)</Text>}</Text>
                    </View>
                </View>
                <View style={surficial_data_styles.contentContainer}>
                    <DatePicker
                        customStyles={{dateInput: {borderWidth: 0,}}}
                        disabled={true}
                        style={[defaults.inputs, { width: '95%' , borderWidth: 0}]}
                        date={this.state.time}
                        mode="datetime"
                        placeholder="Pick date and time (Not available)"
                        showIcon={false}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        value={this.state.datetime}
                        onDateChange={(date) => { this.setState({ datetime: date }) }}
                    />
                    <TextInput editable={false}  style={defaults.inputs} placeholder="Crack A (Not available)" value={this.state.crack_a} onChangeText={text => this.setState({ crack_a: text })} />
                    <TextInput editable={false}  style={defaults.inputs} placeholder="Crack B (Not available)" value={this.state.crack_b} onChangeText={text => this.setState({ crack_b: text })} />
                    <TextInput editable={false}  style={defaults.inputs} placeholder="Crack C (Not available)" value={this.state.crack_c} onChangeText={text => this.setState({ crack_c: text })} />
                </View>
                <View style={surficial_data_styles.contentContainer}>
                    <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Manifestation of Movement</Text>
                    </View>
                    <TextInput style={defaults.inputs} placeholder="Type of Feature" value={this.state.type_of_feature} onChangeText={text => this.setState({ type_of_feature: text })} />
                    <TextInput style={defaults.inputs} placeholder="Description" value={this.state.description} onChangeText={text => this.setState({ description: text })} />
                    <TextInput style={defaults.inputs} placeholder="Name of Feature (if applicable)" value={this.state.name_of_feature} onChangeText={text => this.setState({ name_of_feature: text })} />
                </View>
                <View>
                    <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.saveSurficialData()}>
                        <Text style={defaults.touchableTexts}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
