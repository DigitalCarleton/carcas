# CARCAS project at Carleton College
# Script by Erin Watson '24
# April 1, 2024

# This script tells Datalad where all the models are available to download
# It does 3 things:
#   1. Finds all models and posters that don't have a URL attached
#   2. Adds the URL for all those models and posters
#   3. Pushes the commit to Github
# Note: models are done first, then posters. The code is almost identical, just replacing model with poster.

# ---- MODELS ----

# Find models without a URL attached
echo "Looking for models without a URL"
cd /home/dviewers/www/carcas/carcas-models/models

# Declare the array to store model names
models_missing_urls=()

# Loop through each file in the current directory
for file in *
do
    # Get the output of `git annex whereis` for the current file
    git_annex_output=$(git annex whereis "$file")
    # echo $git_annex_output

    # Check if the output contains the string "web"
    if [[ $git_annex_output != *"web"* ]]; then
        # If not found, add the file name to the array
        models_missing_urls+=("$file")
    fi
done

echo "The following models are missing URLs:"
for model in "${models_missing_urls[@]}"; do
  echo "$model"
done

# Add the URLs for these models 
echo "Adding the URLs for these models"

# create a temporary text file with the model names 
cd /home/dviewers/www/carcas/carcas-models/enable-url-tools
# Print "model" to the top of the file
echo "model,model_no_spaces" > temp_models_missing_urls.csv
# Add each element of "models_missing_urls" to the file on a new line
for model in "${models_missing_urls[@]}"; do
  echo "$model,${model// /%20}" >> temp_models_missing_urls.csv
done

cd /home/dviewers/www/carcas/
# enable-url-tools/temp_models_missing_urls.csv is the file with the model names
# 'https://3dviewer.sites.carleton.edu/carcas/carcas-models/models/{model_no_spaces}' is the link we want to add (replace {model_no_spaces} with an entry from the file, ie one of the files missing a URL)
datalad addurls carcas-models/enable-url-tools/temp_models_missing_urls.csv 'https://3dviewer.sites.carleton.edu/carcas/carcas-models/models/{model_no_spaces}' 'carcas-models/models/{model}' --message "Adding URLs for models so that they can be downloaded from the web from the server. This was done by running 'bash carcas-models/enable-url-tools/add_urls.sh' in the command line."

# ---- POSTERS ----

# Find poster without a URL attached
echo "Looking for posters without a URL"
cd /home/dviewers/www/carcas/carcas-models/posters

# Declare the array to store poster names
posters_missing_urls=()

# Loop through each file in the current directory
for file in *
do
    # Get the output of `git annex whereis` for the current file
    git_annex_output=$(git annex whereis "$file")
    # echo $git_annex_output

    # Check if the output contains the string "web"
    if [[ $git_annex_output != *"web"* ]]; then
        # If not found, add the file name to the array
        posters_missing_urls+=("$file")
    fi
done

echo "The following posters are missing URLs:"
for poster in "${posters_missing_urls[@]}"; do
  echo "$poster"
done

# Add the URLs for these posters 
echo "Adding the URLs for these posters"

# create a temporary text file with the poster names 
cd /home/dviewers/www/carcas/carcas-models/enable-url-tools
# Print "poster" to the top of the file
echo "poster,poster_no_spaces" > temp_posters_missing_urls.csv
# Add each element of "posters_missing_urls" to the file on a new line
for poster in "${posters_missing_urls[@]}"; do
  echo "$poster,${poster// /%20}" >> temp_posters_missing_urls.csv
done

cd /home/dviewers/www/carcas/
# enable-url-tools/temp_posters_missing_urls.csv is the file with the model names
# 'https://3dviewer.sites.carleton.edu/carcas/carcas-models/posters/{poster_no_spaces}' is the link we want to add (replace {poster_no_spaces} with an entry from the file, ie one of the files missing a URL)
datalad addurls carcas-models/enable-url-tools/temp_posters_missing_urls.csv 'https://3dviewer.sites.carleton.edu/carcas/carcas-models/posters/{poster_no_spaces}' 'carcas-models/posters/{poster}' --message "Adding URLs for posters so that they can be downloaded from the web from the server. This was done by running 'bash carcas-models/enable-url-tools/add_urls.sh' in the command line."


# ---- FINISH UP ----

# Clean up and push
echo "Deleting temporary files"
rm /home/dviewers/www/carcas/carcas-models/enable-url-tools/temp_models_missing_urls.csv
rm /home/dviewers/www/carcas/carcas-models/enable-url-tools/temp_posters_missing_urls.csv
datalad save -m "Remove temporary files used to record models and posters missing URLs"

echo "Push to Github"
datalad push --to github






