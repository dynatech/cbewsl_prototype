$(document).ready(function () {
    getCandidateAndLatestAlerts();
});

function getCandidateAndLatestAlerts() {
    $("#ewi_no_current_alert").hide();
    $("#ewi_current_alert_container").hide();
    $("#candidate_alert_information").hide();
    $("#ewi_for_lowering").hide();
    $("#ewi_lowering_details").hide();
    $("#extended_column").hide();
    $.ajax({
        url: "http://192.168.1.10:5000/api/monitoring/get_candidate_and_current_alerts",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let json_data = JSON.parse(data);
        let has_alert_data = false;
        let candidate_alerts = JSON.parse(json_data.candidate_alert);
        console.log(json_data);
        console.log(candidate_alerts);
        $("#current_alert_buttons").hide();

        if (json_data.leo.extended.length != 0) {
            has_alert_data = true;
            displayExtendedAlert(json_data.leo.extended);
            $("#ewi_no_current_alert").hide();
        }

        if (has_alert_data == false) {
            $("#ewi_no_current_alert").show();
        } else {
            $("#ewi_no_current_alert").hide();
        }

        if (json_data.leo.latest.length != 0) {
            displayLatestAlert(json_data.leo.latest, candidate_alerts, true);
        }

        if (json_data.leo.overdue.length != 0) {
            displayOverdueAlert(json_data.leo.overdue, candidate_alerts, true);
        }

        if (candidate_alerts.length != 0) {
            $("#no_candidate_alert").hide();
            displayCandidateAlert(candidate_alerts);
        } else {
            $("#no_candidate_alert").show();
        }



    });
}

function displayLatestAlert(latest_data, candidate_alerts, has_alert_data) {
    let latest = latest_data[0];
    formatEwiDetails(candidate_alerts, latest, has_alert_data);
    
}

function displayOverdueAlert(overdue_data, candidate_alerts, has_alert_data) {
    let overdue = overdue_data[0];
    formatEwiDetails(candidate_alerts, overdue, has_alert_data);   
}

function displayExtendedAlert(extended_data) {
    console.log(extended_data)
    $("#ewi_current_alert_container").show();
    $("#lower_ewi").hide();
    $("#triggers_column").hide();
    $("#validity_column").hide();
    $("#ewi_alert_symbol").empty().append("Alert 0");
    $("#extended_column").show();
    let day_of_extended = "Day " + extended_data[0].day + " of Extended monitoring";
    let latest_release = extended_data[0].releases[0].release_time;
    let data_ts = formatDateTime(extended_data[0].releases[0].data_ts);
    let formatted_latest_release = moment(latest_release, 'HH:mm').format('h:mm A');
    let latest_release_text = data_ts["date_only_format"] + " " + formatted_latest_release;

    $("#extended_day").empty().append(day_of_extended);
    $("#extended_latest_release").empty().append("Latest Release: " + latest_release_text);
    onClickReleaseExtended();

}

function updateEwiData() {
    return $.ajax({
        url: "http://192.168.1.10:5000/api/monitoring/get_candidate_and_current_alerts",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    })
}

function displayCandidateAlert(candidate_alerts) {
    let trigger_list = candidate_alerts[0].trigger_list_arr;
    $("#candidate_alert_list").empty();
    $("#candidate_alert_information").hide();
    if (trigger_list.length != 0) {
        $.each(trigger_list, function (key, value) {
            let public_alert_symbol = "Alert " + value.alert_level;
            let tech_info = value.tech_info;
            let trigger_type = value.trigger_type;
            let alert_timestamp = formatDateTime(value.ts_updated);
            let trigger_id = value.trigger_id;
            let valid_text = "<h4><b style='color: #ee9d01;' id='alert_level_" + trigger_id + "'>" + public_alert_symbol + "</b></h4>";
            if (value.invalid == true) {
                valid_text = "<h4><b style='color: red;' id='alert_level_" + trigger_id + "'>" + public_alert_symbol + " (Invalid)</b></h4>";
            }
            $("#candidate_alert_list").append(valid_text)
                .append("<h5 class='alert_trigger'>" + trigger_type + "</h5>")
                .append("<h5>" + tech_info + "<br>")
                .append("Timestamp: " + alert_timestamp["text_format_timestamp"] + "<br></h5><br>")
                .append("<input class='btn btn-primary' type='button' value='Valid' style='background-color: #195770;' id='candidate_alert_valid_" + trigger_id + "'>&nbsp;")
                .append("<input class='btn btn-primary' type='button' value='Invalid' style='background-color: #195770;' id='candidate_alert_invalid_" + trigger_id + "'><hr>");

            $('.alert_trigger').css('text-transform', 'capitalize');
            if (value.invalid == true) {
                $("#candidate_alert_invalid_" + trigger_id).prop('disabled', true);
            }
            onValidateCandidateAlert(trigger_id, candidate_alerts, value, trigger_type);

        });
        $("#no_candidate_alert").hide();
        $("#candidate_alert_information").show();
    }
}

