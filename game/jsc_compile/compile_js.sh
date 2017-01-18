#!/bin/bash

rm -rf ./outPutFile/*
rm -rf ./sourceFile/*

cp -Rf ../frameworks/cocos2d-x/cocos/scripting/js-bindings/script ./sourceFile/
cp -Rf ../src ./sourceFile/
cp ../main.js ./sourceFile/

cocos jscompile -s ./sourceFile/ -d ./outPutFile/