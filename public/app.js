document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Elements
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('#status-text');

    const categorizerForm = document.querySelector('#categorizer-form');
    const catSubmitBtn = document.querySelector('#cat-submit-btn');
    const catResult = document.querySelector('#cat-result');
    const catPlaceholder = document.querySelector('#cat-placeholder');

    const impactForm = document.querySelector('#impact-form');
    const impactSubmitBtn = document.querySelector('#impact-submit-btn');
    const impactResult = document.querySelector('#impact-result');
    const impactPlaceholder = document.querySelector('#impact-placeholder');

    // API Base URL (relative since we are serving from the same origin)
    const API_BASE = '/api';

    // Check System Health
    async function checkHealth() {
        try {
            const res = await fetch(`${API_BASE}/health`);
            if (res.ok) {
                const data = await res.json();
                statusDot.classList.add('online');
                statusText.textContent = 'System Online';
            } else {
                throw new Error();
            }
        } catch (err) {
            statusDot.classList.remove('online');
            statusText.textContent = 'System Offline';
        }
    }

    checkHealth();
    setInterval(checkHealth, 30000); // Check every 30s

    // Categorizer Form Submission
    categorizerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productName = document.querySelector('#product-name').value;
        const productDesc = document.querySelector('#product-desc').value;

        // Set loading state
        catSubmitBtn.disabled = true;
        catSubmitBtn.innerHTML = '<span>Processing...</span><i data-lucide="loader" class="spin"></i>';
        lucide.createIcons();

        try {
            const response = await fetch(`${API_BASE}/category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name: productName,
                    description: productDesc
                })
            });

            const result = await response.json();

            if (result.success) {
                const data = result.data;

                // Update UI
                const displayId = String(data.product_id).includes('-')
                    ? data.product_id.split('-').pop().toUpperCase()
                    : data.product_id;
                document.querySelector('#res-id').textContent = `#ID-${displayId}`;
                document.querySelector('#res-category').textContent = data.category;
                document.querySelector('#res-subcategory').textContent = data.subcategory;

                // Tags
                const tagsContainer = document.querySelector('#res-tags');
                tagsContainer.innerHTML = '';
                data.tags.forEach(tag => {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'tag';
                    tagEl.textContent = tag;
                    tagsContainer.appendChild(tagEl);
                });

                // Filters
                const filtersContainer = document.querySelector('#res-filters');
                filtersContainer.innerHTML = '';
                data.sustainability_filters.forEach(filter => {
                    const filterEl = document.createElement('span');
                    filterEl.className = 'tag';
                    filterEl.textContent = filter;
                    filtersContainer.appendChild(filterEl);
                });

                // Show Result
                catPlaceholder.classList.add('hidden');
                catResult.classList.remove('hidden');
                catResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                alert('Error: ' + result.error.message);
            }
        } catch (err) {
            console.error('API Error:', err);
            alert('Failed to connect to the AI service. Please ensure the server is running.');
        } finally {
            catSubmitBtn.disabled = false;
            catSubmitBtn.innerHTML = '<span>Generate Categories</span><i data-lucide="sparkles"></i>';
            lucide.createIcons();
        }
    });

    // Impact Form Submission
    impactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productName = document.querySelector('#impact-product').value;
        const quantity = parseInt(document.querySelector('#impact-quantity').value);

        // Set loading state
        impactSubmitBtn.disabled = true;
        impactSubmitBtn.innerHTML = '<span>Calculating...</span><i data-lucide="loader" class="spin"></i>';
        lucide.createIcons();

        try {
            const response = await fetch(`${API_BASE}/impact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product: productName,
                    quantity: quantity
                })
            });

            const result = await response.json();

            if (result.success) {
                const data = result.data;

                // Update UI
                document.querySelector('#res-plastic').textContent = data.impact_metrics.plastic_saved_grams.toLocaleString();
                document.querySelector('#res-carbon').textContent = data.impact_metrics.carbon_avoided_kg.toFixed(3);
                document.querySelector('#res-statement').textContent = data.impact_statement;
                document.querySelector('#res-sourcing').textContent = data.local_sourcing;

                // Show Result
                impactPlaceholder.classList.add('hidden');
                impactResult.classList.remove('hidden');
                impactResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                alert('Error: ' + result.error.message);
            }
        } catch (err) {
            console.error('API Error:', err);
            alert('Failed to connect to the AI service. Please ensure the server is running.');
        } finally {
            impactSubmitBtn.disabled = false;
            impactSubmitBtn.innerHTML = '<span>Generate Report</span><i data-lucide="file-chart-line"></i>';
            lucide.createIcons();
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });

                // Update active link
                document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
});

// Helper for spin animation
const style = document.createElement('style');
style.textContent = `
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