function onValidateCandidateAlert(trigger_id, candidate_alerts, alert_data, trigger_type) {

    $("#candidate_alert_valid_" + trigger_id).unbind();
    $("#candidate_alert_invalid_" + trigger_id).unbind();
    $("#candidate_alert_valid_" + trigger_id).click(function () {

        $("#validate_alert_modal").modal("show");
        $("#validateAlertModalLabel").text("Remarks for this valid alert");
        alertValidation(trigger_id, 1, 1, candidate_alerts, alert_data, trigger_type);
    });

    $("#candidate_alert_invalid_" + trigger_id).click(function () {
        $("#validate_alert_modal").modal("show");
        $("#validateAlertModalLabel").text("Remarks for this invalid alert");
        alertValidation(trigger_id, -1, 1, candidate_alerts, "", trigger_type);
    });
}

function alertValidation(trigger_id, valid, user_id, candidate_alerts, alert_data, trigger_type) {
    $("#alert_remarks").val("");

    $("#save_alert_validation").unbind();
    $("#save_alert_validation").click(function () {

        let url = "http://192.168.1.10:5000/api/monitoring/update_alert_status"
        let remarks = $("#alert_remarks").val();

        fetch(url, {
            method: 'POST',
            dataType: 'jsonp',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "trigger_id": trigger_id,
                "alert_status": valid,
                "remarks": remarks,
                "user_id": user_id,
            }),
        }).then((response) => {
            let alert_message = "";
            if (valid == 1) {
                alert_message = "Alert validated!";
                $("#alert_level_" + trigger_id).text("Alert " + alert_data.alert_level).css("color", "#ee9d01");
                $("#candidate_alert_valid_" + trigger_id).css("background-color", "#28a745").val("Raise");
                $("#candidate_alert_invalid_" + trigger_id).prop('disabled', false);
                formatCandidateAlerts(trigger_id);
            } else {
                alert_message = "Alert invalidated!";
                alert_level = $("#alert_level_" + trigger_id).text();
                $("#alert_level_" + trigger_id).text(alert_level + " (invalid)").css("color", "red")
                $("#candidate_alert_valid_" + trigger_id).css("background-color", "#195770").val("Valid");
                $("#candidate_alert_invalid_" + trigger_id).prop('disabled', true);
            }
            alert(alert_message);
            $("#validate_alert_modal").modal("hide");
        });
    });

}

function formatCandidateAlerts(trigger_id) {
    $("#valid_alert_information").empty();
    let candidate_alerts = updateEwiData();
    candidate_alerts.done(function (data) {
        let json_data = JSON.parse(data);
        updated_data = JSON.parse(json_data.candidate_alert);
        console.log("HERE", updated_data)
        $.each(updated_data[0].trigger_list_arr, function (key, value) {
            if (value.invalid != true) {
                let public_alert_symbol = "Alert " + value.alert_level;
                let tech_info = value.tech_info;
                let alert_timestamp = formatDateTime(value.ts_updated);
                $("#valid_alert_information").append("<h4><b style='color: #ee9d01;'>" + public_alert_symbol + "</b></h4>")
                    .append("<h5 class='alert_trigger'>" + value.trigger_type + "</h5>")
                    .append("<h5>" + tech_info + "<br>")
                    .append("Timestamp: " + alert_timestamp["text_format_timestamp"] + "<br></h5><br>");
            }
        });

        $('.alert_trigger').css('textTransform', 'capitalize');

        $("#candidate_alert_valid_" + trigger_id).unbind();
        $("#candidate_alert_valid_" + trigger_id).click(function () {

            $("#validate_alert_modal").modal("hide");
            $("#confirm_valid_alert_modal").modal("show");
        });

        $("#confirm_release_alert").unbind();
        $("#confirm_release_alert").click(function () {
            let url = 'http://192.168.1.10:5000/api/monitoring/format_candidate_alerts_for_insert'
            fetch(url, {
                method: 'POST',
                dataType: 'jsonp',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updated_data[0]),
            }).then((response) => response.json()).then((responseJson) => {
                let release_data = responseJson;
                releaseAlert(release_data);
                $("#confirm_valid_alert_modal").modal("hide");
            });
        });
    });
}

