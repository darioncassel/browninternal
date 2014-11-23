//@BrownTechmasters

Residents = new Mongo.Collection("Residents");
PollsData = new Mongo.Collection("PollsData");
CalendarEvents = new Mongo.Collection("CalendarEvents");

Accounts.createUser({email: "te5t@virginia.edu", password: "pass"});
var mcpoll = {
  type: "MultipleChoice",
  title: "How Much Wood Could a Woodchuck Chuck?",
  choices: ['Zero','11','42', 'As much as it wants.'],
  results: [1, 2, 1, 3],
  voteReq: 10,
  completed: false
}
var rankedpoll = {
  type: "Ranked",
  title: "How is Schrodinger's Cat Doing?",
  choices: ['Dead','Alive'],
  results: [50,50],
  voteCount: 0,
  voteReq: 100,
  completed: true
}
var rankedpoll2 = {
  type: "Ranked",
  title: "What's the Best Number?",
  choices: ['one','two','three', 'seven'],
  results: [24, 31, 55, 72],
  voteCount: 0,
  voteReq: 10,
  completed: false
}
/*
 PollsData.insert(mcpoll);
 PollsData.insert(rankedpoll);
 PollsData.insert(rankedpoll2);
 */

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

// Renders something or Login if the user is not logged in
function render(route, place) {
  if (!Meteor.user()) {
    route.render('Login');
  } else {
    route.render(place);
  }
}

Router.route('/', function () { render(this, 'Home'); });
Router.route('/roster', function () { render(this, 'Roster'); });
Router.route('/polls', function () { render(this, 'Polls'); });
Router.route('/calendar', function () { render(this, 'Calender'); });
Router.route('/about', function () { render(this, 'About'); });
Router.route('/login', function () { render(this, 'Login'); });


if(Meteor.isClient) {
  Template.Login.events({
    'submit #login-form' : function(e, t) {
      e.preventDefault();
      var email = t.find('#login-email').value
          , password = t.find('#login-password').value;
      Meteor.loginWithPassword(email, password, function(err) {
        if (err) {
          $('#login-message').text("Incorrect email or password.");
        }
        else;
      });
      return false; 
    }
  });

  Template.Roster.rendered = function() {
    var residents = [];
    var resData = Residents.find().fetch();
    for(i=0; i<resData.length; i++){
      var resident = [];
      resident.push(resData[i].Building);
      resident.push(resData[i].Room);
      resident.push(resData[i]["First Name"]);
      resident.push(resData[i]["Last Name"]);
      resident.push(resData[i].Year);
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
  UI.registerHelper('generateID', function() {
    return "#" + this._id;
  });
  Template.Ranked.rendered = function() {
    $("#sortable").sortable();
  }
  Template.Polls.helpers({
    activePolls: function() {
      return PollsData.find({completed: false}).fetch();
    },
    completedPolls: function() {
      return PollsData.find({completed: true}).fetch();
    }
  });
  Template.MultipleChoice.events = {
    'click input[type=submit]': function(e) {
      e.preventDefault();
      var val = $("input[name='poll1']:checked").val();
      var pollid = $('.panel-collapse.collapse.in').attr('id');
      var pol = PollsData.find({_id: pollid}).fetch()[0];
      var num; var sum = 0;
      for(i=0;i<pol.choices.length;i++){
        if(pol.choices[i]===val){num = i;}
      }
      pol.results[num] = pol.results[num] + 1;
      for(i in pol.results) {sum+=pol.results[i]}
      if(sum>pol.voteReq){
        PollsData.update({_id: pollid}, {$set: {completed: true}});
      }else if(sum==pol.voteReq){
        PollsData.update({_id: pollid}, {$set: {completed: true}});
        PollsData.update({_id: pollid}, {$set: {results: pol.results}});
      }else {
        PollsData.update({_id: pollid}, {$set: {results: pol.results}});
      }
      swal("Thank You!", "Your vote was recorded", "success");
    }
  }
  Template.Ranked.events = {
    'click input[type=submit]': function(e) {
      e.preventDefault();
      var pollid = $('.panel-collapse.collapse.in').attr('id');
      var pol = PollsData.find({_id: pollid}).fetch()[0];
      var res = $("#sortable").sortable('toArray');
      for(i=0;i<res.length;i++){
        for(j=0;j<pol.choices.length;j++){
          if(res[i]==pol.choices[j]){pol.results[j] = res.length - i;}
        }
      }
      var sum = pol.voteCount + 1;
      if(sum>pol.voteReq){
        PollsData.update({_id: pollid}, {$set: {completed: true}});
      }else if(sum==pol.voteReq){
        PollsData.update({_id: pollid}, {$set: {completed: true}});
        PollsData.update({_id: pollid}, {$set: {results: pol.results}});
      }else {
        PollsData.update({_id: pollid}, {$set: {voteCount: sum}});
        PollsData.update({_id: pollid}, {$set: {results: pol.results}});
      }
      swal("Thank You!", "Your vote was recorded", "success");
    }
  }
  Template.CompletedPoll.helpers({
    resultsChart: function() {
      var resultsArr = [];
      for(i=0;i<this.choices.length;i++){
        var result = [];
        result.push(this.choices[i]);
        result.push(this.results[i]);
        resultsArr.push(result);
      }
      return {
        chart: {
          plotBackgroundColor: null,
  plotBorderWidth: null,
  plotShadow: false,
        },
  title: {
    text: 'Results'
  },
  tooltip: {
    pointFormat: '<b>{point.percentage:.1f}%</b>'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        style: {
          color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
        },
        connectorColor: 'silver'
      }
    }
  },
  series: [{
    type: 'pie',
    name: 'Results',
    data: resultsArr
  }]
      };
    }
  });
}
