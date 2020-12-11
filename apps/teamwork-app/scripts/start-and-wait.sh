yarn start --display minimal & 
set +e
i=0
until curl "http://localhost:8080" | grep -q "Teamwork"
do
  i=$((i+1))
  if [ "$i" -gt 30 ]
  then
    exit -1
  fi
  echo "Sleeping..."
  sleep 3
done
