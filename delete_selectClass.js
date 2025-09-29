const selectedClass = classSelector.
        options[classSelector.selectedIndex].value;

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


const selectedClass = classSelector.
        options[classSelector.selectedIndex].value;
//delete the studentlist from the selectedClass
const savedStudents = JSON.parse
        (localStorage.getItem('students')) || {};

const savedStudents2 = delete savedStudents[selectedClass];
localStorage.setItem
        ('students', JSON.stringify(savedStudents));


// delete selectedClass
const localClass = JSON.parse
        (localStorage.getItem('classes'));

index = localClass.findIndex(delClass => delClass === selectedClass);
localClass2 = localClass.splice(index, 1);
localStorage.setItem
        ('classes', JSON.stringify(localClass2));
document.location.reload();