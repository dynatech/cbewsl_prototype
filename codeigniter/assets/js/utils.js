let RISK_PROFILE_DATA = null;
let HAZARD_DATA = null;
let RESOURCE_AND_CAPACITIES_DATA = null;
let FAMILY_RISK_PROFILE_DATA = null;
let FIELD_SURVEY_LOG_DATA = null;
let SITUATION_LOG_DATA = null;
let MAINTENANCE_LOG_DATA = null;
let MONITORING_LOG_DATA = null;
let specialElementHandlers = {
    '#editor': function (element, renderer) {
        return true;
    }
};
$(document).ready(function () {
    reportData();
});
function formatDateTime(date = null) {
    let timestamp = date
    let current_timestamp = ""
    let text_format_timestamp = ""
    let date_format = ""
    let date_only_format = ""
    let time_format = ""
    let for_file_name = ""
    if (timestamp == null) {
        current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS");
        date_format = moment(new Date()).format("YYYY-MM-DD");
        date_only_format = moment(new Date()).format("MMMM D, YYYY");
        time_format = moment(new Date()).format("hh:MM a");
        text_format_timestamp = moment(new Date()).format("MMMM D, YYYY hh:MM a");
        for_file_name = moment(new Date()).format("YYYY_MM_DD_HH_MM_SS");
    } else {
        current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS");
        date_format = moment(date).format("YYYY-MM-DD");
        date_only_format = moment(date).format("MMMM D, YYYY");
        time_format = moment(date).format("hh:MM a");
        text_format_timestamp = moment(date).format("MMMM D, YYYY hh:MM a");
        for_file_name = moment(date).format("YYYY_MM_DD_HH_MM_SS");
    }

    return {
        current_timestamp: current_timestamp,
        date: date_format,
        time_format: time_format,
        date_only_format: date_only_format,
        text_format_timestamp: text_format_timestamp,
        for_file_name: for_file_name
    }
}

function reportData() {
    let data = [
        { "type": "Risk Profile", "logs": "risk_profile" },
        { "type": "Family Risk Profile", "logs": "family_risk_profile" },
        { "type": "Field Survey", "logs": "field_survey" },
        { "type": "Latest Field Survey", "logs": "latest_field_survey" },
        { "type": "Hazard Data", "logs": "hazard_data" },
        { "type": "Resource and Capacities", "logs": "resource_and_capacities" },
        { "type": "Sensor Maintenance", "logs": "sensor_maintenance" },
        { "type": "Situation Report", "logs": "situation_report" },
        { "type": "Current Situation Report", "logs": "current_situation_report" }];

    let table = $('#reports_table').DataTable({
        "data": data,
        "bDestroy": true,
        "columns": [
            { "data": "type" },
            {
                render(data, type, full) {
                    return `<button type="button" class="btn btn-primary btn-sm btn-block" id="print_report"><i class="fas fa-print text-center"></i> Print / Save</button>`;
                }
            }
        ]
    });

    $('#reports_table tbody').on('click', '#print_report', function () {
        let data = table.row($(this).parents('tr')).data();
        printData(data);
    });
}


