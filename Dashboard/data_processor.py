import pandas as pd

def load_data():
    # Load and process your data
    data = pd.read_csv('path_to_your_data.csv')
    # Process and prepare data to send to frontend
    return data.to_dict(orient='records')
