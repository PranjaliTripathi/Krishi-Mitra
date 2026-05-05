// Centralized Password Validation
window.getPasswordError = function(password, isSecurityAnswer = false) {
    if (isSecurityAnswer) {
        if (password.length < 6) return "Answer must be at least 6 characters.";
        return "";
    }

    if (password.length < 6) return "Password must be at least 6 characters and include a mix of uppercase, lowercase, number, or special character.";
    
    let types = 0;
    if (/[A-Z]/.test(password)) types++;
    if (/[a-z]/.test(password)) types++;
    if (/[0-9]/.test(password)) types++;
    if (/[^A-Za-z0-9]/.test(password)) types++;
    
    if (types < 3) return "Password must be at least 6 characters and include a mix of uppercase, lowercase, number, or special character.";
    
    return "";
};

document.addEventListener('DOMContentLoaded', () => {
    // Only apply real time validation in certain conditions
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        // Skip on login pages completely
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('admin_login.html')) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-danger small mt-1 password-error-msg';
        errorDiv.style.display = 'none';
        
        const parent = input.parentElement.classList.contains('input-group') ? input.parentElement.parentElement : input.parentElement;
        parent.appendChild(errorDiv);

        input.addEventListener('input', (e) => {
            const isSecurityAnswer = e.target.id && (e.target.id.includes('answer') || e.target.id.includes('SecA') || e.target.id.includes('_a1') || e.target.id.includes('_a2') || e.target.id.includes('checkSecA'));
            const isConfirm = e.target.id && (e.target.id.includes('confirm') || e.target.id.includes('Conf'));

            if (isConfirm) {
                // If it's a confirmation field we generally don't show the strength error
                errorDiv.style.display = 'none';
                input.setCustomValidity("");
                return;
            }

            const err = window.getPasswordError(e.target.value, isSecurityAnswer);

            if (err && e.target.value.length > 0) {
                errorDiv.innerText = err;
                errorDiv.style.display = 'block';
                input.setCustomValidity(err);
            } else {
                errorDiv.style.display = 'none';
                input.setCustomValidity("");
            }
        });
    });
});
