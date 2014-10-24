Residents = new Mongo.Collection("residents");
PollsData = new Mongo.Collection("pollsData");

Meteor.startup(function () {
  Meteor.methods({
    'removeAllResidents' : function() {
      Residents.remove({});
    },
    'removeAllPolls' : function() {
      PollsData.remove({});
    }
  });
});
