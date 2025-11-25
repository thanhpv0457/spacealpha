var div = d3.select("body").append("div").attr("class", "toolTip");

var w = 650;
var h = 400;
var r = 150;
var ir = 0;
var textOffset = 24;
var tweenDuration = 1050;

if (screen.width < 789) {
  w = screen.width - 24;;
}

if (screen.width < 480) {
  h=260; r = 80;
}

//OBJECTS TO BE POPULATED WITH DATA LATER
var lines, valueLabels, nameLabels;
var pieData = [];    
var oldPieData = [];
var filteredPieData = [];

//D3 helper function to populate pie slice parameters from array data
var donut = d3.layout.pie().value(function(d){
  return d.itemvalue;
}).sort(null);

//D3 helper function to create colors from an ordinal scale
var color = d3.scale.category10();

//D3 helper function to draw arcs, populates parameter "d" in path object
var arc = d3.svg.arc()
  .startAngle(function(d){ return d.startAngle; })
  .endAngle(function(d){ return d.endAngle; })
  .innerRadius(ir)
  .outerRadius(r);

///////////////////////////////////////////////////////////
// GENERATE FAKE DATA /////////////////////////////////////
///////////////////////////////////////////////////////////


var data = [
  {
    label: 'Public Round',
    itemvalue: 3,
    color: "#1eaf74",
    id: ''
  }, {
    label: 'Liquity & Marketing',
    itemvalue: 10,
    color: "#29ba7f",
    id: ''
  }, {
    label: 'Seed Round',
    itemvalue: 6,
    color: "#3fcf96",
    id: ''
  }, {
    label: 'Treasury',
    itemvalue: 14,
    color: "#49d9a2",
    id: ''
  }, {
    label: 'Ecosystem',
    itemvalue: 14,
    color: "#54e4ad",
    id: ''
  }, {
    label: 'Private round',
    itemvalue: 16,
    color: "#5ff0b9",
    id: ''
  }, {
    label: 'Play to earn',
    itemvalue: 17,
    color: "#6af9c4",
    id: ''
  }, {
    label: 'Team & Advisor',
    itemvalue: 12,
    color: "#85fdd0",
    id: ''
  }];

///////////////////////////////////////////////////////////
// CREATE VIS & GROUPS ////////////////////////////////////
///////////////////////////////////////////////////////////

var vis = d3.select("#pie-chart").append("svg:svg")
  .attr("width", '100%')
  .attr("height", h);

//GROUP FOR ARCS/PATHS
var arc_group = vis.append("svg:g")
  .attr("class", "arc")
  .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

  // arc_group.enter().append("svg:def")

//GROUP FOR LABELS
var label_group = vis.append("svg:g")
  .attr("class", "label_group")
  .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

//GROUP FOR CENTER TEXT  
var center_group = vis.append("svg:g")
  .attr("class", "center_group")
  .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

//PLACEHOLDER GRAY CIRCLE
// var paths = arc_group.append("svg:circle")
//     .attr("fill", "#EFEFEF")
//     .attr("r", r);

///////////////////////////////////////////////////////////
// CENTER TEXT ////////////////////////////////////////////
///////////////////////////////////////////////////////////

//WHITE CIRCLE BEHIND LABELS
var whiteCircle = center_group.append("svg:circle")
  .attr("fill", "white")
  .attr("r", ir);

///////////////////////////////////////////////////////////
// STREAKER CONNECTION ////////////////////////////////////
///////////////////////////////////////////////////////////

