docker build -t atakan1927/notetakeapp .
docker tag atakan1927/notetakeapp atakan1927/notetakeapp:latest
docker push atakan1927/notetakeapp:latest
wget 'https://api.render.com/deploy/srv-cr5q92bqf0us739s55d0?key=TCJKWy5wXCw' -O /dev/null
