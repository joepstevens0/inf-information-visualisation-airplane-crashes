from pykml import parser
from os import path

import json


def remove_unicode(string_unicode):
    # If not NoneType
    if string_unicode:
        string_encode = string_unicode.encode("ascii", "ignore")
        string_decode = string_encode.decode()
        return string_decode
    else:
        return string_unicode


kml_file = path.join('locations.kml')

# Load and parse KML file
with open(kml_file) as f:
    doc = parser.parse(f).getroot()


# Array of entries (dicts)
entries = []
entry = {}

# Go over all placemarkers (element = e)
for folder in doc.Document.Folder:
    for e in folder.Placemark:
        # New JSON entry
        entry = {}

        date = e.name
        coords = e.Point.coordinates.text.strip()[:-2].split(',')

        # Get location + route out of extended data (has name attribute)
        for data in e.ExtendedData.Data:
            if data.get("name") == "Location":
                location = data.value
            if data.get("name") == "Route":
                route = data.value

        # Fill JSON entry
        entry["date"] = remove_unicode(date.text)
        entry["location"] = remove_unicode(location.text)
        entry["route"] = remove_unicode(route.text)
        entry["coords"] = coords

        # Push JSON entry into entries
        entries.append(entry)

# Open write file & dump JSON data into it
with open("locations.json", 'w') as file:
    json.dump(entries, file)
