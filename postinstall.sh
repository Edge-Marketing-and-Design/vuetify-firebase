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

cp "./src/composables/edgeGlobal.ts" "$project_root/composables/edgeGlobal.ts"
cp "./src/composables/vuetify.ts" "$project_root/composables/vuetify.ts"


# Update the auth middleware

# Extract new block content.
new_block=$(awk '/\/\/ EDGE START/,/\/\/ EDGE END/' ./src/middleware/auth.ts | sed '1d;$d' | sed -e '1s/^/\/\/ EDGE START\n/' -e '$s/$/\n\/\/ EDGE END/')

# Create a temporary file.
temp_file=$(mktemp)

# Flag to indicate whether we are before, inside, or after the block.
state="before"

while IFS= read -r line; do
  case $state in
    before)
      if [[ $line == *'// EDGE START'* ]]; then
        state="inside"
        # Insert new block when we reach the start of the old block.
        echo "$new_block" >> "$temp_file"
      else
        echo "$line" >> "$temp_file"
      fi
      ;;
    inside)
      if [[ $line == *'// EDGE END'* ]]; then
        state="after"
      fi
      # Do nothing for lines inside the old block.
      ;;
    after)
      echo "$line" >> "$temp_file"
      ;;
  esac
done < "$project_root/middleware/auth.ts"

# Replace the original file with the new file.
mv "$temp_file" "$project_root/middleware/auth.ts"
