#!/bin/bash

if [[ $NODE_ENV == "production" ]]
then
    npm --prefix frontend install;
    npm --prefix backend install;
fi