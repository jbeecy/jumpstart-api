#!/bin/sh

# TOKEN="e929f46adb635848e8708938c5a640bf" sh curl-scripts/inquiries/index.sh

API="http://localhost:4741"
URL_PATH="/inquiries"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo