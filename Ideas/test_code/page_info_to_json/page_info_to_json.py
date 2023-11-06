import json


def remove_unicode(string_unicode):
    # If not NoneType
    if string_unicode:
        string_encode = string_unicode.encode("ascii", "ignore")
        string_decode = string_encode.decode()
        return string_decode
    else:
        return string_unicode


def get_amount(field):
    total_end = field.find(' ')

    pass_start = field.find(';') + 1
    crew_start = field.find(';', pass_start) + 1
    pass_end = field.find(' ', pass_start)
    crew_end = field.find(' ', crew_start)

    total_amount = field[:total_end]
    pass_amount = field[pass_start:pass_end]
    crew_amount = field[crew_start:crew_end]

    return pass_amount, crew_amount, total_amount


def split_aboard(entry):
    clean_entry = remove_unicode(entry["aboard"])
    pass_amount, crew_amount, total_amount = get_amount(clean_entry)
    entry["aboard_passengers"] = pass_amount
    entry["aboard_crew"] = crew_amount
    entry["aboard"] = total_amount


def split_fatalities(entry):
    clean_entry = remove_unicode(entry["fatalities"])
    pass_amount, crew_amount, total_amount = get_amount(clean_entry)
    entry["fatalities_passengers"] = pass_amount
    entry["fatalities_crew"] = crew_amount
    entry["fatalities"] = total_amount


def convert_file(year):
    read_path = "./jq_output/" + str(year) + "_data.json"
    write_path = "./" + str(year) + "_data.json"

    file = open(read_path, "r")

    # Read
    data = file.read()
    # Remove parentheses(")
    data = data.replace('"', '')
    # Split on newline(\n)
    data = data.split("\n")

    # Array of entries (dicts)
    entries = []
    entry = {}

    fields = ["Date", "Time", "Location", "Operator", "Flight #", "Route", "ACType",
              "Registration", "cn / ln", "Aboard", "Fatalities", "Ground", "Summary"]

    for i in range(len(data)):
        # print(data[i])
        # First field -> new entry
        if (data[i] == fields[0]):
            entry = {}

        # Fields
        for field in fields:
            if (data[i] == field):
                refactored_field = field.replace(' ', '').lower()
                entry[refactored_field] = remove_unicode(data[i+1])

        if (data[i] == "Aboard"):
            split_aboard(entry)
        if (data[i] == "Fatalities"):
            split_fatalities(entry)

        # Last field -> add to array of entries
        if (data[i] == fields[len(fields) - 1]):
            entries.append(entry)

    # Go over all entries and put in 'coordinates' and 'near_coordinates' property:
    for entry in entries:
        # Add 'coordinates'
        entry["coordinates"] = "?"
        # Add 'near_coordinates'
        entry["near_coordinates"] = "?"

    # Open write file
    with open(write_path, 'w') as file:
        json.dump(entries, file)


begin_year = 1920
end_year = 2020
for year in range(begin_year, end_year + 1):
    convert_file(year)
