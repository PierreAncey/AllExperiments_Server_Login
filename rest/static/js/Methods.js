/**
 * Returns a random integer between 1 and `length` (both included).
 *
 * @param {number} length The maximum number.
 * @returns {number} A random integer between 1 and `length`.
 */
function getRandomIndexExceptFirst(length) {
    return Math.floor(Math.random() * (length - 1)) + 1;
}


/**
 * Returns a random element from an array except the first one.
 *
 * @param {Array} array The array to pick a random element from.
 * @returns {number} A random element from the array.
 */
function getRandomElementExceptFirst(array) {
    return array[getRandomIndexExceptFirst(array.length)];
}

/**
 * Displays an alert message.
 * @returns {void}
 */
function launchAlertMessage() {
    alertMessage = document.getElementById("messageAlert");
    loadFailureMessage = document.getElementById("loadFailureMessage");
    normalMessage = document.getElementById("normalMessage");

    // Display loadFailureMessage
    loadFailureMessage.style.display = "block";
    normalMessage.style.display = "none";

    alertMessage.classList.add("launchAnimation", "alert-custom");
    // Wait 3s before removing the animation
    setTimeout(function() {
        alertMessage.classList.remove("launchAnimation", "alert-custom");
        loadFailureMessage.style.display = "none";
        normalMessage.style.display = "block";
    }, 3000);
}


/**
 * Implements complementary checkboxes.
 *
 * @param {HTMLInputElement} checkbox The checkbox that was clicked.
 * @param {string} name The name of the checkboxes (they have the same one).
 * @returns {void}
 */
function complementaryCheckbox(checkbox, name) {
    if (checkbox.checked) {
        var checkboxes = document.getElementsByName(name);
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i] !== checkbox) {
                checkboxes[i].checked = false;
            }
        }
    }
}


/**
 * Returns a shuffled array.
 *
 * @param {Array} array The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffle(array){
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }

    return array;
}


/**
 * Returns the checked checkboxes from the products templates and their position in the list.
 * Select only nbSelected of them.
 * 
 * @param {number} nbSelected The number of checkboxes to select. If null, select all the checkboxes.
 * @returns {Array<Array<string>>} The checked checkboxes and their position in the list.
 */
function getNCheckedCheckboxesAndPosition(nbSelected = null) {
    // Selected the checked checkboxes that have "selected" in their id
    var checkboxes = document.querySelectorAll('input[id*="selected"]:checked');

    // If nbSelected is not null, select only nbSelected checkboxes
    if (nbSelected != null) {
        checkboxes = shuffle(Array.from(checkboxes)).slice(0, nbSelected);
    }

    // Store the position of the selected checkboxes in an array. It is the numbers at the end of the id.
    checkboxesPosition = getChecboxesPositionInList(checkboxes)

    return [checkboxes, checkboxesPosition];
}


/**
 * Returns the position of the checkboxes in the list (Careful, the position starts at 1)
 * 
 * @param {Array} checkboxes The checkboxes to get the position of.
 * @returns {Array<number>} The position of the checkboxes in the list.
 */
function getChecboxesPositionInList(checkboxes) {
    var checkboxesPosition = [];
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxesPosition.push(checkboxes[i].id.match(/\d+$/)[0]);
    };

    return checkboxesPosition;
}


/**
 * Returns the position of the checkboxes in the list.
 * 
 * @param {string} featureName The name of the feature to set the value of.
 * @param {string} value The value to set the checkboxes to.
 * @param {Array<Array<string>>} checkboxesChosenPrior The checkboxes and their position in the list. If null, get the checked checkboxes and their position in the list.
 * @returns {void}
 */
function setChosenFeatureToValue(featureName, value, checkboxesChosenPrior = null) {
    // Checbox array and their position in the list
    var checkboxes, checkboxesPosition;

    // If checkboxesChosenPrior is null, get the checked checkboxes and their position in the list
    if (checkboxesChosenPrior == null) {
        [checkboxes, checkboxesPosition] = getNCheckedCheckboxesAndPosition();
    }
    else {
        checkboxes = checkboxesChosenPrior[0];
        checkboxesPosition = checkboxesChosenPrior[1];
    }

    // Get the array of the feature
    array = window[featureName + "Array"];

    // Loop over the selected checkboxes
    for (var i = 0; i < checkboxes.length; i++) {
        // Special case for the promoted product
        if (featureName == "choiceSprite"){
            array = window[featureName + "Array"][checkboxesPosition[i]-1];
        }

        // Loop over the array of the feature for the future switch case
        for (var j = 0; j < array.length; j++) {
            // Set the value of the selected checkboxes according to the choice value
            switch (value) {
                case "Random":
                    $("#" + featureName + checkboxesPosition[i]).val(getRandomElementExceptFirst(array));
                    break;
                case array[j]:
                    $("#" + featureName + checkboxesPosition[i]).val(array[j]);
                    break;
            }
        }
    }
}


