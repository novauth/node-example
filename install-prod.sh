#!/bin/bash

if [[ $NODE_ENV != "production" ]]
then
    yarn --cwd frontend install;
    yarn --cwd backend install;
fi