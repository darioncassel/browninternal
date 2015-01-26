// Helper functions

trimInput = function(value) {
    return value.replace(/^\s*|\s*$/g, '');
}

function intersects(m1, m2){
  //[ ( ) ]
  if(moment(m1.start)<=moment(m2.start)&&moment(m1.end)>=moment(m2.end)){
    return true;
  //[ ( ] )
  }else if(moment(m1.start)<=moment(m2.start)&&moment(m1.end)>=moment(m2.start)&&moment(m1.end)<=moment(m2.end)){
    return true;
  //( [ ) ]
  }else if(moment(m1.start)>=moment(m2.start)&&moment(m1.start)<=moment(m2.end)&&moment(m1.end)>=moment(m2.end)){
    return true;
  //( [ ] )
  }else if(moment(m1.start)>=moment(m2.start)&&moment(m1.start)<=moment(m2.end)&&moment(m1.end)<=moment(m2.end)&&moment(m1.end)>=moment(m2.start)){
    return true;
  //( ) [ ]
  }else {
    return false;
  }
}