function onClickReleaseExtended() {
    $("#release_ewi").empty().append('<br><input class="btn btn-success" type="button" id="confirm_release_ewi" value="Release" style="background-color: #28a745;">')
        .append('&nbsp;<input class="btn btn-success" type="button" id="ewi_send_to_email" value="Send to email" style="background-color: #28a745;">');
    sendEwiToEmail();
    $("#confirm_release_ewi").unbind();
    $("#confirm_release_ewi").click(function () {
        $("#confirmReleaseModal").modal("show");
    });

    $("#confirm_release_ewi_modal").unbind();
    $("#confirm_release_ewi_modal").click(function () {
        let candidate_alerts = updateEwiData();
        candidate_alerts.done(function (data) {
            let json_data = JSON.parse(data);
            candidate_alerts = JSON.parse(json_data.candidate_alert);
            let leo = json_data.leo;
            // is_for_release = false;
            // if(candidate_alerts.length != 0){
            //     let is_release_time = candidate_alerts[0].is_release_time;
            //     if(is_release_time == true){
            //         is_for_release = true;
            //     }
            // }else{
            //     is_for_release = false;
            // }
            
            if (candidate_alerts.length != 0) {
                if (leo.extended.length != 0) {
                    let url = 'http://192.168.1.10:5000/api/monitoring/format_candidate_alerts_for_insert'
                    fetch(url, {
                        method: 'POST',
                        dataType: 'jsonp',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(candidate_alerts[0]),
                    }).then((response) => response.json()).then((responseJson) => {
                        console.log(responseJson)
                        $("#confirmReleaseModal").modal("hide");
                        let release_data = responseJson;
                        releaseAlert(release_data);
                        $("#confirm_valid_alert_modal").modal("hide");
                    });
                } else {
                    alert('Please wait for the next release time.')
                }
            } else {
                alert('Unable to release this time.')
                $("#confirm_valid_alert_modal").modal("hide");
            }

        });
    });
    
}

function releaseAlert(release_data, is_moms=false) {
    let url = 'http://192.168.1.10:5000/api/monitoring/insert_ewi';
    fetch(url, {
        method: 'POST',
        dataType: 'jsonp',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(release_data),
    }).then((responseJson) => {
        publicAlert(is_moms);
    });
}

function publicAlert(is_onset = false) {
    let url = 'http://192.168.1.10:5000/api/monitoring/update_alert_gen/' + is_onset;
    fetch(url).then((response) => response.json())
        .then((responseJson) => {
            getCandidateAndLatestAlerts();
        });
}

