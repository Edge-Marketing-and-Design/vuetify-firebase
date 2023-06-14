#!/bin/bash
echo "Please select the framework:"
options=("vuetify" "ionic" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "vuetify")
            echo "You chose vuetify"
            framework="vuetify"
            break
            ;;
        "ionic")
            echo "You chose ionic"
            framework="ionic"
            break
            ;;
        "Quit")
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done
mv ./node_modules/@edgedev/firebase-framework/project_files/.npmrc ./.npmrc
mv ./node_modules/@edgedev/firebase-framework/project_files/.env ./.env
mv ./node_modules/@edgedev/firebase-framework/project_files/init_package_${framework}.json ./package.json
mv ./node_modules/@edgedev/firebase-framework/project_files/app_${framework}.vue ./app.vue

[ ! -d "./composables/" ] && mkdir -p "./composables/"
[ ! -d "./pages/" ] && mkdir -p "./pages/"

rsync -av --ignore-existing "./node_modules/@edgedev/firebase-framework/project_files/composables_${framework}/" "./composables/"
rsync -av --ignore-existing "./node_modules/@edgedev/firebase-framework/project_files/pages_${framework}/" "./pages/"
rsync -av --ignore-existing "./node_modules/@edgedev/firebase-framework/project_files/plugins_${framework}/" "./plugins/"

pnpm install --shamefully-hoist=true --strict-peer-dependencies=false --unsafe-perm=true --side-effects-cache=false --ignore-scripts=false

# Prompt for the project ID
echo "Please enter your Firebase project ID:"
read project_id

# Check if project_id is empty
if [ -z "$project_id" ]; then
  echo "Error: Firebase project ID cannot be empty."
  exit 1
fi

# Check if firebase is installed
if ! command -v firebase &> /dev/null; then
  echo "Firebase CLI could not be found. Please install it and try again."
  exit 1
fi

# Check if firebase.json exists and make a backup
if [ -f ./firebase.json ]; then
  cp ./firebase.json ./firebase.json.temp
fi

# Check if firestore.rules exists and make a backup
if [ -f ./firestore.rules ]; then
  cp ./firestore.rules ./firestore.rules.temp
fi

# Initialize Firebase
firebase use --add $project_id --alias default
firebase init firestore functions hosting storage emulators --project default

# Restore firebase.json from backup
if [ -f ./firebase.json.temp ]; then
  mv ./firebase.json.temp ./firebase.json
fi

# Restore firestore.rules from backup
if [ -f ./firestore.rules.temp ]; then
  mv ./firestore.rules.temp ./firestore.rules
fi

npm --prefix ./functions install
