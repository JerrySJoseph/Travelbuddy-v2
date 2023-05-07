import json
import uuid


class Destination:
    def __init__(self, id, name, city, country):
        self.id = id
        self.name = name
        self.city = city
        self.country = country
        self.attractions = []
        self.reviews = []

    def __str__(self):
        return f"Destination{{\n    id: {self.id},\n    name: {self.name},\n    city: {self.city},\n    country: {self.country},\n    attractions: {self.attractions},\n    reviews: {self.reviews},\n}}"


def convert_to_destination(data):
    destinations = []

    for item in data:
        destination_id = str(uuid.uuid4())
        destination_name = item['name']
        destination_city = item['subcountry']
        destination_country = item['country']

        destination = Destination(destination_id, destination_name, destination_city, destination_country)
        destinations.append(destination)

    return destinations


def destination_to_dict(destination):
    return {
        'id': destination.id,
        'name': destination.name,
        'city': destination.city,
        'country': destination.country,
        'attractions': destination.attractions,
        'reviews': destination.reviews
    }


with open('cities.json', 'r') as file:
    input_data = json.load(file)

destinations = convert_to_destination(input_data)

destination_dicts = [destination_to_dict(destination) for destination in destinations]

with open('output.json', 'w') as file:
    print(len(destination_dicts))
    json.dump(destination_dicts, file, indent=4)
