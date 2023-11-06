import json

from cv2 import split


def search_city(json_object, city_name, country_name=""):
    if country_name != "":
        return [obj for obj in json_object if obj["country"] == country_name and obj["city"] == city_name]
    else:
        return [obj for obj in json_object if obj["city"] == city_name]


def query_coordinates_of_entries(year):
    global cities_data
    global cities_data2

    global one_count
    global two_count
    global more_two_count

    global found
    global not_found

    # Open entries of given year
    year_path = str(year) + '_data.json'
    with open(year_path, 'r') as f:
        entries = json.load(f)

    for entry in entries:
        # Clean + split location data
        split_location = entry["location"].replace("Near", "").replace(
            "Off", "").replace("Over the", "").strip().split(",")

        # Strip individuel location of there whitespaces on both sides
        for i in range(len(split_location)):
            split_location[i] = split_location[i].strip()

        # Sea/Ocean?
        if len(split_location) == 1:
            one_count += 1
            # Skip for now

        # City + country?
        elif len(split_location) == 2:
            two_count += 1

            # Try searching for city (input: city, country)
            city_data = search_city(
                cities_data, split_location[0], split_location[1])
            city_data2 = search_city(
                cities_data2, split_location[0], split_location[1])

            if (city_data or city_data2):
                found += 1
            else:
                # print(split_location[0], "not found.")
                not_found += 1

        # City + ... + country?
        elif len(split_location) > 2:
            more_two_count += 1


# Open city names dataset
with open("../../../additional_datasets/one_line_city_names.json", "r") as read_file:
    cities_data = json.load(read_file)

# Open city names dataset
with open("../../../additional_datasets/one_line_worldcities.json", "r") as read_file:
    cities_data2 = json.load(read_file)


# Count the location variations
one_count = 0
two_count = 0
more_two_count = 0

found = 0
not_found = 0

# Go over all years and query coordinates of locations
begin_year = 1920
end_year = 2020
for year in range(begin_year, end_year + 1):
    query_coordinates_of_entries(year)

print("One part locations:", one_count)
print("Two part locations:", two_count)
print("More then two part locations:", more_two_count)

print("Found:", found)
print("Not found:", not_found)
