do:
	lsof -ti:8000 | xargs kill -9 && python3 -m http.server 8000
	## http://localhost:8000

do2:
	## GET IP ADDRESS
	ipconfig getifaddr en0
	lsof -ti:8000 | xargs kill -9 && python3 -m http.server 8000 --bind 192.168.1.4
	## On phone: http://192.168.1.4:8000

