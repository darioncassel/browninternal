GovboardMembers = new Mongo.Collection("govboardMembers");
GovboardOfficers = new Mongo.Collection("govboardOfficers");
GovboardPortalReps = new Mongo.Collection("govboardPortalReps");

  // Guaranteed to return [Long name, Short name] if input is a valid govboard position
positionNames = {
      "poobah": ["Grand Poobah", "Poobah"],
      "shama": ["Shama Llama Ding Dong", "Shama"],
      "treasurer": ["Treasurer", "Treasurer"],
      "secretary": ["Secretary", "Secretary"],
      "ace": ["Academic, Cultural, and Educational", "ACE"],
      "alumni": ["Alumni", "Alumni"],
      "community": ["Community Outreach", "CO"],
      "ewf": ["Earth, Wind, and Fire", "E W & F"],
      "faculty": ["Faculty Liasons", "Faculty"],
      "fyl": ["First-Year Liasons", "FYL"],
      "hauntings": ["Hauntings", "Hauntings"],
      "ims": ["Intramurals", "IMs"],
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
    "poobah": ["Frederick Short"],
    "shama": ["Alexandra Kinstle"],
    "treasurer": ["Samuel Scimemi"],
    "secretary": ["Amy Snyder"],
  };

  var memberArr = {
    "ace": ["Luke Waddell", "Charlotte Pierson"],
    "alumni": ["Tyler Burd", "Leigham Breckenridge"],
    "community": ["Nicholas Bergh", "Caitlin McNamara"],
    "ewf": ["Benjamin Camber", "Mary Sport"],
    "faculty": ["Victoria Glasgow", "Scott Lebow"],
    "fyl": ["Brian Walter", "Gabrielle Carper", "Kelly Strauch"],
    "hauntings": ["Kathleen Dudgeon", "Nicole Miller", "Megan Carpenter"],
    "ims": ["Addie McMurtry", "Christopher Arthur"],
    "media": ["Emma Bross", "William Mullany", "Sage Tanguay"],
    "membership": ["Joshua Danoff", "Jonathan Martin", "Samantha Lagestee"],
    "panjandrum": ["Jacob Saltzman"],
    "pr": ["Jessica Miles", "Eileen Hernon"],
    "social": ["Aline Mullen", "Oliver Lopez-Gomez", "Jacob Mathews"],
    "techmasters": ["Kean Finucane", "Wylie Wang"],
  };

  var portalRepArr = {
    "antiquad": [""],
    "gildergreen": [""],
    "quad": [""],
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