/**
 * Randomize the avatar elements.
 * 
 * @param {HTMLInputElement} choice The choice that was selected.
 * @param {string} featureName The name of the feature to set the value of.
 * @returns {void}
 */
function randomizeAvatarElements(choice, featureName) {
    setChosenFeatureToValue(featureName, choice.value);
}


/**
 * Toggle all the checkboxes from the list.
 * 
 * @param {HTMLInputElement} ele The checkbox that was clicked.
 * @returns {void}
 */
function toggle(ele) {
    var checkboxes = document.querySelectorAll("[id*='selected']");

    for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = ele.checked;
    }
}


/**
 * Load the data from the API
 * 
 * @returns {void}
 */
function loadData() {
    // Get a reference to the input element
    var inputElement = document.getElementById("LoadId");
    var inputSaveSettingId = document.querySelector("#settingId");

    // Get the value of the input element
    var inputValue = inputElement.value;
    inputSaveSettingId.value = inputValue;

    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Set up a callback function to handle the response from the API
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            // Parse the response as JSON
            var result = xhr.responseText;
            var result_parsed = JSON.parse(result);
            for (var i = 0; i < nbProducts; i++) {
                count = i + 1;
                // Change also the value of selected
                if (result_parsed.products[i].selected) {
                    $("#selected"+count).prop("checked", true);
                } else {
                    $("#selected"+count).prop("checked", false);
                }
                $("#choiceSprite"+count).val(result_parsed.products[i].choiceSprite);
                $("#avatarModel"+count).val(result_parsed.products[i].avatarModel);
                $("#avatarPosition"+count).val(result_parsed.products[i].avatarPosition);
                $("#avatarBehaviour"+count).val(result_parsed.products[i].avatarBehaviour);
            }
            var checkboxes = document.getElementsByName('userNavigation');
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].value === result_parsed.userNavigation) {
                    checkboxes[i].checked = true;
                } else {
                    checkboxes[i].checked = false;
                }
            }
            checkboxes = document.getElementsByName('promotedProductsLabels');
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].value === result_parsed.promotedProductsLabels) {
                    checkboxes[i].checked = true;
                } else {
                    checkboxes[i].checked = false;
                }
            }
            document.querySelector('#shelfId').value = result_parsed.questionAfterShelf;
            // Add the questions
            removeAllQuestions()
            if (result_parsed.questions) {
                for (var i = 0; i < result_parsed.questions.length; i++) {
                    addQuestion(result_parsed.questions[i].text, result_parsed.questions[i].answerRange);
                }
            }

        } else if (xhr.status === 404) {
            console.log("Error: API endpoint or resource not found");
            launchAlertMessage();
        } else {
            console.log("Error: " + xhr.status);
            launchAlertMessage(); 
        }
        }
    };

    // Make a request to the API with the input value as a parameter
    xhr.open("GET", window.location.href + "/s/" + inputValue, true);
    xhr.send();
}


/**
 * Method to randomize nbRandom avatars.
 * 
 * @param {number} nbRandom The number of avatars to randomize. If not specified, read the value from the input.
 * @returns {void}
 */
function randomizeAvatar(nbRandom = null) {
    if (nbRandom == null) {
        nbRandom = document.getElementById("randomizeAvatars").value;
    }

    // Selected the checked checkboxes 
    var checkboxes, checkboxesPosition;
    [checkboxes, checkboxesPosition] = getNCheckedCheckboxesAndPosition(nbRandom);

    setChosenFeatureToValue("avatarModel", "Random", [checkboxes, checkboxesPosition])
    setChosenFeatureToValue("avatarPosition", "Random", [checkboxes, checkboxesPosition])
    setChosenFeatureToValue("avatarBehaviour", "Random", [checkboxes, checkboxesPosition])

    // Set the unselected checboxes (the ones that are not in checkboxes) to "None"
    var unselectedCheckboxes = Array.from(document.querySelectorAll("[id*='selected']"))
    .filter(checkbox => !checkboxes.includes(checkbox));
    var unselectedCheckboxesPosition = getChecboxesPositionInList(unselectedCheckboxes);

    setChosenFeatureToValue("avatarModel", "None", [unselectedCheckboxes, unselectedCheckboxesPosition])
    setChosenFeatureToValue("avatarPosition", "None", [unselectedCheckboxes, unselectedCheckboxesPosition])
    setChosenFeatureToValue("avatarBehaviour", "None", [unselectedCheckboxes, unselectedCheckboxesPosition])
}


