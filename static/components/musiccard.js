const MusicCard = Vue.component('musiccard', {
    template: `
    <div class="row row-cols-1 row-cols-md-2 g-4 mt-2 mb-2">
  <div v-for="song in songs" :key="song.song_id" class="col">
    <div class="card h-100">
      <img src="/static/assests/musiclogo.jpeg" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">{{song.title}}</h5>
        <p class="card-text">Artist: {{ song.artist }}</p>
        <p class="card-text">Album: {{ song.album }}</p>
        <p class="card-text">Genre: Genre Name</p>
        <button @click="playSong(song.id)" class="btn btn-primary">Play</button>
      </div>
    </div>
  </div>
</div>
    `,
    data() {
        return {
            logged_in_as: 'noidea',
            songs: [],
        };
    },
    methods: {
        async fetchData() {
            const apiUrl = 'http://127.0.0.1:5000/api/songs';
      
            await fetch(apiUrl)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json(); // Parse JSON
              })
              .then(data => {
                // Handle the fetched data
                console.log('Fetched data:', data);
                // Do something with the data, such as updating a component property
                this.songs = data;
              })
              .catch(error => {
                // Handle errors
                console.error('Fetch error:', error);
                // Optionally, notify the user or perform other error-handling actions
              });
          },
        playSong(id) {

            this.$emit('play-song', id);
        }
    },
    mounted() {
        this.fetchData();
    }
});

export default MusicCard; 
