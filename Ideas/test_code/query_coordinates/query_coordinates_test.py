import json

from cv2 import split


def search_city(json_object, city_name, country_name=""):
    if country_name != "":
        return [obj for obj in json_object if obj["country"] == country_name and obj["city"] == city_name]
    else:
        return [obj for obj in json_object if obj["city"] == city_name]


# Open city names dataset
with open("../../../additional_datasets/one_line_city_names.json", "r") as read_file:
    cities_data = json.load(read_file)

# Open city names dataset
with open("../../../additional_datasets/one_line_worldcities.json", "r") as read_file:
    cities_data2 = json.load(read_file)


city = "New York"
country = ""

# Try searching for city (input: city, country)
city_data = search_city(cities_data, city)
city_data2 = search_city(cities_data2, city)


if (city_data or city_data2):
    print(city_data, city_data2)
else:
    print(city + ", " + country + " not found.")
