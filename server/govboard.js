GovboardMembers = new Mongo.Collection("govboardMembers");
GovboardOfficers = new Mongo.Collection("govboardOfficers");
GovboardPortalReps = new Mongo.Collection("govboardPortalReps");

  // Guaranteed to return [Long name, Short name] if input is a valid govboard position
positionNames = {
      "poobah": ["Grand Poobah", "Poobah"],
      "shama": ["Shama Llama Ding Dong", "Shama"],
      "treasurer": ["Treasurer", "Treasurer"],
      "secretary": ["Secretary", "Secretary"],
      "ace": ["Arts, Culture, and Entertainment", "ACE"],
      "ath": ["Athletics", "Athletics"],
      "alumni": ["Alumni", "Alumni"],
      "community": ["Community Outreach", "CO"],
      "ewf": ["Earth, Wind, and Fire", "E W & F"],
      "faculty": ["Faculty Liasons", "Faculty"],
      "fyl": ["First-Year Liasons", "FYL"],
      "hauntings": ["Hauntings", "Hauntings"],
      "media": ["Media", "Media"],
      "membership": ["Membership", "Membership"],
      "panjandrum": ["Panjandrum", "Panjandrum"],
      "pr": ["Public Relations", "PR"],
      "social": ["Social", "Social"],
      "techmasters": ["Techmasters", "Techmasters"],
      "antiquad": ["Anti-Quad Portal Reps", "Anti-Quad"],
      "gildergreen": ["Gildergreen Portal Reps", "Gildergreen"],
      "quad": ["Quad Portal Reps", "Quad"],
    }

Meteor.startup(function () {
  GovboardMembers.remove({});
  GovboardOfficers.remove({});
  GovboardPortalReps.remove({});

  var officerArr = {
    "poobah": ["Brian Walter"],
    "shama": ["Elizabeth Harrington"],
    "treasurer": ["Josh Danoff"],
    "secretary": ["Sasha Hoyt"],
  };

  var memberArr = {
    "ace": ["Chad Kamen", "Kylor Kerns"],
    "alumni": ["Chris Arthur", "Tyler Burd"],
    "athletics": ["Caitlin McNamara", "Gabriella Perkes"],
    "community": ["Jake Mathews", "Peiching Teo"],
    "ewf": ["Victoria Glasgow", "Megan Carpenter"],
    "faculty": ["Sohpia Naide", "Tess Gibson"],
    "fyl": ["Gabrielle Carper", "Harpreet Singh", "Eddie Rossi"],
    "hauntings": ["Nicole Miller", "Katherine Shaffer", "Will Neff"],
    "media": ["Emma Bross", "Gwyneth Sholar", "Laurel Cummings"],
    "membership": ["Kate Fitzgerald", "Jonathan Martin", "Pasuth Thothaveesansuk"],
    "panjandrum": ["Oliver Lopez-Gomez"],
    "pr": ["John Grencer", "Sean Gatewood"],
    "social": ["Jake Saltzman"],
    "techmasters": ["Kean Finucane", "Chris Hall"],
  };

  var portalRepArr = {
    "antiquad": ["Laurel Cummings", "Peiching Teo", "Alexander Huynh"],
    "gildergreen": ["Indigo Ballister", "Amrita Singh", "Emily Snavely", "Tyler Robbins"],
    "quad": ["Jesse Ginn", "Cameron Miller", "Lillia Siuta", "Lily Zamanali"],
  };
  parseArr(officerArr, GovboardOfficers);
  parseArr(memberArr, GovboardMembers);
  parseArr(portalRepArr, GovboardPortalReps);
});

parseArr = function(arr, dbdoc) {
  for (var key in arr) {
    var people = [];
    for (var mem in arr[key]) {
      mem = arr[key][mem]
      var fn = mem.split(" ")[0];
      var ln = mem.split(" ")[1];
      var member = Meteor.users.findOne(
        {"profile.first_name":fn,
          "profile.last_name":ln
      });
      if (!member) {
        member = Meteor.users.findOne({username:mem});
      }
      if (member) {
        people.push(member);
      }
      else {
        console.log(key + " : " + mem + " cannot be found in accounts.");
      }
    }
    dbdoc.insert({
      position: key,
      position_names: positionNames[key],
      members: people,
    });
  }
}
