<script setup>
import { ref, onMounted, watch } from "vue" // add watch

const search = ref("");

watch(() => search.value, () => {
    loadAsyncData();
});
const data = ref([]);
const total = ref(0);
const loading = ref(false);
const sortField = ref("vote_count");
const sortOrder = ref("asc");
const page = ref(1);
const perPage = ref(5);

const loadAsyncData = function () {
    const params = [
        /* "api_key=bb6f51bef07465653c3e553d6ab161a8",
        "language=en-US",
        "include_adult=false",
        "include_video=false",*/
        `sort_by=${sortField.value}.${sortOrder.value}`, 
        `page=${page.value}`,
        `email=${search.value}`,
    ].join("&");
    loading.value = true;
    const token = localStorage.getItem('token');
    
    fetch(`/api/bookings?${params}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((response) => response.json())
        .then((result) => {
            perPage.value = result.perPage;
            total.value = result.total;
            data.value = result.bookings

            loading.value = false;
        })
        .catch((error) => {
            data.value = [];
            total.value = 0;
            loading.value = false;
            throw error;
        });
}

/*
 * Handle page-change event
 */
function onPageChange(p) {
    page.value = p;
    loadAsyncData();
}

/*
 * Handle sort event
 */
function onSort(column, order) {
    sortField.value = column?.field;
    sortOrder.value = order;
    loadAsyncData();
}

/*
 * Type style in relation to the value
 */
function type(value) {
    const number = parseFloat(value);
    if (number < 6) {
        return "is-danger";
    } else if (number >= 6 && number < 8) {
        return "is-warning";
    } else if (number >= 8) {
        return "is-success";
    } else return "";
}

onMounted(() => {
    loadAsyncData();
});
</script>

<template>
    <section>
        <input class="form-control" v-model="search" placeholder="Search..." />
        <o-table :data="data" :loading="loading" paginated backend-pagination :total="total" :per-page="perPage"
            backend-sorting :default-sort="[sortField, sortOrder]" aria-next-label="Next page"
            aria-previous-label="Previous page" aria-page-label="Page" aria-current-label="Current page"
            @page-change="onPageChange" @sort="onSort">
            <o-table-column v-slot="{ row }" field="email" label="Email" sortable>
                <!-- {{ row.email }} -->
                <RouterLink :to="`/booking/${row._id}`"> {{ row.email }} </RouterLink>
            </o-table-column>
            <o-table-column v-slot="{ row }" field="numTickets" label="#" numeric sortable>
                <span class="tag" :class="type(row.vote_average)">
                    {{ row.numTickets }}
                </span>
            </o-table-column>
            <o-table-column v-slot="{ row }" field="superhero" label="Superhero" numeric sortable>
                {{ row.superhero }}
            </o-table-column>
            <o-table-column v-slot="{ row }" field="modified_at" label="Last Modified At" sortable centered>
                {{
                    row.modified_at
                        ? new Date(row.modified_at).toLocaleDateString()
                        : "unknown"
                }}
            </o-table-column>
            <o-table-column v-slot="{ row }" field="payment" label="Payment" sortable>
                {{ row.payment }}
            </o-table-column>
        </o-table>
    </section>
</template>