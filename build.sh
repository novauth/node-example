#!/bin/bash

if [[ $NODE_ENV == "production" ]]
then
    npm --prefix frontend run build;
    npm --prefix backend run build;
fi