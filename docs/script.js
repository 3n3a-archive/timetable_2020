var schedule = {
  initialize: function(){
    schedule.activities.set();
    
  }, 
  options: {
    schedule: '#schedule', 
    // lessons and their breaks

    breaks: [ //0, // before school
              5, // lesson 1
              20, // lesson 2
              5, // lesson 3
              10, // lesson 4
              5, // lesson 5
              15, // lesson 6
              5, // lesson 7
              15, // lesson 8
              5, // lesson 9
              5, // lesson 10
              0, // lesson 11
              ],
    s_breaks: [525, 575, 640, 690, 745, 795, 855, 905, 965, 1015, 1065], // the time after which the break begins
    
    lesson_time: 45, // lesson duration (minutes)
    lessons: 11, // number of lessons per day
    start: function(){ // start at 8.00
      return schedule.general.toMin(8,0)
    }, 
    end: function(){ // start at 17.45
      return schedule.general.toMin(17,45)
    },
    h_width: $('.s-hour-row').width(), // get a width of hour div
    minToPx: function(){ // divide the box width by the duration of one lesson
      return schedule.options.h_width / schedule.options.lesson_time;
    },
  },
  general: {
    hoursRegEx: function(hours){
      var regex = /([0-9]{1,2}).([0-9]{1,2})-([0-9]{1,2}).([0-9]{1,2})/;
      if(regex.test(hours)){
        return true;
      }else{
        return false;
      }
      
    },
    toMin: function(hours, minutes, string){ 
      // change time format (10,45) to minutes (645)
      if(!string){
        return (hours * 60) + minutes;
      }
      
      if(string.length>0){
        // "7.10"
        var h = parseInt(string.split('.')[0]),
            m = parseInt(string.split('.')[1]);
        
        return schedule.general.toMin(h, m);
      }
    },
    getPosition: function(start, duration, end){
      var translateX = (start - schedule.options.start()) * schedule.options.minToPx(),
          width = duration * schedule.options.minToPx(),
          breaks = schedule.options.breaks,
          s_breaks = schedule.options.s_breaks;
      
      $.each(breaks, function(index, item) { 
        if( start < s_breaks[index] && duration > item && end > (s_breaks[index]+item) ){
          width -= item * schedule.options.minToPx();
        }
        if( start > s_breaks[index] && duration > item && end > (s_breaks[index]+item) ){
          translateX -= item * schedule.options.minToPx();
        }
      }); 
      
      return [translateX, width];
    }
  },
  activities: {
    find: function(week, hours, id){
      
    },
    delete: function(week, hours){
      /* week: 0-4 << remove all activities from a day 
         hours: "7.10-16.10" << remove all activities from a choosed hours
      */
      function finalize(message){
        if(confirm(message)){
          return true;
        }
      }
      
      if(week && !hours){
        if(finalize("Do you want to delete all activities on the selected day?")){
          $('.s-activities .s-act-row:eq('+ week +')').empty();
        }
      }
      
      if(!week && !hours){
        console.log('Error. You have to add variables like a week (0-4) or hours ("9.10-10.45")!')
      }
      // if day is not defined and hours has got a correct form
      if(!week && schedule.general.hoursRegEx(hours)){
        
          console.log('Week not defined and hours are defined!');
        
          $(schedule.options.schedule + ' .s-act-tab').each(function(i,v){
              var t = $(this), // get current tab
                  name = t.children('.s-act-name').text(), // get tab name
                  h = t.attr('data-hours').split('-'), // get tab hours
                  s = schedule.general.toMin(0,0, h[0]), // get tab start time (min)
                  e = schedule.general.toMin(0,0, h[1]), // get tab end time (min)
                  uh = hours.split('-'), // user choosed time
                  us = schedule.general.toMin(0,0, uh[0]), // user choosed start time (min)
                  ue = schedule.general.toMin(0,0, uh[1]); // user choosed end time (min)

              if(us<=s && ue>=e){
                 $(this).remove();
              }

            })
        
      }
    
      if(week && hours){
        // if week and hours is defined 
        console.log('Week is defined and hours are defined too!');
        
        $('#schedule .s-act-row:eq('+ week +') .s-act-tab').each(function(i,v){
              var t = $(this), // get current tab
                  name = t.children('.s-act-name').text(), // get tab name
                  h = t.attr('data-hours').split('-'), // get tab hours
                  s = schedule.general.toMin(0,0, h[0]), // get tab start time (min)
                  e = schedule.general.toMin(0,0, h[1]), // get tab end time (min)
                  uh = hours.split('-'), // user choosed time
                  us = schedule.general.toMin(0,0, uh[0]), // user choosed start time (min)
                  ue = schedule.general.toMin(0,0, uh[1]); // user choosed end time (min)

              if(us<=s && ue>=e){
                 $(this).remove();
              }

          })
        
        
      };
      
    },
    add: function(week, lesson, hours, classroom, group, teacher, color){
      /* EXAMPLES --> week: 0-4, lesson: "Math", hours: "9.45-12.50", 
      classroom: 145, group: "A", teacher: "A. Badurski", color: "orange" */
      var tab = "<div class='s-act-tab "+ color +"' data-hours='"+ hours +"'>\
            <div class='s-act-name'>"+ lesson +"</div>\
            <div class='s-wrapper'>\
              <div class='s-act-teacher'>"+ teacher +"</div>\
              <div class='s-act-room'>"+ classroom +"</div>\
              <div class='s-act-group'>"+ group +"</div>\
            </div>\
          </div>";
      $('.s-activities .s-act-row:eq('+ week +')').append(tab);
      schedule.activities.set();
    },
    set: function(){
      $(schedule.options.schedule + ' .s-act-tab').each(function(i){
        var hours = $(this).attr('data-hours').split("-"),
            start = /* HOURS */ parseInt(hours[0].split(".")[0]*60) 
            + /* MINUTES */ parseInt(hours[0].split(".")[1]),
            end = /* HOURS */ parseInt(hours[1].split(".")[0]*60) 
            + /* MINUTES */ parseInt(hours[1].split(".")[1]),
            duration = end - start,
            translateX = schedule.general.getPosition(start,duration,end)[0],
            width = schedule.general.getPosition(start,duration,end)[1];

        $(this)
          .attr({"data-start": start, "data-end": end})
          .css({"transform": "translateX("+translateX+"px)", "width": width+"px"});
      });
    }
  }
  
}

schedule.initialize();