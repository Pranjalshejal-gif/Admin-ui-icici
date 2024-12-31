#!/bin/bash

#####################################################################################
## Author   : Saurabh Dagwar
## Date     : 14.06.2023
## Purpose  : This script creates a angular build copies it REST-API WEB-INF folder and 
##            triggers the build script of REST-API
#####################################################################################
#####################################################################################

## merchant portal project location path
MERCHANT_LOCATION=${MERCHANT_CODEBASE_LOCATION}
## admin portal project location path
ADMIN_LOCATION=${ADMIN_CODEBASE_LOCATION}


## Check - project location path has set in bashrc if not then set it
if [ -z ${MERCHANT_LOCATION} ] || [ -z ${ADMIN_LOCATION} ]; then
  echo "!! Error MERCHANT_LOCATION or ADMIN_LOCATION is not set, Please do it via ~/.bashrc and execute this again....   "
  exit 1
fi

##for loop- make build for admin portal for all bank
for i in feat-rtsp-dev-yes feat-rtsp-dev-IndusInd  feat-rtsp-dev-sbi  feat-rtsp-dev-idfc feat-rtsp-dev-icici
do 

BANK_NAME=${i##*-}
echo "*************************************************"
echo ">>>> Executing for ${BANK_NAME} Bank-Admin Portal"
echo "*************************************************"

## execute generateAndCopyUI this script for admin  of all banks
./generateAndCopyUI.sh $i admin-portal-ws ${ADMIN_LOCATION} ${BANK_NAME} admin

sleep 2;
done


## same for merchant portal 
for i in feat-merchant-dev-yes feat-merchant-dev-IndusInd feat-merchant-dev-sbi  feat-merchant-dev-idfc feat-merchant-dev-icici
do 

BANK_NAME=${i##*-}
echo "*********************************************************"
echo ">>>> Executing for ${BANK_NAME} Bank-Merchant Portal <<<<"
echo "*********************************************************"

## execute generateAndCopyUI this script for merchant  of all banks
./generateAndCopyUI.sh $i merchant-portal-2FA-encrypted-payload ${MERCHANT_LOCATION} ${BANK_NAME} merchant

sleep 2;
done


