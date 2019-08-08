#!/bin/bash

git config --global user.name "WOB"
git config --global user.email "contact@workonblockchain.com"
git log --pretty=format:'%h' -n 1
export GIT_HASH=$(git log --pretty=format:'%h' -n 1)
export SERVER_VERSION="server_"$GIT_HASH"_$1"
export SERVER_VERSION_FILE="{ \"version\": \""$SERVER_VERSION"\" }"
export SERVER_ZIP_FILE="$SERVER_VERSION.zip"
export CLIENT_VERSION="client_"$GIT_HASH"_$1"
export CLIENT_VERSION_FILE="{ \"version\": \""$SERVER_VERSION"\" }"
export CLIENT_ZIP_FILE="$CLIENT_VERSION.zip"
