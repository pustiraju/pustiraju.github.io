 document.addEventListener('DOMContentLoaded', () => {
            const usernameInput = document.getElementById('usernameInput');
            const searchBtn = document.getElementById('searchBtn');
            const profileContainer = document.getElementById('profileContainer');
            const loading = document.getElementById('loading');
            const error = document.getElementById('error');

            const profileImage = document.getElementById('profileImage');
            const name = document.getElementById('name');
            const bio = document.getElementById('bio');
            const locationText = document.getElementById('location-text');
            const followers = document.getElementById('followers');
            const following = document.getElementById('following');
            const publicRepos = document.getElementById('publicRepos');
            const reposContainer = document.getElementById('reposContainer');

            const messageModal = document.getElementById('messageModal');
            const modalContent = document.getElementById('modalContent');
            const modalCloseBtn = document.getElementById('modalCloseBtn');
            
            // Function to show the custom message modal
            function showMessage(message) {
                modalContent.textContent = message;
                messageModal.classList.remove('hidden');
            }

            // Function to hide the custom message modal
            modalCloseBtn.addEventListener('click', () => {
                messageModal.classList.add('hidden');
            });

            // Handle search button click
            searchBtn.addEventListener('click', () => {
                const username = usernameInput.value.trim();
                if (username) {
                    fetchGitHubProfile(username);
                } else {
                    showMessage("Please enter a GitHub username.");
                }
            });

            // Handle Enter key in input field
            usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    searchBtn.click();
                }
            });

            // Main function to fetch and display profile data
            async function fetchGitHubProfile(username) {
                // Show loading state and hide previous results
                profileContainer.classList.add('hidden');
                error.classList.add('hidden');
                loading.classList.remove('hidden');

                try {
                    const [profileResponse, reposResponse] = await Promise.all([
                        fetch(`https://api.github.com/users/${username}`),
                        fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=10`)
                    ]);

                    if (!profileResponse.ok) {
                        throw new Error('User not found');
                    }
                    
                    const profileData = await profileResponse.json();
                    const reposData = await reposResponse.json();
                    
                    // Display profile details
                    profileImage.src = profileData.avatar_url;
                    profileImage.alt = `${profileData.login}'s profile picture`;
                    name.textContent = profileData.name || profileData.login;
                    bio.textContent = profileData.bio || 'No bio provided.';
                    locationText.textContent = profileData.location || 'Not specified';
                    followers.textContent = profileData.followers;
                    following.textContent = profileData.following;
                    publicRepos.textContent = profileData.public_repos;
                    
                    // Clear previous repos
                    reposContainer.innerHTML = '';
                    
                    // Display repositories
                    if (reposData.length > 0) {
                        reposData.forEach(repo => {
                            const repoCard = document.createElement('a');
                            repoCard.href = repo.html_url;
                            repoCard.target = "_blank";
                            repoCard.classList.add('block', 'p-4', 'bg-white', 'rounded-lg', 'shadow-md', 'hover:shadow-lg', 'transition-shadow', 'duration-200');
                            repoCard.innerHTML = `
                                <h4 class="font-semibold text-lg text-blue-600 truncate">${repo.name}</h4>
                                <p class="text-sm text-gray-600 mt-1 line-clamp-2">${repo.description || 'No description provided.'}</p>
                                <div class="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                    <span class="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        ${repo.stargazers_count}
                                    </span>
                                    <span class="text-xs">•</span>
                                    <span class="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.5 8.75A.75.75 0 017.25 8h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
                                        </svg>
                                        ${repo.forks_count}
                                    </span>
                                </div>
                            `;
                            reposContainer.appendChild(repoCard);
                        });
                    } else {
                        reposContainer.innerHTML = '<p class="text-gray-500 text-center col-span-2">No public repositories found.</p>';
                    }
                    
                    loading.classList.add('hidden');
                    profileContainer.classList.remove('hidden');

                } catch (error) {
                    console.error('Error fetching GitHub profile:', error);
                    loading.classList.add('hidden');
                    error.classList.remove('hidden');
                }
            }
        });