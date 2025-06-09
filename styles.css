document.addEventListener('DOMContentLoaded', () => {
  const assignmentForm = document.getElementById('assignment-form');
  const assignmentNameInput = document.getElementById('assignment-name');
  const assignmentGradeInput = document.getElementById('assignment-grade');
  const assignmentList = document.getElementById('assignment-list');
  const gpaDisplay = document.getElementById('gpa-display');

  let assignments = [];

  function calculateGPA() {
    if (assignments.length === 0) return 0;
    const total = assignments.reduce((sum, assignment) => sum + assignment.grade, 0);
    return total / assignments.length;
  }

  function updateGPA() {
    const gpa = calculateGPA();
    gpaDisplay.textContent = gpa.toFixed(2);
  }

  function renderAssignments() {
    assignmentList.innerHTML = '';
    assignments.forEach((assignment, index) => {
      const li = document.createElement('li');
      li.textContent = `${assignment.name}: ${assignment.grade.toFixed(2)}`;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.style.marginLeft = '10px';
      removeBtn.addEventListener('click', () => {
        assignments.splice(index, 1);
        renderAssignments();
        updateGPA();
      });

      li.appendChild(removeBtn);
      assignmentList.appendChild(li);
    });
  }

  assignmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = assignmentNameInput.value.trim();
    const grade = parseFloat(assignmentGradeInput.value);

    if (name && !isNaN(grade) && grade >= 0 && grade <= 5) {
      assignments.push({ name, grade });
      renderAssignments();
      updateGPA();
      assignmentForm.reset();
      assignmentNameInput.focus();
    } else {
      alert('Please enter a valid assignment name and grade between 0 and 5.');
    }
  });
});
