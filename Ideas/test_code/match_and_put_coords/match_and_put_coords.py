import json
from sqlite3 import DataError


def get_year(date):
    split_date = date.split("/")
    year = split_date[2]
    return year

# Parse x/x/x


def parse_date_slash(date):
    split_date = date.split("/")
    day = split_date[1]
    month = split_date[0]
    year = split_date[2]

    return day, month, year

# Parse month day-nr, year-nr


def parse_date_custom(date):
    months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"]

    # Remove ',' and split
    split_date = date.replace(',', '').split(' ')

    split_date[0] = str(months.index(split_date[0]) + 1)
    month = split_date[0]
    year = split_date[2]

    # Remove first '0' | example: 03 -> 3
    if split_date[1][0] == '0':
        day = split_date[1][1:]
    else:
        day = split_date[1]

    return day, month, year


def match_and_put_in_coords(data, loc_entry):
    # Parse location date
    loc_day, loc_month, loc_year = parse_date_slash(loc_entry["date"])

    date_match_count = 0
    date_and_location_match_count = 0

    # Go over entries in 'main' date -> match and put in coords
    for entry in data:
        # Parse 'main' date
        day, month, year = parse_date_custom(entry["date"])

        # Remove whitespaces from all locations (removes any space errors)
        loc_location = loc_entry["location"].replace(" ", "")
        location = entry["location"].replace(" ", "")

        # Match dates
        if (loc_day == day and loc_month == month and loc_year == year):
            date_match_count += 1
            # Match location (with all, without 'Near', without 'Off')
            if (loc_location == location or loc_location == location.replace("Near", "").replace("Off", "")):
                date_and_location_match_count += 1
                # Copy coords into coordinates property of 'main' data
                entry["coordinates"] = loc_entry["coords"]

    # If no match or no unique match
    if date_and_location_match_count == 0 or date_and_location_match_count > 2:
        print("Date:", loc_day, loc_month, loc_year)
        print("Locaton:", loc_entry["location"])
        print("Route:", loc_entry["route"])
        print("Date matches:", date_match_count)
        print("Date + location matches:", date_and_location_match_count)
        print("===============================================================")

    # Return changed 'main' data
    return data


# Read location data
with open('locations.json', 'r') as f:
    loc_data = json.load(f)

# Go over location entries
for loc_entry in loc_data:

    # Read 'main' data from location's year
    year_path = get_year(loc_entry["date"]) + '_data.json'
    with open(year_path, 'r') as f:
        data = json.load(f)

    new_data = match_and_put_in_coords(data, loc_entry)

    # Write new 'main' data (with coordinates)
    with open(year_path, 'w') as file:
        json.dump(new_data, file)
