if (Meteor.isClient) {
  Template.Apply.helpers({
    uploaded: function() {
      return {
        finished: function(index, fileInfo, context) {
          console.log(fileInfo.name);
          $('#entry_1344549631').val(fileInfo.name);
          $('#submit_brown').show();
          $('#submit_brown').click(function() {
            var valid = true;
            var wrongReg = false;

            if($("#entry_330501359").val()==""){valid = false;}
            if($("#entry_940862617").val()==""){valid = false;}
            if(!$("input[name='entry.1958161708']").is(":checked")){valid = false;}
            if($("#entry_585078888").val()==""){valid = false;}
            if(!$("input[name='entry.1407320545']").is(":checked")){valid = false;}
            //if($("#entry_2077898466").val()==""){valid = false;}
            //Email is optional, no check needed
            if($("#entry_1344549631").val()==""){valid = false;}

            //Regex to check if file name is only computing id
            //Note, length check includes 5-6 characters for id, 4 for .pdf, and 4 for 
            // \s(\d) (Space followed by number in paranthesis)
            var fileName = $("#entry_1344549631").val();
            var computing_reg = /[A-Za-z][A-Za-z][A-Za-z0-9][A-Za-z0-9][A-Za-z0-9][A-Za-z0-9]?/ig;
            if (!computing_reg.test(fileName) || fileName.length >14) {
              wrongReg = true;
              valid = false;
            }
            if(valid){
              $("#ss-submit").click();
              var email = $("#entry_2077898466").val().trim();
              var computing_id = $("#entry_585078888").val().trim();
              var computing_email = computing_id + '@virginia.edu';
              var text = "We have received your application from Brown!";
              if (email !=  "") {
                 Meteor.call('appConfirmationEmail', text, email);
              }
              Meteor.call('appConfirmationEmail', text, computing_email);

            }else if (wrongReg) {
              swal("Your file name needs to be soley your NetBadge ID \(ex: brc2bg.pdf\)", "", "error");
            }else {
              swal("Please fill in all fields.", "", "error");
            }
          });
        }
      }
    }
  });
};
