
$(".bl-icon-about").text("Current unemployment rate:");


var margin = {top: 20, right: 20, bottom: 50, left: 100},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;
var parseTime = d3.timeParse("%Y-%m-%d");
transitionTime = 2500; // What feels best? Should it always be the same?


function api(){
	// Call local JSON file to get most recent value.
	var currentue;
	d3.json("unemployment.json", function(data) {
	  var currentue = data['observations'][0]['value'];
	  d3.select(".bl-icon-about").append('p').text(currentue+'%');
	});
};

function draw() {

	if (d3.select("#emp_chart").empty()){
		console.log("empty first time");
	}
	else{
		d3.select('#emp_chart').remove();
		console.log('exists?')
	}
	var svg = d3.select('#ue_chart').append("svg")
	  .attr('id', 'emp_chart')
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform",
	        "translate(" + margin.left + "," + margin.top + ")");
	var parseTime = d3.timeParse("%Y-%m-%d");
	var how_far_below_min_for_y_scale = .1;
	var percentFormat = d3.format(".1%"); 

	d3.json("unemployment.json", function(data) {
		arr = data['observations']
		arr.forEach(function(d){
			d.ue = +d.value/100;
			d.date = parseTime(d.date)
		});

	var xx = d3.scaleTime().range([0, width]);
   	var yy = d3.scaleLinear().range([height, 0]);

  	function axes_labels(xAxis, yAxis, x_axis_label, y_axis_label){
	    // Axes labels:
	    // X axis label:
	    xAxis.append("text")             
	      .attr("transform",
	            "translate(" + (width/2) + " ," + 
	                           (margin.top + 20) + ")")
	      .style("text-anchor", "middle")
	      .style('fill','black')
	      .text(x_axis_label);
	    // Y axis label
	    xAxis.append("text").attr("transform", "rotate(-90)")
	      .attr("y", -3*margin.top)
	      .attr("x",(height / 2))
	      .attr("dy", "1em")
	      .style("text-anchor", "middle")
	      .style('fill','black')
	      .text(y_axis_label); 
  	};

    function addInitialAxes(x_axis_series, y_axis_series){
	    xx.domain(d3.extent(arr, function(d) { return d[x_axis_series]; }));
	    yy.domain([d3.min(arr, function(d) { return d[y_axis_series]; }) - 
	      how_far_below_min_for_y_scale*d3.min(arr, function(d) { return d[y_axis_series]; }), 
	        d3.max(arr, function(d) { return d[y_axis_series]; })]);

	    // Add the Y Axis initially
	    var yAxis = svg.append("g")
	      .attr('id', 'unemployment_axis')
	      .call(d3.axisLeft().tickFormat(percentFormat).scale(yy));
	    // Add the X Axis
	    var xAxis = svg.append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .attr('id','xaxis')
	      .call(d3.axisBottom(xx).ticks(10).tickFormat(d3.timeFormat("%Y")));
	    // Call axes_labels function to add labels.
	    axes_labels(xAxis,yAxis,'Date', 'Percent (%)');
  	}
  	addInitialAxes('date', 'ue');

	function draw_line(data, x, y, color, line_id){
	    xx.domain(d3.extent(arr, function(d) { return d[x]; }));
	    yy.domain([d3.min(arr, function(d) { return d[y]; }) - 
	      how_far_below_min_for_y_scale*d3.min(arr, function(d) { return d[y]; }), 
	        d3.max(arr, function(d) { return d[y]; })]);
	    path = svg.append("path")
	          .datum(arr)
	          .attr("fill", "none")
	          .attr("id", line_id)
	          .attr("class", "path")
	          .attr("stroke", color)
	          .attr("stroke-linejoin", "round")
	          .attr("stroke-linecap", "round")
	          .attr("stroke-width", 2.5)
	          .attr("d", d3.line()
	            .x(function(d) { return xx(d[x]); })
	            .y(function(d) { return yy(d[y]); }));

	    // Mechanism for animating line path left to right.
	    // totalLength = path.node().getTotalLength();
	    // console.log(totalLength);
	    // path
	    //   .attr("stroke-dasharray", totalLength + " " + totalLength)
	    //   .attr("stroke-dashoffset", totalLength)
	    //   .transition()
	    //   .duration(transitionTime)
	    //   .attr("stroke-dashoffset", 0);
  	};

  	draw_line(data, 'date', 'ue', 'steelblue', 'id');
// Close d3.json()
});
// Close draw() function.
};
