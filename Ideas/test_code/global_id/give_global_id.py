import json

global_id = 0

start_year = 1920
end_year = 2020

#     "date": "January 02, 2020",
#     "time": "?",
#     "location": "Geneina, Sudan",
#     "operator": "Sudanese Air Force",
#     "flight#": "?",
#     "route": "Geneina - Khartoum",
#     "actype": "Antonov An12-A",
#     "registration": "?",
#     "cn/ln": "2340606",
#     "aboard": "18",
#     "aboard_passengers": "9",
#     "aboard_crew": "9",
#     "fatalities": "18",
#     "fatalities_passengers": "9",
#     "fatalities_crew": "9",
#     "ground": "?",
#     "summary": "The aircraft"
#     "coordinates": "?",
#     "near_coordinates": "?"

def give_global_id(data):
    global global_id

    new_data = []

    # Add all crashes to new_data
    for crash in data:
        # Empty new entry
        new_entry = {}

        print(global_id)
        new_entry["id"]                     = global_id
        new_entry["date"]                   = crash["date"]
        new_entry["time"]                   = crash["time"]
        new_entry["location"]               = crash["location"]
        new_entry["operator"]               = crash["operator"]
        new_entry["flight#"]                = crash["flight#"]
        new_entry["route"]                  = crash["route"]
        new_entry["actype"]                 = crash["actype"]
        new_entry["registration"]           = crash["registration"]
        new_entry["cn/ln"]                  = crash["cn/ln"]
        new_entry["aboard"]                 = crash["aboard"]
        new_entry["aboard_passengers"]      = crash["aboard_passengers"]
        new_entry["aboard_crew"]            = crash["aboard_crew"]
        new_entry["fatalities"]             = crash["fatalities"]
        new_entry["fatalities_passengers"]  = crash["fatalities_passengers"]
        new_entry["fatalities_crew"]        = crash["fatalities_crew"]
        new_entry["ground"]                 = crash["ground"]
        new_entry["summary"]                = crash["summary"]
        new_entry["coordinates"]            = crash["coordinates"]
        new_entry["near_coordinates"]       = crash["near_coordinates"]
        
        new_data.append(new_entry)
        global_id += 1

    return new_data


for year in range(start_year, end_year + 1):
    # Read 'main' data from location's year
    year_path = str(year) + '_data.json'
    with open("original_data/" + year_path, 'r') as f:
        data = json.load(f)

    new_data = give_global_id(data)

    # Write new 'main' data (with coordinates)
    with open(year_path, 'w') as file:
        json.dump(new_data, file)

   