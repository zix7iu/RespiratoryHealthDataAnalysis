# RespiratoryHealthDataAnalysis

This repository contains the code and data for the "Respiratory Health Data Analysis" project. It includes scripts for data preprocessing, analysis, and an interactive dashboard hosted on Heroku to visualize the impacts of air quality on respiratory health, focusing primarily on asthma and COPD.

## Repository Structure

- `Dashboard/`: Contains the Flask application for the interactive dashboard.
- `raw_data/`: Raw data files used in the analysis.
- `data_processed/`: Processed data files generated from the raw data.
- `RawDataProcess.ipynb`: Jupyter notebook for initial data processing.
- `DataAnalysis.ipynb`: Jupyter notebook containing detailed data analysis, including correlation and regression analysis.

## Interactive Dashboard

Access the interactive dashboard deployed on Heroku to explore data visualizations and insights on respiratory health:
[Respiratory Health Dashboard](https://respiratoryhealthdashboard-95c9232b21db.herokuapp.com/)

## Getting Started

To run the dashboard locally, you need to install the required Python packages:

```bash
pip install -r requirements.txt

To start the Flask app locally:

```bash
cd Dashboard
python app.py

This will serve the flask application on http://localhost:5000.


