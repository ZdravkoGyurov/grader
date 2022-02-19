mkdir -p ./public/config
echo "window._env_ = {" > ./public/config/env-config.js
awk -F '=' '{ print $1 ": \"" (ENVIRON[$1] ? ENVIRON[$1] : $2) "\"," }' ./.env >> ./public/config/env-config.js
echo "}" >> ./public/config/env-config.js