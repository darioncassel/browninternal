if (Meteor.isClient) {
  Meteor.subscribe('alumnis');
  Template.Alumni.rendered = function() {
    var alumnis = [];
    var alumniData = Alumni.find().fetch();
    console.log(alumniData.length);
    for(i=0; i<alumniData.length; i++){
      var alumni = [];
      alumni.push(alumniData[i]["First Name"]);
      alumni.push(alumniData[i]["Last Name"]);
      alumni.push(alumniData[i]["E-mail"]);
      alumnis.push(alumni);
    }
    $('#alumniDataTable').dataTable({
      scrollY: 950,
      scrollCollapse: true,
      "lengthMenu": [25, 50, 100],
      "data": alumnis,
      "columns": [
          { "title": "First Name" },
          { "title": "Last Name" },
          { "title": "E-mail" }
      ]
    });
  }
}

