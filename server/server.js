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
    },
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
  process.env.MAIL_URL="smtp://browncollegeuva%40gmail.com:*******@smtp.gmail.com:587/"; 
});

randompass = function(num)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < num; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
