"""
Python script to access (at the moment, FRED) API data.

We currently import a csv with the list of FRED series_ids and HTML ids.
We then use these series to perform a python request and call FRED data.
It is then saved to local directory.
"""

import datetime
import json
import requests

import pandas as pd

from dateutil.relativedelta import relativedelta

import secrets
# ______________________________________________________________________________
# 
def frmt_dt_str(s, format_str = '%Y-%m-%d'):
    return datetime.datetime.strptime(s, format_str)

def get_historical_data(series_id, file_name, num_years, source = 'fred'):
    print('Running.')
    """
    Get historical data for the past number yeas (num_years). 

    If FRED = source:
        - Return as a JSON with observations in ['observations'] with
        associated values and dates.
    """
    if source == 'fred':
        fred_key = secrets.fred_api_key
        series_id = series_id
        observation_start = (datetime.datetime.today() - relativedelta(years=num_years)).strftime('%Y-%m-%d')
        observation_end = datetime.datetime.today().strftime('%Y-%m-%d') # Today"
          

        # Observations returned in in descending order: 'sort_order=desc'
        url = 'https://api.stlouisfed.org/fred/series/observations?series_id='+series_id+'&observation_start='+observation_start+'&observation_end='+observation_end+'&api_key='+fred_key+'&sort_order=desc&file_type=json'
        js = requests.get(url).json()

        for i, obs in enumerate(js['observations']):
            datetime_obj = frmt_dt_str(obs['date'])
            # datetime.datetime.strptime(obs['date'], format_str)
            # Initially, CPS had x families until y year.
            if datetime_obj < frmt_dt_str('1956-01-01'):
                obs['n'] = 25000
            elif ( (datetime_obj > frmt_dt_str('1956-01-01')) & (datetime_obj < frmt_dt_str('1967-01-01'))) :
                obs['n'] = 40000
            elif ( (datetime_obj > frmt_dt_str('1967-01-01')) & (datetime_obj < frmt_dt_str('1972-01-01'))) :
                obs['n'] = 60000
            # elif ( (datetime_obj > frmt_dt_str('1967-01-01')) & (datetime_obj < frmt_dt_str('1972-01-01'))) :
                # obs['n'] = 58000
            elif ( (datetime_obj > frmt_dt_str('1972-01-01')) & (datetime_obj < frmt_dt_str('1981-01-01'))) :
                obs['n'] = 72000
            elif ( (datetime_obj > frmt_dt_str('1981-01-01')) & (datetime_obj < frmt_dt_str('1994-01-01'))) :
                obs['n'] = 56000
            elif ( (datetime_obj > frmt_dt_str('1994-01-01')) & (datetime_obj < frmt_dt_str('1996-01-01'))) :
                obs['n'] = 50000
            elif ( (datetime_obj > frmt_dt_str('1996-01-01')) & (datetime_obj < frmt_dt_str('2001-01-01'))) :
                obs['n'] = 50000
            elif ( (datetime_obj > frmt_dt_str('2001-01-01')) ) :
                obs['n'] = 60000 
        file_name = file_name
        with open(file_name, 'w') as outfile:
            json.dump(js, outfile)
        return True

if __name__ == "__main__":
    # get_historical_data('CPIAUCSL', 'cpi.json', 19, 'fred')  # Example of single call.
    fred_sources = pd.read_csv('fred_sources.csv', header = 0)
    series_ids = fred_sources['series_id']
    my_ids = fred_sources['my_id']
    # Read csv which has file ids and FRED ids
    for series_id, idd in zip(series_ids, my_ids):
        get_historical_data(series_id, '{}.json'.format(idd), 50, 'fred')


#         