if (Meteor.isClient) {
  UI.registerHelper('generateID', function() {
    return "#" + this._id;
  });
  Template.Ranked.rendered = function() {
    $("#sortable").sortable();
  }
  Template.Polls.helpers({
    activePolls: function() {
      return PollsData.find({completed: false}).fetch();
    },
    completedPolls: function() {
      return PollsData.find({completed: true}).fetch();
    }
  });
  Template.Polls.events = {
    'click button[name=addPoll]': function(e) {
      function bootboxContent() {
        var str ="<div>\
          <p>Type:\
            <input type='radio' value='mcPoll' name='poll1'> Multiple Choice</input>\
            <input type='radio' value='ranked' name='poll1'> Ranked</input></p>\
          <p>Title:<input type='text' name='title'></input></p>\
          <p>Choices:</p>\
            <p><input type='text' name='choices[]'></input></p>\
            <button class='btn btn-warning' id='addField'>+</button>\
          <p>Required Votes:\
            <input style='text-align:center;width:30px;' type='text' name='voteReq' placeholder='0'></input>\
          </p>\
        </div>"
        var object = $('<div/>').html(str).contents();
        object.find('#addField').click(function() {
          $('#addField').before("<p><input type='text' name='choices[]'></input></p>");
        });
        return object;
      }
      bootbox.dialog({
        backdrop: false,
        message: bootboxContent,
        className: 'form-width',
        title: 'New Poll',
        buttons: {
          main: {
            label: 'Add',
            className: 'btn btn-primary',
            callback: function() {
              var pollData={}; var add = true;
              var type = $('input[name=poll1]:checked').val();
              var title = $('input[name=title]').val();
              var choices = $("input[name='choices\\[\\]']").map(function(){return $(this).val();}).get();
              var voteReq = $('input[name=voteReq]').val();
              if(type=='mcPoll'){
                pollData.type = "MultipleChoice";
              }else if(type=='ranked'){
                pollData.type = "Ranked";
              }else {
                add = false;
                swal('Error','Please select a type.','error');
              }
              if(title){
                pollData.title = title.toLowerCase().replace(/([^a-z])([a-z])(?=[a-z]{2})|^([a-z])/g, function(_, g1, g2, g3){return (typeof g1 === 'undefined') ? g3.toUpperCase() : g1 + g2.toUpperCase(); } );
              }else {
                add = false;
                swal('Error','Please add a title.','error');
              }
              if(choices){
                pollData.choices = choices;
                pollData.results = [];
                for(i=0;i<choices.length;i++){
                  pollData.results.push(0);
                }
              }else {
                add = false;
                swal('Error','Please add choices.','error');
              }
              if(voteReq){
                var isNum = /^\+?[1-9]\d*$/.test(voteReq);
                if(isNum){
                  pollData.voteReq = parseInt(voteReq);
                }else {
                  add = false;
                  swal('Error','The vote requirement must be a positive, non-zero number.','error');
                }
              }else {
                add = false;
                swal('Error','Please set a vote requirement.','error');
              }
              pollData.completed = false;
              pollData.creator = Meteor.userId();
              pollData.voters = [];
              if(add){
                PollsData.insert(pollData);
                swal('Added!','','success');
              }
            }
          },
          secondary: {
            label: 'Cancel',
            className: 'btn btn-secondary',
            callback: function() {}
          }
        }
      });
    }
  }
  Template.NewPoll.rendered = function(){
    $('.showIfCreator').hide();
    var pollArr = PollsData.find({completed: false}).fetch();
    for(i=0;i<pollArr.length;i++){
      if(pollArr[i].creator==Meteor.userId()){
        $('#'+pollArr[i]._id+' .showIfCreator').show();
      }
    }
  }
  Template.NewPoll.events = {
    'click button[name=closePoll]': function(e) {
      var pollid = $('.panel-collapse.collapse.in').attr('id');
      bootbox.confirm("Are you sure?", function(result){
        if(result){
          PollsData.update({_id: pollid}, {$set: {completed: true}});
        }
      });
    }
  }
  Template.MultipleChoice.events = {
    'click input[type=submit]': function(e) {
      e.preventDefault();
      var val = $("input[name='poll1']:checked").val();
      var pollid = $('.panel-collapse.collapse.in').attr('id');
      var pol = PollsData.find({_id: pollid}).fetch()[0];
      var voted = false;
      for(i=0;i<pol.voters.length;i++){
        if(pol.voters[i] == Meteor.userId()){
          voted = true;
        }
      }
      if(!voted){
        var voteArr = [];
        for(i=0;i<pol.voters.length;i++){
          voteArr.push(pol.voters[i]);
        }
        voteArr.push(Meteor.userId());
        PollsData.update({_id: pollid}, {$set: {voters: voteArr}});
        var num; var sum = 0;
        for(i=0;i<pol.choices.length;i++){
          if(pol.choices[i]===val){num = i;}
        }
        pol.results[num] = pol.results[num] + 1;
        for(i in pol.results) {sum+=pol.results[i]}
        if(sum>pol.voteReq){
          PollsData.update({_id: pollid}, {$set: {completed: true}});
        }else if(sum==pol.voteReq){
          PollsData.update({_id: pollid}, {$set: {completed: true}});
          PollsData.update({_id: pollid}, {$set: {results: pol.results}});
        }else {
          PollsData.update({_id: pollid}, {$set: {results: pol.results}});
        }
        swal("Thank You!", "Your vote was recorded", "success");
      }else{
        swal("You've already voted!","","error");
      }
    }
  }
  Template.Ranked.events = {
    'click input[type=submit]': function(e) {
      e.preventDefault();
      var pollid = $('.panel-collapse.collapse.in').attr('id');
      var pol = PollsData.find({_id: pollid}).fetch()[0];
      var res = $("#sortable").sortable('toArray');
      for(i=0;i<res.length;i++){
        for(j=0;j<pol.choices.length;j++){
          if(res[i]==pol.choices[j]){pol.results[j] = res.length - i;}
        }
      }
      var sum = pol.voteCount + 1;
      if(sum>pol.voteReq){
        PollsData.update({_id: pollid}, {$set: {completed: true}});
      }else if(sum==pol.voteReq){
        PollsData.update({_id: pollid}, {$set: {completed: true}});
        PollsData.update({_id: pollid}, {$set: {results: pol.results}});
      }else {
        PollsData.update({_id: pollid}, {$set: {voteCount: sum}});
        PollsData.update({_id: pollid}, {$set: {results: pol.results}});
      }
      swal("Thank You!", "Your vote was recorded", "success");
    }
  }
  Template.CompletedPoll.helpers({
    resultsChart: function() {
      var resultsArr = [];
      for(i=0;i<this.choices.length;i++){
        var result = [];
        result.push(this.choices[i]);
        result.push(this.results[i]);
        resultsArr.push(result);
      }
      return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
        },
        title: {
            text: 'Results'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Results',
            data: resultsArr
        }]
      };
    }
  });
}
