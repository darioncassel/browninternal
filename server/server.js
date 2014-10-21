Residents = new Mongo.Collection("residents");

Meteor.startup(function () {
  Meteor.methods({
    'removeAllResidents' : function() {
      Residents.remove({});
    }
  });
});
