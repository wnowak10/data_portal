import json
import datetime

def get_historical_data(num_years =2, source = 'fred', series_id, file_name):
    """
    Get historical data for the past number yeas (num_years). 

    If FRED = source:
        - Return as a JSON with observations in ['observations'] with
        associated values and dates.
    """
    if source == 'fred':
        series_id = 'UNRATE'
        num_years  = 2
        observation_start = (datetime.datetime.today() - relativedelta(years=num_years)).strftime('%Y-%m-%d')
        observation_end = datetime.datetime.today().strftime('%Y-%m-%d') # Today"
          

        # Observations returned in in descending order: 'sort_order=desc'
        url = 'https://api.stlouisfed.org/fred/series/observations?series_id='+series_id+'&observation_start='+observation_start+'&observation_end='+observation_end+'&api_key='+fred_key+'&sort_order=desc&file_type=json'

        file_name = 'unemployment.txt'
        with open(file_name, 'w') as outfile:
            json.dump(requests.get(url).json(), outfile)
        return True
           