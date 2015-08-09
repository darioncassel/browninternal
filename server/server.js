Residents = new Mongo.Collection("residents");
PollsData = new Mongo.Collection("pollsData");
PostsData = new Mongo.Collection("postsData");
CalendarEvents = new Mongo.Collection("calendarEvents");

Accounts.emailTemplates.from = "Brown College Website <no-reply@virginia.edu>"
Accounts.emailTemplates.siteName = "Brown Internal Website"

if (Meteor.isServer) {
  Accounts.onLogin(function() {
    Meteor.publish("residents", function() {
      self = this;
      if(this.userId){
        return Residents.find();
      }else {
        console.log("FAIL: publish Residents")
      }
    });
    Meteor.publish("govboard_officers", function() {
      self = this;
      if(this.userId){
        return GovboardOfficers.find();
      }else {
        console.log("FAIL: publish GovboardOfficers")
      }
    });
    Meteor.publish("govboard_members", function() {
      self = this;
      if(this.userId){
        return GovboardMembers.find();
      }else {
        console.log("FAIL: publish GovboardMembers")
      }
    });
    Meteor.publish("govboard_portalreps", function() {
      self = this;
      if(this.userId){
        return GovboardPortalReps.find();
      }else {
        console.log("FAIL: publish GovboardPortalReps")
      }
    });
    Meteor.publish("calendar_events", function() {
      self = this;
      if(this.userId){
        return CalendarEvents.find();
      }else {
        console.log("FAIL: publish calendarEvents")
      }
    });
    Meteor.publish("polls_data", function() {
      self = this;
      if(this.userId){
        return PollsData.find();
      }else {
        console.log("FAIL: publish pollsData")
      }
    });
    Meteor.publish("posts_data", function() {
      self = this;
      if(this.userId){
        return PostsData.find();
      }else {
        console.log("FAIL: publish pollsData")
      }
    });
  });
  Meteor.methods({
    'updateAccounts' : function() {
      var resData = Residents.find().fetch();
      for(i=0; i<resData.length; i++){
        var email = resData[i]["E-mail"];
        var username = email.split('@')[0];
        if (Meteor.users.findOne({ "emails.address" : email }) == null) {
          Accounts.createUser({
            username : username,
            email: email,
            password: randompass(8),
            profile : {
              first_name : resData[i]["First Name"],
              last_name : resData[i]["Last Name"],
              gender : resData[i].Gender,
            }
          });
        }
      }
    },
    'reservationEmail' : function (text) {
      check([text], [String]);
      this.unblock();
      Email.send({
        to: 'bc-chat@list.mail.virginia.edu',
        from: "\"ZemBot 6000\" <BC_reservations@email.virginia.edu>",
        subject: 'BC Reservations: New Reservation',
        text: text
      });
    },
    'updatePollStatus' : function (id, bool, time) {
      var t = time - moment().valueOf();
      Meteor.setTimeout( function() {
        PollsData.update({_id: id}, {$set: {completed: bool}});
      }, t > 0 ? t : 0)
    },
    'addCalendarEvent' : function (eventData) {
      CalendarEvents.insert(eventData)
    },
    'removeCalendarEvent' : function (event) {
      CalendarEvents.remove({_id: event._id});
    },
    'updateEventTitle' : function (event, title) {
      CalendarEvents.update({_id: event._id}, {$set: {title: title}});
    },
    'updateEventWithEnd' : function (event) {
      CalendarEvents.update({_id: event._id}, {$set: {allDay: event.allDay, start: event.start, end: event.end}});
    },
    'updateEventWithoutEnd' : function (event) {
      CalendarEvents.update({_id: event._id}, {$set: {allDay: event.allDay, start: event.start}});
    },
    'updateEventOnResize' : function (event) {
      CalendarEvents.update({_id: event._id}, {$set: {end: event.end}});
    },
    'addPoll' : function (pollData) {
      var id = PollsData.insert(pollData);
      return id;
    },
    'updatePoll' : function (pollid, pol) {
      PollsData.update({_id: pollid}, {$set: {votes: pol.votes, voteNum: pol.voteNum}});
    },
    'closePoll' : function (pollid) {
      PollsData.update({_id: pollid}, {$set: {completed: true}});
    },
    'openPoll' : function (pollid) {
      PollsData.update({_id: pollid}, {$set: {completed: false}});
    },
    'removePoll' : function (pollid) {
      PollsData.remove({_id: pollid});
    },
    'setPollResults' : function(pollid, results, winner) {
      PollsData.update({_id: pollid}, {$set: {results: results, winner: winner}});
    }
  });

  Meteor.startup(function () {
    UploadServer.init({
      tmpDir: process.env.PWD + '/.uploads/tmp',
      uploadDir: process.env.PWD + '/.uploads/apps',
      checkCreateDirectories: true,
      acceptFileTypes: /(pdf)/i,
    });
  });
}

randompass = function(num)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < num; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
