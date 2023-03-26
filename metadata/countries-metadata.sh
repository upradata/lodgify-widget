#!/usr/bin/env bash

COUNTRIES="AT,BE,BG,CY,CZ,DK,EE,FI,FR,DE,GR,HU,IE,IT,LV,LT,LU,MT,NL,PL,PT,RO,SK,SI,ES,SE,GB,RS,UA,TR,CH,RU,NO,ME,MC,MD,MK,GE,HR,BA,BY,AZ,AL,US,CA"
CURRENT_DIR=$(dirname -- "$0")

case $1 in

"phone")
    libphonenumber-metadata-generator "$CURRENT_DIR"/json/libphonenumber-metadata.custom.json --countries "$COUNTRIES" --types mobile,fixed_line
    ;;

"timezone")
    ts-node "$CURRENT_DIR"/src/timezones.ts "$COUNTRIES"
    ;;

*)
    echo "Nothing to do with <$1>"
    ;;
esac
