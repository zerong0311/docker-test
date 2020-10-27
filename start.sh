#!/bin/bash
currntDir=$PWD
volumeDataDir=${currntDir}'/data'
isDataExist=false

ECHO ${currntDir};
ECHO ${volumeDataDir};
ECHO ${isDataExist};

#check if data is exist 
if [ -d "${volumeDataDir}" ]; then
  ECHO "${volumeDataDir} FOUND"
else
  ECHO "${volumeDataDir} NOT FOUND"
  exit 1
fi