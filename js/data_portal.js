/*

Helper functions for charts.js, which helps build Data Portal v0.1.
*/
////////////////////////////////////////////////////////////////////////////////
function asoftoday(data_file_path, id){
	d3.json(data_file_path, function(data) {
		var date = data['observations'][0]['date'];
		$('#'+id+'_date').append('h3').text('As of '+date);
	});
};

////////////////////////////////////////////////////////////////////////////////
function api_datum_call(   data, 
				           id, 
				           units, 
				           display_as_percent_increase_since,
				           base_date_of_percent_increase) {
	/* Call local JSON file to get most recent value or some other # we want to present
	(could be percent growth).

	* data: What json file to use as our source. This is a 
	time series file which has observations for given dates. At the moment, this is only tested
	on JSON files exported from FRED API
	* id: What id I use to reference objects related to this data in HTML.
	* units: percent, dollar, percent_growth, or index
		- percent: E.g. % Unemployed
		- dollar: E.g. median wages $
		- percent_growth: E.g. percent growth since year (base_date_of_percent_increase)
	* display_as_percent_increase_since: true/false
	* base_date_of_percent_increase:  What is the base year for which we are calculating % growth?

	*/

	d3.json(data, function(data) {
		
		if (display_as_percent_increase_since == true) {
			dates = []
			arr = data['observations']
			arr.forEach(function(d){
				var date = parseTime(d['date']);
				year = date.getFullYear()
				// Check for January 1 value of that year.
				if (year == base_date_of_percent_increase) {
					if (date.getMonth() == 0){
						v = d['value']
						m = d['date']
					}
				}
			});
		}

		var current_value = data['observations'][0]['value'];
		
		if (display_as_percent_increase_since == true) {
		  	new_rounded = ((current_value/v-1) * 100)

		}
		
		if (units == 'percent') {
		  	d3.select('#'+id+'_api')
		  		.attr('id','api_text')
		  		.text(current_value+'%');
		}
		else if (units == 'dollar') {
		  	d3.select('#'+id+'_api')
		  	.attr('id','api_text')
			.text('$'+current_value);
	    }
	    else if (units == 'percent_growth') {
		  	d3.select('#'+id+'_api')
		  	.attr('id','api_text')
		  	.text(Math.round(new_rounded*10)/10+'%');
	    }
	    else if (units == 'index'){
	  	rounded = Math.round(current_value*100)/100;
		d3.select('#'+id+'_api')
	  		.attr('id','api_text')
	  		.text(rounded);
	 	}
	});
};

////////////////////////////////////////////////////////////////////////////////
function load_tile( data_file_path, 
					tile_title,
					id, 
					source,
					units = 'percent',
					display_as_percent_increase_since,
					base_date_of_percent_increase) {
	/*
	This function loads data and content for a tile in the 
	data portal grid. 

	* data_file_path: path to file (JSON?) containing time series data
	* tile_title: title of the tile
	* id: HTML id
	* source: URL of data source, if possible
	* units = 'percent', 'dollar', 'none'
	* display_as_percent_increase_since = BOOL: If true, we take all
	of the values and display the tile front observation as % inc/dec
	since base_date_of_percent_increase,
	* base_date_of_percent_increase = 2000 -- defined above.

	*/
	$("#"+id).append('h3').text(tile_title);
	// Add 'as of `what date?`' to tile.
	asoftoday(data_file_path, id);
	// Add data to tile so we can present
	// key statistic.
	api_datum_call(data_file_path, 
			       id, 
				   units, 
				   display_as_percent_increase_since,
				   base_date_of_percent_increase);

	// Add citation. `source` is a url
	// to data source.
	$("#"+id+"_source")
		.text("Data source: " + source)
		// If we want link underlined.
		// .html("Data source: <U>"+source+"</U>")
		.attr('class','link')
		.on("click", function() { window.open(source); });
};

