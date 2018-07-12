// Wrk flow

// -- Add if to tile front
// -- Add selector and title text

function load_page(){
	$("#uerate").text("Current unemployment rate:");
	api('unemployment.json', '#uerate', true);

	$("#civpart").text("Civilian Labor Force Participation Rate:");
	api('civpart.json', '#civpart', convert_to_percent = true);

	$("#cpi").text("Current consumer price index:");
	api('cpi.json', '#cpi');

	$("#sp500").text("S&P 500:");
	api('sp500.json', '#sp500');

	$("#ffr").text("Federal Funds Rate:");
	api('ffr.json', '#ffr', convert_to_percent = true);

	$("#tpahe").text("Average Hourly Earnings of All Employees: Total Private:");
	api('tpahe.json', '#tpahe', convert_to_percent = 'dollar');

	
};

// load_page();

var margin = {top: 20, right: 20, bottom: 50, left: 100},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;
var parseTime = d3.timeParse("%Y-%m-%d");
transitionTime = 2500; // What feels best? Should it always be the same?


function api(data, selector, convert_to_percent){
	// Call local JSON file to get most recent value.

	// convert_to_percent = true, false, or 'dollar' if this is
	// a $ amount. 
	var value;
	d3.json(data, function(data) {
	  var value = data['observations'][0]['value'];
	  if (convert_to_percent == true) {
	  	d3.select(selector).append('p').text(value+'%');
	  }
	  else if (convert_to_percent == 'dollar') {
	  	d3.select(selector).append('p').text('$'+value);
	  }
	  else {
	  	d3.select(selector).append('p').text(value);
	  }
	});
};

function draw(data, selector, chart_id, convert_to_percent) {

	if (d3.select('#x').empty()){
		console.log("empty first time");
	}
	else{
		d3.select('#x').remove();
		console.log('exists?')
	}
	var svg = d3.select('#'+chart_id).append("svg")
	  .attr('id', 'x')
	  .attr('class', 'line_chart')
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform",
	        "translate(" + margin.left + "," + margin.top + ")");
	var parseTime = d3.timeParse("%Y-%m-%d");
	var how_far_below_min_for_y_scale = .1;
	var percentFormat = d3.format(".1%"); 

	d3.json(data, function(data) {
		arr = data['observations']
		arr.forEach(function(d){
			if (convert_to_percent == true) {
				d.value = +d.value/100;
				d.date = parseTime(d.date)
			}
			else {
				d.value = +d.value;
				d.date = parseTime(d.date)
				console.log(d)
			}			
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

    function addInitialAxes(x_axis_series, y_axis_series, convert_to_percent) {
	    xx.domain(d3.extent(arr, function(d) { return d[x_axis_series]; }));
	    yy.domain([d3.min(arr, function(d) { return d[y_axis_series]; }) - 
	      how_far_below_min_for_y_scale*d3.min(arr, function(d) { return d[y_axis_series]; }), 
	        d3.max(arr, function(d) { return d[y_axis_series]; })]);

	    if (convert_to_percent == true) {
	    	var yAxis = svg.append("g")
	      .attr('id', 'unemployment_axis')
	      .call(d3.axisLeft().tickFormat(percentFormat).scale(yy));
	    }
	    else {
	    	var yAxis = svg.append("g")
	      .attr('id', 'unemployment_axis')
	      .call(d3.axisLeft().scale(yy));
	    }

	    var xAxis = svg.append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .attr('id','xaxis')
	      .call(d3.axisBottom(xx).ticks(20).tickFormat(d3.timeFormat("%m-%y")));
	    // Call axes_labels function to add labels.
	    if (convert_to_percent == true) {
	    	axes_labels(xAxis,yAxis,'Date', 'Percent (%)');
	    }
	    else {
	    	axes_labels(xAxis,yAxis,'Date', 'Value');
	    }
  	}
  	addInitialAxes('date', 'value', convert_to_percent);

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

  	draw_line(data, 'date', 'value', 'steelblue', 'id');
// Close d3.json()
});
// Close draw() function.
};



function drawSP500(data, selector, chart_id, convert_to_percent) {

	if (d3.select('#x').empty()){
		console.log("empty first time");
	}
	else{
		d3.select('#x').remove();
		console.log('exists?')
	}
	var svg = d3.select('#'+chart_id).append("svg")
	  .attr('id', 'x')
	  .attr('class', 'line_chart')
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform",
	        "translate(" + margin.left + "," + margin.top + ")");
	var parseTime = d3.timeParse("%Y-%m-%d");
	var how_far_below_min_for_y_scale = .1;
	var percentFormat = d3.format(".1%"); 

	d3.csv(data, function(data) {
		arr = data
		arr.forEach(function(d){
			d.value = +d.SP500;
			d.date = parseTime(d.Date)
		});
	var d1 = new Date('January 1, 2016');
    arr = arr.filter(function(d){return d.date >d1;});
    console.log(arr)


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

    function addInitialAxes(x_axis_series, y_axis_series, convert_to_percent) {
	    xx.domain(d3.extent(arr, function(d) { return d[x_axis_series]; }));
	    yy.domain([d3.min(arr, function(d) { return d[y_axis_series]; }) - 
	      how_far_below_min_for_y_scale*d3.min(arr, function(d) { return d[y_axis_series]; }), 
	        d3.max(arr, function(d) { return d[y_axis_series]; })]);

	    if (convert_to_percent == true) {
	    	var yAxis = svg.append("g")
	      .attr('id', 'unemployment_axis')
	      .call(d3.axisLeft().tickFormat(percentFormat).scale(yy));
	    }
	    else {
	    	var yAxis = svg.append("g")
	      .attr('id', 'unemployment_axis')
	      .call(d3.axisLeft().scale(yy));
	    }

	    var xAxis = svg.append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .attr('id','xaxis')
	      .call(d3.axisBottom(xx).ticks(20).tickFormat(d3.timeFormat("%m-%y")));
	    // Call axes_labels function to add labels.
	    if (convert_to_percent == true) {
	    	axes_labels(xAxis,yAxis,'Date', 'Percent (%)');
	    }
	    else {
	    	axes_labels(xAxis,yAxis,'Date', 'Value');
	    }
  	}
  	addInitialAxes('date', 'value', convert_to_percent);

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

  	draw_line(arr, 'date', 'value', 'steelblue', 'id');
// Close d3.json()
});
// Close draw() function.
};
