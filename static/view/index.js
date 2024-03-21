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
                <div v-show="currentSongId !== null" class="d-flex justify-content-center align-items-center">
                    <div class="card d-flex justify-content-center text-center" style="width: 18rem;">
                        <div class="now-playing">PLAYING x OF y</div>
                        <img src="/static/assests/musiclogo.jpeg" class="rounded img-thumbnail mx-auto d-block" alt="..."
                            style="height: 200px; width: 200px;">
                        <div class="card-body text-center">
                            <h5 class="track-name card-title">Track Name</h5>
                            <p class="track-artist card-text">Track Artist</p>
                            <div class="d-flex justify-content-center"> <!-- Center the buttons -->
                            <div class="prev-track me-3" @click="prevTrack()">
                                <i class="fa fa-step-backward fa-1x"></i>
                            </div>
                            <div class="playpause-track me-3" @click="playpauseTrack()">
                                <i class="fa fa-play-circle fa-2x"></i>
                            </div>
                            <div class="next-track" @click="nextTrack()">
                                <i class="fa fa-step-forward fa-1x"></i>
                            </div>
                            </div>
                            <div class="slider_container d-flex justify-content-center"> <!-- Center the time and seek input -->
                            <div class="current-time">00:00</div>
                            <input class="seek_slider" type="range" min="1" max="100" value="0" @change="seekTo()">
                            <div class="total-duration">00:00</div>
                            </div>
                            <div class="slider_container d-flex justify-content-center"> <!-- Center the volume controls -->
                            <i class="fa fa-volume-down"></i>
                            <input type="range" min="1" max="100" value="99" class="volume_slider" @change="setVolume()">
                            <i class="fa fa-volume-up"></i>
                            </div>
                        </div>
                        </div>
                    </div>
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
            track_list:[],
            currentSongId: null,
            now_playing: document.querySelector(".now-playing"),
            // track_art: document.querySelector(".track-art"),
            track_name: document.querySelector(".track-name"),
            track_artist: document.querySelector(".track-artist"),
            playpause_btn: document.querySelector(".playpause-track"),
            next_btn: document.querySelector(".next-track"),
            prev_btn: document.querySelector(".prev-track"),
            seek_slider: document.querySelector(".seek_slider"),
            volume_slider: document.querySelector(".volume_slider"),
            curr_time: document.querySelector(".current-time"),
            total_duration: document.querySelector(".total-duration"),
            track_index: 0,
            isPlaying: false,
            updateTimer: '',
            curr_track: document.createElement('audio')
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
            if(this.currentSongId ===null){
                this.initsetup()
            }

            console.log(this.currentSongId, 'pooonam pandey')
            this.currentSongId=id
            const index = 
            this.track_index = this.track_list.findIndex(p => p.id ===id);
            console.log(this.track_index, 'pooonam pandey')
            // Load and play the new track
            this.loadTrack(this.track_index);
            this.playTrack();
            // Load and play the new track
            
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
        },
        loadTrack(track_index) {
            // Clear the previous seek timer
            clearInterval(this.updateTimer);
            this.resetValues();

            // Load a new track
            this.curr_track.src = this.track_list[this.track_index].path;
            this.curr_track.load();

            // Update details of the track
            // this.track_art.style.backgroundImage =
            //     "url(" + this.track_list[this.track_index].image + ")";
            this.track_name.textContent = this.track_list[this.track_index].name;
            this.track_artist.textContent = this.track_list[this.track_index].artist;
            this.now_playing.textContent =
                "PLAYING " + (this.track_index + 1) + " OF " + this.track_list.length;

            // Set an interval of 1000 milliseconds
            // for updating the seek slider
            this.updateTimer = setInterval(this.seekUpdate, 1000);

            // Move to the next track if the current finishes playing
            // using the 'ended' event
            this.curr_track.addEventListener("ended", this.nextTrack);

            // Apply a random background color
            this.random_bg_color();
        },

        random_bg_color() {
            // Get a random number between 64 to 256
            // (for getting lighter colors)
            let red = Math.floor(Math.random() * 256) + 64;
            let green = Math.floor(Math.random() * 256) + 64;
            let blue = Math.floor(Math.random() * 256) + 64;

            // Construct a color with the given values
            let bgColor = "rgb(" + red + ", " + green + ", " + blue + ")";

            // Set the background to the new color
            document.body.style.background = bgColor;
        },

        //  to reset all values to their default
        resetValues() {
            this.curr_time.textContent = "00:00";
            this.total_duration.textContent = "00:00";
            this.seek_slider.value = 0;
        },
        playpauseTrack() {
            // Switch between playing and pausing
            // depending on the current state
            if (!this.isPlaying) this.playTrack();
            else this.pauseTrack();
        },

        playTrack() {
            // Play the loaded track
            this.curr_track.play();
            this.isPlaying = true;

            // Replace icon with the pause icon
            this.playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-2x"></i>';
        },

        pauseTrack() {
            // Pause the loaded track
            this.curr_track.pause();
            this.isPlaying = false;

            // Replace icon with the play icon
            this.playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-2x"></i>';
        },

        nextTrack() {
            // Go back to the first track if the
            // current one is the last in the track list
            if (this.track_index < this.track_list.length - 1)
                this.track_index += 1;
            else this.track_index = 0;

            // Load and play the new track
            this.loadTrack(this.track_index);
            this.playTrack();
        },

        prevTrack() {
            // Go back to the last track if the
            // current one is the first in the track list
            if (this.track_index > 0)
                this.track_index -= 1;
            else this.track_index = this.track_list.length - 1;

            // Load and play the new track
            this.loadTrack(this.track_index);
            this.playTrack();
        },
        seekTo() {
            // Calculate the seek position by the
            // percentage of the seek slider 
            // and get the relative duration to the track
            let seekto = this.curr_track.duration * (this.seek_slider.value / 100);

            // Set the current track position to the calculated seek position
            this.curr_track.currentTime = seekto;
        },

        setVolume() {
            // Set the volume according to the
            // percentage of the volume slider set
            this.curr_track.volume = this.volume_slider.value / 100;
        },

        seekUpdate() {
            let seekPosition = 0;

            // Check if the current track duration is a legible number
            if (!isNaN(this.curr_track.duration)) {
                seekPosition = this.curr_track.currentTime * (100 / this.curr_track.duration);
                this.seek_slider.value = seekPosition;

                // Calculate the time left and the total duration
                let currentMinutes = Math.floor(this.curr_track.currentTime / 60);
                let currentSeconds = Math.floor(this.curr_track.currentTime - currentMinutes * 60);
                let durationMinutes = Math.floor(this.curr_track.duration / 60);
                let durationSeconds = Math.floor(this.curr_track.duration - durationMinutes * 60);

                // Add a zero to the single digit time values
                if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
                if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
                if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
                if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

                // Display the updated duration
                this.curr_time.textContent = currentMinutes + ":" + currentSeconds;
                this.total_duration.textContent = durationMinutes + ":" + durationSeconds;
            }
        },
        async fetchData() {
            const apiUrl = 'http://127.0.0.1:5000/api/songs/curr';
      
            await fetch(apiUrl)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json(); // Parse JSON
              })
              .then(data => {
                // Handle the fetched data
                console.log('Fetched data current songs:', data);
                // Do something with the data, such as updating a component property
                this.track_list = data;
              })
              .catch(error => {
                // Handle errors
                console.error('Fetch error:', error);
                // Optionally, notify the user or perform other error-handling actions
              });
          },
          initsetup(){
            this.now_playing=document.querySelector(".now-playing"),
            // this.track_art= document.querySelector(".track-art"),
            this.track_name= document.querySelector(".track-name"),
            this.track_artist= document.querySelector(".track-artist"),
            this.playpause_btn= document.querySelector(".playpause-track"),
            this.next_btn= document.querySelector(".next-track"),
            this.prev_btn =  document.querySelector(".prev-track"),
            this.seek_slider= document.querySelector(".seek_slider"),
            this.volume_slider= document.querySelector(".volume_slider"),
            this.curr_time= document.querySelector(".current-time"),
            this.total_duration = document.querySelector(".total-duration"),
            this.track_index= 0,
            this.isPlaying = false,
            this.updateTimer = null,
            this.curr_track= document.createElement('audio')
            this.loadTrack(this.track_index);
          }

    },
    components: {
        MusicCard
    },
    mounted() {
        this.$store.dispatch('fetchAuthUser')
        this.getdata()
        this.fetchData()
    }
});

export default IndexView; 
