//roster2.js
document.addEventListener("DOMContentLoaded",
    function () {
        populateClasses();
        showStudentsList();
    });

function showAddStudentOrgForm() {
    document.getElementById('addStudentOrgPopup').
        style.display = 'block';
}

function showreadOrgForm() {
    document.getElementById('readOrgPopup').
        style.display = 'block';
}

function showreadForm() {
    document.getElementById('readPopup').
        style.display = 'block';
}

function showAddStudentForm() {
    document.getElementById('addStudentPopup').
        style.display = 'block';
}

function showAddClassForm() {
    // Show the add class popup
    document.getElementById('addClassPopup').
        style.display = 'block';
}
function readOrg() {
    console.log("read last one");
	if (!classSelector || !classSelector.options ||
        classSelector.selectedIndex-1 === -1) {
        alert
            ('上次會友名單不存在！');
            return;} 
    else 
    {
        const studentsCopy = localStorage.getItem("students");
        //console.log(studentsCopy);
        const stdArray = JSON.parse(studentsCopy);
        //make the lsClass is the last class
        const lsClass = classSelector.
                options[classSelector.selectedIndex-1].value;

        //the newClass is the current empty class
        const newClass = classSelector.
                options[classSelector.selectedIndex].value;
        //copy the lsClass to newClass
        stdArray[newClass] = stdArray[lsClass]

        localStorage.setItem('students', 
                JSON.stringify(stdArray));

        /* class already created so this is not necessary, leave for backup 
        const classCopy = localStorage.getItem("classes");
        const stdClass = JSON.parse(classCopy);
        stdClass.push('2025-10-27-第2堂');
        console.log(stdClass)
        localStorage.setItem('classes', 
                JSON.stringify(stdClass));*/

        // copy the colors

        const colorsCopy = localStorage.getItem("colors");
        const stdColor = JSON.parse(colorsCopy);
        //console.log(stdColor);

        //make color of newClass to be last class
        stdColor[newClass]=stdColor[lsClass];
        //console.log(stdColor);

        localStorage.setItem('colors', 
                JSON.stringify(stdColor));
        //location.reload();
        
        //copy attendanceData to new class
        const copattData = localStorage.getItem('attendanceData');
        //console.log(copattData);
        const copyatt = JSON.parse(copattData);
        //console.log(copyatt);


        // filter to be copied att data from last class
        const matchingObjects = copyatt.filter(obj => obj.class.includes(lsClass));
        //console.log(matchingObjects);

        //make newAttObjects as the new class name by map
        const newAttObjects = matchingObjects.map(item => {       
        return { ...item, class: newClass}; 
        });

        // By Concatenation append the new Att data to copyatt as new att
        const newatt = copyatt.concat(newAttObjects);
        //console.log(newatt);

        localStorage.setItem('attendanceData', 
                JSON.stringify(newatt));             
        location.reload();		
    }
    closePopup();
}

async function addOrg() {
    const requestURL =
        "https://mintetang.github.io/web-projects/test-site/scripts/nameroll1.json";
    const request = new Request(requestURL);
    const response = await fetch(request);
    const rData = await response.json();
    const jsArray = rData.data;
    /*const savedStudents = JSON.parse
            (localStorage.getItem('students'));
    const orgArray = savedStudents[selectedClass];
    //console.log(jsArray.length);*/
    for (let i = 0; i < jsArray.length; i++) 
        {
    const newStudentName = jsArray[i].name;
    const newStudentRoll = jsArray[i].rollNumber;
    if (!newStudentName || !newStudentRoll) {
        alert("Missing name or roll number.");
        return;}
    std(newStudentName, newStudentRoll);}
}

function addStudent() {
    // Get input values
    const newStudentName = document.
        getElementById('newStudentName').value;
    const newStudentRoll = document.
        getElementById('newStudentRoll').value;

    if (!newStudentName || !newStudentRoll) {
        alert("Please provide both name and roll number.");
        return;
    }
    std(newStudentName, newStudentRoll);
    
}

