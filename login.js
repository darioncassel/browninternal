if (Meteor.isClient) {
  // Login and password reset events
  Template.Login.events({
    'submit #login-form' : function(e, t) {
      e.preventDefault();
      var email = t.find('#login-email').value
      , password = t.find('#login-password').value;
      Meteor.loginWithPassword(email, password, function(err) {
        if (err) {
          swal("Incorrect email or password", "", "error");
        }
        else;
      });

      return false;
    }
  })
  Template.PasswordReset.events({
    'submit #reset-form' : function(e, t) {
      e.preventDefault();
      var email = trimInput(t.find('#reset-email').value.toLowerCase());
      Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            swal("Oops", "This email doesn't exist. If it should you should contact a techmaster");
          } else {
            swal("Oops", "Something went wrong! D=");
          }
        } else {
          swal('Password Changed', 'Email Sent. Please check your mailbox to reset your password.');
        }
      });
      return false;
    }
  })
}
