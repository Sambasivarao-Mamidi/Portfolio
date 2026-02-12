
document.addEventListener('DOMContentLoaded', () => {
    const username = 'Sambasivarao-Mamidi'; // Replace with your GitHub username if different
    const projectsGrid = document.querySelector('.projects-grid');
    const filterContainer = document.querySelector('.portfolio-filter');

    if (!projectsGrid) return;

    // Fetch repositories
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`)
        .then(response => {
            if (!response.ok) {
                if (filterContainer) filterContainer.innerHTML = ''; // Clear filters if error
                throw new Error(`GitHub API Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(repos => {
            // Clear the loading message
            projectsGrid.innerHTML = '';

            // --- 1. Collect all unique languages ---
            // Using a Set to store unique languages found in the repos
            const languages = new Set();

            // Filter out forks if desired. For now, keep them.
            // repos = repos.filter(repo => !repo.fork);

            repos.forEach(repo => {
                const language = repo.language || 'Misc'; // Default to 'Misc' if null
                languages.add(language);
            });

            // --- 2. Update Filter Section ---
            if (filterContainer) {
                filterContainer.innerHTML = ''; // Remove existing static filters

                // Create 'ALL' filter
                const allFilter = document.createElement('span');
                allFilter.classList.add('filter-item', 'active');
                allFilter.textContent = 'ALL';
                allFilter.setAttribute('data-filter', 'all');
                filterContainer.appendChild(allFilter);

                // Create filters for each language
                languages.forEach(lang => {
                    const filterItem = document.createElement('span');
                    filterItem.classList.add('filter-item');
                    filterItem.textContent = lang.toUpperCase();
                    filterItem.setAttribute('data-filter', lang); // Store original case or normalized? Let's use exact string match later
                    filterContainer.appendChild(filterItem);
                });

                // Add Click Event Listeners to Filters
                const allFilters = filterContainer.querySelectorAll('.filter-item');
                allFilters.forEach(btn => {
                    btn.addEventListener('click', () => {
                        // Activate button
                        allFilters.forEach(f => f.classList.remove('active'));
                        btn.classList.add('active');

                        const filterValue = btn.getAttribute('data-filter');
                        filterProjects(filterValue);
                    });
                });
            }

            // --- 3. Render Projects ---
            repos.forEach(repo => {
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card');

                // Store language for filtering
                const language = repo.language || 'Misc';
                projectCard.setAttribute('data-category', language);

                // Use Open Graph image or a placeholder
                const imageUrl = `https://opengraph.githubassets.com/1/${username}/${repo.name}`;

                const description = repo.description || 'No description available.';

                // Card HTML
                projectCard.innerHTML = `
                    <div class="card-image">
                        <img src="${imageUrl}" alt="${repo.name}" loading="lazy">
                        <div class="overlay">
                            <a href="${repo.html_url}" target="_blank" class="view-btn">View Code</a>
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="view-btn">Live Demo</a>` : ''}
                        </div>
                    </div>
                    <div class="card-info">
                        <span class="category">${language}</span>
                        <h3>${formatRepoName(repo.name)}</h3>
                        <p style="font-size: 0.9rem; color: #666; margin-top: 5px;">${truncateText(description, 70)}</p>
                    </div>
                `;

                projectsGrid.appendChild(projectCard);
            });
        })
        .catch(error => {
            console.error('Error fetching GitHub projects:', error);
            projectsGrid.innerHTML = `<div style="text-align:center; width:100%; color:red;">Failed to load projects. Please try again later.</div>`;
        });

    // --- Helper Filter Function ---
    function filterProjects(category) {
        const cards = document.querySelectorAll('.project-card');

        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');

            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                // Add fade-in animation reset if desired
                card.style.animation = 'none';
                card.offsetHeight; /* trigger reflow */
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
});

// Helper function to format repo names
function formatRepoName(name) {
    return name.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Helper function to truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}
