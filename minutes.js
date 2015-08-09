if(Meteor.isClient){
  Meteor.subscribe('posts_data');
  Template.Minutes.helpers({
    posts: function(){
      return PostsData.find({},{sort: {"publishedDate": -1}});
    }
  });

  Template.addPost.helpers({
    editDoc: function(){
      return PostsData.findOne(Blog._editing.get());
    },
    formMode: function(){
      return !!Blog._editing.get() ? "update" : "insert";
    }
  });

  AutoForm.addHooks(['addPost'], {
    after: {
      insert: function(error, result) {
        if (error) {
          console.log("Insert Error:", error);
        } else {
          console.log("Insert Result:", result);
          Router.go('editBlogPost', {'id': result});
        }
      },
      update: function(error) {
        if (error) {
          console.log("Update Error:", error);
        } else {
          console.log("Updated!");
        }
      }
    }
  });

}
