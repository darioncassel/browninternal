//@BrownTechmasters

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('Login', {});
});

Router.route('/roster', function () {
  this.render('Roster', {});
});

Router.route('/polls', function () {
  this.render('Polls', {});
});

Router.route('/about', function () {
  this.render('About', {});
});
