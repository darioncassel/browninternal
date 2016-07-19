// Random stuff, MOVE THINGS TO THE RIGHT PLACES IF THEY GET TOO BIG.


if(Meteor.isClient) {
  // Bugs form
  Template.ApplicationLayout.events = {
    'click button[name=bugs]': function() {
      function bootBoxContent0() {
        var gform = "<div style='width:780;'><iframe src='https://docs.google.com/forms/d/1-iuNWSQuf6qs7irUrGyHo_8OFFu1Jjdr4-ITae44ahI/viewform?embedded=true'\
        width='760' height='500' frameborder='0' marginheight='0' marginwidth='0'>Loading...</iframe></div>";
        var object = $('<div/>').html(gform).contents();
        return object;
      }
      bootbox.dialog({
        backdrop:false,
        message: bootBoxContent0,
        className: 'gform-width',
        buttons: {
          main: {
            label: 'Cancel',
            className: 'btn btn-secondary',
            callback: function() {}
          }
        }
      })
    }
  }
}
