//@BrownTechmasters

Residents = new Mongo.Collection("Residents");
PollsData = new Mongo.Collection("PollsData");
CalendarEvents = new Mongo.Collection("CalendarEvents");

//Accounts.createUser({email: "te5t@virginia.edu", password: "pass"});

var mcpoll = {
  type: "MultipleChoice",
  title: "How Much Wood Could a Woodchuck Chuck?",
  choices: ['Zero','11','42', 'As much as it wants.'],
  results: [1, 2, 1, 3],
  voteReq: 10,
  completed: false
}
var rankedpoll = {
  type: "Ranked",
  title: "How is Schrodinger's Cat Doing?",
  choices: ['Dead','Alive'],
  results: [50,50],
  voteCount: 0,
  voteReq: 100,
  completed: true
}
var rankedpoll2 = {
  type: "Ranked",
  title: "What's the Best Number?",
  choices: ['one','two','three', 'seven'],
  results: [24, 31, 55, 72],
  voteCount: 0,
  voteReq: 10,
  completed: false
}
/*
PollsData.insert(mcpoll);
PollsData.insert(rankedpoll);
PollsData.insert(rankedpoll2);
*/

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

// Renders something or Login if the user is not logged in
function render(route, place) {
  if (!Meteor.user()) {
    route.render('Login');
  } else {
    route.render(place);
  }
}

Router.route('/', function () { render(this, 'Home'); });
Router.route('/roster', function () { render(this, 'Roster'); });
Router.route('/polls', function () { render(this, 'Polls'); });
Router.route('/calendar', function () { render(this, 'Calendar'); });
Router.route('/about', function () { render(this, 'About'); });
Router.route('/login', function () { render(this, 'Login'); });


