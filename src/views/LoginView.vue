\<script setup>
// imports
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()
// credentials
const credentials = ref({
    email: '',
    password: ''
});
const error = ref('')
// methods
const login = async () => {
    error.value = ''
    try {
        // fetch
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.value.email, password: credentials.value.password })
        });

        // response
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        // save token to local storage
        localStorage.setItem('token', data.token);
        if (data.role === 'admin') {
            router.push('/bookings'); // Admins usually manage all bookings
        } else {
            router.push('/users'); // Regular users see the user list
        }
    } catch (error) {
        alert(error);
    }
}
</script>

<template>
    <main class="container-fluid min-vh-100 w-100 d-flex align-items-center justify-content-center bg-light">
        
        <div class="card shadow-lg border-0 p-4" style="min-width: 350px; max-width: 450px;">
            
            <div class="text-center mb-4">
                <h3 class="fw-bold">Library Management</h3>
                <p class="text-muted small">Full-Stack System by Cheok In Lou</p>
            </div>

            <form @submit.prevent="login">
                <div class="mb-3">
                    <label class="form-label small fw-bold">EMAIL ADDRESS</label>
                    <input v-model="credentials.email" type="email" class="form-control" placeholder="oscar@example.com" required>
                </div>

                <div class="mb-3">
                    <label class="form-label small fw-bold">PASSWORD</label>
                    <input v-model="credentials.password" type="password" class="form-control" placeholder="••••••" required minlength="6">
                </div>

                <div v-if="error" class="alert alert-danger py-2 small mb-3">
                    {{ error }}
                </div>

                <button type="submit" class="btn btn-primary w-100 py-2 fw-bold">
                    SIGN IN
                </button>
            </form>
        </div>
    </main>
</template>

<style scoped>
/* This ensures the Bootstrap centering isn't fought by Vue defaults */
main {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>