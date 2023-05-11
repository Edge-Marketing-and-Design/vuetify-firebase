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

sed -i.backup '/\/\/ EDGE START/,/\/\/ EDGE END/d' "$project_root/middleware/auth.ts"

awk '/\/\/ EDGE START/,/\/\/ EDGE END/' ./src/middleware/auth.ts | \
  sed '1d;$d' | \
  sed -e '1s/^/\/\/ EDGE START\n/' -e '$s/$/\n\/\/ EDGE END/' \
  >> "$project_root/middleware/auth.js";