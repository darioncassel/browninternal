//@BrownTechmasters

Residents = new Mongo.Collection("Residents");
PollsData = new Mongo.Collection("PollsData");

var mcpoll = {
  type: "MultipleChoice",
  title: "Test Poll",
  choices: ['one','two','three'],
  results: [10, 20, 10],
  completed: false
}
var rankedpoll = {
  type: "Ranked",
  title: "Test Poll",
  choices: ['one','two','three'],
  results: [10, 20, 10],
  completed: true
}
var rankedpoll2 = {
  type: "Ranked",
  title: "Test Poll",
  choices: ['one','two','three'],
  results: [10, 20, 10],
  completed: false
}
//PollsData.insert(mcpoll);
//PollsData.insert(rankedpoll);
//PollsData.insert(rankedpoll2);

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  if (!Meteor.user()) {
    this.render('Login');
  } else {
    this.render('Home');
  }
});

Router.route('/roster', function () {
  if (!Meteor.user()) {
    this.render('Login');
  } else {
    this.render('Roster');
  }
});

Router.route('/polls', function () {
  if (!Meteor.user()) {
    this.render('Login');
  } else {
    this.render('Polls');
  }
});

Router.route('/about', function () {
  if (!Meteor.user()) {
    this.render('Login');
  } else {
    this.render('About');
  }
});

if(Meteor.isClient) {
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
  Template.Polls.rendered = function() {
    $( "#sortable" ).sortable();
  }
  Template.Polls.helpers({
    activePolls: function() {
      return PollsData.find({completed: false}).fetch();
    },
    completedPolls: function() {
      return PollsData.find({completed: true}).fetch();
    }
  });
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
            plotShadow: false
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
