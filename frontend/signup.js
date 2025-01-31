// Firebase configuration object
const firebaseConfig = {
    // ...existing code...
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log('Firebase initialized:', firebase.apps.length > 0);

class SignupUI {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.nameInput = document.getElementById('name');
        this.dobInput = document.getElementById('dob');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.errorMessage = document.getElementById('errorMessage');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSignup(e));
    }

    handleSignup(e) {
        e.preventDefault();
        const name = this.nameInput.value;
        const dob = this.dobInput.value;
        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User signed up:', user);
                this.showSuccessMessage('Sign up successful! You can now log in.');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
                // Save additional user info (name, dob) to database if needed
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error signing up:', errorCode, errorMessage);
                this.showErrorMessage(errorMessage);
            });
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

    showErrorMessage(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
    }
}

// Initialize the SignupUI class when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignupUI();
});
