//@BrownTechmasters

Residents = new Mongo.Collection("Residents");
PollsData = new Mongo.Collection("PollsData");
CalendarEvents = new Mongo.Collection("CalendarEvents");

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
Router.route('/roster', function () { render(this, 'Roster'); });
Router.route('/polls', function () { render(this, 'Polls'); });
Router.route('/calendar', function () { render(this, 'Calendar'); });
Router.route('/about', function () { render(this, 'About'); });
Router.route('/login', function () { render(this, 'Login'); });
Router.route('/logout', function () { Meteor.logout(); Router.go('/'); });
Router.route('/password_reset', function () { this.render('PasswordReset'); });
