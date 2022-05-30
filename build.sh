#!/bin/bash

if [[ $NODE_ENV == "production" ]]
then
    yarn --cwd frontend run build;
    yarn --cwd backend run build;
fi