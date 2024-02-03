from .models import UnityData, Experiment
from .serializer import UnityDataSerializer
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.db.models import Count
from django.db.models.functions import TruncDate
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView
import json
import csv
import zipfile
from io import BytesIO, StringIO
from datetime import datetime


class HasExperimentToken(BasePermission):
    def has_permission(self, request, view):
        token = request.headers.get('Experiment-Token')
        if not token:
            return False

        try:
            Experiment.objects.get(token=token)
        except Experiment.DoesNotExist:
            return False

        return True

class UnityDataCreateView(CreateAPIView):
    queryset = UnityData.objects.all()
    serializer_class = UnityDataSerializer
    permission_classes = [HasExperimentToken]

    def perform_create(self, serializer):
        # Set the experiment based on the token 
        token = self.request.headers.get('Experiment-Token')
        experiment = Experiment.objects.get(token=token)
        
        # Set the current time
        current_time = datetime.now()

        # Save the UnityData instance
        serializer.save(experiment=experiment, timestamp=current_time)

class UnityDataView(ListAPIView):
    queryset = UnityData.objects.all()
    serializer_class = UnityDataSerializer
    permission_classes = [HasExperimentToken]  # Add this line

    def get_queryset(self):
        # Only return UnityData instances for the experiment the token identifier is associated with
        token = self.request.headers.get('Experiment-Token')
        experiment = Experiment.objects.get(token=token)
        return UnityData.objects.filter(experiment=experiment)
    
@login_required
def data_table(request):
    # Get the experiments the user is a part of
    user_experiments = Experiment.objects.filter(researchers=request.user)

    # Order data by date and filter by the user's experiments
    data = UnityData.objects.filter(experiment__in=user_experiments).order_by('-timestamp')

    # Group the data by day
    time = data.annotate(date=TruncDate('timestamp')).values('date').annotate(count=Count('id')).order_by('-date').values('date', 'count')
    
    # Make a count
    count = 1

    # For each day, get the details of the data
    for t in time:
        t['details'] = UnityData.objects.filter(experiment__in=user_experiments, timestamp__date=t['date']).order_by('-timestamp')
        # Determine the length of the details
        length = len(t['details'])

        t['count'] = count
        count += length

    return render(request, 'rest/data_table.html', {'data': data, 'time': time, 'experiments': user_experiments})

@login_required
def generate_csv(request):
    # Get the data from the form
    data = request.POST

    print(data)
    
    # If data contains the input "data_zip", then we want to create a zip file
    if 'data_zip' in data:

        # Create an in-memory byte buffer
        buffer = BytesIO()

        # Create a new ZipFile object using the byte buffer
        with zipfile.ZipFile(buffer, 'w') as zip_file:
            for key in data.keys():
                if key.startswith("checkbox"):
                    checkbox_id = key.split("-")[1]

                    # Get the data
                    experimentName = data.get('experimentName-' + checkbox_id)
                    csvData = data.get('csvData-' + checkbox_id)
                    timestamp = data.get('timestamp-' + checkbox_id)

                    # Create a csv file and write data to it
                    csv_data = StringIO()
                    writer = csv.writer(csv_data, delimiter=',')
                    writer.writerow(['experimentName', 'timestamp', 'csvData']) 
                    writer.writerow([experimentName, timestamp, csvData])

                    # Write the csv file to the zip file using 
                    csv_data.seek(0)
                    zip_file.writestr(checkbox_id + '.csv', csv_data.read())

        # Close the zip file
        zip_file.close()

        # Create a new response object
        response = HttpResponse(content_type='application/zip')
        
        # Set the content disposition of the response to "attachment" with a filename for the zip file
        response['Content-Disposition'] = 'attachment; filename="csv_files.zip"'

        # Write the content of the byte buffer to the response object
        response.write(buffer.getvalue())
    
    # If data does not contain the input "data_zip", then we want to create a csv file
    else:
        # Create a csv file and write data to it
        csv_data = StringIO()
        writer = csv.writer(csv_data, delimiter=',')

        # Define a variable to know if the header row has been written
        header_row_written = False

        # Write the header row to the CSV file
        header_row = ['experimentName', 'timestamp', 'csvData']

        writer.writerow(header_row)

        # Write data rows to the CSV file
        for key in data.keys():
            if key.startswith("checkbox"):
                checkbox_id = key.split("-")[1]

                # Get the data
                experimentName = data.get('experimentName-' + checkbox_id)
                csvData = data.get('csvData-' + checkbox_id)
                timestamp = data.get('timestamp-' + checkbox_id)

                # Write the data row to the CSV file
                data_row = [experimentName, timestamp, csvData]
                writer.writerow(data_row)

        # Create a new response object
        response = HttpResponse(content_type='text/csv')

        # Set the content disposition of the response to "attachment" with a filename for the CSV file
        response['Content-Disposition'] = 'attachment; filename="csv_file.csv"'

        # Get the CSV data as a string
        csv_data.seek(0)
        csv_content = csv_data.getvalue()

        # Set the CSV data as the response content
        response.write(csv_content)

    # Return the response object
    return response