if(Meteor.isClient) {
  Template.Login.events({
    'submit #login-form' : function(e, t) {
      e.preventDefault();
      var email = t.find('#login-email').value
      , password = t.find('#login-password').value;
      Meteor.loginWithPassword(email, password, function(err) {
        if (err) {
          swal("Incorrect email or password", "", "error");
        }
        else;
      });
      return false;
    }
  });
  Template.Roster.rendered = function() {
    var residents = [];
    var resData = Residents.find().fetch();
    for(i=0; i<resData.length; i++){
      var resident = [];
      resident.push(resData[i].Building);
      resident.push(resData[i].Room);
      resident.push(resData[i]["First Name"]);
      resident.push(resData[i]["Last Name"]);
      resident.push(resData[i].Year);
      residents.push(resident);
    }
    $('#resDataTable').dataTable({
      scrollY: 950,
      scrollCollapse: true,
      "lengthMenu": [25],
      "data": residents,
      "columns": [
          { "title": "Portal" },
          { "title": "Room" },
          { "title": "First Name" },
          { "title": "Last Name" },
          { "title": "E-mail" }
      ]
    });
  }
  UI.registerHelper('generateID', function() {
    return "#" + this._id;
  });
  Template.Ranked.rendered = function() {
    $("#sortable").sortable();
  }
  Template.Polls.helpers({
    activePolls: function() {
      return PollsData.find({completed: false}).fetch();
    },
    completedPolls: function() {
      return PollsData.find({completed: true}).fetch();
    }
  });
  Template.Polls.events = {
    'click button[name=addPoll]': function(e) {
      function bootboxContent() {
        var str ="<div>\
          <p>Type:\
            <input type='radio' value='mcPoll' name='poll1'> Multiple Choice</input>\
            <input type='radio' value='ranked' name='poll1'> Ranked</input></p>\
          <p>Title:<input type='text' name='title'></input></p>\
          <p>Choices:</p>\
            <p><input type='text' name='choices[]'></input></p>\
            <button class='btn btn-warning' id='addField'>+</button>\
          <p>Required Votes:\
            <input style='text-align:center;width:30px;' type='text' name='voteReq' placeholder='0'></input>\
          </p>\
        </div>"
        var object = $('<div/>').html(str).contents();
        object.find('#addField').click(function() {
          $('#addField').before("<p><input type='text' name='choices[]'></input></p>");
        });
        return object;
      }
      bootbox.dialog({
        backdrop: false,
        message: bootboxContent,
        title: 'New Poll',
        buttons: {
          main: {
            label: 'Add',
            className: 'btn btn-primary',
            callback: function() {
              var pollData={}; var add = true;
              var type = $('input[name=poll1]:checked').val();
              var title = $('input[name=title]').val();
              var choices = $("input[name='choices\\[\\]']").map(function(){return $(this).val();}).get();
              var voteReq = $('input[name=voteReq]').val();
              if(type=='mcPoll'){
                pollData.type = "MultipleChoice";
              }else if(type=='ranked'){
                pollData.type = "Ranked";
              }else {
                add = false;
                swal('Error','Please select a type.','error');
              }
              if(title){
                pollData.title = title.toLowerCase().replace(/([^a-z])([a-z])(?=[a-z]{2})|^([a-z])/g, function(_, g1, g2, g3){return (typeof g1 === 'undefined') ? g3.toUpperCase() : g1 + g2.toUpperCase(); } );
              }else {
                add = false;
                swal('Error','Please add a title.','error');
              }
              if(choices){
                pollData.choices = choices;
                pollData.results = [];
                for(i=0;i<choices.length;i++){
                  pollData.results.push(0);
                }
              }else {
                add = false;
                swal('Error','Please add choices.','error');
              }
              if(voteReq){
                var isNum = /^\+?[1-9]\d*$/.test(voteReq);
                if(isNum){
                  pollData.voteReq = parseInt(voteReq);
                }else {
                  add = false;
                  swal('Error','The vote requirement must be a positive, non-zero number.','error');
                }
              }else {
                add = false;
                swal('Error','Please set a vote requirement.','error');
              }
              pollData.completed = false;
              pollData.creator = Meteor.userId();
              pollData.voters = [];
              if(add){
                PollsData.insert(pollData);
                swal('Added!','','success');
              }
            }
          },
          secondary: {
            label: 'Cancel',
            className: 'btn btn-secondary',
            callback: function() {}
          }
        }
      });
    }
  }
  Template.NewPoll.rendered = function(){
    $('.showIfCreator').hide();
    var pollArr = PollsData.find({completed: false}).fetch();
    for(i=0;i<pollArr.length;i++){
      if(pollArr[i].creator==Meteor.userId()){
        $('#'+pollArr[i]._id+' .showIfCreator').show();
      }
    }
  }
  Template.NewPoll.events = {
    'click button[name=closePoll]': function(e) {
      var pollid = $('.panel-collapse.collapse.in').attr('id');
      bootbox.confirm("Are you sure?", function(result){
        if(result){
          PollsData.update({_id: pollid}, {$set: {completed: true}});
        }
      });
    }
  }
  Template.MultipleChoice.events = {
    'click input[type=submit]': function(e) {
      e.preventDefault();
      var val = $("input[name='poll1']:checked").val();
      var pollid = $('.panel-collapse.collapse.in').attr('id');
      var pol = PollsData.find({_id: pollid}).fetch()[0];
      var voted = false;
      for(i=0;i<pol.voters.length;i++){
        if(pol.voters[i] == Meteor.userId()){
          voted = true;
        }
      }
      if(!voted){
        var voteArr = [];
        for(i=0;i<pol.voters.length;i++){
          voteArr.push(pol.voters[i]);
        }
        voteArr.push(Meteor.userId());
        PollsData.update({_id: pollid}, {$set: {voters: voteArr}});
        var num; var sum = 0;
        for(i=0;i<pol.choices.length;i++){
          if(pol.choices[i]===val){num = i;}
        }
        pol.results[num] = pol.results[num] + 1;
        for(i in pol.results) {sum+=pol.results[i]}
        if(sum>pol.voteReq){
          PollsData.update({_id: pollid}, {$set: {completed: true}});
        }else if(sum==pol.voteReq){
          PollsData.update({_id: pollid}, {$set: {completed: true}});
          PollsData.update({_id: pollid}, {$set: {results: pol.results}});
        }else {
          PollsData.update({_id: pollid}, {$set: {results: pol.results}});
        }
        swal("Thank You!", "Your vote was recorded", "success");
      }else{
        swal("You've already voted!","","error");
      }
    }
  }
  Template.Ranked.events = {
    'click input[type=submit]': function(e) {
      e.preventDefault();
      var pollid = $('.panel-collapse.collapse.in').attr('id');
      var pol = PollsData.find({_id: pollid}).fetch()[0];
      var res = $("#sortable").sortable('toArray');
      for(i=0;i<res.length;i++){
        for(j=0;j<pol.choices.length;j++){
          if(res[i]==pol.choices[j]){pol.results[j] = res.length - i;}
        }
      }
      var sum = pol.voteCount + 1;
      if(sum>pol.voteReq){
        PollsData.update({_id: pollid}, {$set: {completed: true}});
      }else if(sum==pol.voteReq){
        PollsData.update({_id: pollid}, {$set: {completed: true}});
        PollsData.update({_id: pollid}, {$set: {results: pol.results}});
      }else {
        PollsData.update({_id: pollid}, {$set: {voteCount: sum}});
        PollsData.update({_id: pollid}, {$set: {results: pol.results}});
      }
      swal("Thank You!", "Your vote was recorded", "success");
    }
  }
  Template.CompletedPoll.helpers({
    resultsChart: function() {
      var resultsArr = [];
      for(i=0;i<this.choices.length;i++){
        var result = [];
        result.push(this.choices[i]);
        result.push(this.results[i]);
        resultsArr.push(result);
      }
      return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
        },
        title: {
            text: 'Results'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Results',
            data: resultsArr
        }]
      };
    }
  });
  Template.Calendar.rendered = function() {
    function bootboxContent1() {
      var str= "<div id='newEvent'>\
        <p>Title: <input type='text' id='this_title'></input>\
        Description: <textarea class='form-control' id='this_des'></textarea>\
        <div id='timeSelect'>\
          <div class='input-append bootstrap-timepicker'></p>\
            <p>Start: <input id='timepicker1' type='text' class='input-small'>\
            <span class='add-on'></i></span><br></p>\
          </div>\
          <div class='input-append bootstrap-timepicker'>\
            <p>End: <input id='timepicker2' type='text' class='input-small'>\
            <span class='add-on'></i></span></p>\
          </div>\
        </div>\
        <p>All Day <input type='checkbox' id='isAllDay'></input></p>\
        <select id='locSelect' class='form-control'>\
          <option>Tucker</option>\
          <option>Tucker Projector</option>\
          <option>Tucker Kitchen</option>\
          <option>Smith</option>\
          <option>The Hill</option>\
          <option>Other</option>\
        </select>\
        <div id='typeOther'>\
          <p><input type='text' style='width:100px' value='Other' id='isOther'></input></p>\
        </div>\
      </div>";
      var object = $('<div/>').html(str).contents();
      object.find('#typeOther').hide();
      object.find('#timepicker1').timepicker();
      object.find('#timepicker2').timepicker();
      object.find('#isAllDay').click(function(){
        $('#timeSelect').toggle();
      });
      object.find('#locSelect').change(function(){
        if($("#locSelect option:selected").text()=='Other'){
          $('#typeOther').show();
        }else {
          $('#typeOther').hide();
        }
      });
      return object;
    }
    function parseTime(t) {
      var x = new moment();
      if(t[6]=='P'){
        x.hours(parseInt(t[0]+t[1])+12);
        x.minutes(parseInt(t[3]+t[4]));
      }else {
        x.hours(parseInt(t[0]+t[1]));
        x.minutes(parseInt(t[3]+t[4]));
      }
      return x;
    }
    $('#calendar').fullCalendar({
      eventSources: [
        {
          events: function(start, end, timezone, callback) {
            callback(CalendarEvents.find().fetch());
          }
        }
      ],
      eventMouseover: function(calEvent, jsEvent) {
        if(calEvent.allDay!=undefined && calEvent.allDay==true){
          var tooltip = '<div class="tooltipevent"><p>'+calEvent.title+'</p>\
            '+calEvent.description+'\
            '+calEvent.location+'. All day.<br><br></div>';
        }else if(moment(calEvent.start).isSame(moment(calEvent.end), 'day')) {
          var tooltip = '<div class="tooltipevent"><p>'+calEvent.title+'</p>\
            '+calEvent.description+'\
            '+calEvent.location+'. From '+moment(calEvent.start).format('h:mm a')+'\
            to '+moment(calEvent.end).format('h:mm a')+'.<br><br></div>';
        }else {
          var tooltip = '<div class="tooltipevent"><p>'+calEvent.title+'</p>\
            '+calEvent.description+'\
            '+calEvent.location+'. From '+moment(calEvent.start).format('ddd')+ ' at ' + moment(calEvent.start).format('h:mm a')+'\
            to '+moment(calEvent.end).format('ddd') + ' at ' +  moment(calEvent.end).format('h:mm a')+'.<br><br></div>';
        }
        var object = $('<div/>').html(tooltip).contents();
        if(calEvent.description!=''){
          object.find('p').append('<br><br>');
        }
        $("body").append(object);
        $(this).mouseover(function(e) {
          $(this).css('z-index', 10000);
          $('.tooltipevent').fadeIn('500');
          $('.tooltipevent').fadeTo('10', 1.9);
        }).mousemove(function(e) {
          $('.tooltipevent').css('top', e.pageY + 10);
          $('.tooltipevent').css('left', e.pageX + 20);
        });
      },
      eventMouseout: function(calEvent, jsEvent) {
        $(this).css('z-index', 8);
        $('.tooltipevent').remove();
      },
      select: function(start, end) {
        bootbox.dialog({
          backdrop: false,
          message: bootboxContent1,
          title: 'New Event',
          buttons: {
            main: {
              label: 'Reserve',
              className: 'btn-primary',
              callback: function(){
                var eventData; var add=true;
                if($('#this_title').val()!='') {
                  var startTime = $("#timepicker1").val().split('');
                  var endTime = $("#timepicker2").val().split('');
                  var title = $('#this_title').val().toLowerCase().replace(/([^a-z])([a-z])(?=[a-z]{2})|^([a-z])/g, function(_, g1, g2, g3){return (typeof g1 === 'undefined') ? g3.toUpperCase() : g1 + g2.toUpperCase(); } );
                  var description = $('#this_des').val();
                  var colorArr = ['#3498db','#2980b9','#16a085','#27ae60','#9b59b6']
                  var location; var color;
                  if($("#locSelect option:selected").text()=='Other'){
                    location = $('#isOther').val().toLowerCase().replace(/([^a-z])([a-z])(?=[a-z]{2})|^([a-z])/g, function(_, g1, g2, g3){return (typeof g1 === 'undefined') ? g3.toUpperCase() : g1 + g2.toUpperCase(); } );;
                    color='#7f8c8d';
                  }else{
                    location = $("#locSelect option:selected").text();
                    for(i=0;i<$('#locSelect option').size()-1;i++){
                      if(location==$($('#locSelect option')[i]).val()){
                        color = colorArr[i];
                      }
                    }
                  }
                  if($("input[id='isAllDay']").is(":checked")){
                    eventData={
                      id: $('#this_title').val()+start+end,
                      title: title,
                      description: description,
                      allDay: true,
                      start: moment(start._d).add(1, 'days').format('YYYY MM DD'),
                      end: moment(end._d).format('YYYY MM DD'),
                      color: color,
                      location: location,
                      type: 'created',
                      creator: Meteor.userId()
                    };
                  }else {
                    var s = moment(start._d).add(1, 'days').hours(parseTime(startTime).hours()).minutes(parseTime(startTime).minutes()).format();
                    var e = moment(end._d).hours(parseTime(endTime).hours()).minutes(parseTime(endTime).minutes()).format();
                    if(moment(e).isBefore(moment(s), 'hour')){
                      e = moment(e).add(1, 'days');
                    }
                    eventData={
                      id: $('#this_title').val()+start+end,
                      title: title,
                      description: description,
                      start: s,
                      end: e,
                      color: color,
                      location: location,
                      type: 'created',
                      creator: Meteor.userId()
                    };
                  }
                  if(location==null){
                    add=false;
                    swal("Error", "Please select a location!", "error");
                  }
                  var locEvents = CalendarEvents.find({location: location}).fetch();
                  for(i=0;i<locEvents.length;i++){
                    if(intersects(eventData, locEvents[i])){
                      add = false;
                    }
                  }
                  if(add){
                    CalendarEvents.insert(eventData);
                  }
                  $('#calendar').fullCalendar('refetchEvents');
                }
              }
            }
          }
        })
        $('#calendar').fullCalendar('unselect');
      },
      eventClick: function(event){
        if(event.creator==Meteor.userId() && event.type=='created' || event.type=='google'){
        bootbox.dialog({
          backdrop: false,
          message: "<p>Modify Event</p>",
          closeButton: true,
          buttons: {
            modify: {
              label: "Change Title",
              callback: function() {
                bootbox.prompt("New Title: ", function(result) {
                  if(result && event.type=='created'){
                    CalendarEvents.update({_id: event._id}, {$set: {title: result}});
                    $('#calendar').fullCalendar('refetchEvents');
                  }else if(result && event.type=='google'){
                    google_updateTitle(result, event);
                  }
                });
              }
            },
            delete: {
              label: "Delete",
              callback: function() {
                if(event.type=='created'){
                  CalendarEvents.remove({_id: event._id});
                }else if(event.type=='google'){
                  google_deleteEvent(event);
                }
                $('#calendar').fullCalendar('refetchEvents');
              }
            }
          }
        });
        }
      },
      eventDrop: function(event){
        if(event.creator==Meteor.userId() && event.type=='created'){
          if(event.end!=null){
            CalendarEvents.update({_id: event._id}, {$set: {allDay: event.allDay, start: moment(event.start).format(), end: moment(event.end).format()}});
          }else {
            CalendarEvents.update({_id: event._id}, {$set: {allDay: event.allDay, start: moment(event.start).format()}});
          }
        }else if(event.type=='google'){
          google_updateTime(event);
        }
      },
      eventResize: function(event){
        if(event.creator==Meteor.userId() && event.type=='created'){
          CalendarEvents.update({_id: event._id}, {$set: {end: moment(event.end).format()}});
        }else if(event.type=='google'){
          google_resizeTime(event);
        }
      },
      header: {
        left: 'prev, next, today',
        center: 'title',
        right: 'month, agendaWeek, agendaDay'
      },
      lazyFetching: false,
      selectable: true,
      selectHelper: true,
      weekends: true,
      editable: true
    });
  }
}

function intersects(m1, m2){
  if(moment(m1.start).isBefore(moment(m2.start))&&moment(m1.end).isAfter(moment(m2.end))){
    return true;
  }else if(moment(m1.start).isBefore(moment(m2.start))&&moment(m1.end).isAfter(moment(m2.start))&&moment(m1.end).isBefore(moment(m2.end))){
    return true;
  }else if(moment(m1.start).isAfter(moment(m2.start))&&moment(m1.start).isBefore(moment(m2.end))&&moment(m1.end).isAfter(moment(m2.end))){
    return true;
  }else if(moment(m1.start).isAfter(moment(m2.start))&&moment(m1.start).isBefore(moment(m2.end))&&moment(m1.end).isBefore(moment(m2.end))&&moment(m1.end).isAfter(moment(m2.start))){
    return true;
  }else {
    return false;
  }
}
