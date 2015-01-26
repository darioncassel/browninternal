if (Meteor.isClient) {
  Template.Roster.rendered = function() {
    var residents = [];
    var resData = Residents.find().fetch();
    for(i=0; i<resData.length; i++){
      var resident = [];
      resident.push(resData[i].Building);
      resident.push(resData[i].Room);
      resident.push(resData[i]["First Name"]);
      resident.push(resData[i]["Last Name"]);
      resident.push(resData[i]["E-mail"]);
      residents.push(resident);
    }
    $('#resDataTable').dataTable({
      scrollY: 950,
      scrollCollapse: true,
      "lengthMenu": [25],
      "data": residents,
      "columns": [
          { "title": "Portal" },
          { "title": "Room" },
          { "title": "First Name" },
          { "title": "Last Name" },
          { "title": "E-mail" }
      ]
    });
  }
}
