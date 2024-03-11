const WelcomeView = Vue.component('welview', {
    template: `
    <section>
    <section class="user-info">
        <h2>User Information</h2>
        <p>Username: John Doe</p>
        <p>Email: john.doe@example.com</p>
        <p>logged_in_as: {{ logged_in_as }}</p>
        <!-- Add more user information as needed -->
        <button @click="getdata()">Get Data</button>
    </section>

    <!-- Song List -->
    <section class="container song-list">
        <h2>All Songs</h2>
        <ul class="list-group">
            <li class="list-group-item">Song 1</li>
            <li class="list-group-item">Song 2</li>
            <li class="list-group-item">Song 3</li>
            <!-- Add more songs as needed -->
        </ul>
    </section>

    <!-- Current Playing Song -->
    <section class="container current-song">
        <h2>Now Playing</h2>
        <p>Song: Song 1</p>
        <p>Artist: Artist 1</p>
        <p>Duration: 3:30</p>
        <!-- Add more information about the currently playing song as needed -->
    </section>
</section>
    `,
    data() {
        return {
            logged_in_as: 'noidea'
        };
    },
    methods: {
        async getdata() {
            try {
                const apiUrl = 'http://127.0.0.1:5000/protected';
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    const data = await response.json();
                    if (response.status === 404) {
                        alert(data.error);
                    } else if (response.status === 401) {
                        alert(data.error);
                    } else if (response.status === 403) {
                        alert(data.error)
                    }
                    else {
                        alert(`An error occurred: ${response.statusText}`);
                    }
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Fetched data:', data);
                this.logged_in_as = data.logged_in_as;
            } catch (error) {
                console.error('Fetch error:', error);
                // Optionally, notify the user or perform other error-handling actions
            }
        }


    }
});

export default WelcomeView; 
