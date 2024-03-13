import MusicCard from '/static/components/musiccard.js';

const IndexView = Vue.component('indexview', {
    template: `
    <div class="container-fluid overflow-hidden">
        <div class="text-center">
            <!-- Stack the columns on mobile by making one full-width and the other half-width -->
            <div class="row">
                <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">Navbar</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Link</a>
                                </li>
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        Dropdown
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#">Action</a></li>
                                        <li><a class="dropdown-item" href="#">Another action</a></li>
                                        <li>
                                            <hr class="dropdown-divider">
                                        </li>
                                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                                    </ul>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                                </li>
                            </ul>
                            <form class="d-flex" role="search">
                                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                                <button class="btn btn-outline-light text-dark" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </nav>
            </div>

            <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
            <div class="row">
                <div class="col-sm-8 border border-danger-subtle">
                    <div class="card text-center">
                        <div class="card-header">
                        Featured
                        </div>
                        <div class="card-body">
                        <h5 class="card-title">Special title treatment</h5>
                        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                        </div>
                        <div class="card-footer text-body-secondary">
                        2 days ago
                        </div>
                    </div>
                </div>
                <div class="col-sm-4 border border-danger-subtle overflow-y-scroll">
                    <div class="row row-cols-1 row-cols-md-2 g-4 mt-2 mb-2">
                        <MusicCard />
                        <MusicCard />
                        <MusicCard />
                        <MusicCard />
                        <MusicCard />
                        <MusicCard />
                        <MusicCard />
                    </div>
                </div>
            </div>

            <!-- Columns are always 50% wide, on mobile and desktop -->
            <div class="row">
                <footer>
                    <p>© 2018 Gandalf</p>
                </footer>
                <section class="user-info">
                    <h2>User Information</h2>
                    <p>Username: John Doe</p>
                    <p>Email: john.doe@example.com</p>
                    <p>logged_in_as: {{ logged_in_as }}</p>
                    <!-- Add more user information as needed -->
                    <button @click="getdata()">Get Data</button>
                </section>
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


    },
    components: {
        MusicCard
    }
});

export default IndexView; 
