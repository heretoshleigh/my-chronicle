// Display form based on user-selected chronicle type
function displayForm(value){
    switch(value){
        case 'freestyle':
            document.getElementById('freestyle').removeAttribute('hidden');
            document.getElementById('chronological').setAttribute('hidden','');    
            document.getElementById('categorical').setAttribute('hidden','');
            break;
        case 'chronological':
            document.getElementById('freestyle').setAttribute('hidden','');
            document.getElementById('chronological').removeAttribute('hidden');    
            document.getElementById('categorical').setAttribute('hidden','');
            break;
        case 'categorical':
            document.getElementById('freestyle').setAttribute('hidden','');
            document.getElementById('chronological').setAttribute('hidden','');    
            document.getElementById('categorical').removeAttribute('hidden');
            break;
        default:
            document.getElementById('freestyle').setAttribute('hidden','');
            document.getElementById('chronological').setAttribute('hidden','');    
            document.getElementById('categorical').setAttribute('hidden','');
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
                    <input type="text" name="startDate" id="startDate${newId}" class="datepicker">
                    <label for="#startDate${newId}">Start Date</label>
                </div>
                <div class="col l6">
                    <input type="text" name="endDate" id="endDate${newId}" class="datepicker">
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
                <input type="radio" name="topic${newId}" value="Context" class="with-gap"/>
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