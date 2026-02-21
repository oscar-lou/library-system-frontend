<script setup>
import { onMounted, ref } from "vue";
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'vue-router'

const router = useRouter()

const users = ref([]);
const name = ref("");

const loadAsyncData = async () => {
    try {
        // Get the token from local storage    
        const token = localStorage.getItem('token');

                if (!token) {
            alert('Please login first')
            window.location.href = '/login'
            return
        }

        // decode jwt token
        const decoded = jwtDecode(token);
        console.log(decoded);
        name.value = `${decoded.first_name} ${decoded.last_name}`;
        if (!response.ok) {
            throw new Error(response.statusText);
        }



        // Send a request to the endpoint with the token in the Authorization header
        var response = await fetch("/api/users", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });


        // convert the response to json
        const json = await response.json();
        // log the json
        console.log(json);
        // set the data
        users.value = json;
    } catch (error) {
        console.log(error);
    }
};

const logout = async function () {

    // Get the token from local storage    
    const token = localStorage.getItem('token');

    try {
        // Send a request to the endpoint with the token in the Authorization header
        var response = await fetch("/api/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        localStorage.removeItem('token');
        alert("Logout Successfully.")
        //location.reload()
        router.push('/login')
    } catch (error) {
        console.error("Logout error:", error);
        alert("An error occurred during logout. Please try again.");
    }
}

onMounted(() => {
    loadAsyncData();
});
</script>

<template>
    <main class="container py-5">
        <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <div>
                <h2 class="fw-bold mb-0">User Management</h2>
                <p class="text-muted mb-0">Logged in as: <strong>{{ name }}</strong></p>
            </div>
            <button type="button" class="btn btn-outline-danger shadow-sm" @click="logout">
                Log Out
            </button>
        </div>

        <div class="card shadow-sm border-0 p-4">
            <table class="table table-hover">
                <thead class="table-light">
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Bookings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user._id">
                        <td>{{ user.first_name }}</td>
                        <td>{{ user.last_name }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <span class="badge bg-primary rounded-pill">
                                {{ user.bookings ? user.bookings.length : 0 }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>