function printData(data) {
    let logs = data.logs
    if (logs == "risk_profile") {
        if (RISK_PROFILE_DATA.length != 0) {
            printJS({
                printable: RISK_PROFILE_DATA,
                type: 'json',
                properties: [
                    { field: 'entry', displayName: 'Entry' },
                    { field: 'timestamp', displayName: 'Timestamp' }
                ],
                header: '<h3>Risk Profile</h3>'
            });
        } else {
            alert("No data.");
        }
    } else if (logs == "family_risk_profile") {
        if (FAMILY_RISK_PROFILE_DATA.length != 0) {
            printJS({
                printable: FAMILY_RISK_PROFILE_DATA,
                type: 'json',
                properties: [
                    { field: 'members_count', displayName: 'Number of Members' },
                    { field: 'vulnerable_members_count', displayName: 'Number of Vulnerable' },
                    { field: 'vulnerability_nature', displayName: 'Nature of Vulnerability' }
                ],
                header: '<h3>Family Risk Profile</h3>'
            });
        } else {
            alert("No data.");
        }
    } else if (logs == "field_survey") {
        if (FIELD_SURVEY_LOG_DATA.length != 0) {
            printJS({
                printable: FIELD_SURVEY_LOG_DATA,
                type: 'json',
                properties: [
                    { field: 'features', displayName: 'Features' },
                    { field: 'mat_characterization', displayName: 'Material Characterization' },
                    { field: 'mechanism', displayName: 'Mechanism' },
                    { field: 'exposure', displayName: 'Exposure' },
                    { field: 'note', displayName: 'Note' },
                    { field: 'date', displayName: 'Date' }
                ],
                header: '<h3>Field Survey Log</h3>'
            });
        } else {
            alert("No data.");
        }
    } else if (logs == "hazard_data") {
        if (HAZARD_DATA.length != 0) {
            printJS({
                printable: HAZARD_DATA,
                type: 'json',
                properties: [
                    { field: 'hazard', displayName: 'Hazard' },
                    { field: 'speed_of_onset', displayName: 'Speed of onset' },
                    { field: 'early_warning', displayName: 'Early Warning' },
                    { field: 'impact', displayName: 'Impact' }
                ],
                header: '<h3>Hazard Data</h3>'
            });
        } else {
            alert("No data.");
        }
    } else if (logs == "resource_and_capacities") {
        if (RESOURCE_AND_CAPACITIES_DATA.length != 0) {
            printJS({
                printable: RESOURCE_AND_CAPACITIES_DATA,
                type: 'json',
                properties: [
                    { field: 'resource_and_capacity', displayName: 'Resource / Capacity' },
                    { field: 'status', displayName: 'Status' },
                    { field: 'owner', displayName: 'Owner' }
                ],
                header: '<h3>Resource and Capacities</h3>'
            });
        } else {
            alert("No data.");
        }
    } else if (logs == "sensor_maintenance") {
        if (MAINTENANCE_LOG_DATA.length != 0) {
            printJS({
                printable: MAINTENANCE_LOG_DATA,
                type: 'json',
                properties: [
                    { field: 'working_nodes', displayName: 'Working Nodes' },
                    { field: 'anomalous_nodes', displayName: 'Anomalous Nodes' },
                    { field: 'rain_gauge_status', displayName: 'Rain Gauge Status' },
                    { field: 'start', displayName: 'Date' }
                ],
                header: '<h3>Maintenance Logs</h3>'
            });
        } else {
            alert("No data.");
        }
    } else if (logs == "situation_report") {
        if (SITUATION_LOG_DATA.length != 0) {
            printJS({
                printable: SITUATION_LOG_DATA,
                type: 'json',
                properties: [
                    { field: 'title', displayName: 'Summary' },
                    { field: 'start', displayName: 'Date' }
                ],
                header: '<h3>Situation Report</h3>'
            });
        } else {
            alert("No data.");
        }
    } else if (logs == "latest_field_survey") {
        let data = [FIELD_SURVEY_LOG_DATA[0]]
        if (data.length != 0) {
            printJS({
                printable: data,
                type: 'json',
                properties: [
                    { field: 'features', displayName: 'Features' },
                    { field: 'mat_characterization', displayName: 'Material Characterization' },
                    { field: 'mechanism', displayName: 'Mechanism' },
                    { field: 'exposure', displayName: 'Exposure' },
                    { field: 'note', displayName: 'Note' },
                    { field: 'date', displayName: 'Date' }
                ],
                header: '<h3>Latest Field Survey Log</h3><img src="http://cbewsl.com/assets/images/banner.png"></img>'
            });
        } else {
            alert("No data.");
        }

    } else if (logs == "current_situation_report") {
        let data = [SITUATION_LOG_DATA[0]];
        if (data.length != 0) {
            printJS({
                printable: data,
                type: 'json',
                properties: [
                    { field: 'title', displayName: 'Summary' },
                    { field: 'start', displayName: 'Date' }
                ],
                header: '<h3>Current Situation Report</h3><img src="http://cbewsl.com/assets/images/banner.png"></img>'
            });
        } else {
            alert("No data.");
        }
    }

}