function std(a, b) {
    const newStudentName = a;
    const newStudentRoll = b;
    // Add the new student to the list
    const classSelector = document.
        getElementById('classSelector');
    const selectedClass = classSelector.
        options[classSelector.selectedIndex].value;
    const studentsList = document.
        getElementById('studentsList');

    const listItem = document.createElement('li');
    listItem.setAttribute('data-roll-number', newStudentRoll);
    listItem.innerHTML =
        `<strong>
            ${newStudentName}
        </strong> 
        (#${newStudentRoll})`;

    const absentButton =
        createButton('缺席', 'absent',
            () => markAttendance('absent', listItem, selectedClass));
    const presentButton =
        createButton('出席', 'present',
            () => markAttendance('present', listItem, selectedClass));
    const leaveButton =
        createButton('請假', 'leave',
            () => markAttendance('leave', listItem, selectedClass));
    const resetButton =
        createButton('重設', 'reset',
            () => markAttendance('reset', listItem, selectedClass));

    listItem.appendChild(absentButton);
    listItem.appendChild(presentButton);
    listItem.appendChild(leaveButton);
    listItem.appendChild(resetButton); //jt 0928 night
    studentsList.appendChild(listItem);
    saveStudentsList(selectedClass);
    closePopup();
}

function addClass() {
	//jt 0927
	const newSession = document.
        getElementById('session').value;
    const tempClassName = document.
        getElementById('newClassName').value;
	const newClassName = `${tempClassName}-${newSession}`;
	//console.log(newClassName); // jt 0928

    if (!newClassName) {
        alert("請輸入日期.");
        return;
    }

    // Add the new class to the class selector
    const classSelector = document.
        getElementById('classSelector');
    const newClassOption = document.
        createElement('option');
    newClassOption.value = newClassName;
    newClassOption.text = newClassName;
    classSelector.add(newClassOption);
    classSelector.value = newClassName;
    showStudentsList();
    saveClasses();
    closePopup();
}

function submitAttendance() {
    const classSelector = document.
        getElementById('classSelector');

    if (!classSelector || !classSelector.options ||
        classSelector.selectedIndex === -1) {
        console.error
            ('Class selector is not properly defined or has no options.');
        return;
    }

    const selectedClass = classSelector.
        options[classSelector.selectedIndex].value;

    if (!selectedClass) {
        console.error('Selected class is not valid.');
        return;
    }

    const studentsList =
        document.getElementById('studentsList');

    // Check if attendance is already submitted 
    // for the selected class
    const isAttendanceSubmitted =
        isAttendanceSubmittedForClass(selectedClass);

    if (isAttendanceSubmitted) {
        // If attendance is submitted, hide the 
        // summary and show the attendance result
        document.getElementById('summarySection').
            style.display = 'none';
        showAttendanceResult(selectedClass);
    } else {
        // If attendance is not submitted, show the summary
        document.getElementById('summarySection').
            style.display = 'block';
        document.getElementById('resultSection').
            style.display = 'none';
    }
    // Clear the student list and reset the form
    studentsList.innerHTML = '';
}

function isAttendanceSubmittedForClass(selectedClass) {
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];
    return savedAttendanceData.some
        (record => record.class === selectedClass);
}

