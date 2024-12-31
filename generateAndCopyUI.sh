#!/bin/bash

#####################################################################################
## Author   : Gurumeet Singh
## Date     : 23.05.2023
## Purpose  : This script creates a angular build copies it REST-API WEB-INF folder and 
##            triggers the build script of REST-API
#####################################################################################
#####################################################################################

UI_BRANCH_NAME=${1}
API_BRANCH_NAME=${2}
REST_API_ROOT_LOC=${3}
EXTRA_ACTION=${4}
PORTAL_NAME=${5}

validation() {

  START_TIME=$(date +%s)

  if [ -z ${UI_BRANCH_NAME} ] || [ -z ${API_BRANCH_NAME} ] || [ -z ${REST_API_ROOT_LOC} ]; then
      echo "!! Script Usage is ./generateAndCopyUI.sh <ui-branch-name> <rest-api-branch-name> <rest-api-root-path>"
      exit 1
  fi

  echo "++++++++++++++++++++++++++++++++++++++"
  echo "Now Do some basic Sanity checks"

  if [[ -z $(git ls-remote --heads origin ${UI_BRANCH_NAME}) ]]; then
      echo "ERROR : !! Branch does not exist : ${UI_BRANCH_NAME}"
      exit 1
  fi

  ELAPSED=$(($(date +%s) - ${START_TIME}))
  echo ">> Main Script Step.1 [OK] : ${ELAPSED} secs <<"

}

makeBuild(){

  START_TIME=$(date +%s)

  echo "++++++++++++++++++++++++++++++++++++++"
  echo "Now Start the building of Angular Code"

  git checkout ${UI_BRANCH_NAME} || {
    echo "!!ERROR : Please stash/revert changes and then try again"; 
      BRANCH_SPEC_LOC=${HOME}/releases/${PORTAL_NAME}/$(date +%Y-%m-%d)/${EXTRA_ACTION}
    exit 1;
    }
  git pull
  npm install --force
  git checkout package-lock.json
  rm -rf dist
  ng build

  cd dist/*-portal && tar -zcf dist_UI.tar.gz *

  ELAPSED=$(($(date +%s) - ${START_TIME}))
  echo ">> Main Script Step.2 [OK] : ${ELAPSED} secs <<"

}

transferToAPI(){
  
  START_TIME=$(date +%s)

  echo "++++++++++++++++++++++++++++++++++++++"
  echo "Now ship the UI-Components to API path"

  DEST_LOCATION=${REST_API_ROOT_LOC}/src/main/webapp

  if [ ! -d ${DEST_LOCATION} ]; then
      echo "ERROR : !! The REST API Path is Invalid, Copy command failed : ${REST_API_ROOT_LOC}"
      exit 1
  fi

  rm -rf ${DEST_LOCATION}/assets
  rm -f ${DEST_LOCATION}/*
  echo "Old UI-Components deleted from API path [ This will raise error above (but can be ignored ;) ]"

  cp -p dist_UI.tar.gz ${DEST_LOCATION} && cd ${DEST_LOCATION} && tar -xf dist_UI.tar.gz && rm dist_UI.tar.gz
  echo "New UI-Components copied to API path"

  cd ../../../

  if [[ -z $(git ls-remote --heads origin ${API_BRANCH_NAME}) ]]; then
      echo "ERROR : !! Branch does not exist : ${API_BRANCH_NAME}"
      exit 1
  fi

  # Now build the REST API war file with UI
  echo "--------------------------------------"
  echo "--------------------------------------"
  echo "Now execute ./build.sh of API project "
  
  git checkout ${API_BRANCH_NAME} || {
    echo "!!ERROR : Please stash/revert changes and then try again"; 
    exit 1;
    }
  git pull

  ./build.sh

   if [ ! -z ${EXTRA_ACTION} ]; then
      
      BRANCH_SPEC_LOC=${HOME}/releases/${PORTAL_NAME}/$(date +%Y-%m-%d)/${EXTRA_ACTION}

      mkdir -p ${BRANCH_SPEC_LOC}
      cp ${REST_API_ROOT_LOC}/build/distributions/rtsp-*.tar ${BRANCH_SPEC_LOC}
   fi;

  echo "--------------------------------------"
  echo "--------------------------------------"

  ELAPSED=$(($(date +%s) - ${START_TIME}))
  echo ">> Main Script Step.3 [OK] : ${ELAPSED} secs <<"

}



## Main Script : start
validation
makeBuild
transferToAPI
## Main Script : end
