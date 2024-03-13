const RegisterVue = Vue.component('register', {
    template: `
    <div class="mx-auto p-2 mt-5" style="width: 600px;">
    <div class="row g-0">
        <div class="col-md-4 p-2">
            <img src="/static/assests/musiclogo.jpeg" class="card-img-top" alt="...">
        </div>
        <div class="col-md-8 p-2">
            <div class="card-body">
                <form @submit.prevent="register">
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
    data(){
        return {
            email: null,
            password: null,
            username: null
        }
    },
    methods: {
        async register() {
            try {
                const apiUrl = 'http://127.0.0.1:5000/register';
                const response = await fetch(apiUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        "username": this.username,
                        "email": this.email,
                        "password": this.password
                    })
                })
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
                alert(data.message);
                this.$router.push('/login');
            }catch (error) {
                console.error('There was an error!', error);
            }
        }
    }
})
export default RegisterVue;