/* Method to decrement a field value by 1 as long as it is greater than 0 
 *
 * @param {string} fieldName The name of the field to decrement.
 * @returns {void}
 */
function decrementField(fieldName) {
    var input = document.getElementById(fieldName);
    var value = parseInt(input.value) - 1;
    input.value = value >= 0 ? value : 0;
}


/* Method to increment a field value by 1 as long as it is less than nbProducts
 *
 * @param {string} fieldName The name of the field to increment.
 * @returns {void}
 */
function incrementField(fieldName) {
    var input = document.getElementById(fieldName);
    var value = parseInt(input.value) + 1;
    input.value = value <= nbProducts ? value : nbProducts;
}


/**
 * Method to randomize nbRandom products and reinitialize the avatar features
 * 
 * @returns {void}
 */
function randomizeProductCategory() {
    // Insert code for the randomize() method here
    var nbRandom = document.getElementById("randomizeProductCategories").value;

    // Selected the checkboxes that have "selected" in their id
    var checkboxes = document.querySelectorAll("[id*='selected']");;

    // Store the position of the selected checkboxes in an array. It is the numbers at the end of the id
    var checkboxesPosition = getChecboxesPositionInList(checkboxes);

    // Shuffle the array 
    checkboxesPosition = shuffle(checkboxesPosition);

    // Chose a random value for the first nbRandom checkboxes of the array, and None for the others
    for (var i = 0; i < checkboxes.length; i++) {
        if (i < Math.min(nbRandom, checkboxes.length)) {
            var promotedLength = document.getElementById("choiceSprite" + checkboxesPosition[i]).options.length;
            // Get the name of the piece by removing the last string of digits from the second option of the select
            var name = document.getElementById("choiceSprite" + checkboxesPosition[i]).options[1].text.replace(/\s\d$/, "");
            $("#choiceSprite" + checkboxesPosition[i]).val(name + " " + getRandomIndexExceptFirst(promotedLength));
            // Check the box
            $("#selected" + checkboxesPosition[i]).prop("checked", true);
        } else {
            $("#choiceSprite" + checkboxesPosition[i]).val("None");
            $("#selected" + checkboxesPosition[i]).prop("checked", false);
        }
    }

    // Reinitialize the avatar features
    randomizeAvatar(0);
}


/**
 * Method to enforce the min and max values of an input field.
 * 
 * @param {object} input The input field to enforce the min and max values.
 * @returns {void}
 */
function enforceMinMax(input) {
    let min = parseFloat(input.min);
    let max = parseFloat(input.max);
    let value = parseFloat(input.value);

    if (value < min) {
        input.value = min;
    } else if (value > max) {
        input.value = max;
    }
}


/**
 * Method to add a new question to the survey.
 * 
 * @returns {void}
 */
function addEmptyQuestion() {
    // Create a new element to add to the region
    const newElement = document.createElement('div');

    // Get the value of the region-count input and parse it to a number
    const nbQuestions = parseInt(document.getElementById('region-count').value);

    // Add two inputs the the new element
    newElement.innerHTML = '<div class = "row justify-content-center">\
                                <div class="col-xl-9 text-center">\
                                    <input type="text" name="question'+(nbQuestions+1)+'" id="question'+(nbQuestions+1)+'" placeholder="Question Text" class="form-control" style="margin-bottom: 10px;">\
                                </div>\
                                <div class="col-xl-2 text-center">\
                                    <input type="number" name="range'+(nbQuestions+1)+'" id="range'+(nbQuestions+1)+'" placeholder="Range" class="form-control" style="margin-bottom: 10px;">\
                                </div>\
                                <div class="col-auto text-center">\
                                    <button type="button" class="btn btn-outline-light px-3" onclick="removeThisQuestion(this)">-</button>\
                                </div>\
                            </div>';

    // Increment the value of region-count
    document.getElementById('region-count').value = nbQuestions+1;

    // Add the new element to the region
    const region = document.getElementById('region');
    region.appendChild(newElement);
}


/**
 * Method to add a new question to the survey knowing the question text and the range.
 * 
 * @param {string} questionText The text of the question.
 * @param {number} answerRange The range of the question.
 * @returns {void}
 */
