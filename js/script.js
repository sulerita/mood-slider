
//Hold all the different moods as dicts
var moodDict = {0: 'agitated', 1: 'none', 2: 'calm', 3: 'happy', 4: 'none',
                5: 'sad', 6:'tired', 7: 'none', 8: 'wide awake', 9: 'scared',
                10: 'none', 11: 'fearless' };

var programs = null;
var moodArray = null;
var moodPrograms = [];
var progsStartIndex = 0;//initial start index is 0
function noContent(){
    //return no content

    var parImg = document.createElement('div');
    parImg.innerHTML = 'No Content';
    
    var parImgDiv = document.createElement('div');
    parImgDiv.className = 'parImg';
    parImgDiv.innerHTML = parImg.outerHTML;

    var parText = document.createElement('div');
    parText.innerHTML = 'No Content';

    var parTextDiv = document.createElement('div');
    parTextDiv.className = 'parText';
    parTextDiv.innerHTML = parText.outerHTML;

    return parImgDiv.outerHTML + parTextDiv.outerHTML;
}

function blankContent(){
    //return no content

    var parImg = document.createElement('div');
    parImg.className = 'parImg';

    var parText = document.createElement('div');
    parText.className = 'parText';

    parImg.innerHTML = '';
    parText.innerHTML = '';

    return parImg.outerHTML + parText.outerHTML;
}

function addContent(prog){
    //return content program image path and name for updating programs

    var image_path = prog.getElementsByTagName('image_path')[0].innerHTML;
    var progName = prog.getElementsByTagName('name')[0].innerHTML;
    var progMood = prog.getElementsByTagName('mood')[0].innerHTML;

    var parImg = document.createElement('img');
    parImg.src = image_path;
    parImg.alt = progName;

    var parImgDiv = document.createElement('div');
    parImgDiv.className = 'parImg';
    parImgDiv.innerHTML = parImg.outerHTML;

    var parText = document.createElement('div');
    parText.innerHTML = progName;

    var parTextDiv = document.createElement('div');
    parTextDiv.className = 'parText';
    parTextDiv.innerHTML = parText.outerHTML;

    return parImgDiv.outerHTML + parTextDiv.outerHTML;
}

function populateMoodPrograms(){
    //populate moodPrograms with the programs selection based on the moodArray values
    if(programs == null){
        moodPrograms = [];
    }
    else if(moodArray == null) {
        moodPrograms = [];
    }
    else {//there is valid moodArray and programs
        moodPrograms = [];
        for (var i = 0; i < programs.length; i++){
            pMood = programs[i].getElementsByTagName('mood')[0].innerHTML.toString();
            pMood = pMood.toLowerCase();
            //console.log('pMood: ' + pMood);
            if(moodArray.indexOf(pMood) > -1){
                moodPrograms.push(programs[i]);
            }
            

            // if(programs[i].getElementsByTagName('mood')[0].innerHTML == 'Scared'){
            //     scared.push(programs[i]);
            // }
            // console.log(programs[i].getElementsByTagName('mood')[0]);
        }
    }
}
function initBody(){
    //initialize the view of the web application
    updateMood();
    populateMoodPrograms();
    populatePrograms(0);
    updateButtonStatus();
}
var populatePrograms = function(startIndex){
    //populates the programs based on content and mood
    progsStartIndex = startIndex;//for knowing where programs display stops
    //console.log('populatePrograms startIndex: ' + startIndex);
    // updateMood();
    // console.log(moodArray);
    // populateMoodPrograms();
    // console.log(moodPrograms);

    var programCells = document.getElementsByClassName('programs');
    //console.log('program cells ' + programCells.length.toString());
    
    for(var i = 0; i < programCells.length; i++){
        if(moodPrograms == null){
            
            programCells[i].innerHTML = noContent();
        }
        else{
            if(i + startIndex < moodPrograms.length){/*insert programs to programCells
            as long as mood programs do not exceed programcells available*/
                programCells[i].innerHTML = addContent(moodPrograms[i + startIndex]);
            }
            else if (moodPrograms.length == 0){//if empty, there is no content
                programCells[i].innerHTML = noContent();
            }
            else {//if programs not equal to available cards, insert blank
                programCells[i].innerHTML = blankContent();
            }

        }


    }

}

