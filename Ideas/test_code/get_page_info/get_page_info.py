from re import L
from turtle import end_fill
import requests
import urllib.request
import lxml.html
import json


BEGINSTRING = "- ACCIDENT DETAILS"
ENDSTRING = "Sources\nReturn to Home Page "

def write_to_file(filtered, year):
    f = open(str(year)+"_data.json", "w")
    f.write(filtered)
    f.close()

def remove_front_backpart(to_filter):
    to_filter = to_filter.replace("\n\n", "").replace("\t", "").replace("  ", "")
    index_to_remove_front =to_filter.find(BEGINSTRING) + len(BEGINSTRING)
    filtered = to_filter[index_to_remove_front:]
    index_to_remove_back = filtered.find(ENDSTRING)
    filtered = filtered[:index_to_remove_back]
    filtered = filtered.replace("\n\n", "|")
    filtered = filtered.replace("\n", "")
    return special_split(filtered)

def special_split(data):
    return data.replace("passengers:", "passengers;").replace("crew:", "crew;")
    

def split_forJSON(textfile):
    textsplit = textfile.split("|")
    textsplit = list(filter(None, textsplit))
    #print(textsplit)
    #print("\n\n")
    textReadyDict = [j.split(":") for j in textsplit]
    #print(textReadyDict)
    #dicttext = {textReadyDict[i]: textReadyDict[i+1] for i in range(0, len(textReadyDict), 2)}
    jsonString = json.dumps(textReadyDict)
    return jsonString


def get_data(weburl):
    data = weburl.read()
    text = lxml.html.fromstring(data)
    text =(text.text_content())

    filtered = remove_front_backpart(text)
    filtered=split_forJSON(filtered)
    return filtered
    #print(filtered)
    #write_to_file(filtered)

year = 1921
urlbasis = 'http://www.planecrashinfo.com/'
end_url = ".htm"

def check_year(url, year):
    counter = 1
    data_for_json = ""
    check = True
    while(check):
        try:
            check=requests.head(url+str(counter)+end_url, allow_redirects=True).status_code == 200
            if(check):
                weburl = urllib.request.urlopen(url+str(counter)+end_url)
                temp=get_data(weburl)
                data_for_json += temp
                counter += 1
        except:
            write_to_file(data_for_json, year)

    write_to_file(data_for_json, year)

def init_years(year):
    while(year < 2021):
        url = urlbasis+str(year)+"/"+str(year)+"-"
        check_year(url, year)
        print(year)
        year+=1

init_years(year)