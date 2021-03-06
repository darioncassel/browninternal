if (Meteor.isClient) {
  Meteor.subscribe("calendar_events");
  Template.Calendar.rendered = function() {
    function bootboxContent1() {
      var str= "<div id='newEvent'>\
        <p>Title: <input type='text' id='this_title'></input><br>\
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
          <option>Smith Game Room</option>\
          <option>Smith TV</option>\
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
      googleCalendarApiKey: Session.get(" googleCalendarApiKey "),
      eventSources: [
        {
          //ACE
          googleCalendarId: Session.get( " ACE_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Alumni
          googleCalendarId: Session.get( " Alumni_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Earth, Wind, and Fire
          googleCalendarId: Session.get( " EarthWindFire_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Community Outreach
          googleCalendarId: Session.get( " CommunityOutreach_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Faculty Liaisons
          googleCalendarId: Session.get( " FacultyLiaisons_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //First-Year Liaisons
          googleCalendarId: Session.get(" FirstYearLiaisons_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Hauntings
          googleCalendarId: Session.get(" Hauntings_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Historians
          googleCalendarId: Session.get(" Historians_googleCalendarId "),
        },
        {
          //Intramurals
          googleCalendarId: Session.get(" Intramurals_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Membership
          googleCalendarId: Session.get( " Membership_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Newsletter
          googleCalendarId: Session.get( " Newsletter_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Panjandrum
          googleCalendarId: Session.get( " Panjandrum_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Public Relations
          googleCalendarId: Session.get( " PublicRelations_googleCalendarId "),
          className: 'gcal-event'
        },
          //Add Res Staff
        {
          //Social
          googleCalendarId: Session.get( " Social_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Techmasters
          googleCalendarId: Session.get( " Techmasters_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Quad Portals Reps
          googleCalendarId: Session.get( " QuadPortalsReps_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Gildergreen Portal Reps
          googleCalendarId: Session.get(" GildergreenPortalReps_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Anti-Quad Portal Reps
          googleCalendarId: Session.get( " AntiQuadPortalReps_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          //Brown College Faculty
          googleCalendarId: Session.get( " BrownCollegeFaculty_googleCalendarId "),
          className: 'gcal-event'
        },
        {
          events: function(start, end, timezone, callback) {
            callback(CalendarEvents.find().fetch());
          }
        }
      ],
      eventMouseover: function(calEvent, jsEvent) {
        if(calEvent.description==undefined){
          calEvent.description="";
        }
        if(calEvent.location==undefined){
          calEvent.location="";
        }
        if(calEvent.allDay!=undefined && calEvent.allDay==true){
          var tooltip = '<div class="tooltipevent"><p>'+calEvent.title+'</p>\
            '+calEvent.description+'<br>\
            '+calEvent.location+'. All day.<br><br></div>';
        }else if(moment(calEvent.start).isSame(moment(calEvent.end), 'day')) {
          var tooltip = '<div class="tooltipevent"><p>'+calEvent.title+'</p>\
            '+calEvent.description+'<br>\
            '+calEvent.location+'. From '+moment(calEvent.start).format('h:mm a')+'\
            to '+moment(calEvent.end).format('h:mm a')+'.<br><br></div>';
        }else {
          var tooltip = '<div class="tooltipevent"><p>'+calEvent.title+'</p>\
            '+calEvent.description+'<br>\
            '+calEvent.location+'. From '+moment(calEvent.start).format('ddd')+ ' at ' + moment(calEvent.start).format('h:mm a')+'\
            to '+moment(calEvent.end).format('ddd') + ' at ' +  moment(calEvent.end).format('h:mm a')+'.<br><br></div>';
        }
        var object = $('<div/>').html(tooltip).contents();
        /*
        if(calEvent.description=!''){
          object.find('p').append('<br><br>');
        }
        */
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
          className: 'form-width',
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
                  var intersect = false;
                  for(i=0;i<locEvents.length;i++){
                    if(intersects(eventData, locEvents[i])){
                      intersect = true;
                    }
                  }
                  if(intersect){
                    add = false;
                    swal("There is already an event at this time and location.", "","error");
                  }
                  if(add){
                    Meteor.call('addCalendarEvent', eventData, function(err, data) {
                      if(err) {
                        swal("Something went wrong :(", "","error");
                      } else {
                        $('#calendar').fullCalendar('refetchEvents');
                      }
                    });
                    var text = "What's up Brown?\n\nThere's an event called "+eventData.title+' at '+eventData.location;
                    if(eventData.allDay!=undefined && eventData.allDay==true){
                      text += ' all day on '+moment(eventData.start).format('MMMM Do')+'.';
                    }else if(moment(eventData.start).isSame(moment(eventData.end), 'day')) {
                      text += ' from '+moment(eventData.start).format('h:mm a')+' to '+moment(eventData.end).format('h:mm a')+' on '+moment(eventData.start).format('MMMM Do')+ '.';
                    }else {
                      text += ' from '+moment(eventData.start).format('ddd')+ ' at ' + moment(eventData.start).format('h:mm a')+' to '+moment(eventData.end).format('ddd') + ' at ' +  moment(eventData.end).format('h:mm a')+'.';
                    }
                    if(eventData.description!=null){
                      text += " This event's description is: " +eventData.description+"\n\nKeep it real,\nTechmasters@Brown"
                    }
                    Meteor.call('reservationEmail', text);
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
          className: "eventClick",
          buttons: {
            modify: {
              label: "Change Title",
              callback: function() {
                bootbox.prompt("New Title: ", function(result) {
                  if(result && event.type=='created'){
                    Meteor.call('updateEventTitle', event, result, function(err, data) {
                      if(err) {
                        swal("Something went wrong :(", "","error");
                      } else {
                        $('#calendar').fullCalendar('refetchEvents');
                      }
                    });
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
                  Meteor.call('removeCalendarEvent', event, function(err, data) {
                    if(err) {
                      swal("Something went wrong :(", "","error");
                    } else {
                      $('#calendar').fullCalendar('refetchEvents');
                    }
                  });
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
            event.start = moment(event.start).format();
            event.end = moment(event.end).format();
            Meteor.call('updateEventWithEnd', event, function(err, data) {
              if(err) {
                swal("Something went wrong :(", "","error");
              } else {
                $('#calendar').fullCalendar('refetchEvents');
              }
            });
          }else {
            event.start = moment(event.start).format();
            Meteor.call('updateEventWithoutEnd', event, function(err, data) {
              if(err) {
                swal("Something went wrong :(", "","error");
              } else {
                $('#calendar').fullCalendar('refetchEvents');
              }
            });
          }
        }else if(event.type=='google'){
          google_updateTime(event);
        }
      },
      eventResize: function(event){
        if(event.creator==Meteor.userId() && event.type=='created'){
          event.end = moment(event.end).format();
          Meteor.call('updateEventOnResize', event, function(err, data) {
            if(err) {
              swal("Something went wrong :(", "","error");
            } else {
              $('#calendar').fullCalendar('refetchEvents');
            }
          });
        }else if(event.type=='google'){
          google_resizeTime(event);
        }
      },
      header: {
        left: 'prev, next',
        center: 'title',
        right: 'today'
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
  //[ ( ) ]
  if(moment(m1.start)<=moment(m2.start)&&moment(m1.end)>=moment(m2.end)){
    return true;
    //[ ( ] )
  }else if(moment(m1.start)<=moment(m2.start)&&moment(m1.end)>=moment(m2.start)&&moment(m1.end)<=moment(m2.end)){
    return true;
    //( [ ) ]
  }else if(moment(m1.start)>=moment(m2.start)&&moment(m1.start)<=moment(m2.end)&&moment(m1.end)>=moment(m2.end)){
    return true;
    //( [ ] )
  }else if(moment(m1.start)>=moment(m2.start)&&moment(m1.start)<=moment(m2.end)&&moment(m1.end)<=moment(m2.end)&&moment(m1.end)>=moment(m2.start)){
    return true;
    //( ) [ ]
  }else {
    return false;
  }
}
