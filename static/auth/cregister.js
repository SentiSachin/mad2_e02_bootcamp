const RegisterCreatorView = Vue.component('registercreatorview', {
    template: `
    <div class="mx-auto p-2 mt-5" style="width: 600px;">
    <div class="row g-0">
        <div class="col-md-4 p-2">
            <img src="/static/assests/musiclogo.jpeg" class="card-img-top" alt="...">
        </div>
        <div class="col-md-8 p-2">
            <div class="card-body">
                <h5 class="card-title">Creator Register Page</h5>
                <form @submit.prevent="registerCreator">
                    <div class="mb-3">
                        <label for="exampleInputUsername1" class="form-label">Username</label>
                        <input type="text" class="form-control" id="exampleInputUsername1" v-model="username"
                            aria-describedby="emailHelp">
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" v-model="email"
                            aria-describedby="emailHelp">
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" v-model="password" class="form-control" id="exampleInputPassword1">
                    </div>
                    <button type="submit" class="btn btn-primary">Register</button>
                </form>
            </div>
        </div>
    </div>
</div>
      `,
    data() {
      return {
          username: null,
          password: null,
          email:''
      };
    },
    methods: {
      async registerCreator() {
        try {
          const apiUrl = 'http://127.0.0.1:5000/api/creator';
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "username": this.username,
              "password": this.password,
              'email':this.email
            }),
          });
          if (!response.ok) {
            const data = await response.json();
            if (response.status === 404) {
              alert(data.error);
            } else if (response.status === 401) {
              alert(data.error);
            } else if (response.status===403) {
              alert(data.error)
            }
             else {
              alert(`An error occurred: ${response.statusText}`);
            }
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          const data = await response.json();
          console.log('Fetched data:', data);
          alert('Registration success!');
          this.$router.push('/login');
        } catch (error) {
          console.error('Fetch error:', error);
          // Optionally, notify the user or perform other error-handling actions
        }
      }
    }
  });
  
  export default RegisterCreatorView; 