var resetMood = function() {
    //reset the mood to default values
    var sliders = document.getElementsByClassName('slider');
    moodArray = null;
    programs = null;
    moodPrograms = [];
    populatePrograms(0);

    for (var i = 0; i < sliders.length; i++){
        sliders[i].value = parseInt(sliders[i].min) + 1;
        // document.getElementsByClassName('slider')[i].value = sliders[i].min + 1;
        // var sliderValue = sliders[i].value;
        // moodArray.push(moodDict[sliderValue]);
    }

    updateButtonStatus();
}
var updateMood = function() {
    //update the mood values in moodArray based on slider values whenever there is a change in any slider value
    var sliders = document.getElementsByClassName('slider');
    //console.log('sliders length ' + sliders.length.toString());
    moodArray = [];
    for (var i = 0; i < sliders.length; i++){
        var sliderValue = sliders[i].value;
        moodArray.push(moodDict[sliderValue]);
    }
    populateMoodPrograms();
    populatePrograms(0);
    updateButtonStatus();
    //console.log('moodArray' + moodArray.toString());
    //return moodArray;
}

function activateMood(moodID, level){
    if (level == 0){
        document.getElementById(moodID).value = document.getElementById(moodID).min;
    }
    else {
        document.getElementById(moodID).value = document.getElementById(moodID).max;
    }
    updateMood();
}
    var openFile = function(event) {
        fetch('https://raw.githubusercontent.com/sulerita/mood-slider/master/programmesDB.xml')
        .then(res => res.text()) // Gets the response and returns it as a blob
        .then(text => {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(text,"text/xml");
            programs = xmlDoc.getElementsByTagName('programme');
        });
        
        resetMood();
        
    };
function updateButtonStatus(){
    // progsStartIndex = parseInt(progsStartIndex);
    if(moodPrograms.length <= 1 || programs == null){
        document.getElementById('shuffle').disabled = true;
    }
    else{
        document.getElementById('shuffle').disabled = false;
    }

    if(progsStartIndex <= 0){
        document.getElementById('prev_page').disabled = true;
    }
    else{
        document.getElementById('prev_page').disabled = false;
    }
    
    if(progsStartIndex + 5 >= moodPrograms.length){
        document.getElementById('next_page').disabled = true;
    }
    else{
        document.getElementById('next_page').disabled = false;
    }

    //console.log('progsStartIndex: ' + (progsStartIndex));
    //console.log('progsStartIndex-5: ' + (progsStartIndex - 5));
    //console.log('progsStartIndex+5: ' + (progsStartIndex + 5));
    //console.log('moodPrograms: ' + moodPrograms);
}
function prev_page(){
    // progsStartIndex = progsStartIndex - 5;//because we are displaying 5 programs per page
    if(progsStartIndex - 5 > 0){
        progsStartIndex = progsStartIndex - 5;
    }
    else{
        progsStartIndex = 0;
    }
    populatePrograms(progsStartIndex);
    updateButtonStatus();
}

function next_page(){
    // progsStartIndex = progsStartIndex + 5;//because we are displaying 5 programs per page
    if(progsStartIndex + 5 < moodPrograms.length - 1){
        progsStartIndex = progsStartIndex + 5;
    }
    else{
        progsStartIndex = moodPrograms.length - 1;
    }
    populatePrograms(progsStartIndex);
    updateButtonStatus();
    
}

function shuffle(){
    if(moodPrograms.length > 1){
        moodPrograms = moodPrograms.sort(function(a, b){return 0.5 - Math.random()});
        progsStartIndex = 0;
        populatePrograms(progsStartIndex);
        updateButtonStatus();
    }

}

