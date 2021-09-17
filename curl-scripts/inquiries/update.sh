#!/bin/bash

#  ID="6142150a16c71e836433964d" TOKEN="e929f46adb635848e8708938c5a640bf" CONTENT="testing update curl script" sh curl-scripts/inquiries/update.sh

API="http://localhost:4741"
URL_PATH="/inquiries"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "inquiry": {
      "content": "'"${CONTENT}"'"
    }
  }'

echo