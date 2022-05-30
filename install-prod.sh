#!/bin/bash

npm --prefix frontend install;
npm --prefix frontend install --only=dev;
npm --prefix backend install;
npm --prefix backend install --only=dev;
