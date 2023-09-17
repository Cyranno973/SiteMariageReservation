#!/bin/bash

# Obtenir la branche actuelle
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Selon la branche, construisez l'environnement approprié
if [ "$CURRENT_BRANCH" == "master" ]; then
    echo "Building for Production..."
    ng build --configuration production
else
    echo "Building for Development..."
    ng build --configuration development
fi
