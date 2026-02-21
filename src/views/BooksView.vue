<script setup>
import { ref, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';
// import NavBar from '../components/NavBar.vue';

// State management
const books = ref([]);
const loading = ref(true);
const isAuthenticated = ref(false);
const isAdmin = ref(false);

// Pagination state
const page = ref(1);
const limit = ref(6);
const total = ref(0);
const totalPages = ref(1);

// 1. Check user role and authentication status
const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            isAuthenticated.value = true;
            isAdmin.value = decoded.role === 'admin';
        } catch (e) {
            isAuthenticated.value = false;
            isAdmin.value = false;
        }
    }
};

// 2. Fetch books with pagination
const fetchBooks = async () => {
    try {
        loading.value = true;
        const token = localStorage.getItem('token');
        
        // Setup headers conditionally based on login status
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const response = await fetch(`/api/books?page=${page.value}&limit=${limit.value}`, {
            headers: headers
        });

        if (!response.ok) throw new Error("Failed to fetch books");

        const data = await response.json();
        
        books.value = data.books || data;
        total.value = data.total || 0;
        totalPages.value = Math.ceil(total.value / limit.value) || 1;
        
    } catch (error) {
        console.error("Error fetching books:", error);
    } finally {
        loading.value = false;
    }
};

// Pagination controls
const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        page.value = newPage;
        fetchBooks();
    }
};

// Admin Action: Delete Book
const deleteBook = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/books/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            alert("Book deleted successfully!");
            fetchBooks(); // Refresh the current page
        } else {
            alert("Failed to delete book.");
        }
    } catch (error) {
        console.error(error);
    }
};

// User Action: Borrow Book
const borrowBook = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/books/${id}/borrow`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            alert("Book borrowed successfully!");
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Failed to borrow book.");
        }
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    checkAuth();
    fetchBooks();
});
</script>

<template>
    <!-- <NavBar /> -->
    
    <main class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <h2 class="fw-bold mb-0">Books</h2>
            <RouterLink v-if="isAdmin" to="/book/add" class="btn btn-primary">
                Add New Book
            </RouterLink>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-secondary" role="status"></div>
        </div>

        <div v-else class="row row-cols-1 row-cols-md-3 g-4 mb-5">
            <div class="col" v-for="book in books" :key="book._id">
                <div class="card h-100 shadow-sm border-0">
                    
                    <div class="bg-secondary text-white d-flex align-items-center justify-content-center rounded-top" style="height: 225px; overflow: hidden;">
                        <img v-if="book.coverImage" :src="book.coverImage" class="img-fluid w-100 h-100" style="object-fit: cover;" alt="Book Cover">
                        <span v-else class="text-muted fs-5">Cover Image</span>
                    </div>

                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">{{ book.title }}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">{{ book.author }}</h6>
                        
                        <p class="card-text text-muted small flex-grow-1" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                            {{ book.description || 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.' }}
                        </p>

                        <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                            <div class="btn-group">
                                <RouterLink :to="`/book/detail/${book._id}`" class="btn btn-sm btn-outline-secondary">
                                    View
                                </RouterLink>
                                
                                <template v-if="isAdmin">
                                    <RouterLink :to="`/book/edit/${book._id}`" class="btn btn-sm btn-outline-secondary">
                                        Edit
                                    </RouterLink>
                                    <button @click="deleteBook(book._id)" class="btn btn-sm btn-outline-danger">
                                        Delete
                                    </button>
                                </template>

                                <template v-if="isAuthenticated && !isAdmin">
                                    <button @click="borrowBook(book._id)" class="btn btn-sm btn-outline-primary">
                                        Borrow
                                    </button>
                                </template>
                            </div>
                            
                            <small class="text-muted">
                                {{ book.updatedAt || book.created_at ? new Date(book.updatedAt || book.created_at).toLocaleDateString() : 'recently' }}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-if="books.length === 0" class="col-12 text-center text-muted py-5">
                <h4>No books found in the library.</h4>
            </div>
        </div>

        <nav v-if="totalPages > 1" aria-label="Book pagination" class="mt-4">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: page === 1 }">
                    <button class="page-link" @click="changePage(page - 1)">Previous</button>
                </li>
                
                <li class="page-item" v-for="p in totalPages" :key="p" :class="{ active: p === page }">
                    <button class="page-link" @click="changePage(p)">{{ p }}</button>
                </li>
                
                <li class="page-item" :class="{ disabled: page === totalPages }">
                    <button class="page-link" @click="changePage(page + 1)">Next</button>
                </li>
            </ul>
        </nav>
        
    </main>
</template>

<style scoped>
/* Minor enhancements for hover states */
.card {
    transition: transform 0.2s ease-in-out;
}
.card:hover {
    transform: translateY(-3px);
}
</style>