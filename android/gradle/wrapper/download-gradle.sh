#!/bin/bash

GRADLE_VERSION="8.0"
GRADLE_URL="https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip"
GRADLE_ZIP="gradle-${GRADLE_VERSION}-bin.zip"
GRADLE_DIR="$(dirname "$0")"

echo "Checking for Gradle distribution..."

if [ ! -f "${GRADLE_DIR}/${GRADLE_ZIP}" ]; then
    echo "Gradle distribution not found. Downloading from ${GRADLE_URL}..."
    curl -L -o "${GRADLE_DIR}/${GRADLE_ZIP}" "${GRADLE_URL}"
    
    if [ $? -eq 0 ]; then
        echo "Download successful!"
    else
        echo "Download failed. Please check your internet connection and try again."
        exit 1
    fi
else
    echo "Gradle distribution already exists at ${GRADLE_DIR}/${GRADLE_ZIP}"
fi

echo "Gradle setup complete."
