from flask import Flask, render_template, jsonify, request
import logging
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/gender-asthma-data')
def gender_asthma_data():
    df = pd.read_csv('./data/life_long_asthma.csv')
    df.sort_values('Year', ascending=True, inplace=True)
    return jsonify(df.to_dict(orient='records'))

@app.route('/asthma-map-data')
def asthma_map_data():
    try:
        year = request.args.get('year', '2021')
        year = int(year)
        df = pd.read_csv('./data/merged_asthma_mortality_data.csv')
        # Filtering data for the year 2021 and selecting the required columns
        map_data = df[df['Year'] == year][['State', 'State Abbreviation', 'Number With Current Asthma', 'Percent With Current Asthma', 'Adjusted Death Rate']]
        # Converting the filtered DataFrame to a dictionary in 'records' format and jsonify it to send as a JSON response
        map_data.fillna('NA', inplace=True)
        return jsonify(map_data.to_dict(orient='records'))
    except Exception as e:
        print(e)  # Print out the error if any
        return jsonify({"error": str(e)}), 500

@app.route('/copd-mortality-data')
def copd_mortality_data():
    df = pd.read_csv('./data/State_COPD_mortality_2021.csv')
    # Assuming the column for mortality rate is named 'Age-Adjusted Mortality (per 100,000)'
    df = df.sort_values(by='Age-Adjusted Mortality (per 100,000)', ascending=False).head(10)
    return jsonify(df.to_dict(orient='records'))


if __name__ == '__main__':
    app.run(debug=True)
