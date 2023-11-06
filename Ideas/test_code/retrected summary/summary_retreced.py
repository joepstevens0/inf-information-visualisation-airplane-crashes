import json
from turtle import begin_fill
BEGIN_YEAR = 1920
END_YEAR = 1921
#END_YEAR = 2020
PATH_READ = "C:/Users/thomi/Documents/Master/visual/git/Information-Visualisation-airplane/Ideas/test_code/retrected summary/test_data/"
PATH_WRITE = "./worked_data/"
key_words = []


#File for keywords needs to be expended to include more
#Also maybe use of categories like storm, wind == weather
def find_keywords(summary):
    list_key = []
    for i in key_words:
        if(i in summary):
            list_key.append(i)

    return list_key



def loop_years():
    for i in range(BEGIN_YEAR, END_YEAR):
        file = open (PATH_READ+str(i)+"_data.json", "r")
        data = json.load(file)
        for j in data:
            print( find_keywords(j["summary"]))

file = open("key_wordlist.txt", "r")
data = file.read()
key_words=data.split("\n")

loop_years()

