Residents = new Mongo.Collection("residents");
PollsData = new Mongo.Collection("pollsData");
CalendarEvents = new Mongo.Collection("calendarEvents");

Accounts.emailTemplates.from = "Brown College Website <no-reply@virginia.edu>"
Accounts.emailTemplates.siteName = "Brown Internal Website"

Meteor.startup(function () {
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
    }
  });
});

randompass = function(num)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < num; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
