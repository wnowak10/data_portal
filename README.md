# README for dataportal.realfacts.co:

Contents:

1. How to run site locally.
2. How to add new tiles.
3. Another awesome section of the readme.

# 1. How to run site locally.

1. Ensure data portal installed locally. Clone to desired directory. 
2. Install MAMP. 
3. "Open Webpage Start" > "My Website" 
4. Navigate to `data_portal/docs`. Occasionally, a hard reload is needed to clear cached data and view local changes.

# 2. How to add a new tile

### TO DO: With refactoring, we can continue to simplify this process and the amount of source code touches needed. Ideally, this would be done. Also, ideally, tests would be written to ensure any edits / additions don't break the current site before publishing. 

1. Locally, create a new branch off of the current master:

`$ git pull origin master`

`$ git branch -b new_branch`

Then edit as follows.

1. Get data. To do so, edit `data/fred_sources.csv`, assuming your time series source is contained in FRED database. Simply add the FRED_ID and our corresponding internal ID. Ideally, these are the same. 

Ensure you have a `data/secrets.py` file stored locally with you API keys. This file simply contains all API keys stored as strings:

E.g.

`fred_api_key = '123456789'`

After making this edit, run:

`$ python data/mkdata.py` 

This script requires a minimal set of Python libraries:

* datetime
* json
* requests
* pandas
* dateutil.relativedelta


This will update the `data/data` directory. 

If you aren't accessing a FRED data source, that's OK. What matters is the data ends in the data/data directory. At the moment, we're only processing JSON files formatted using FRED's dictionary key / value taxonomy. TO DO: Allow wider array of time series inputs.

1. Run `python new_tile.py -i <id> -t <title> --overwrite`. Leaving out `overwrite` flag will do a dry run, creating a new HTML file with proposed changes.

	Note! The ID should be the prefix of your JSON data file. Ex: If you download food prices time series and store as `foodprices.json`, `foodprices` is your ID.

	Title above is the title of your tile.
				
2. Add to `charts.js` to the `load_tile()` function. Replace ID as needed.:

Should be near L110 in the `js/charts.js` file.

```
// 10
	load_tile(  data_file_path = DATA_PATH+'<<<DATA_SOURCE (e.g. food.json)>>>',
				tile_title = '<<<Tile title (e.g. Food cost % change since 2000>>>',
				id = '<<<ID (e.g. food)>>>',
				source = '<<<URL (e.g. https://fred.stlouisfed.org/series/CPIUFDNS)>>>',
				units = 'percent_growth',
				display_as_percent_increase_since = true,
				base_date_of_percent_increase = 2000);
```

CSS, JS, and HTML are white-space agnostic, so your intendentation doesn't matter, but it's best practice to fall in line!

Once editing code and saving, git add, commit, push branch and then submit a pull request, as the live site is fed from the master branch only. 

# 3. Another awesome section of the readme.

![](cat.gif)

