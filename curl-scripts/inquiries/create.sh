#!/bin/bash

# TOKEN="e929f46adb635848e8708938c5a640bf" SUBJECT="test text" CONTENT="this is a test post" sh curl-scripts/inquiries/create.sh

API="http://localhost:4741"
URL_PATH="/inquiries"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "inquiry": {
      "subject": "'"${SUBJECT}"'",
      "content": "'"${CONTENT}"'"
    }
  }'

  echo