// to run each time data is generated
function update(data) {

  oldPieData = filteredPieData;
  pieData = donut(data);

  var sliceProportion = 0; //size of this slice
  filteredPieData = pieData.filter(filterData);
  function filterData(element, index, array) {
    element.name = data[index].label;
    element.value = data[index].itemvalue;
    sliceProportion += element.value;
    return (element.value > 0);
  }

    //DRAW ARC PATHS
    paths = arc_group.selectAll("path").data(filteredPieData);
    paths.enter().append("svg:path")
      .attr("class", "wedge")
      .attr("id", function (d, i) {return d.data.id + 'pie-' + (i + 1)})
      .attr("fill", function(d, i) { return d.data.color; })
      .on("mousemove", function(d, i){
        console.log(paths[i].attr("id"));
      })
      .transition()
        .duration(tweenDuration)
        .attrTween("d", pieTween);
    paths
      .transition()
        .duration(tweenDuration)
        .attrTween("d", pieTween);
    paths.exit()
      .transition()
        .duration(tweenDuration)
        .attrTween("d", removePieTween)
      .remove();

  paths.on("mousemove", function(d){
    div.style("left", d3.event.pageX+10+"px");
    div.style("top", d3.event.pageY-25+"px");
    div.style("display", "inline-block");
    div.html((d.data.label)+"<br>"+('$' + (d.data.itemvalue) + ' millions'));
  });

paths.on("mouseout", function(d){
    div.style("display", "none");
});




    //DRAW TICK MARK LINES FOR LABELS
    lines = label_group.selectAll("line").data(filteredPieData);
    lines.enter().append("svg:line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", -r-3)
      .attr("y2", -r-15)
      .attr("stroke", "gray")
      .attr("transform", function(d) {
        return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
      });
    lines.transition()
      .duration(tweenDuration)
      .attr("transform", function(d) {
        return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
      });
    lines.exit().remove();

    //DRAW LABELS WITH PERCENTAGE VALUES
    valueLabels = label_group.selectAll("text.value").data(filteredPieData)
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
          return 5;
        } else {
          return -7;
        }
      })
      .attr("text-anchor", function(d){
        if ( (d.startAngle+d.endAngle)/2 < Math.PI ){
          return "beginning";
        } else {
          return "end";
        }
      })
      .text(function(d){
        var percentage = (d.value/sliceProportion)*100;
        return percentage.toFixed(1) + "%";
      });

    valueLabels.enter().append("svg:text")
      .attr("class", "value").attr("id", function (d, i) {return d.data.id + 'value-' + (i + 1)})
      .attr("transform", function(d) {
        return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (r+textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (r+textOffset) + ")";
      })
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
          return 20;
        } else {
          return 5;
        }
      })
      .attr("text-anchor", function(d){
        if ( (d.startAngle+d.endAngle)/2 < Math.PI ){
          return "beginning";
        } else {
          return "end";
        }
      }).text(function(d){
        var percentage = (d.value/sliceProportion)*100;
        return percentage.toFixed(1) + "%";
      });

    valueLabels.transition().duration(tweenDuration).attrTween("transform", textTween);

    valueLabels.exit().remove();


    //DRAW LABELS WITH ENTITY NAMES
    nameLabels = label_group.selectAll("text.units").data(filteredPieData)
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
          return 17;
        } else {
          return 8;
        }
      })
      .attr("text-anchor", function(d){
        if ((d.startAngle+d.endAngle)/2 < Math.PI ) {
          return "beginning";
        } else {
          return "end";
        }
      }).text(function(d){
        return d.name;
      });

    nameLabels.enter().append("svg:text")
      .attr("class", "units").attr("id", function (d, i) {return d.data.id + 'unit-' + (i + 1)})
      .attr("transform", function(d) {
        return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (r+textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (r+textOffset) + ")";
      })
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
          return 0;
        } else {
          return -14;
        }
      })
      .attr("text-anchor", function(d){
        if ((d.startAngle+d.endAngle)/2 < Math.PI ) {
          return "beginning";
        } else {
          return "end";
        }
      }).text(function(d){
        return d.name;
      });

    nameLabels.transition().duration(tweenDuration).attrTween("transform", textTween);

    nameLabels.exit().remove();
    
}

///////////////////////////////////////////////////////////
// FUNCTIONS //////////////////////////////////////////////
///////////////////////////////////////////////////////////

// Interpolate the arcs in data space.
function pieTween(d, i) {
  var s0;
  var e0;
  if(oldPieData[i]){
    s0 = oldPieData[i].startAngle;
    e0 = oldPieData[i].endAngle;
  } else if (!(oldPieData[i]) && oldPieData[i-1]) {
    s0 = oldPieData[i-1].endAngle;
    e0 = oldPieData[i-1].endAngle;
  } else if(!(oldPieData[i-1]) && oldPieData.length > 0){
    s0 = oldPieData[oldPieData.length-1].endAngle;
    e0 = oldPieData[oldPieData.length-1].endAngle;
  } else {
    s0 = 0;
    e0 = 0;
  }
  var i = d3.interpolate({startAngle: s0, endAngle: e0}, {startAngle: d.startAngle, endAngle: d.endAngle});
  return function(t) {
    var b = i(t);
    return arc(b);
  };
}

function removePieTween(d, i) {
  s0 = 2 * Math.PI;
  e0 = 2 * Math.PI;
  var i = d3.interpolate({startAngle: d.startAngle, endAngle: d.endAngle}, {startAngle: s0, endAngle: e0});
  return function(t) {
    var b = i(t);
    return arc(b);
  };
}

function textTween(d, i) {
  var a;
  if(oldPieData[i]){
    a = (oldPieData[i].startAngle + oldPieData[i].endAngle - Math.PI)/2;
  } else if (!(oldPieData[i]) && oldPieData[i-1]) {
    a = (oldPieData[i-1].startAngle + oldPieData[i-1].endAngle - Math.PI)/2;
  } else if(!(oldPieData[i-1]) && oldPieData.length > 0) {
    a = (oldPieData[oldPieData.length-1].startAngle + oldPieData[oldPieData.length-1].endAngle - Math.PI)/2;
  } else {
    a = 0;
  }
  var b = (d.startAngle + d.endAngle - Math.PI)/2;

  var fn = d3.interpolateNumber(a, b);
  return function(t) {
    var val = fn(t);
    return "translate(" + Math.cos(val) * (r+textOffset) + "," + Math.sin(val) * (r+textOffset) + ")";
  };
}

update(data);


var hoverC = document.getElementById('pie-chart')
hoverC.onmouseover = function(e) {
  var hoverEStr = (e.target.id).slice((e.target.id).length-1, (e.target.id).length)
  var rItem = document.getElementById("r-item-" + hoverEStr);
  var valueStyle = document.getElementById("value-" + hoverEStr);
  var unitStyle = document.getElementById("unit-" + hoverEStr);
  valueStyle.classList.add('active')
  unitStyle.classList.add('active')
  rItem.classList.add('active')
}
hoverC.onmouseout = function(e) {
  var hoverEStr = (e.target.id).slice((e.target.id).length-1, (e.target.id).length)
  var rItem = document.getElementById("r-item-" + hoverEStr);
  var valueStyle = document.getElementById("value-" + hoverEStr);
  var unitStyle = document.getElementById("unit-" + hoverEStr);
  rItem.classList.remove('active')
  valueStyle.classList.remove('active')
  unitStyle.classList.remove('active')
}

function removePieElement(n) {
  var pieStyle = document.getElementById("pie-" + n);
  var valueStyle = document.getElementById("value-" + n);
  var unitStyle = document.getElementById("unit-" + n);
  pieStyle.classList.remove('active')
  valueStyle.classList.remove('active')
  unitStyle.classList.remove('active')
}
function callPieElement(n) {
  
  var pieStyle = document.getElementById("pie-" + n);
  var valueStyle = document.getElementById("value-" + n);
  var unitStyle = document.getElementById("unit-" + n);
  pieStyle.classList.add('active')
  valueStyle.classList.add('active')
  unitStyle.classList.add('active')
}