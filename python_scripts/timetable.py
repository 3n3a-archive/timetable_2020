import csv
import subprocess

def copy2clip(txt):
    cmd='echo "'+txt.strip()+'" | CLIP'
    return subprocess.check_call(cmd, shell=True)

"""
ORIGINAL:
<div class='s-act-tab orange' data-hours='9.55-10.40'>
	<div class='s-act-name'>SUBJECT</div>
	<div class='s-wrapper'>
		<div class='s-act-teacher'>TEACHER NAME</div>
		<div class='s-act-room'>ROOM</div>
	</div>
</div>
"""
html_2 = "'><div class='s-act-name'>"
html_3 = "</div><div class='s-wrapper'><div class='s-act-teacher'>"
html_4 = "</div><div class='s-act-room'>"
html_5 = "</div></div></div>"

colors = ["green", "orange", "red", "yellow", "blue", "pink", "black"] # 7 items
subj = {
	"Math": colors[0],
	"English": colors[1],
	"Sport": colors[2],
	"Philosophy": colors[3],
	"Class": colors[6],
	"German": colors[4],
	"French": colors[5],
	"spf": colors[0],
	"egf": colors[1],
	"Physics": colors[2],
	"History": colors[3],
	"Geography": colors[4],
	"Biology": colors[5],
}


def make(hours, subject, teacher, room):

	color = subj[subject]
	html_1 = "<div class='s-act-tab " + color + "' data-hours='" 

	html_snippet = html_1 + str(hours) + html_2 + str(subject) + html_3 + str(teacher) + html_4 + str(room) + html_5
	return html_snippet

# test_data = ["8.00-8.45", "Class", "R. Oberholzer", "R3.1"]
# print(make(test_data[0], test_data[1], test_data[2], test_data[3]))

# csv stuff
files = ["tuesday.csv", "wednesday.csv", "thursday.csv", "friday.csv"]
clip_content = ""
for file in files:
	html = ""
	with open(file) as csv_file:
		csv_reader = csv.reader(csv_file, delimiter=",")
		line_count = 0
		for row in csv_reader:
			if line_count == 0:
				line_count += 1
			else:
				snippet = make(str(row[0]), str(row[1]), str(row[2]), str(row[3]))
				html += snippet
				line_count += 1

	html_with_day = "<!--" + file + "-->" + html
	clip_content += html_with_day
	print("Processed " + file)

copy2clip(clip_content)
print("Copied all the HTML to the Clipboard!")
