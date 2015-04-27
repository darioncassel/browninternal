if (Meteor.isClient) {
  Template.Apply.helpers({
    uploaded: function() {
      return {
        finished: function(index, fileInfo, context) {
          console.log(fileInfo);
          $('#entry_1253155548').val(fileInfo.name);
          console.log($('#entry_1253155548').val());
          $('#ss-submit').show();
        }
      }
    }
  });
};