function onClickReleaseAlert(is_overdue = false) {
    
    $("#release_ewi").empty().append('<br><input class="btn btn-success" type="button" id="confirm_release_ewi" value="Release" style="background-color: #28a745;">')
        .append('&nbsp;<input class="btn btn-success" type="button" id="ewi_send_to_email" value="Send to email" style="background-color: #28a745;">');
    sendEwiToEmail();
    $("#confirm_release_ewi").unbind();
    $("#confirm_release_ewi").click(function () {
        $("#confirmReleaseModal").modal("show");
    });

    $("#confirm_release_ewi_modal").unbind();
    $("#confirm_release_ewi_modal").click(function () {
        let candidate_alerts = updateEwiData();
        candidate_alerts.done(function (data) {
            let json_data = JSON.parse(data);
            candidate_alerts = JSON.parse(json_data.candidate_alert);
            let leo = json_data.leo;
            is_for_release = false;
            let is_moms = false
            

            if(candidate_alerts.length != 0){
                let is_release_time = candidate_alerts[0].is_release_time;
                let internal_alert_level = candidate_alerts[0].internal_alert_level;
                let check_moms = internal_alert_level.split("")
                $.each(check_moms, function (key, value) {
                    if(is_moms == false){
                        if(value == "m" || value == "M"){
                            is_moms = true
                        }
                    }
                });
                if(is_release_time == true){
                    is_for_release = true;
                }
                if(candidate_alerts[0].public_alert_symbol == "A0"){
                    is_for_release = true
                }
            }else{
                is_for_release = false;
            }
            
            if (is_for_release == true) {
                candidate_alerts[0].is_overdue = is_overdue;
                if (leo.latest.length != 0 || leo.overdue.length != 0) {
                    let url = 'http://192.168.1.10:5000/api/monitoring/format_candidate_alerts_for_insert';
                    fetch(url, {
                        method: 'POST',
                        dataType: 'jsonp',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(candidate_alerts[0]),
                    }).then((response) => response.json()).then((responseJson) => {
                        console.log(responseJson)
                        let release_data = responseJson;
                        alert("Successfully Release!");
                        $("#ewi_send_to_email").show();
                        $("#confirm_release_ewi").hide();
                        $("#confirmReleaseModal").modal("hide");
                        releaseAlert(release_data, is_moms);
                        $("#confirm_valid_alert_modal").modal("hide");
                    });
                } else {
                    alert('Please wait for the next release time.')
                }
            } else {
                alert('Unable to release this time.')
                $("#confirmReleaseModal").modal("hide");
            }

        });
    });
}

