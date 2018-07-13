

// Work flow

// -- Add if to tile front
// -- Add selector and title text
function title(){
	// Set title for entire data portal
	var today = new Date();
	// call new
	// https://stackoverflow.com/questions/2627650/why-javascript-gettime-is-not-a-function
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	console.log(mm)
	if (mm<10){
		mm = '0'+mm;
	}
	var yyyy = today.getFullYear();	
	var obj = $('.title_text').append('h1').text('KEY ECONOMIC INDICATORS -- \n as of '+yyyy+'-'+mm+'-'+dd);
	obj.html(obj.html().replace(/\n/g,'<br/>'));

}
title();
// Add subtitle.
$('#instructions').append('h3').text('(Click tile to view historical data.)');

function load_page(){

	// 1
	// Text to tile
	$("#uerate").append('h3').text("Current unemployment rate");
	// As of what date? to tile.
	asoftoday('unemployment.json', '#uerate_date');
	// Add data to tile.
	api('unemployment.json', '#uerate_api', true);
	$("#uerate_source")
		.text("Data source: https://fred.stlouisfed.org/series/UNRATE")
		.attr('class','link')
		.on("click", function() { window.open("https://fred.stlouisfed.org/series/UNRATE"); });

	// 2
	$("#civpart").text("Labor Force Participation Rate");
	asoftoday('civpart.json','#civpart_date');
	api('civpart.json', '#civpart_api', convert_to_percent = true);
	// Add data source: requires a #civpart_source div on tile back.
	$("#civpart_source")
		.text("Data source: https://fred.stlouisfed.org/series/CIVPART")
		.attr('class','link')
		.on("click", function() { window.open("https://fred.stlouisfed.org/series/CIVPART"); });

	// 3
	$("#cpi").text("Current consumer price index");
	asoftoday('cpi.json','#cpi_date');
	api('cpi.json', '#cpi_api');
	$("#cpi_source")
		.text("Data source: https://fred.stlouisfed.org/series/CPIAUCSL")
		.attr('class','link')
		.on("click", function() { window.open("https://fred.stlouisfed.org/series/CPIAUCSL"); });

	// 4
	$("#ffr").text("Target Federal Funds Rate");
	asoftoday('ffr.json','#ffr_date');
	api('ffr.json', '#ffr_api', convert_to_percent = true);
	$("#ffr_source")
		.text("Data source: https://fred.stlouisfed.org/series/FEDFUNDS")
		.attr('class','link')
		.on("click", function() { window.open("https://fred.stlouisfed.org/series/FEDFUNDS"); });

	//5 
	$("#tpahe").text("Average Hourly Earnings of All Employees");
	asoftoday('tpahe.json','#tpahe_date');
	api('tpahe.json', '#tpahe_api', convert_to_percent = 'dollar');
	$("#tpahe_source")
		.text("Data source: https://fred.stlouisfed.org/series/CES0500000003")
		.attr('class','link')
		.on("click", function() { window.open("https://fred.stlouisfed.org/series/CES0500000003"); });

	//6
	$("#education").text("Education cost % change since 2000");
	asoftoday('education.json','#education_date');
	api('education.json', '#education_api', convert_to_percent = false, base_index_variable = true);
	$("#education_source")
		.text("Data source: https://fred.stlouisfed.org/series/CUSR0000SEEB")
		.attr('class','link')
		.on("click", function() { window.open("https://fred.stlouisfed.org/series/CUSR0000SEEB"); });

	// 7
	$("#housing").text("Housing cost % change since 2000");
	asoftoday('housing.json','#housing_date');
	api('housing.json', '#housing_api', convert_to_percent = false, base_index_variable = true);
	$("#housing_source")
		.text("Data source: https://fred.stlouisfed.org/series/USSTHPI")
		.attr('class','link')
		.on("click", function() { window.open("https://fred.stlouisfed.org/series/USSTHPI"); });

	// 8
	$("#healthcare").text("Healthcare cost % change since 2000");
	asoftoday('healthcare.json','#healthcare_date');
	api('healthcare.json', '#healthcare_api', convert_to_percent = false, base_index_variable = true);
	$("#healthcare_source")
		.text("Data source: https://fred.stlouisfed.org/series/CPIMEDNS")
		.attr('class','link')
		.on("click", function() { window.open("https://fred.stlouisfed.org/series/CPIMEDNS"); });

	// 9
	$("#food").text("Food cost % change since 2000");
	asoftoday('food.json','#food_date');
	api('food.json', '#food_api', convert_to_percent = false, base_index_variable = true);
	$("#food_source")
		.text("Data source: https://fred.stlouisfed.org/series/CPIUFDNS")
		.attr('class','link')
		.on("click", function() { window.open("https://fred.stlouisfed.org/series/CPIUFDNS"); });

	// $("#sp500").text("S&P 500:");
	// api('sp500.json', '#sp500');
	
};

