import os
import sys

args = sys.argv
filename = args[1]
fin = open(filename, 'r', encoding='utf_8')
data = fin.read()
fout = open("new_" + filename, "wt", encoding='utf_8')
lines = data.split("\n")
for line in lines:
    if line.startswith("("):
        useful_info = line.split(",")
        new_info = useful_info[0] + "," + useful_info[1] + "," + useful_info[2] + "),\n"
        #new_info = useful_info[0] + "," + useful_info[1] + "),\n"
        fout.write(new_info)
    else:
        fout.write(line)
fin.close()
fout.close()   