#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "  Usage: $0 REPO"
    exit 1
fi

BASE=`basename "$1"`
CONFIG="${HOME}/.ssh/config"
ssh-keygen -t rsa -f "${HOME}/.ssh/${BASE}.id_rsa" -N ""

echo >> "$CONFIG"
echo "Host github.${BASE}" >> "$CONFIG"
echo "User git" >> "$CONFIG"
echo "Hostname github.com" >> "$CONFIG"
echo "IdentityFile=/home/gar/.ssh/${BASE}.id_rsa" >> "$CONFIG"
echo >> "$CONFIG"
