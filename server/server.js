Residents = new Mongo.Collection("residents");
PollsData = new Mongo.Collection("pollsData");
CalendarEvents = new Mongo.Collection("calendarEvents");

Meteor.startup(function () {
  Meteor.methods({
    'removeAllResidents' : function() {
      Residents.remove({});
    },
    'removeAllPolls' : function() {
      PollsData.remove({});
    },
    'removeAllEvents' : function(){
      CalendarEvents.remove({});
    }
  });
});
