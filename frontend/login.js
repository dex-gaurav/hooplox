// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCDRG18wxNZ5ex2EkhXihLLEf30PZSdqyM",
    authDomain: "hooplox3.firebaseapp.com",
    projectId: "hooplox3",
    storageBucket: "hooplox3.firebasestorage.app",
    messagingSenderId: "558379880121",
    appId: "1:558379880121:web:e21d5e833b3c2b94e7d568"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log('Firebase initialized:', firebase.apps.length > 0);

class AuthUI {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberMe = document.getElementById('remember');
        this.signupLink = document.getElementById('signupLink');
        this.forgotPasswordLink = document.getElementById('forgotPasswordLink');
        this.errorMessage = document.getElementById('errorMessage');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
        this.signupLink.addEventListener('click', (e) => this.redirectToSignup(e));
        this.forgotPasswordLink.addEventListener('click', (e) => this.redirectToForgotPassword(e));
    }

    handleLogin(e) {
        e.preventDefault();
        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('User logged in:', user);
                // Redirect or perform other actions after successful login
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error logging in:', errorCode, errorMessage);
                this.showErrorMessage(errorMessage);
            });
    }

    handleSignup(e) {
        e.preventDefault();
        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                console.log('User signed up:', user);
                // Redirect or perform other actions after successful signup
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error signing up:', errorCode, errorMessage);
                this.showErrorMessage(errorMessage);
            });
    }

    redirectToSignup(e) {
        e.preventDefault();
        window.location.href = 'signup.html';
    }

    redirectToForgotPassword(e) {
        e.preventDefault();
        window.location.href = 'forgot-password.html';
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

// Initialize the AuthUI class when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthUI();
});