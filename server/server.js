Residents = new Mongo.Collection("residents");
PollsData = new Mongo.Collection("pollsData");
PostsData = new Mongo.Collection("postsData");
CalendarEvents = new Mongo.Collection("calendarEvents");

Accounts.emailTemplates.from = "Brown College Website <no-reply@virginia.edu>"
Accounts.emailTemplates.siteName = "Brown Internal Website"

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
});

Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/.uploads/apps',
    checkCreateDirectories: true,
    acceptFileTypes: /(pdf|doc|docx)/i,
    getFileName: function(fileinfo, formData) {
      console.log(formData);
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
