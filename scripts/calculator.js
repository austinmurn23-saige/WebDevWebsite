// /Users/austinmurn/Documents/Web Development/WebDevWebsite/scripts/calculator.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.forms['calform'];
    if (!form) return;

    const calcBox = form.closest('.calc-box');
    const note = calcBox.querySelector('.calc-note');

    // Create result element or reuse note
    const resultEl = document.createElement('div');
    resultEl.setAttribute('aria-live', 'polite');
    resultEl.style.marginTop = '0.6rem';
    resultEl.style.fontSize = '0.95rem';
    resultEl.style.color = '#213026';
    calcBox.appendChild(resultEl);

    function round(n) { return Math.round(n); }

    function showMessage(msg, isError = false) {
        resultEl.textContent = msg;
        resultEl.style.color = isError ? '#8b1d1d' : '#213026';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const age = parseFloat(form.elements['age'].value) || 0;
        const gender = form.elements['gender'].value;
        const heightFeet = parseFloat(form.elements['heightFeet'].value) || 0;
        const heightInch = parseFloat(form.elements['heightInch'].value) || 0;
        const weightLbs = parseFloat(form.elements['weight'].value) || 0;
        const activity = parseFloat(form.elements['activity'].value) || 1.0;
        const goal = form.elements['goal'].value;

        // Basic validation
        if (age < 18 || age > 120) {
            showMessage('Please enter a valid age (18–120).', true);
            return;
        }
        if (heightFeet < 1 || heightFeet > 8 || heightInch < 0 || heightInch >= 12) {
            showMessage('Please enter a valid height.', true);
            return;
        }
        if (weightLbs < 30 || weightLbs > 1000) {
            showMessage('Please enter a valid weight.', true);
            return;
        }

        // Conversions
        const heightCm = ((heightFeet * 12) + heightInch) * 2.54;
        const weightKg = weightLbs * 0.45359237;

        // Mifflin-St Jeor BMR
        const sexFactor = gender === 'male' ? 5 : -161;
        const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + sexFactor;

        const tdee = bmr * activity;

        let target;
        if (goal === 'lose') target = tdee - 500;
        else if (goal === 'gain') target = tdee + 500;
        else target = tdee;

        // sensible lower bound
        if (target < 1200) target = 1200;

        // simple macro suggestions (protein in g, carbs and fat kcal split)
        const proteinG = Math.round(1.6 * weightKg); // 1.6 g/kg
        const proteinKcal = proteinG * 4;
        const fatKcal = Math.round(target * 0.25); // 25% from fat
        const fatG = Math.round(fatKcal / 9);
        const carbsKcal = Math.round(target - proteinKcal - fatKcal);
        const carbsG = Math.round(carbsKcal / 4);

        // Output 
        const goalMessage = `Aim for ${round(target)} calories per day.`;
        
        const macroMessage = `Suggested macros: Protein ${proteinG} g · Carbs ${carbsG} g · Fat ${fatG} g`;

        const resultMessage = goalMessage + '<br>' + macroMessage;
        
        resultEl.innerHTML = resultMessage;
                resultEl.style.color = '#213026';
    });

    form.addEventListener('reset', function () {
        // small delay to allow form reset to apply default values
        setTimeout(() => {
            resultEl.textContent = '';
            note.textContent = 'Currently not functional — working on JavaScript implementation.';
            note.style.fontStyle = 'italic';
        }, 10);
    });

    // initialize note text
    note.textContent = 'Enter your info and press Calculate to see results.';
    note.style.fontStyle = 'italic';
});