#!/bin/bash

# ID="6142171916c71e836433964e" TOKEN="e929f46adb635848e8708938c5a640bf" sh curl-scripts/inquiries/delete.sh

API="http://localhost:4741"
URL_PATH="/inquiries"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo