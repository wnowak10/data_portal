////////////////////////////////////////////////////////////////////////////////
// Add title to .title_text div
function title(){
	// Set title for entire data portal
	var today = new Date();
	// Call `new`
	// https://stackoverflow.com/questions/2627650/
	// ...why-javascript-gettime-is-not-a-function
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	if (mm<10){
		mm = '0'+mm;
	}
	var yyyy = today.getFullYear();	
	var obj = $('.title_text')
				.append('h1')
				.text('KEY ECONOMIC INDICATORS');
	$('.title_date').append('h2').text('as of  '+yyyy+'-'+mm+'-'+dd);
}
title();

////////////////////////////////////////////////////////////////////////////////
// Add subtitle.
$('#instructions').append('h3').text('(Click tile to view historical data.)');

////////////////////////////////////////////////////////////////////////////////
// Load page via load_tile calls.
function load_page(){
	var DATA_PATH = 'data/data/';

	// 1
	load_tile(  data_file_path = DATA_PATH+'uerate.json',
				tile_title = 'Current unemployment rate',
				id = 'uerate',
				source = 'https://fred.stlouisfed.org/series/UNRATE',
				units = 'percent',
				display_as_percent_increase_since = false,
				base_date_of_percent_increase = 2000 );

	// 2
	load_tile(  data_file_path = DATA_PATH+'civpart.json',
				tile_title = 'Current Labor Force Participation Rate',
				id = 'civpart',
				source = 'https://fred.stlouisfed.org/series/CIVPART' ,
				units = 'percent',
				display_as_percent_increase_since = false,
				base_date_of_percent_increase = 2000 );

	// 3 
	load_tile(  data_file_path = DATA_PATH+'cpi.json',
				tile_title = 'YoY inflation rate',
				id = 'cpi',
				source = 'https://fred.stlouisfed.org/series/CPIAUCSL',
				units = 'percent_growth',
				display_as_percent_increase_since = true,
				base_date_of_percent_increase = 2017);

	// 4 
	load_tile(  data_file_path = DATA_PATH+'ffr.json',
				tile_title = 'Current target federal funds rate',
				id = 'ffr',
				source = 'https://fred.stlouisfed.org/series/FEDFUNDS',
				units = 'percent',
				display_as_percent_increase_since = false);
	
	// 5
	load_tile(  data_file_path = DATA_PATH+'tpahe.json',
				tile_title = 'Average Hourly Earnings of All Employees',
				id = 'tpahe',
				source = 'https://fred.stlouisfed.org/series/CES0500000003',
				units = 'dollar',
				display_as_percent_increase_since = false);
	
	// 6
	load_tile(  data_file_path = DATA_PATH+'education.json',
				tile_title = 'Education cost % change since 2000',
				id = 'education',
				source = 'https://fred.stlouisfed.org/series/CUSR0000SEEB',
				units = 'percent_growth',
				display_as_percent_increase_since = true,
				base_date_of_percent_increase = 2000);	
	
	// 7
	load_tile(  data_file_path = DATA_PATH+'housing.json',
				tile_title = 'Housing cost % change since 2000',
				id = 'housing',
				source = 'https://fred.stlouisfed.org/series/USSTHPI',
				units = 'percent_growth',
				display_as_percent_increase_since = true,
				base_date_of_percent_increase = 2000);

	// 8
	load_tile(  data_file_path = DATA_PATH+'healthcare.json',
				tile_title = 'Healthcare cost % change since 2000',
				id = 'healthcare',
				source = 'https://fred.stlouisfed.org/series/CPIMEDNS',
				units = 'percent_growth',
				display_as_percent_increase_since = true,
				base_date_of_percent_increase = 2000);

	// 9
	load_tile(  data_file_path = DATA_PATH+'food.json',
				tile_title = 'Food cost % change since 2000',
				id = 'food',
				source = 'https://fred.stlouisfed.org/series/CPIUFDNS',
				units = 'percent_growth',
				display_as_percent_increase_since = true,
				base_date_of_percent_increase = 2000);
	
};

