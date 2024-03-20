import MusicCard from '/static/components/musiccard.js';

const IndexView = Vue.component('indexview', {
    template: `
    <div class="container-fluid overflow-hidden">
        <div class="text-center">
            <!-- Stack the columns on mobile by making one full-width and the other half-width -->
            <div class="row">
                <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
                    <div class="container-fluid">
                        <h3><span class="badge text-bg-secondary">BS Music</span></h3>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul v-if="!this.$store.state.isAuthenticated" class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" style="cursor:pointer" @click="login()">Login</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" style="cursor:pointer" @click="register()">Register</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" style="cursor:pointer" @click="cregister()">Creator Register</a>
                                </li>
                            </ul>
                            <ul v-else class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <a class="nav-link" style="cursor:pointer" @click="addalbum()">add album</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" style="cursor:pointer" @click="addsong()">add song</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" style="cursor:pointer" @click="logout()">logout</a>
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
                    <router-view />
                    <div class="container text-center mt-2">
                        <div class="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
                            <div v-for="album in albums" :key="album.id" class="col">
                                <div class="p-3">{{ album.title }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-4 border border-danger-subtle overflow-y-scroll">
                    <MusicCard @play-song="passid" />
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
                    <!-- Add more user information as needed -->
                    <button @click="getdata()">Get Data</button>
                </section>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            isAuthenticated: sessionStorage.getItem('access-token')?true:false,
            albums: [],
        };
    },
    methods: {
        async getdata() {
            try {
                const apiUrl = 'http://127.0.0.1:5000/get/ablum';
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
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
                this.albums = data;

            } catch (error) {
                console.error('Fetch error:', error);
                // Optionally, notify the user or perform other error-handling actions
            }
        },
        passid(id){
            console.log(id)
            this.$store.commit('setCurrentSongId', id);
            if(this.$route.path !== '/current/playing/song/'+id)        
                this.$router.push('/current/playing/song/'+id);
        },
        login() {
            if(this.$route.path !== '/login')        
                this.$router.push('/login');
        },
        async logout() {
            console.log(document.cookie)
            try {
                const apiUrl = 'http://127.0.0.1:5000/logout';
                const response = await fetch(apiUrl, {
                    method: 'POST'
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
                sessionStorage.removeItem('access-token');
                if(this.$route.path !== '/')        
                    this.$router.push('/');
            } catch (error) {
                console.error('Fetch error:', error);
                // Optionally, notify the user or perform other error-handling actions
            }
        },
        register() {
            if(this.$route.path !== '/register')        
                this.$router.push('/register');
        },
        cregister() {
            if(this.$route.path !== '/creator/register')        
                this.$router.push('/creator/register');
        },
        addalbum() {
            if(this.$route.path !== '/creator/newalbumform')        
                this.$router.push('/creator/newalbumform');
        },
        addsong() {
            if(this.$route.path !== '/creator/add/song')        
                this.$router.push('/creator/add/song');
        }

    },
    components: {
        MusicCard
    },
    mounted() {
        this.$store.dispatch('fetchAuthUser')
        this.getdata()
    }
});

export default IndexView; 