function showAttendanceResult(selectedClass) {
    const resultSection = document.
        getElementById('resultSection');

    if (!resultSection) {
        console.error('Result section is not properly defined.');
        return;
    }

    const now = new Date();
    const date =
        `${now.getFullYear()}-${String(now.getMonth() + 1).
        padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const time =
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

	// Retrieve attendance data from local storage
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];
    const filteredAttendanceData = savedAttendanceData.
        filter(record => record.class === selectedClass);


    const totalPresent = filteredAttendanceData.
        filter(record => record.status === 'present').length;
    const totalAbsent = filteredAttendanceData.
        filter(record => record.status === 'absent').length;
    const totalLeave = filteredAttendanceData.
        filter(record => record.status === 'leave').length;
    const totalReset = filteredAttendanceData.
        filter(record => record.status === 'reset').length; //jt 1002

    const totalStudents = filteredAttendanceData.
    reduce((acc, record) => {
        if (!acc.includes(record.name)) {
            acc.push(record.name);
        }
        return acc;
    }, []).length - totalReset;

    // Update the result section
    document.getElementById('attendanceDate').
        innerText = date;
    document.getElementById('attendanceTime').
        innerText = time;
    document.getElementById('attendanceClass').
        innerText = selectedClass;
    document.getElementById('attendanceTotalStudents').
        innerText = totalStudents;
    document.getElementById('attendancePresent').
        innerText = totalPresent;
    document.getElementById('attendanceAbsent').
        innerText = totalAbsent;
    document.getElementById('attendanceLeave').
        innerText = totalLeave;
    document.getElementById('attendanceRate').
        innerText = Math.round(`${totalPresent/totalStudents*100}`)+'%';

    // Show the attendance result section
    resultSection.style.display = 'block';
    attText = document.getElementById('attendanceRate').innerText;
    attClass = selectedClass;
    console.log(attClass);
    console.log(attText);
    histRate(attClass, attText);
}
function histRate(attClass, attText) {
    // Create a new div element
    const newDiv = document.createElement("div");

    // Add some text content to the div
    newDiv.textContent = "歷史出席率:";
    newDiv.classList.add("attArr");

    // Add a span to the div
    const rate1 = document.createElement("p");
    //attObj to record the class and the attendance rate 
    attObj = {[attClass]: attText};
    console.log(attObj);
    if (typeof (attArray) === 'undefined') {
    attArray = [];
    attArray.push(attObj);
    console.log(attArray);
    } 
    else if (JSON.stringify(attArray).includes(attClass) !== false){
        console.log(attArray.includes(attClass));
        console.log(attObj);
        console.log(attArray);
    }
    else {
    attArray.push(attObj);
    console.log(attArray);
    }
    console.log(attArray.sort((a, b) => a.attClass - b.attClass));
    //save attendance history to localStorage attHis
    localStorage.setItem('attHis', 
          JSON.stringify(attArray));
    rate1.textContent = localStorage.getItem('attHis');
    rate1.setAttribute ('id', 'attP');
    newDiv.appendChild(rate1);
    // Append the new div to the result session
    attendanceRate.appendChild(newDiv);
}


function closePopup() {
    // Close the currently open popup
    document.getElementById('addStudentPopup').
        style.display = 'none';
    document.getElementById('addClassPopup').
        style.display = 'none';
    document.getElementById('addStudentOrgPopup').
        style.display = 'none';
    document.getElementById('readOrgPopup').
        style.display = 'none';
    document.getElementById('readPopup').
        style.display = 'none';
}

function createButton(text, status, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = text;
    button.className = status;
    button.onclick = onClick;
    return button;
}

function populateClasses() {
    // Retrieve classes from local storage
    const savedClasses = JSON.parse
        (localStorage.getItem('classes')) || [];
    const classSelector = 
        document.getElementById('classSelector');

    savedClasses.forEach(className => {
        const newClassOption = 
            document.createElement('option');
        newClassOption.value = className;
        newClassOption.text = className;
        classSelector.add(newClassOption);
    });
    let ln = classSelector.options.length;
    //console.log(ln);
    const selectedClass = classSelector.
        options[classSelector.selectedIndex+ln-1].value;
    classSelector.value = selectedClass;
    //console.log(classSelector.value);
}

function showStudentsList() {
    const classSelector = 
        document.getElementById('classSelector');
    const selectedClass = classSelector.
        options[classSelector.selectedIndex].value;
    const studentsList = 
        document.getElementById('studentsList');
    studentsList.innerHTML = '';

    // Retrieve students from local storage
    const savedStudents = JSON.parse
        (localStorage.getItem('students')) || {};
    const selectedClassStudents = 
        savedStudents[selectedClass] || [];

    selectedClassStudents.forEach(student => {
        const listItem = document.createElement('li');
        listItem.setAttribute
            ('data-roll-number', student.rollNumber);
        listItem.innerHTML = 
            `<strong>
                ${student.name}
            </strong> 
            (#${student.rollNumber})`;

        const absentButton = createButton('缺席', 'absent', 
            () => markAttendance('absent', listItem, selectedClass));
        const presentButton = createButton('出席', 'present', 
            () => markAttendance('present', listItem, selectedClass));
        const leaveButton = createButton('請假', 'leave', 
            () => markAttendance('leave', listItem, selectedClass));
        const resetButton =
        createButton('重設', 'reset',
            () => markAttendance('reset', listItem, selectedClass));
        listItem.appendChild(absentButton);
        listItem.appendChild(presentButton);
        listItem.appendChild(leaveButton);
        listItem.appendChild(resetButton); //jt 0928 night
        studentsList.appendChild(listItem);

        const savedColor = getSavedColor
            (selectedClass, student.rollNumber);
        if (savedColor) {
            listItem.style.backgroundColor = savedColor;
        }


    });

    // Check if attendance for the 
    // selected class has been submitted
    const resultSection = document.
        getElementById('resultSection');
    const isAttendanceSubmitted = 
        resultSection.style.display === 'block';

    // Show the appropriate section based 
    // on the attendance submission status
    if (isAttendanceSubmitted) {
        // Attendance has been submitted, 
        // show the attendance result
        showAttendanceResult(selectedClass);
    } else {
        // Attendance not submitted, 
        // show the normal summary
        showSummary(selectedClass);
    }
}

