const MusicCard = Vue.component('musiccard', {
    template: `
    <div class="col">
        <div class="card h-100">
        <img src="/static/assests/musiclogo.jpeg" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">Song Title</h5>
            <p class="card-text">Artist: Artist Name</p>
            <p class="card-text">Album: Album Name</p>
            <p class="card-text">Genre: Genre Name</p>
            <a href="#" class="btn btn-primary">Play</a>
        </div>
        </div>
    </div>
    `,
    data() {
        return {
            logged_in_as: 'noidea'
        };
    },
    methods: {
        async getdata() {
            try {
                const apiUrl = 'http://127.0.0.1:5000/who_am_i';
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
                        alert(data.msg)
                    }
                    else {
                        alert(`An error occurred: ${response.statusText}`);
                    }
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Fetched data:', data);
                this.logged_in_as = data.username;
            } catch (error) {
                console.error('Fetch error:', error);
                // Optionally, notify the user or perform other error-handling actions
            }
        }


    }
});

export default MusicCard; 
