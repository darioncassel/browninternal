if (Meteor.isClient) {
  Template.Apply.helpers({
    uploaded: function() {
      return {
        finished: function(index, fileInfo, context) {
          $('#entry_955211999').val(fileInfo.name);
          $('#submit_brown').show();
          $('#submit_brown').click(function() {
            var valid = true;
            if($("#entry_1729943190").val()==""){valid = false;}
            if($("#entry_1352770139").val()==""){valid = false;}
            if(!$("input[name='entry.257589673']").is(":checked")){valid = false;}
            if($("#entry_592522003").val()==""){valid = false;}
            //if($("#entry_419154489").val()==""){valid = false;}
            if(!$("input[name='entry.770152780']").is(":checked")){valid = false;}
            if($("#entry_955211999").val()==""){valid = false;}
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
