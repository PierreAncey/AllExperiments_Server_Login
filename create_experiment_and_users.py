import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portal.settings')
django.setup()

from django.contrib.auth.models import User
from rest.models import UnityData, Experiment

# Function to create a new researcher
def create_researcher(username, password):
    researcher, _ = User.objects.get_or_create(username=username)
    researcher.set_password(password)  # Set a password
    researcher.save()
    return researcher

# Function to create a new experiment group and users
def create_experiment(experiment_name, researchers):
    # Create the experiment
    experiment = Experiment(name=experiment_name)

    # Generate a unique token for the experiment
    experiment.token = uuid.uuid4()

    # Save the experiment
    experiment.save()

    # Assign researchers to the experiment
    for researcher in researchers:
        experiment.researchers.add(researcher)

    # Add the superuser to the experiment if it exists
    superuser = User.objects.filter(is_superuser=True).first()
    if superuser:
        experiment.researchers.add(superuser)
    else:
        print("No superuser found")

    # Print the token to the console with the experiment name
    print(f"Token for {experiment_name}: {experiment.token}")

    # Assign the experiment to a UnityData instance
    unity_data = UnityData(experiment=experiment)
    unity_data.save()

# Example usage
researcher1 = create_researcher('Researcher1', 'password1')
researcher2 = create_researcher('Researcher2', 'password2')
researcher3 = create_researcher('Researcher3', 'password3')
researcher4 = create_researcher('Researcher4', 'password4')

create_experiment('ExperimentA', [researcher1, researcher2])
create_experiment('ExperimentB', [researcher2, researcher3])
create_experiment('ExperimentC', [researcher4])