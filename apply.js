if (Meteor.isClient) {
  Template.Apply.helpers({
    uploaded: function() {
      return {
        finished: function(index, fileInfo, context) {
          $('#entry_1253155548').val(fileInfo.name);
          $('#submit_brown').show();
          $('#submit_brown').click(function() {
            var valid = true;
            if($("#entry_1751668997").val()==""){valid = false;}
            if($("#entry_1643291388").val()==""){valid = false;}
            if(!$("input[name='entry.1370385546']").is(":checked")){valid = false;}
            if($("#entry_1461977651").val()==""){valid = false;}
            if($("#entry_2078331929").val()==""){valid = false;}
            if(!$("input[name='entry.1402613261']").is(":checked")){valid = false;}
            if($("#entry_1253155548").val()==""){valid = false;}
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
