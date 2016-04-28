if (Meteor.isClient) {
  Template.Apply.helpers({
    uploaded: function() {
      return {
        finished: function(index, fileInfo, context) {
          $('#entry_1344549631').val(fileInfo.name);
          $('#submit_brown').show();
          $('#submit_brown').click(function() {
            var valid = true;
            if($("#entry_330501359").val()==""){valid = false;}
            if($("#entry_940862617").val()==""){valid = false;}
            if(!$("input[name='entry.1958161708']").is(":checked")){valid = false;}
            if($("#entry_585078888").val()==""){valid = false;}
            if(!$("input[name='entry.1407320545']").is(":checked")){valid = false;}
            //if($("#entry_419154489").val()==""){valid = false;}
            //Email is optional, no check needed
            if($("#entry_1344549631").val()==""){valid = false;}
            if(valid){
              $("#ss-submit").click();
            }else {
              swal("Please fill in all fields.", "", "error");
            }
          });
        }
      }
    }
  });
};
