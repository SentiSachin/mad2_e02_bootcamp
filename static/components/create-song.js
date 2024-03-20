const NewSongForm = Vue.component('newsongform', {
    template: `<div class="container justify-content-center d-flex mt-5">
    <div class="card" style="width: 30rem;">
      <header>
        <h1>New Song</h1>
      </header>
      <div class="card-body">
        <form @submit.prevent="saveSong" enctype="multipart/form-data">
          <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input type="text" class="form-control" id="title" v-model="title" required>
          </div>
          <br>
          <div class="mb-3">
            <label for="audio_file" class="form-label">Upload</label>
            <input type="file" ref="audioFileInput" @change="handleFileChange" class="form-control" id="audio_file" required>
          </div>
          <br>
          <select class="form-select" v-model="selectedAlbum" aria-label="Default select example" required>
            <option selected>Open this select menu</option>
            <option v-for="album in albums" :key="album.album_id" :value="album.album_id" value="1">{{ album.title }}</option>
          </select>
          <br>
          <div class="form-floating">
            <textarea v-model="lyrics" class="form-control" placeholder="Leave a comment here"
              id="floatingTextarea"></textarea>
            <label for="floatingTextarea">Comments</label>
          </div>
          <br>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>         
    `,
    data() {
      return {
        title: '',
        audioFile: null,
        selectedAlbum: '',
        lyrics: '',
        albums: [],
        csrfToken: ''
      };
    },
    methods: {
      handleFileChange(event) {
        this.audioFile = event.target.files[0];
      },
      async fetchData() {
        const apiUrl = 'http://127.0.0.1:5000/get/ablum';
  
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
            this.albums = data
          })
          .catch(error => {
            // Handle errors
            console.error('Fetch error:', error);
            // Optionally, notify the user or perform other error-handling actions
          });
      },
      async saveSong() {
        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('audio_file', this.audioFile);
        formData.append('album_id', this.selectedAlbum);
        formData.append('lyrics', this.lyrics);
      
        try {
          // Any other error-prone code can go here
          console.log('Save song clicked with title:', this.title, 'and album:', this.selectedAlbum);
      
          // Fetch API call
          const response = await fetch('http://127.0.0.1:5000/api/add/song', {
            method: 'POST',
            headers: {
              'X-CSRF-TOKEN': this.csrfToken,
            },
            body: formData,
            credentials: 'include',
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json(); // Assuming your server returns JSON
      
          // Handle the successful response
          console.log('Success:', data);
          alert('Song added successfully!');
          this.$router.push('/');
        } catch (error) {
          // Handle errors
          console.error('Error:', error);
          // Optionally, notify the user or perform other error-handling actions
        }
      },
      getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return "";
      },
      
    },
    mounted() {
      this.fetchData()
      this.csrfToken = this.getCookie("csrf_access_token");
    },
  });
  export default NewSongForm