function formatEwiDetails(candidate_alerts, leo_data, has_alert_data){
    let alert_level = "Alert " + leo_data.public_alert_symbol.alert_level;
    if(alert_level == "Alert 0"){
        if (has_alert_data == true) {
            $("#ewi_no_current_alert").show();
        } else {
            $("#ewi_no_current_alert").hide();
        }
        $("#ewi_current_alert_container").hide();
    }else{
        $("#ewi_no_current_alert").hide();
        $("#ewi_current_alert_container").show();
        let recommended_response = leo_data.public_alert_symbol.recommended_response;
        let event_start = formatDateTime(leo_data.event.event_start);
        let validity = formatDateTime(leo_data.event.validity);
        let trigger = leo_data.releases[0].triggers;

        let formatted_as_of = "";
        let latest_data_information = "";
        let has_trigger = false;
        let trigger_list_trigger_id = 0;
        let release_schedule = "";
        let general_status = "";

        if(candidate_alerts.length == 0){
            formatted_as_of = formatDateTime(leo_data.releases[0].data_ts);
        }else{
            formatted_as_of = formatDateTime(candidate_alerts[0].release_details.data_ts);
            let trigger_list_arr = candidate_alerts[0].trigger_list_arr;
            general_status = candidate_alerts[0].general_status
            if(candidate_alerts[0].public_alert_symbol == "A0"){
                release_schedule = candidate_alerts[0].release_details.data_ts;
            }else{
                release_schedule = candidate_alerts[0].release_schedule;
            }
            console.log(release_schedule)
            let update_ts = moment(release_schedule).add(30, "minutes").format("YYYY-MM-DD HH:mm:SS");
            console.log("update_ts",update_ts)
            release_schedule = formatDateTime(update_ts);
            if(trigger_list_arr.length != 0){
                has_trigger = true;
                $.each(trigger_list_arr, function (key, value) {
                    if(trigger_list_trigger_id == 0){
                        trigger_list_trigger_id = value.trigger_id
                    }
                    if(candidate_alerts[0].release_details.data_ts == value.ts_updated){
                        let trigger_type = value.trigger_type;
                        let tech_info = value.tech_info;
                        if(trigger_type == "rainfall"){
                            latest_data_information += "<b>Rainfall: </b> " + tech_info + "<br>";
                        }else if(trigger_type == "moms"){
                            latest_data_information += "<b>Manifestations of movement: </b> " + tech_info + "<br>";
                        }else if(trigger_type == "earthquake"){
                            latest_data_information += "<b>Earthquake Alert: </b> " + tech_info + "<br>";
                        }
                    }else{
                        latest_data_information += "No new retriggers<br>"
                    }
                    
                });
            }else{
                has_trigger = false;
                let latest_ts = formatDateTime(candidate_alerts[0].release_details.data_ts);
                latest_data_information += "<hr><br>As of <b>"+latest_ts["text_format_timestamp"]+"</b><br>No new retriggers<br>"
            }
            
        }

        let as_of_datetime = formatted_as_of["text_format_timestamp"] + "</b>";
        let latest_release_text = "none";
        let info = ""
        let release_ts = "";
        
        $("#recommended_response").empty();
        $.each(leo_data.releases, function (key, value) {
            if(latest_release_text == "none"){
                let formatted_release_time = moment(value.release_time, 'HH:mm').format('h:mm A');
                release_ts = formatDateTime(value.data_ts);
                
                if(release_ts["text_format_timestamp"] == event_start["text_format_timestamp"]){
                    release_ts = formatDateTime(value.data_ts);
                }else{
                    let update_ts = moment(value.data_ts).add(30, "minutes").format("YYYY-MM-DD HH:mm:SS");
                    release_ts = formatDateTime(update_ts);
                }
                latest_release_text = release_ts["date_only_format"] + " " + formatted_release_time;
            }
        });

        let latest_event_triggers = leo_data.latest_event_triggers;
        let latest_release_trigger_id = 0;
        if (trigger.length != 0) {
            latest_release_trigger_id = leo_data.releases[0].triggers[0].trigger_id;
        }
        let is_equal_trigger = true;
        let is_moms = false;
        if(has_trigger == false){
            if(latest_event_triggers.length != 0){
                $.each(latest_event_triggers, function (key, value) {
                    let ts = formatDateTime(value.ts);
                    let trigger_id = value.trigger_id;
                    
                    if(trigger_id != latest_release_trigger_id){
                        is_equal_trigger = false;
                        let internal_symbol = value.internal_sym.alert_symbol;
    
                        if (internal_symbol == "E") {
                            let magnitude = value.trigger_misc.eq.magnitude;
                            let longitude = value.trigger_misc.eq.longitude;
                            let latitude = value.trigger_misc.eq.latitude;
                            let as_of = "As of <b>last earthquake retrigger</b> at " + "<b>"+ts["text_format_timestamp"]+ "</b><br>";
                            let earth_quake_info = "Magnitude: " + magnitude + " Longitude: " + longitude + " Latitude:" + latitude;
                            info += as_of + earth_quake_info + "<br><br>";
                        } else if (internal_symbol == "R") {
                            let as_of = "As of <b>last rainfall retrigger</b> at " + "<b>"+ts["text_format_timestamp"]+ "</b><br>";
                            let rain_info = value.info;
                            info += as_of + rain_info + "<br><br>";
                        } else if (internal_symbol == "m" || internal_symbol == "M") {
                            is_moms = true;
                            let as_of = "As of <b>last moms retrigger</b> at " + "<b>"+ts["text_format_timestamp"]+ "</b><br>";
                            let moms_info = value.info;
                            info += as_of + moms_info + "<br><br>";
                        }
                    }
                });
                
            }
        }else{
            let trigger_list_arr = candidate_alerts[0].trigger_list_arr;
            $.each(trigger_list_arr, function (key, value) {
                let ts = formatDateTime(value.ts_updated);
                let trigger_type = value.trigger_type;
                let tech_info = value.tech_info;
                let trigger_id = value.trigger_id;
                if(trigger_id != trigger_list_trigger_id){
                    is_equal_trigger = false;
                    if(trigger_type == "rainfall"){
                        let as_of = "As of <b>last rainfall retrigger</b> at " + "<b>"+ts["text_format_timestamp"]+ "</b><br>";
                        info += as_of + tech_info + "<br><br>";
                    }else if(trigger_type == "moms"){
                        let as_of = "As of <b>last moms retrigger</b> at " + "<b>"+ts["text_format_timestamp"]+ "</b><br>";
                        info += as_of + tech_info + "<br><br>";
                        is_moms = true;
                    }else if(trigger_type == "earthquake"){
                        let magnitude = value.trigger_misc.eq.magnitude;
                        let longitude = value.trigger_misc.eq.longitude;
                        let latitude = value.trigger_misc.eq.latitude;
                        let as_of = "As of <b>last earthquake retrigger</b> at " + "<b>"+ts["text_format_timestamp"]+ "</b><br>";
                        let earth_quake_info = "Magnitude: " + magnitude + " Longitude: " + longitude + " Latitude:" + latitude;
                        info += as_of + earth_quake_info + "<br><br>";
                    }
                }
                
            });
        }
        
       
        if(alert_level == "Alert 3"){
            $("#ewi_alert_symbol").text(alert_level).css("color", "red");
        }else{
            $("#ewi_alert_symbol").text(alert_level);
        }
        $("#validity").empty().append("<b>Event started at </b>" + event_start["text_format_timestamp"]);
        $("#validity").append("<br><b>Valid until </b> " + validity["text_format_timestamp"]);
        $("#validity").append("<br><br><b>Latest release timestamp: </b> " + latest_release_text);
        $("#validity").append("<br><b>Recommended response:</b> " + recommended_response);
        
        if(is_equal_trigger == false){
            $("#recommended_response").append("<hr><br>");
        }

        if(has_trigger == true){
            $("#recommended_response").append(info + "<hr><br>As of <b>" + as_of_datetime + "<br>" + latest_data_information);
        }else{
            $("#recommended_response").append(info + latest_data_information);
        }
        
        $("#triggers").empty();
        if (trigger.length == 0) {
            $("#triggers").append("As of last release timestamp <b>" + release_ts["text_format_timestamp"] + "</b><br>");
            $("#triggers").append("No new retriggers");
            $("#triggers_column > h5").hide();
        } else {
            $("#triggers_column > h5").show();
            $("#triggers").append("As of last release timestamp <b>" + release_ts["text_format_timestamp"] + "</b><br>");
           
            $.each(trigger, function (key, value) {
                let internal_symbol = value.internal_sym.alert_symbol;
                if (internal_symbol == "E") {
                    let trigger_type = "Earthquake: ";
                    let magnitude = value.trigger_misc.eq.magnitude;
                    let longitude = value.trigger_misc.eq.longitude;
                    let latitude = value.trigger_misc.eq.latitude;
                    let earth_quake_info = "Magnitude: " + magnitude + " Longitude: " + longitude + " Latitude:" + latitude;
                    $("#triggers").append("<b>" + trigger_type + "</b>" + earth_quake_info + "<br>");
                } else if (internal_symbol == "R") {
                    let trigger_type = "Rainfall: ";
                    let info = value.info;
                    $("#triggers").append("<b>" + trigger_type + "</b>" + info + "<br>");
                } else if (internal_symbol == "m" || internal_symbol == "M") {
                    let trigger_type = "Manifestations of movement: ";
                    let info = value.info;
                    $("#triggers").append("<b>" + trigger_type + "</b>" + info + "<br>");
                }

            });
        }

        let for_lowering = false;

        if(validity["text_format_timestamp"] == release_schedule["text_format_timestamp"]){
            $("#recommended_response").append("<br><b id='candidate_for_lowering'>Candidate for lowering.</b>");
            if(is_moms == false){
                onClickRaiseMomsData();
            }
        }

        if(general_status == "lowering"){
            $("#recommended_response").append("<br>END OF VALIDITY");
            $("#raise_non_significant").hide();
            $("#candidate_for_lowering").hide();
        }
        onClickReleaseAlert(false);
    }
    
}

function onClickRaiseMomsData(){
    $("#recommended_response").append('<br><input class="btn btn-primary" type="button" id="raise_non_significant" value="Raise Non-Significant" style="background-color: #28a745;">')
    $("#raise_non_significant").unbind();
    $("#raise_non_significant").click(function () {
        let data = {
            feature_name: "none",
            feature_type: "none"
        }
        displayRaiseMomsModal(data)
    });
}


function sendEwiToEmail() {
    // $("#ewi_send_to_email").hide();
    $("#ewi_send_to_email").unbind();
    $("#ewi_send_to_email").click(function () {
        $("#sendEwiToEmailModal").modal("show");
    });

    $("#confirm_send_ewi").click(function () {
        let email = $("#email_for_ewi").val();
        let html = $("#report_to_email").html();
        let url = "http://192.168.1.10:5000/api/ewi/send_ewi_via_email";
        let data = {
            email: email,
            html: html
        }
        $("#confirm_send_ewi").prop('disabled', true);

        $.post(url, data).done(function (response) {
            alert(response.message);
            if (response.status == true) {
                $("#email_for_ewi").val("");
                $("#sendEwiToEmailModal").modal("hide");
            }
            $("#confirm_send_ewi").prop('disabled', false);
        });
    });
}