var margin = {top: 20, right: 20, bottom: 50, left: 100}
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var parseTime = d3.timeParse("%Y-%m-%d");

// Add so that even as we scroll through front of the tiles,
// when we click, we scroll to top so we see chart without having
// to scroll manually.
$('.bl-box').on("click",function(){
	var previous_height = $(window).scrollTop()
	$(window).scrollTop(160);
});

// How do we scroll back to where we were in tiles when we click back button?
// $('.close').on('click', function() {
// 	console.log('registered', previous_height)
// 	$(window).scrollTop(previous_height);
// });

function se95(p, n) {
                return Math.sqrt(p*(1-p)/n)*1.96;
            };

////////////////////////////////////////////////////////////////////////////////
// Draw line function
function draw_line( data_file_path, 
					id, 
					units,
					norm_data_to_prct_chng_ovr_tme,
					base_date_of_percent_increase) {

	/* 
	
	The main function to draw time series lines on the back of data portal
	tiles.

	* data_file_path: path to locally stored (JSON?) file. In future,
		build flexibility.
	* id: HTML id selector.
	* units: 'percent', 'dollar', 'index', or 'percent_growth'
	* norm_data_to_prct_chng_ovr_tm: 
	* base_date_of_percent_increase: 

	*/
	var DATA_PATH = 'data/data/'
	var path = DATA_PATH + data_file_path;
	// If a chart exists in this place, remove it so we can draw each time we click?
	// TO DO: Make this more efficient. Draw it on load and then just keep it there
	// so it appears and we don't need to redraw on future loads. 
	d3.select('#x').remove();

	// Create holder so we can append points on line chart.
	var holder = d3.select('#'+id+'_chart');
	// Create chart svg to contain line chart.
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
	d3.json(path, function(data) {
		// For FRED stored JSON, all observations are within
		// array stored in data['observations'].

		arr = data['observations']
		dates = []
		arr.forEach(function(d){
			if (units == 'percent') {
				d.value = +d.value/100;
				d.date = parseTime(d.date)
				d['n'] = +d['n']
				// d['n'] = +d['n'] // How many households in CPS sample?
				// Need to actually update this with real data.
				// https://www.census.gov/prod/2006pubs/tp-66.pdf
				dates.push(d.date)
			}
			else {
				d.value = +d.value;
				d.date = parseTime(d.date)
				d['n'] = +d['n'] // How many households in CPS sample?
				dates.push(d.date)
			}			
		});


		if (norm_data_to_prct_chng_ovr_tme){
			// This function changes our data so that, instead 
			// of raw plotted values, we convert y axis to 
			// growth since given value (base_date_of_percent_increase). 
			norm_data(arr, base_date_of_percent_increase);
			arr.forEach(function(d){
				// Need to scale by 100.
				d.value = +d.value/100;
			});
		};

		// Build line chart. These are d3 scales.
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

	    function addInitialAxes(x_axis_series, y_axis_series, units) {
		    xx.domain(d3.extent(arr, function(d) { return d[x_axis_series]; }));
		    yy.domain([d3.min(arr, function(d) { return d[y_axis_series]; }) - 
		      how_far_below_min_for_y_scale*d3.min(arr, function(d) { return d[y_axis_series]; }), 
		        d3.max(arr, function(d) { return d[y_axis_series]; })]);

		    if (units == 'percent' | units == 'percent_growth') {
		    	var yAxis = svg.append("g")
		    		.attr('id', 'yaxis')
		      	    .call(d3.axisLeft().tickFormat(percentFormat).scale(yy));
		    }
		    else {
		    	var yAxis = svg.append("g")
		    		.attr('id', 'yaxis')
			        .call(d3.axisLeft().scale(yy));
		    }

		    var xAxis = svg.append("g")
		      .attr("transform", "translate(0," + height + ")")
		      .attr('id','xaxis')
		      .call(d3.axisBottom(xx).ticks(20).tickFormat(d3.timeFormat("%m-%y")));
		    // Call axes_labels function to add labels.
		    if (units == 'percent') {
		    	axes_labels(xAxis,yAxis,'Date', 'Percent (%)');
		    }
		    else if (units == 'index') {
		    	axes_labels(xAxis,yAxis,'Date', 'Index');
		    }
		     else if (units == 'percent_growth') {
		    	axes_labels(xAxis,yAxis,'Date', 'Percent Growth (%)');
		    }
		    else {
		    	axes_labels(xAxis,yAxis,'Date', 'Value');
		    }
	  	}
	  	addInitialAxes('date', 'value', units);

		function draw_line(data, x, y, color, line_id){
		    xx.domain(d3.extent(arr, function(d) { return d[x]; }));
		    yy.domain([d3.min(arr, function(d) { return d[y]; }) - 
		      how_far_below_min_for_y_scale*d3.min(arr, function(d) { return d[y]; }), 
		        d3.max(arr, function(d) { return d[y]; })]);

		    var line = d3.line()
		          	.x(d => xx(d[x]))
		          	.y(d => yy(d[y]))

		    path = svg.append("path")
		          .datum(arr)
		          .attr("fill", "none")
		          .attr("id", line_id)
		          .attr("class", "path")
		          .attr('class', 'line')
		          // .attr("stroke", color)
		          // .attr("stroke-width", 4.5)
		          .attr("d", line);

		    // area =  d3.area()
      //           // .interpolate(interpolation)
      //           .x(function(d) { return xx(d[x]); })
      //           .y0(function(d) {
      //               return yy(d[y]); })
      //           .y1(function(d) {
      //               return yy( d[y]+ se95( d[y], d['n']) ); } ) ;

      //       area2 =  d3.area()
      //           // .interpolate(interpolation)
      //           .x(function(d) { return xx(d[x]); })
      //           .y0(function(d) {
      //               return yy(d[y]); })
      //           .y1(function(d) {
      //           	console.log(d['n'])
      //           	console.log(se95(d[y],d['n']))
      //               return yy(d[y] - se95(d[y],d['n'])); });

      //      // add the area
		    // svg.append("path")
		    //    .data([arr])
		    //    .attr("class", "area")
		    //    .attr("d", area);

		    // // add the area
		    // svg.append("path")
		    //    .data([arr])
		    //    .attr("class", "area2")
		    //    .attr("d", area2);



		    // Tool tip:
			// https://bl.ocks.org/micahstubbs/e4f5c830c264d26621b80b754219ae1b

			const focus = svg.append('g')
		      .attr('class', 'focus')
		      .style('display', 'none');

		    focus.append('circle')
		      .attr('r', 4.5);

		    focus.append('line')
		      .classed('x', true);

		    focus.append('line')
		      .classed('y', true);

		    focus.append('text')
		      .attr('x', 9)
		      .attr('dy', '.35em');

		    svg.append('rect')
		      .attr('class', 'overlay')
		      .attr('width', width)
		      .attr('height', height)
		      .on('mouseover', () => focus.style('display', null))
		      .on('mouseout', () => focus.style('display', 'none'))
		      .on('mousemove', mousemove);

    
		    const bisectDate = d3.bisector(d => d[x]).left;
		    arr = arr.sort((a, b) => a.date - b.date);

	    	function mousemove() {
	    		const x0 = xx.invert(d3.mouse(this)[0]);
			    const i = bisectDate(arr, x0, 1);
			    const d0 = arr[i - 1];
			    const d1 = arr[i];
			    const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

			    focus.attr('transform', `translate(${xx(d[x])}, ${yy(d[y])})`);
			    focus.select('line.x')
			      .attr('x1', 0)
			      .attr('x2', -xx(d[x]))
			      .attr('y1', 0)
			      .attr('y2', 0);

		      	focus.select('line.y')
			      .attr('x1', 0)
			      .attr('x2', 0)
			      .attr('y1', 0)
			      .attr('y2', height - yy(d[y]));

		        focus.select('text').text(percentFormat(d[y]));
	  		};
  		// Close draw_line()
		};
		draw_line(arr, 'date', 'value', 'steelblue', 'id');
	// Close d3.json()
	});
// Close draw() function.
};

