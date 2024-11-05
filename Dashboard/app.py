from flask import Flask, render_template, jsonify, request
import logging
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/asthma-data')
def asthma_data():
    df = pd.read_csv('/Users/smiie/Desktop/RespiratoryHealth/Dashboard/data/asthma_data.csv')
    yearly_data = df.groupby('Year')['Number With Current Asthma'].sum().reset_index()
    return jsonify(yearly_data.to_dict(orient='records'))

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


if __name__ == '__main__':
    app.run(debug=True)
