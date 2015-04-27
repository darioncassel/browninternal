if (Meteor.isClient) {
  Template.Apply.helpers({
    filedata: function() {
      /*
      var data = {
        name: $('#entry_1751668997').val(),
        id:$('#entry_1461977651').val()
      };
      console.log(data);
      */
      //return {name: $('#entry_1751668997').val(), id:$('#entry_1461977651').val()}
      /*
      $('.upload-control').click(function() {
        console.log("clicked");
        var data = {
          name: $('#entry_1751668997').val(),
          id: $('#entry_1461977651').val(),
          test: "test"
        };
        console.log(data);
        return data;
      });
      */
      //return {name:'#entry_1751668997', id:'#entry_1461977651'}
    },
    uploaded: function() {
      return {
        finished: function(index, fileInfo, context) {
          $('#entry_1253155548').val(fileInfo.name);
          $('#ss-submit').show();
        }
      }
    }
  });
};
