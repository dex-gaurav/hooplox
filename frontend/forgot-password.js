// Firebase configuration object
const firebaseConfig = {
    // ...existing code...
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log('Firebase initialized:', firebase.apps.length > 0);

class ForgotPasswordUI {
    constructor() {
        this.form = document.getElementById('forgotPasswordForm');
        this.emailInput = document.getElementById('email');
        this.errorMessage = document.getElementById('errorMessage');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleForgotPassword(e));
    }

    handleForgotPassword(e) {
        e.preventDefault();
        const email = this.emailInput.value;

        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                console.log('Password reset email sent');
                this.showSuccessMessage('Password reset email sent. Please check your inbox.');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error sending password reset email:', errorCode, errorMessage);
                this.showErrorMessage(errorMessage);
            });
    }

    showErrorMessage(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
    }

    showSuccessMessage(message) {
        const successMessage = document.createElement('div');
        successMessage.classList.add('success-message');
        successMessage.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> ${message}`;
        document.body.appendChild(successMessage);
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }
}

// Initialize the ForgotPasswordUI class when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ForgotPasswordUI();
});
