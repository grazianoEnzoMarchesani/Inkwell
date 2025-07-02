document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT REFERENCES ---
    const postsGrid = document.getElementById('posts-grid');
    const searchInput = document.getElementById('search-input');
    const tagFiltersContainer = document.getElementById('tag-filters');
    const yearFiltersContainer = document.getElementById('year-filters');
    const noResultsMessage = document.getElementById('no-results');

    // Modal
    const modal = document.getElementById('post-modal');
    const modalContent = document.getElementById('modal-post-content');
    const closeModalButton = document.getElementById('close-modal');

    // --- APPLICATION STATE ---
    let allPosts = [];
    let currentFilters = {
        searchTerm: '',
        tag: null,
        year: null
    };
    let scrollPosition = 0;

    // --- DATA LOADING AND PARSING ---
    async function fetchAndParseIndex() {
        try {
            const response = await fetch('index.md');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const markdownIndex = await response.text();
            
            const postRegex = /\* \[([^\]]+)\]\(([^)]+)\) - ([\d-]+) - img:([^\s]+) - (.*)/;
            
            const parsedPosts = markdownIndex.split('\n')
                .map(line => line.trim())
                .filter(line => line.startsWith('* ['))
                .map(line => {
                    const match = line.match(postRegex);
                    if (!match) return null;

                    const [, title, path, date, image, tagsString] = match;
                    const tags = tagsString.split(',')
                                        .map(tag => tag.trim().replace('#', ''))
                                        .filter(tag => tag);
                    
                    return { title, path, date, image, tags };
                })
                .filter(post => post !== null);

            allPosts = parsedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

            populateFilters();
            renderPosts();

        } catch (error) {
            console.error("Error loading the post index:", error);
            postsGrid.innerHTML = `<p class="error">Could not load posts. Check the console for details.</p>`;
        }
    }

    // --- RENDERING AND FILTERING ---
    function populateFilters() {
        const allTags = new Set(allPosts.flatMap(post => post.tags));
        const allYears = new Set(allPosts.map(post => post.date.substring(0, 4)));

        // FIX: Translated button text to English
        tagFiltersContainer.innerHTML = '<button class="filter-button active" data-tag="all">All Tags</button>';
        allTags.forEach(tag => {
            tagFiltersContainer.innerHTML += `<button class="filter-button" data-tag="${tag}">${tag}</button>`;
        });

        // FIX: Translated button text to English
        yearFiltersContainer.innerHTML = '<button class="filter-button active" data-year="all">All Years</button>';
        [...allYears].sort((a, b) => b - a).forEach(year => {
            yearFiltersContainer.innerHTML += `<button class="filter-button" data-year="${year}">${year}</button>`;
        });
    }

    function applyAndRenderFilters() {
        let filteredPosts = [...allPosts];

        if (currentFilters.searchTerm) {
            const term = currentFilters.searchTerm.toLowerCase();
            filteredPosts = filteredPosts.filter(post => post.title.toLowerCase().includes(term));
        }

        if (currentFilters.tag) {
            filteredPosts = filteredPosts.filter(post => post.tags.includes(currentFilters.tag));
        }

        if (currentFilters.year) {
            filteredPosts = filteredPosts.filter(post => post.date.startsWith(currentFilters.year));
        }
        
        renderPosts(filteredPosts);
    }
    
    function renderPosts(postsToRender = allPosts) {
        postsGrid.innerHTML = ''; 

        if (postsToRender.length === 0) {
            noResultsMessage.style.display = 'block';
            return;
        }

        noResultsMessage.style.display = 'none';

        const fragment = document.createDocumentFragment();
        postsToRender.forEach(post => {
            const card = document.createElement('div');
            card.className = 'post-card';
            card.dataset.path = post.path;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');

            const tagsHtml = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

            // FIX: Changed toLocaleDateString to 'en-US' for English date format
            const formattedDate = new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            card.innerHTML = `
                <img src="${post.image}" alt="Cover image for ${post.title}" class="card-image" loading="lazy">
                <div class="card-content">
                    <h2>${post.title}</h2>
                    <p class="card-meta">${formattedDate}</p>
                    <div class="card-tags">${tagsHtml}</div>
                </div>
            `;
            fragment.appendChild(card);
        });
        postsGrid.appendChild(fragment);
    }

    // --- MODAL HANDLING & SECURITY ---
    async function openPostModal(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Could not load post: ${path}`);
            const markdownText = await response.text();

            const unsafeHtml = marked.parse(markdownText);
            const safeHtml = DOMPurify.sanitize(unsafeHtml);

            modalContent.innerHTML = safeHtml;
            
            scrollPosition = window.pageYOffset;
            document.body.classList.add('modal-open');
            modal.style.display = 'flex';
            
        } catch (error) {
            console.error("Error opening post:", error);
            modalContent.innerHTML = `<p class="error">Sorry, the content for this post could not be loaded.</p>`;
        }
    }

    function closeModal() {
        if (modal.style.display === 'none') return;
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        modalContent.innerHTML = '';
        window.scrollTo(0, scrollPosition);
    }

    // --- EVENT LISTENERS ---
    searchInput.addEventListener('input', (e) => {
        currentFilters.searchTerm = e.target.value;
        applyAndRenderFilters();
    });

    [tagFiltersContainer, yearFiltersContainer].forEach(container => {
        container.addEventListener('click', (e) => {
            if (!e.target.matches('.filter-button')) return;
            const button = e.target;
            const filterType = button.dataset.tag ? 'tag' : 'year';
            const value = button.dataset[filterType];
            if (currentFilters[filterType] === value || value === 'all') {
                currentFilters[filterType] = null;
                 container.querySelector('.active').classList.remove('active');
                 container.querySelector(`[data-${filterType}="all"]`).classList.add('active');
            } else {
                currentFilters[filterType] = value;
                if (container.querySelector('.active')) {
                    container.querySelector('.active').classList.remove('active');
                }
                button.classList.add('active');
            }
            applyAndRenderFilters();
        });
    });

    postsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.post-card');
        if (card && card.dataset.path) {
            openPostModal(card.dataset.path);
        }
    });

    closeModalButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display !== 'none') closeModal();
    });

    // --- APPLICATION START ---
    fetchAndParseIndex();
});