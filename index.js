//@BrownTechmasters

Residents = new Mongo.Collection("Residents");
PollsData = new Mongo.Collection("PollsData");
PostsData = new Mongo.Collection("PostsData");
CalendarEvents = new Mongo.Collection("CalendarEvents");

GovboardMembers = new Mongo.Collection("GovboardMembers");
GovboardOfficers = new Mongo.Collection("GovboardOfficers");
GovboardPortalReps = new Mongo.Collection("GovboardPortalReps");

Alumni = new Mongo.Collection("Alumni");
Faculty = new Mongo.Collection("Faculty");

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

// Routes
Router.route('/', function () { render(this, 'Home'); });
Router.route('/social', function () { render(this, 'Social'); });
Router.route('/roster', function () { render(this, 'Roster'); });
Router.route('/govboard', function () { render(this, 'Govboard'); });
Router.route('/alumni', function () { render(this, 'Alumni'); });
Router.route('/polls', function () { render(this, 'Polls'); });
Router.route('/calendar', function () { render(this, 'Calendar'); });
Router.route('/more', function () { render(this, 'More'); });
Router.route('/about', function () { render(this, 'About'); });
Router.route('/archives', function () { render(this, 'Archives'); });
Router.route('/minutes', function () { render(this, 'Minutes'); });
Router.route('/addpost', function () { render(this, 'addPost'); });
Router.route('/login', function () { render(this, 'Login'); });
Router.route('/logout', function () { Meteor.logout(); Router.go('/'); });
Router.route('/password_reset', function () { this.render('PasswordReset'); });
//Publically available:
Router.route('/apply', function () { this.render('Apply'); });

var Schemas = {};
Schemas.Post = new SimpleSchema({
    title: {
        type: String,
        label: "Title",
        max: 200
    },
    summary: {
        type: String,
        label: "Brief summary",
        optional: true,
        max: 1000
    }
});

PostsData.attachSchema(Schemas.Post);
