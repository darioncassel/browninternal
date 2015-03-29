if (Meteor.isClient) {
  Template.Govboard.rendered = function() {
    var odata = [];
    var mdata = [];
    var pdata = [];
    var officers = GovboardOfficers.find().fetch();
    var mem = GovboardMembers.find().fetch()
    var portal_reps = GovboardPortalReps.find().fetch();
    for(i=0; i<officers.length; i++){
      for (j=0; j<officers[i].members.length; j++) {
        var member = officers[i].members[j];
        var d = [];
        d.push(officers[i].position_names[0]);
        d.push(member.profile.first_name);
        d.push(member.profile.last_name);
        d.push(member.emails[0].address);
        odata.push(d);
      }
    }
    for(i=0; i<mem.length; i++){
      for (j=0; j<mem[i].members.length; j++) {
        var member = mem[i].members[j];
        var d = [];
        d.push(mem[i].position_names[0]);
        d.push(member.profile.first_name);
        d.push(member.profile.last_name);
        d.push(member.emails[0].address);
        mdata.push(d);
      }
    }
    for(i=0; i<portal_reps.length; i++){
      for (j=0; j<portal_reps[i].members.length; j++) {
        var member = portal_reps[i].members[j];
        var d = [];
        d.push(portal_reps[i].position_names[0]);
        d.push(member.profile.first_name);
        d.push(member.profile.last_name);
        d.push(member.emails[0].address);
        pdata.push(d);
      }
    }
    $('#officersDataTable').dataTable({
      scrollY: 300,
      scrollCollapse: true,
      "data": odata,
      "searching" : false,               
      "paging": false,
      "info": false,
      "columns": [
          { "title": "Position" },
          { "title": "First Name" },
          { "title": "Last Name" },
          { "title": "E-mail" }
      ]
    });
    $('#membersDataTable').dataTable({
      scrollY: 300,
      scrollCollapse: true,
      "data": mdata,
      "searching" : false,               
      "paging": false,
      "info": false,
      "columns": [
          { "title": "Position" },
          { "title": "First Name" },
          { "title": "Last Name" },
          { "title": "E-mail" }
      ]
    });
    $('#portalrepsDataTable').dataTable({
      scrollY: 300,
      scrollCollapse: true,
      "data": pdata,
      "searching" : false,               
      "paging": false,
      "info": false,
      "columns": [
          { "title": "Position" },
          { "title": "First Name" },
          { "title": "Last Name" },
          { "title": "E-mail" }
      ]
    });
  }
}
