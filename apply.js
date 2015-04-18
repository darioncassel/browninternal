if (Meteor.isClient) {
  Template.Apply.helpers({
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
