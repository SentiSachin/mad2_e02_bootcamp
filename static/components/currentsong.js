const CurrentSong = Vue.component('currentsong', {
    template: `
    <div class="d-flex justify-content-center align-items-center">
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
    <div class="card-footer text-center">
        <button type="button" @click="initsetup">setup</button>
    </div>
  </div>
</div>
    `,
    data() {
        return {
            logged_in_as: 'noidea',
            songs: [],
            track_list:[],
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
        // Select all the elements in the HTML page
        // and assign them to a variable


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
            this.playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-2 x"></i>';
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
    mounted() {
        // 
        this.fetchData();
    }
});

export default CurrentSong; 
