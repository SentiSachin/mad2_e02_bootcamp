const NewAlbumForm = Vue.component('newalbumform', {
    template: `
      <section class="content">
        <h1>New Album</h1>
        <form @submit.prevent="saveAlbum" enctype="multipart/form-data">
          <label for="title">Title</label>
          <input v-model="title" type="text" id="title" required>
          <label for="genre">Genre</label>
          <input v-model="genre" type="text" id="genre" required>
          <input type="submit"></input>
        </form>
      </section>
    `,
    data() {
      return {
        title: '',
        genre: '',
        csrfToken: '',
      };
    },
    methods: {
      async saveAlbum() {
        try {
          
          const response = await fetch('http://127.0.0.1:5000/api/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': this.csrfToken,
            },
            body: JSON.stringify({
              "title": this.title,
              "genre": this.genre
            }),
            credentials: 'include', // Include cookies
          });
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          const data = await response.json();
          console.log('Fetched data:', data);
          alert('Album Created');
          this.$router.push('/');
        } catch (error) {
          console.error('Fetch error:', error);
          // Optionally, notify the user or perform other error-handling actions
        }
        console.log('Save album clicked with title:', this.title, 'and genre:', this.genre);
      },
      getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return "";
      },
    },
    mounted() {
      this.csrfToken = this.getCookie("csrf_access_token");
    }
  });

  export default NewAlbumForm
  