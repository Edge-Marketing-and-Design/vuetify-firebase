#!/bin/bash

# Resolve the symlink and get the actual directory path
actual_dir=$(readlink -f $(dirname $0))
# Get the project root directory by removing the node_modules directory path
project_root=$(echo "$actual_dir" | awk '{gsub(/node_modules.*$/, ""); print}')


# define the source and destination directories
source_dir="./src/"
destination_dir="$project_root/"

# use rsync to copy files from the source to the destination
rsync -av --ignore-existing "$source_dir" "$destination_dir"

# Overwrite app.vue Once
if [ ! -f "$project_root/app.vue.flg" ]; then
  cp "./src/app.vue" "$project_root/app.vue" 
  # If the file does not exist, create it and add the rules_version line
  touch "$project_root/app.vue.flg";
fi

# Overwrite Nuxt Config Once
if [ ! -f "$project_root/nuxt.config.flg" ]; then
  cp "./src/nuxt.config.js" "$project_root/nuxt.config.js" 
  # If the file does not exist, create it and add the rules_version line
  touch "$project_root/nuxt.config.flg";
fi

# Overwrite Firebase Config Once
if [ ! -f "$project_root/firebase.flg" ]; then
  cp "./src/firebase.json" "$project_root/firebase.json" 
  # If the file does not exist, create it and add the rules_version line
  touch "$project_root/firebase.flg";
fi

sed -i.backup '/\/\/ EDGE START/,/\/\/ EDGE END/d' "$project_root/middleware/auth.js"

awk '/\/\/ EDGE START/,/\/\/ EDGE END/' ./src/middleware/auth.js | \
  sed '1d;$d' | \
  sed -e '1s/^/\/\/ EDGE START\n/' -e '$s/$/\n\/\/ EDGE END/' \
  >> "$project_root/middleware/auth.js";