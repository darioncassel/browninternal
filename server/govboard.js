GovboardMembers = new Mongo.Collection("govboardMembers");
GovboardOfficers = new Mongo.Collection("govboardOfficers");
GovboardPortalReps = new Mongo.Collection("govboardPortalReps");

  // Guaranteed to return [Long name, Short name] if input is a valid govboard position
positionNames = {
      "poobah": ["Poobah", "Poobah"],
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
      "historians": ["Historians", "Historians"],
      "ims": ["Intramurals", "IMs"],
      "membership": ["Membership", "Membership"],
      "newsletter": ["Newsletter", "Newsletter"],
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
    "poobah": ["Alex Aberman"],
    "shama": ["Patrick Steiner"],
    "treasurer": ["Brooke Dalby"],
    "secretary": ["Scott Lebow"],
  };

  var memberArr = {
    "ace": ["Jacob Saltzman", "Luke Waddell"],
    "alumni": ["Chad Vickers", "Tyler Burd"],
    "community": ["Christian Batarseh", "Mariah Huffman"],
    "ewf": ["Katharine Miller", "jbm7gj"],
    "faculty": ["Victoria Glasgow", "Jacqueline Tran"],
    "fyl": ["Elizabeth Ballou", "Frederick Short", "Brian Walter"],
    "hauntings": ["Oliver Lopez-Gomez", "Kathleen Dudgeon", "Kurt Hilburger"],
    "historians": ["Noor Waheed", "Benjamin Camber"],
    "ims": ["Addie McMurtry", "Christopher Arthur"],
    "membership": ["Joshua Danoff", "Tyler Robbins", "Jay Fuhrman"],
    "newsletter": ["zeh9qz", "ddv7md"],
    "panjandrum": ["Emily Snavely"],
    "pr": ["Kelly Strauch", "Sara Faye"],
    "social": ["Alexandra Kinstle", "Aline Mullen", "Lucas Beane"],
    "techmasters": ["Zeming Lin", "Darion Cassel"],
  };

  var portalRepArr = {
    "antiquad": ["Whitney Wu", "omk2uy", "jwm5vv"],
    "gildergreen": ["Gabrielle Carper", "Kean Finucane", "Amy Snyder"],
    "quad": ["Emma Bross", "Eileen Hernon", "Harpreet Singh", "Samantha Lagestee"],
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
