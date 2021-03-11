#!/bin/bash

if [ $# -eq 0 ]
  then
    http :2019/id/httpsredirects/host | toyaml
    exit
fi

echo "POSTING: $1"
http POST :2019/id/httpsredirects/host <<< "\"$1\""
