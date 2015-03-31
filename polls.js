if (Meteor.isClient) {
  UI.registerHelper('generateID', function() {
    return "#" + this._id;
  });
  Template.Ranked.rendered = function() {
    $(".sortable").sortable();
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
        var str =
            "<div>" +
            "  <div class='btn-group' data-toggle='buttons'>" +
            "    <label class='btn btn-default'>" +
            "      <input type='radio' value='mcPoll' name='poll1' /> Multiple Choice" +
            "    </label>" +
            "    <label class='btn btn-default'>" +
            "      <input type='radio' value='ranked' name='poll1'/> Ranked Choice" +
            "    </label>" +
            "  </div><br/><br/>" +
            "  <input type='text' class='form-control' name='title' placeholder='Poll Title'/>" +
            "  <textarea class='form-control' name='description' placeholder='Poll Description'></textarea><br/>" +
            "  <label>Choices:</label><br/>" +
            "  <input type='text' class='form-control' name='choices[]' placeholder='Choice'/>" +
            "  <button class='btn btn-warning' id='addField'>+</button><br/><br/>" +
            "  <label>Required Votes: " +
            "    <input style='text-align:center;width:30px;' type='text' name='voteReq' placeholder='0' />" +
            "  </label>" +
            "  <label>Start time:" +
            "    <div class='input-group datetimepicker' id='startTime'>" +
            "      <input type='text' class='form-control' />" +
            "      <span class='input-group-addon'><span class='glyphicon glyphicon-calendar'></span></span>" +
            "    </div>"+
            "  </label>" +
            "  <label>End time:" +
            "    <div class='input-group datetimepicker' id='endTime'>" +
            "      <input type='text' class='form-control' />" +
            "      <span class='input-group-addon'><span class='glyphicon glyphicon-calendar'></span></span>" +
            "    </div>"+
            "  </label>" +
            "</div>" +
            ""
        var object = $('<div/>').html(str).contents();
        object.find('#addField').click(function() {
          $('#addField').before("<input type='text' class='form-control' name='choices[]' placeholder='Choice'/>");
        });
        object.find('#startTime').datetimepicker();
        object.find('#endTime').datetimepicker();
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
              var pollData={};
              var type = $('input[name=poll1]:checked').val();
              var title = $('input[name=title]').val();
              var choices = $("input[name='choices\\[\\]']").map(function(){return $(this).val();}).get();
              var voteReq = $('input[name=voteReq]').val();
              var desc = $('textarea[name=description]').val();

              if(type=='mcPoll')      pollData.type = "MultipleChoice";
              else if(type=='ranked') pollData.type = "Ranked";
              else {
                swal('Error','Please select a type.','error'); return;
              }

              if(title)
                pollData.title = title.toLowerCase().replace(/([^a-z])([a-z])(?=[a-z]{2})|^([a-z])/g, function(_, g1, g2, g3){return (typeof g1 === 'undefined') ? g3.toUpperCase() : g1 + g2.toUpperCase(); } );
              else {
                swal('Error','Please add a title.','error'); return;
              }

              if(choices) pollData.choices = choices;
              else {
                swal('Error','Please add choices.','error'); return;
              }

              if(voteReq){
                var isNum = /^\+?[1-9]\d*$/.test(voteReq);
                if (isNum) pollData.voteReq = parseInt(voteReq);
                else {
                  swal('Error','The vote requirement must be a positive, non-zero number.','error'); return;
                }
              }
              else {
                swal('Error','Please set a vote requirement.','error'); return;
              }

              // This should probably be put into jobs but I'm really lazy xD
              pollData.startTime = $("#startTime").data("DateTimePicker").date()
              pollData.endTime = $("#endTime").data("DateTimePicker").date()

              pollData.completed = false;
              pollData.creator = Meteor.userId();
              pollData.votes = {};
              pollData.voteNum = 0;
              pollData.desc = desc;
              var id = PollsData.insert(pollData);

              if (pollData.startTime) Meteor.call("updatePollStatus", id, false, pollData.startTime.valueOf());
              if (pollData.endTime) Meteor.call("updatePollStatus", id, true, pollData.endTime.valueOf());

              swal('Added!','','success');
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
    $('.showIfCreatorNewPoll').hide();
    var pollArr = PollsData.find({completed: false}).fetch();
    for(i=0;i<pollArr.length;i++){
      if(pollArr[i].creator==Meteor.userId()){
        $('#'+pollArr[i]._id+'container .showIfCreatorNewPoll').show();
      }
    }
  }
  Template.NewPoll.events = {
    'click button[name=closePoll]': function(e) {
      var pollid = $('.panel-collapse.collapse.in').attr('id').substring(0,17);
      bootbox.confirm("Closing poll, are you sure? You can reopen it in the Completed Polls section.", function(result){
        if(result){
          PollsData.update({_id: pollid}, {$set: {completed: true}});
        }
      });
    },
    'click button[name=deletePoll]': function(e) {
      var pollid = $('.panel-collapse.collapse.in').attr('id').substring(0,17);
      bootbox.confirm("Deleting poll, are you sure? This cannot be reverted", function(result){
        if(result){
          PollsData.remove({_id: pollid});
        }
      });
    }
  }
  Template.MultipleChoice.events = {
    'click input[type=submit]': function(e) {
      e.preventDefault();
      var val = $("input[name='poll1']:checked").val();
      var pollid = $('.panel-collapse.collapse.in').attr('id').substring(0,17);
      var pol = PollsData.findOne({_id: pollid});

      if (!pol.votes[Meteor.userId()])
        pol.voteNum = pol.voteNum + 1;
      pol.votes[Meteor.userId()] = val;
      if(pol.voteNum > pol.voteReq) {
        PollsData.update({_id: pollid}, {$set: {completed: true}});
        swal("Sorry!", "The poll has closed", "error");
        return;
      }
      if(pol.voteNum == pol.voteReq) {
        PollsData.update({_id: pollid}, {$set: {completed: true}});
      }
      PollsData.update({_id: pollid}, {$set: {votes: pol.votes, voteNum: pol.voteNum}});

      swal("Thank You!", "Your vote was recorded", "success");
    }
  }
  Template.Ranked.events = {
    'click input[type=submit]': function(e) {
      e.preventDefault();
      var pollid = $('.panel-collapse.collapse.in').attr('id').substring(0,17);
      var pol = PollsData.findOne({_id: pollid});
      var res = $(".sortable").sortable('toArray');
      var voted = false;

      if (!pol.votes[Meteor.userId()])
        pol.voteNum = pol.voteNum + 1;
      pol.votes[Meteor.userId()] = res;
      if(pol.voteNum > pol.voteReq) {
        PollsData.update({_id: pollid}, {$set: {completed: true}});
        swal("Sorry!", "The poll has closed", "error");
        return;
      }
      if(pol.voteNum == pol.voteReq) {
        PollsData.update({_id: pollid}, {$set: {completed: true}});
      }
      PollsData.update({_id: pollid}, {$set: {votes: pol.votes, voteNum: pol.voteNum}});

      swal("Thank You!", "Your vote was recorded", "success");
    }
  }
  Template.CompletedPoll.rendered = function(){
    $('.showIfCreatorCompletedPoll').hide();
    var pollArr = PollsData.find({completed: true}).fetch();
    for(i=0;i<pollArr.length;i++){
      if(pollArr[i].creator==Meteor.userId()){
        $('#'+pollArr[i]._id+'container .showIfCreatorCompletedPoll').show();
      }
    }
  }
  Template.CompletedPoll.events = {
    'click button[name=reopenPoll]': function(e) {
      var pollid = $('.panel-collapse.collapse.in').attr('id').substring(0,17);
      bootbox.confirm("Reopening poll, are you sure?", function(result){
        if(result){
          PollsData.update({_id: pollid}, {$set: {completed: false}});
        }
      });
    },
    'click button[name=deletePoll]': function(e) {
      var pollid = $('.panel-collapse.collapse.in').attr('id').substring(0,17);
      bootbox.confirm("Deleting poll, are you sure? This cannot be reverted", function(result){
        if(result){
          PollsData.remove({_id: pollid});
        }
      });
    }
  }
  Template.CompletedPoll.helpers({
    resultsChart: function() {
      if (this.type == "MultipleChoice") {
        if (!this.results) {
          this.results = {};
          for (i=0; i < this.choices.length; i++)
            this.results[this.choices[i]] = 0;
          for (voter in this.votes)
            this.results[this.votes[voter]] += 1;
          this.winner = 0;
          for (i=0; i<this.choices.length; i++) {
            if (this.results[this.choices[i]] > this.results[this.choices[this.winner]])
              this.winner = i;
          }
          PollsData.update({_id: this._id}, {$set: {results: this.results, winner: this.winner}});

        }
        var resultsArr = [];
        for (choice in this.results) {
          var result = [];
          result.push(choice);
          result.push(this.results[choice]);
          resultsArr.push(result);
        }
        return {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
          },
          title: { text: 'Winner: ' + this.choices[this.winner]},
          tooltip: { pointFormat: '<b>{point.percentage:.1f}%</b>'},
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
      else if (this.type = "Ranked") {
        if (!this.results) {
          this.results = {};
          this.winner = undefined;
          var rejected = {};
          for (i=0; i < this.choices.length; i++) {
            this.results[this.choices[i]] = [];
            rejected[this.choices[i]] = false;
            for (j=0; j < this.choices.length; j++)
              this.results[this.choices[i]].push(0);
          }
          for (voter in this.votes) {
            for (i in this.votes[voter])
              this.results[this.votes[voter][i]][i] += 1;
          }

          var choice_inv = _.invert(this.choices);
          for (i=0; i<this.choices.length; i++) {
            var majority = _.map(this.choices, function(i) {return 0;});
            var loser = 0;

            for (voter in this.votes) {
              var k = 0;
              while (rejected[this.votes[voter][k]]) k++;
              majority[choice_inv[this.votes[voter][k]]] += 1;
            }
            for (k=0; k<this.choices.length; k++) {
              if (majority[k] > this.voteNum/2) this.winner = k;
              if (majority[k] <= majority[loser]) loser = k;
            }
            if (this.winner != undefined) break;
            else rejected[this.choices[loser]] = true;
          }
          PollsData.update({_id: this._id}, {$set: {results: this.results, winner: this.winner}});

        }
        var resultsArr = [];
        for (choice in this.results) {
          resultsArr.push({
            name: choice,
            data: this.results[choice],
          });
        }

        var xaxis = [];
        for (i=0; i< this.choices.length; i++) xaxis.push(i+1);
        return {
          chart: { type: 'column' },
          title: { text: 'Winner: ' + this.choices[this.winner]},
          credits: { enabled: false },
          xAxis: { 
            categories: xaxis,
            title: { text: "Number of votes for each option at each position"},
          },
          yAxis: {
            min: 0,
            title: { text: "Number of votes"},
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                         '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            }
          },
          series: resultsArr,
        };
      }
    }
  });
}