/*function showAttendanceResult(selectedClass) {
    const resultSection = 
        document.getElementById('resultSection');

    if (!resultSection) {
        console.error('Result section is not properly defined.');
        return;
    }

    const now = new Date();
    const date = 
        `${now.getFullYear()}-${String(now.getMonth() + 1).
        padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const time = 
        `${String(now.getHours()).padStart(2, '0')}:
        ${String(now.getMinutes()).padStart(2, '0')}:
        ${String(now.getSeconds()).padStart(2, '0')}`;

    // Retrieve attendance data from local storage
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];
    const filteredAttendanceData = savedAttendanceData.
        filter(record => record.class === selectedClass);

    const totalStudents = filteredAttendanceData.
    reduce((acc, record) => {
        if (!acc.includes(record.name)) {
            acc.push(record.name);
        }
        return acc;
    }, []).length;

    const totalPresent = filteredAttendanceData.
        filter(record => record.status === 'present').length;
    const totalAbsent = filteredAttendanceData.
        filter(record => record.status === 'absent').length;
    const totalLeave = filteredAttendanceData.
        filter(record => record.status === 'leave').length;

    // Update the result section
    const resultContent = 
        `Date: ${date} | Time: ${time} | 
        Total Students: ${totalStudents} | 
        Present: ${totalPresent} | 
        Absent: ${totalAbsent} | Leave: ${totalLeave} |
        Attending Rate ${totalPresent/totalStudents*100}%`;
    resultSection.innerHTML = resultContent;

    // Show the result section
    resultSection.style.display = 'block';

    // Show the list of students below the result section
    const studentsListHTML = 
        generateStudentsListHTML(filteredAttendanceData);
    resultSection.insertAdjacentHTML
        ('afterend', studentsListHTML);
}
*/

function markAttendance
    (status, listItem, selectedClass) {
    // Find the corresponding student name
    const studentName = listItem.
        querySelector('strong').innerText;

    // Update the background color of the student 
    // row based on the attendance status
    listItem.style.backgroundColor = 
        getStatusColor(status);

    // Save the background color to local storage
    saveColor(selectedClass, 
        listItem.getAttribute('data-roll-number'), 
        getStatusColor(status));

    // Update the attendance record for the specific student
    updateAttendanceRecord(studentName, selectedClass, status);

    // Show the summary for the selected class
    showSummary(selectedClass);
}

function getStatusColor(status) {
    switch (status) {
        case 'absent':
            return '#e74c3c';
        case 'present':
            return '#2ecc71';
        case 'leave':
            return '#f39c12';
        case 'reset':
            //return 'rgba(0, 0, 0, 0.06)'; //jt 0928 9pm
            return '';
        default:
            return '';
    }
}

function updateAttendanceRecord
    (studentName, selectedClass, status) {
    // Retrieve existing attendance data from local storage
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];

    // Check if the record already exists
    const existingRecordIndex = savedAttendanceData.
        findIndex(record => record.name === studentName && 
            record.class === selectedClass);

    if (existingRecordIndex !== -1) {
        // Update the existing record
        savedAttendanceData[existingRecordIndex].
            status = status;
        savedAttendanceData[existingRecordIndex].
            date = getCurrentDate();
    } else {
        // Add a new record
        savedAttendanceData.push(
            { 
                name: studentName, class: selectedClass, 
                status: status, date: getCurrentDate() 
            });
    }

    // Save updated attendance data to local storage
    localStorage.setItem('attendanceData', 
        JSON.stringify(savedAttendanceData));
}

