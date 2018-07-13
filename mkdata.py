import json
import datetime
from dateutil.relativedelta import relativedelta
import requests

def get_historical_data(series_id, file_name, num_years, source = 'fred'):
    print('Running.')
    """
    Get historical data for the past number yeas (num_years). 

    If FRED = source:
        - Return as a JSON with observations in ['observations'] with
        associated values and dates.
    """
    if source == 'fred':
        fred_key = '529502bf6a30427956b4b16244000f32'
        series_id = series_id
        observation_start = (datetime.datetime.today() - relativedelta(years=num_years)).strftime('%Y-%m-%d')
        observation_end = datetime.datetime.today().strftime('%Y-%m-%d') # Today"
          

        # Observations returned in in descending order: 'sort_order=desc'
        url = 'https://api.stlouisfed.org/fred/series/observations?series_id='+series_id+'&observation_start='+observation_start+'&observation_end='+observation_end+'&api_key='+fred_key+'&sort_order=desc&file_type=json'

        file_name = file_name
        with open(file_name, 'w') as outfile:
            json.dump(requests.get(url).json(), outfile)
        return True

if __name__ == "__main__":
    get_historical_data('USSTHPI', 'housing.json', 19, 'fred', )