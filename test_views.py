import requests
import json

# # Test UnityDataCreateView
# def test_unity_data_create_view():
#     url = 'http://localhost:8000/api/saveDataCSV/' 
#     headers = {
#         'Content-Type': 'application/json',
#         'Experiment-Token': '565c76dc-d67f-4732-9d4b-c6835c1f0311',  # Replace with your actual token
#     }
#     data = {
#         'csvData': 'value2',  # Replace with your actual data
#     }
#     response = requests.post(url, headers=headers, data=json.dumps(data))
#     print(response.status_code)
#     if response.status_code in [200, 201]:  # Check for 200 or 201 status code
#         print(response.json())
#     else:
#         print('Request failed')

# Test UnityDataView
def test_unity_data_view():
    url = 'http://localhost:8000/api/dataCSV/' 
    headers = {
        'Content-Type': 'application/json',
        'Experiment-Token': '16869b0b-9cd7-484f-ba56-fb9faefdd7f4',  # Replace with your actual token
    }
    response = requests.get(url, headers=headers)
    print(response.status_code)
    print(response.json())

# Run the tests
# test_unity_data_create_view()
test_unity_data_view()