function showSummary(selectedClass) {
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];

    // Filter attendance data based on the selected class
    const filteredAttendanceData = savedAttendanceData.
        filter(record => record.class === selectedClass);


    const totalPresent = filteredAttendanceData.
        filter(record => record.status === 'present').length;
    const totalAbsent = filteredAttendanceData.
        filter(record => record.status === 'absent').length;
    const totalLeave = filteredAttendanceData.
        filter(record => record.status === 'leave').length;
    const totalReset = filteredAttendanceData.
        filter(record => record.status === 'reset').length; //jt 1002

    const totalStudents = filteredAttendanceData.
    reduce((acc, record) => {
        if (!acc.includes(record.name)) {
            acc.push(record.name);
        }
        return acc;
    }, []).length - totalReset;

    document.getElementById('totalStudents').
        innerText = totalStudents;
    document.getElementById('totalPresent').
        innerText = totalPresent;
    document.getElementById('totalAbsent').
        innerText = totalAbsent;
    document.getElementById('totalLeave').
        innerText = totalLeave;
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).
        padStart(2, '0');
    const day = String(now.getDate()).
        padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function saveClasses() {
    // Save classes to local storage
    const classSelector = document.
        getElementById('classSelector');
    const savedClasses = Array.from(classSelector.options).
        map(option => option.value);
    localStorage.setItem('classes', 
        JSON.stringify(savedClasses));
}

function saveStudentsList(selectedClass) {
    // Save the updated student list to local storage
    const studentsList = document.
        getElementById('studentsList');
    const savedStudents = JSON.parse
        (localStorage.getItem('students')) || {};
    const selectedClassStudents = Array.from(studentsList.children).
    map(item => {
        return {
            name: item.querySelector('strong').innerText,
            rollNumber: item.getAttribute('data-roll-number')
        };
    });

    savedStudents[selectedClass] = selectedClassStudents;
    localStorage.setItem
        ('students', JSON.stringify(savedStudents));
}

function saveColor(selectedClass, rollNumber, color) {
    const savedColors = JSON.parse
    (localStorage.getItem('colors')) || {};
    if (!savedColors[selectedClass]) {
        savedColors[selectedClass] = {};
    }
    savedColors[selectedClass][rollNumber] = color;
    localStorage.setItem('colors', 
        JSON.stringify(savedColors));
}

function getSavedColor(selectedClass, rollNumber) {
    const savedColors = JSON.parse
        (localStorage.getItem('colors')) || {};
    return savedColors[selectedClass] ? 
        savedColors[selectedClass][rollNumber] : null;
}

function cleanSelectedClass()
    {
    const reCheck = prompt('！！！請輸入"CONFIRM"來確認刪除目前的日期出席記錄，確認後"無法回復"！！！');
    console.log(reCheck); 
    if (reCheck === 'CONFIRM') {
  // Perform actions for cancellation, e.g., stop further processing

    const classSelector = 
        document.getElementById('classSelector');
	const selectedClass = classSelector.
        options[classSelector.selectedIndex].value;
        //console.log(selectedClass);
    //delete the studentlist from the selectedClass
    const savedStudents = JSON.parse
            (localStorage.getItem('students'));

    delete savedStudents[selectedClass];
    //console.log(savedStudents);
    localStorage.setItem
            ('students', JSON.stringify(savedStudents));

    // delete selectedClass
    let localClass = JSON.parse
            (localStorage.getItem('classes'));

    index = localClass.findIndex(delClass => delClass === selectedClass);
    localClass.splice(index, 1);
    //console.log(localClass);
    localStorage.setItem
            ('classes', JSON.stringify(localClass));
    document.location.reload();
	//localStorage.clear();
    } else {
    alert("已經取消.");
    }

}


function exportLocalStorage() {
  // 1. Get all localStorage data
  const localStorageData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    localStorageData[key] = localStorage.getItem(key);
  }

  // 2. Convert to a JSON string
  const jsonString = JSON.stringify(localStorageData, null, 4);

  // 3. Create a Blob and URL
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // 4. Create and click a download link
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'data.json';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  //alert('Your localStorage data has been exported to data.json');
}

function rlsFromFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.clear(); // Clear existing localStorage before restoring
            for (const key in data) {
                localStorage.setItem(key, data[key]);
            }
            console.log('localStorage restored successfully!');
            alert('成功讀回出席紀錄!');
            location.reload();
        } catch (error) {
            console.error('Error parsing or restoring localStorage:', error);
        }
    };
    reader.readAsText(file);
    closePopup();
}

// HTML for file input:
// <input type="file" id="restoreFileInput" accept=".json" onchange="rlsFromFile(event)">
