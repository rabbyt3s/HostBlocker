document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    const hostsContainer = document.getElementById('hosts-container');
    const blockBtn = document.getElementById('block-btn');
    const unblockBtn = document.getElementById('unblock-btn');
    const selectAllBtn = document.getElementById('select-all-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const successPopup = document.getElementById('success-popup');
    const successMessage = successPopup.querySelector('p');

    let currentPage = 1;
    let totalHosts = 0;
    let allHosts = [];
    let selectedHosts = [];

    function fetchHosts(page, search = '') {
        loadingOverlay.classList.add('active');
        fetch(`/hosts?page=${page}&search=${search}`)
            .then(response => response.json())
            .then(data => {
                renderHosts(data.hosts);
                updatePagination(data.totalPages);
                totalHosts = data.totalHosts;
                allHosts = data.allHosts;
                updateSelectedHosts();
                loadingOverlay.classList.remove('active');
            })
            .catch(error => {
                console.error(error);
                loadingOverlay.classList.remove('active');
            });
    }

    
    function renderHosts(hosts) {
        hostsContainer.innerHTML = '';

        hosts.forEach(host => {
            const li = document.createElement('li');
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = host;
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    selectedHosts.push(host);
                } else {
                    const index = selectedHosts.indexOf(host);
                    if (index > -1) {
                        selectedHosts.splice(index, 1);
                    }
                }
            });
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(host));
            li.appendChild(label);
            hostsContainer.appendChild(li);
        });

        updateSelectedHosts();
    }

    // Function to update pagination
    function updatePagination(totalPages) {
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // Function to update selected hosts
    function updateSelectedHosts() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (selectedHosts.includes(checkbox.value)) {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
        });
    }

    // Event listener for search button
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        currentPage = 1;
        selectedHosts = [];
        fetchHosts(currentPage, searchTerm);
    });

    // Event listener for previous button
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            fetchHosts(currentPage, searchInput.value.trim());
        }
    });

    // Event listener for next button
    nextBtn.addEventListener('click', function() {
        const totalPages = parseInt(totalPagesSpan.textContent);
        if (currentPage < totalPages) {
            currentPage++;
            fetchHosts(currentPage, searchInput.value.trim());
        }
    });

    // Event listener for block button
    blockBtn.addEventListener('click', function() {
        loadingOverlay.classList.add('active');
        fetch('/block', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hosts: selectedHosts })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchHosts(currentPage, searchInput.value.trim());
                showSuccessPopup('Hosts blocked successfully!');
            }
            loadingOverlay.classList.remove('active');
        })
        .catch(error => {
            console.error(error);
            loadingOverlay.classList.remove('active');
        });
    });

    // Event listener for unblock button
    unblockBtn.addEventListener('click', function() {
        loadingOverlay.classList.add('active');
        fetch('/unblock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hosts: selectedHosts })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchHosts(currentPage, searchInput.value.trim());
                showSuccessPopup('Hosts unblocked successfully!');
            }
            loadingOverlay.classList.remove('active');
        })
        .catch(error => {
            console.error(error);
            loadingOverlay.classList.remove('active');
        });
    });

    
    selectAllBtn.addEventListener('click', function() {
        if (selectedHosts.length === allHosts.length) {
            selectedHosts = [];
        } else {
            selectedHosts = [...allHosts];
        }
        updateSelectedHosts();
    });

    
    function showSuccessPopup(message) {
        successMessage.textContent = message;
        successPopup.classList.add('active');
        setTimeout(() => {
            successPopup.classList.remove('active');
        }, 3000);
    }

    fetchHosts(currentPage);
});