function addQuestion(questionText, answerRange) {
    // Create a new element to add to the region
    const newElement = document.createElement('div');

    // Get the value of the region-count input and parse it to a number
    const nbQuestions = parseInt(document.getElementById('region-count').value);

    // Add two inputs the the new element
    newElement.innerHTML = '<div class = "row justify-content-center">\
                                <div class="col-xl-9 text-center">\
                                    <input type="text" name="question'+(nbQuestions+1)+'" id="question'+(nbQuestions+1)+'" placeholder="Question Text" class="form-control" style="margin-bottom: 10px;" value="'+questionText+'">\
                                </div>\
                                <div class="col-xl-2 text-center">\
                                    <input type="number" name="range'+(nbQuestions+1)+'" id="range'+(nbQuestions+1)+'" placeholder="Range" class="form-control" style="margin-bottom: 10px;" value="'+answerRange+'">\
                                </div>\
                                <div class="col-auto text-center">\
                                    <button type="button" class="btn btn-outline-light px-3" onclick="removeThisQuestion(this)">-</button>\
                                </div>\
                            </div>';

    // Increment the value of region-count
    document.getElementById('region-count').value = nbQuestions+1;

    // Add the new element to the region
    const region = document.getElementById('region');
    region.appendChild(newElement);
}


/**
 * Method to add a remove the newest question from the survey.
 * 
 * @returns {void}
 */
function removeQuestion() {
    // Get a reference to the last element in the region
    const region = document.getElementById('region');
    const lastElement = region.lastChild;

    // Get the value of the region-count input and parse it to a number
    const nbQuestions = parseInt(document.getElementById('region-count').value);

    // Decrement the value of region-count
    document.getElementById('region-count').value = nbQuestions-1;

    // remove the last element from the region
    region.removeChild(lastElement);
}


/**
 * Method to remove the questions specified in parameter
 * 
 * @param {HTMLInputElement} ele The element to remove.
 * @returns {void}
 */
function removeThisQuestion(ele) {
    // Get a reference to the element to remove
    const wholeQuestion = ele.parentElement.parentElement;

    // Get the value of the region-count input and parse it to a number
    const nbQuestions = parseInt(document.getElementById('region-count').value);

    // Decrement the value of region-count
    document.getElementById('region-count').value = nbQuestions-1;

    // Remove the whole question from the region
    wholeQuestion.parentElement.removeChild(wholeQuestion);
}


/**
 * Method to remove all the questions from the survey.
 * 
 * @returns {void}
 */
function removeAllQuestions() {
    // Get a reference to the last element in the region
    const region = document.getElementById('region');
    const lastElement = region.lastChild;

    // Get the value of the region-count input and parse it to a number
    const nbQuestions = parseInt(document.getElementById('region-count').value);

    // Decrement the value of region-count
    document.getElementById('region-count').value = 0;

    // Remove the last element from the region
    for (var i = 0; i < nbQuestions; i++) {
        region.removeChild(region.lastChild);
    }
}


/**
 *  Method to read the text file and parse it, if it is a valid text file.
 * 
 * @returns {void}
 */
function AddTextFileToQuestions() {
    // Get a reference to the span that will display the name of the file
    const fileNameSpan = document.querySelector('.file-name')

    // Get the file
    const fileInput = document.getElementById('myFile');
    const file = fileInput.files[0];

    // Allowed extensions
    const allowedExtensions = ['.tsv'];

    // Check if the file is valid
    if (file && allowedExtensions.includes(getFileExtension(file.name))) {
        // Display the name of the file
        fileNameSpan.textContent = file.name;

        // Parse the text file and add the questions to the survey
        parseTextFile(file);

    // If the file is not valid    
    } else {
        // Display an error message
        fileNameSpan.textContent = 'Invalid file format';

        // Clear the selected file
        fileInput.value = '';
    }
}


/**
 * Method to get the extension of a file.
 * 
 * @param {string} filename
 * @returns {string}
 */
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 1);
}


/**
 * Method to parse the text file and add the questions to the survey.
 * 
 * @param {File} file The file to parse.
 * @returns {void}
 * @throws {Error} If the question and range are not strings.
 */
function parseTextFile(file) {
    // Create a FileReader object
    const reader = new FileReader();

    // Set the callback function to be called when the file is read
    reader.onload = function (event) {
        // Get the file contents
        const fileContents = event.target.result;

        // Split into rows based on new lines
        const rows = fileContents.split('\n');

        // Loop over all rows
        rows.forEach(function (row) {
            // Split row into values based on commas
            const values = row.split('\t');

            // Add question only if values[0] contains the word 'question'
            if (!values[0].includes('question')) {
                return;
            }

            // Get the question and send error if it is not a string
            if (typeof values[1] !== 'string') {
                alert('Error: Question is not a string');
                return;
            } else {
                question = values[1];
            }

            // Get the range and send error if it is not a string
            if (typeof values[2] !== 'string') {
                alert('Error: Range is not an integer');
                return;
            } else {
                // If the range contains a new line character, remove it
                if (values[2].includes('\r')) {
                    range = values[2].replace('\r', '');
                } else {
                    range = values[2];
                }
            }

            // Add the question to the list
            addQuestion(question, range);
        });
    };

    // Read the file
    reader.readAsText(file);
}