// load_page();

var margin = {top: 20, right: 20, bottom: 50, left: 100},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;
var parseTime = d3.timeParse("%Y-%m-%d");
// transitionTime = 2500; // What feels best? Should it always be the same?

function asoftoday(fred_data, selector){
	d3.json(fred_data, function(data) {
		var date = data['observations'][0]['date'];
		$(selector).append('h3').text('As of '+date);
	});


};

function api(data, selector, convert_to_percent, base_index_variable = false){
	// Call local JSON file to get most recent value or some other # we want to present

	// If base index variable = true, reset index year to 100 and show growth from there.

	d3.json(data, function(data) {
	if (base_index_variable == true) {
		dates = []
		arr = data['observations']
		arr.forEach(function(d){
			var date = parseTime(d['date']);
			year = date.getFullYear()
			// Check for January 1 value of that year.
			if (year == 2000) {
				if (date.getMonth() == 0){
					v = d['value']
					m = d['date']
				}
			}
		});
	}

	var current_value = data['observations'][0]['value'];
	if (base_index_variable == true) {
	  	new_rounded = ((current_value/v-1) * 100)
	  	new_rounded = Math.round(new_rounded*100)/100;
	}
	if (convert_to_percent == true) {
	  	d3.select(selector)
	  		.attr('id','api_text')
	  		.text(current_value+'%');
	  }
	  else if (convert_to_percent == 'dollar') {
	  	d3.select(selector)
	  	.attr('id','api_text')
		.text('$'+current_value);
	  }
	  else if (base_index_variable == true) {
	  	d3.select(selector)
	  	.attr('id','api_text')
	  	.text(  ((new_rounded -1 )).toString()+'%');
	  }
	  else {
	  	d3.select(selector)
	  	.attr('id','api_text')
	  	.text(current_value);
	  }
	});
};

// Add so that even as we scroll through front of the tiles,
// when we click, we scroll to top so we see chart without having
// to scroll manually.
$('.bl-box').on("click",function(){
      $(window).scrollTop(160);
});

function draw(data, selector, chart_id, convert_to_percent) {

	if (d3.select('#x').empty()){
		console.log("empty first time");
	}
	else{
		d3.select('#x').remove();
		console.log('exists?')
	}
	var holder = d3.select('#'+chart_id);
	var svg = holder.append("svg")
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
	var axes_label_size = 50;

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
	      .style("class", 'axis')
	      .text(x_axis_label);
	    // Y axis label
	    xAxis.append("text").attr("transform", "rotate(-90)")
	      .attr("y", -3*margin.top)
	      .attr("x",(height / 2))
	      .attr("dy", "1em")
	      .style("text-anchor", "middle")
	      .style('fill','black')
	      .style("class", 'axis')
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


	    // var div = d3.select("body").append("div")
	    var div = holder.append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);
	    // Add dots.
	    svg.selectAll('dot')
	    	.data(arr)
	     	.enter()
	     	.append('circle')
	     	.attr('r', 2)
	     	.attr('cx', function(d) {
            	return xx(d[x]);
          	})
	     	.attr('cy', function(d) {
            	return yy(d[y]);
          	})
          	.on("mouseover", function (d) {
          			console.log('moused over')
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);


                        // Need to move these tool tips closer to mouse.
                        if (convert_to_percent == true){
                        	div.html((parseFloat(d[y])*100).toString()+'% on '+ ( parseInt(d[x].getMonth())+1).toString() +'-'+ d[x].getFullYear())
                        	 .style("left", (d3.event.pageX) + "px")
	                        .style("top", (d3.event.pageY)-200 + "px");
                        }
                        else {
		                    div.html(d[y]+' on '+ ( parseInt(d[x].getMonth())+1).toString() +'-'+ d[x].getFullYear())
		                    .style("left", (d3.event.pageX) + "px")
                        	.style("top", (d3.event.pageY)-200 + "px");
                        }
                       
             });
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
