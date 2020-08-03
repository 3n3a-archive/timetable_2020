# Author: Enea Krähenbühl

def reverse(number, hour):
	hour_calc = int(hour) * 60
	reversed_time = int(number) - int(hour_calc)
	print(str(hour) + "." + str(reversed_time))

def transform(hours, minutes):
	number = (hours * 60) + minutes
	return number

numbers = []

for i in ["8.45", "9.35", "10.40", "11.30", "12.25", "13.15", "14.15", "15.05", "16.05", "16.55", "17.45"]:
	# makes the right format for transform func
	time = i.split(".")
	hours = int(time[0])
	minutes = int(time[1])

	numbers.append(transform(hours, minutes))

print(numbers)
