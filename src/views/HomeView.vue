<script setup>
import { ref, computed, onMounted } from 'vue';

// State management for tabs and book lists
const activeTab = ref('new');
const highlightedBooks = ref([]);
const newBooks = ref([]);
const trendingBooks = ref([]);
const hotBooks = ref([]);
const loading = ref(true);

// Computed property to seamlessly switch the list based on the active tab
const displayedBooks = computed(() => {
    if (activeTab.value === 'new') return newBooks.value;
    if (activeTab.value === 'trending') return trendingBooks.value;
    if (activeTab.value === 'hot') return hotBooks.value;
    return [];
});

// Fetch data from your backend
// Fetch data from your backend
const fetchHomepageData = async () => {
    try {
        // 1. Get the token from local storage
        const token = localStorage.getItem('token');

        // 2. Add ?limit=50 so we have enough data to filter!
        const response = await fetch('/api/books?limit=50', {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }
        
        const data = await response.json();
        
        const allBooks = data.books || data; 
        
        highlightedBooks.value = allBooks.filter(b => b.isHighlighted);
        newBooks.value = allBooks.slice(0, 6); 
        trendingBooks.value = allBooks.slice(0, 6); 
        hotBooks.value = allBooks.slice(0, 6);
        
    } catch (error) {
        console.error("Error loading homepage:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchHomepageData();
});
</script>

<template>
    <main class="container py-4">
        
        <div id="highlightedBooksCarousel" class="carousel slide mb-5 bg-secondary rounded" data-bs-ride="carousel" style="min-height: 300px;">
            <div class="carousel-inner h-100">
                <div 
                    v-for="(book, index) in highlightedBooks" 
                    :key="book._id"
                    :class="['carousel-item h-100', { active: index === 0 }]"
                >
                    <div class="d-flex align-items-center justify-content-center h-100 text-white p-5" style="min-height: 300px; background-color: #6c757d;">
                        <div class="text-center">
                            <h2 class="fw-bold">{{ book.title || 'Book 1 cover' }}</h2>
                        </div>
                    </div>
                </div>
                <div v-if="highlightedBooks.length === 0" class="carousel-item active h-100">
                    <div class="d-flex align-items-center justify-content-center h-100 text-white p-5" style="min-height: 300px; background-color: #6c757d;">
                        <h2>No Highlighted Books Available</h2>
                    </div>
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#highlightedBooksCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#highlightedBooksCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>

        <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'new' }" href="#" @click.prevent="activeTab = 'new'">New</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'trending' }" href="#" @click.prevent="activeTab = 'trending'">Trending</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'hot' }" href="#" @click.prevent="activeTab = 'hot'">Hot</a>
            </li>
        </ul>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-secondary" role="status"></div>
        </div>

        <div v-else class="book-list">
            <div class="card mb-3 border-0 border-bottom rounded-0" v-for="book in displayedBooks" :key="book._id">
                <div class="row g-0 align-items-center pb-3">
                    
                    <div class="col-md-2 col-4">
                        <div class="bg-secondary rounded" style="width: 100%; aspect-ratio: 1; object-fit: cover;">
                             <img v-if="book.coverImage" :src="book.coverImage" class="img-fluid rounded w-100 h-100" style="object-fit: cover;" alt="Book Cover">
                        </div>
                    </div>
                    
                    <div class="col-md-10 col-8">
                        <div class="card-body py-0">
                            <h5 class="card-title fw-bold mb-1">{{ book.title }}</h5>
                            <p class="card-text text-muted small mb-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                {{ book.description || 'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin...' }}
                            </p>
                            <p class="card-text">
    <small class="text-muted">
        Last updated {{ book.modified_at ? new Date(book.modified_at).toLocaleDateString() : 'recently' }}
    </small>
</p>
                            <RouterLink :to="`/book/detail/${book._id}`" class="btn btn-sm btn-outline-primary mt-2">
                                View
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-if="displayedBooks.length === 0" class="text-muted py-3">
                No books found in this category.
            </div>
        </div>

    </main>
</template>