//Show form and adjust required attributes based on user-selected chronicle type
//Commenting out freestyle validator until we figure out ckeditor for required textareas
function displayForm(value){

    const freestyle = document.getElementById('freestyle');
    // const freestyleInput = document.querySelector('.freestyleInput');

    const chronological = document.getElementById('chronological');
    const chronologicalInputs = document.querySelectorAll('.chronologicalInput');

    const categorical = document.getElementById('categorical');
    const categoricalInputs = document.querySelectorAll('.categoricalInput');

    switch(value){

        case 'freestyle':
            freestyle.removeAttribute('hidden');
            // freestyleInput.setAttribute('required','');
            chronological.setAttribute('hidden','');
            chronologicalInputs.forEach(input => input.removeAttribute('required'));
            categorical.setAttribute('hidden','');
            categoricalInputs.forEach(input => input.removeAttribute('required'));
            break;

        case 'chronological':
            chronological.removeAttribute('hidden');   
            chronologicalInputs.forEach(input => input.setAttribute('required',''));
            freestyle.setAttribute('hidden','');
            // freestyleInput.removeAttribute('required');
            categorical.setAttribute('hidden','');
            categoricalInputs.forEach(input => input.removeAttribute('required'));
            break;

        case 'categorical':
            categorical.removeAttribute('hidden');
            categoricalInputs.forEach(input => input.setAttribute('required',''));
            freestyle.setAttribute('hidden','');
            // freestyleInput.removeAttribute('required');
            chronological.setAttribute('hidden','');
            chronologicalInputs.forEach(input => input.removeAttribute('required'));
            break;

    }
}

//Add time periods to chronological form
const addPeriodBtn = document.getElementById('addPeriod');
const removePeriodBtn = document.getElementById('removePeriod')

if(addPeriodBtn){
    addPeriodBtn.addEventListener('click', addPeriod);
}

function addPeriod(){
    //Add time period
    const previousPeriod = addPeriodBtn.previousElementSibling;
    const previousId = previousPeriod.querySelector('[id^="chronologicalText"]').id.match(/\d+/g);
    const newId = +previousId + 1;
    const newPeriod = 
        `<div class="input-field">
            <div class="row">
                <div class="col l6">
                    <input type="text" name="startDate" id="startDate${newId}" class="datepicker chronologicalInput" required>
                    <label for="#startDate${newId}">Start Date</label>
                </div>
                <div class="col l6">
                    <input type="text" name="endDate" id="endDate${newId}" class="datepicker chronologicalInput" required>
                    <label for="#endDate${newId}">End Date</label>
                </div>
            </div>
            <textarea name="chronologicalText" id="chronologicalText${newId}"></textarea>
        </div>`;
    previousPeriod.insertAdjacentHTML('afterend', newPeriod);

    //Show remove period button
    removePeriodBtn.style.display = 'inline-block'

    //Reinitialize materialize datepicker and ckeditor
    M.Datepicker.init(document.querySelectorAll('.datepicker'));
    CKEDITOR.replace(`chronologicalText${newId}`);
}

//If only one time period, hide remove period button
if(removePeriodBtn && removePeriodBtn.parentElement.getElementsByTagName('textarea').length === 1){
    removePeriodBtn.style.display = 'none';
}

//Remove time periods from chronological form
if(removePeriodBtn){
    removePeriodBtn.addEventListener('click', removePeriod);
}

function removePeriod(){
    const previousPeriod = addPeriodBtn.previousElementSibling;
    previousPeriod.remove();
    if(removePeriodBtn.parentElement.getElementsByTagName('textarea').length === 1){
        removePeriodBtn.style.display = 'none';
    }
}

//Add topics to categorical form
const addTopicBtn = document.getElementById('addTopic');
const removeTopicBtn = document.getElementById('removeTopic');

if(addTopicBtn){
    addTopicBtn.addEventListener('click', addTopic);
}

function addTopic(){
    //Add topic
    const previousTopic = addTopicBtn.previousElementSibling;
    const previousId = previousTopic.querySelector('[id^="categoricalText"]').id.match(/\d+/g);
    const newId = +previousId + 1;
    const newTopic = 
        `<div class="section">
            <label class="radio">
                <input type="radio" name="topic${newId}" value="Context" class="with-gap categoricalInput" required/>
                <span>Context</span>
            </label>
            <label class="radio">
                <input type="radio" name="topic${newId}" value="Symptoms" class="with-gap"/>
                <span>Symptoms</span>
            </label>
            <label class="radio">
                <input type="radio" name="topic${newId}" value="Tests" class="with-gap"/>
                <span>Tests</span>
            </label>
            <label class="radio">
                <input type="radio" name="topic${newId}" value="Treatments" class="with-gap"/>
                <span>Treatments</span>
            </label>
            <label class="radio">
                <input type="radio" name="topic${newId}" value="Other" class="with-gap"/>
                <span>Other</span>
            </label>
            <div class="input-field">
                <textarea name="categoricalText" id="categoricalText${newId}"></textarea>
            </div>
        </div>`;
    previousTopic.insertAdjacentHTML('afterend', newTopic);

    //Show remove topic button
    removeTopicBtn.style.display = 'inline-block'

    //Reinitialize ckeditor
    CKEDITOR.replace(`categoricalText${newId}`);
}

//If only one topic, hide remove topic button
if(removeTopicBtn && removeTopicBtn.parentElement.getElementsByTagName('textarea').length === 1){
    removeTopicBtn.style.display = 'none';
}

//Remove topics from categorical form
if(removeTopicBtn){
    removeTopicBtn.addEventListener('click', removeTopic);
}

function removeTopic(){
    const previousTopic = addTopicBtn.previousElementSibling;
    previousTopic.remove();
    if(removeTopicBtn.parentElement.getElementsByTagName('textarea').length === 1){
        removeTopicBtn.style.display = 'none';
    }
}