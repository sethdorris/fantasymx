
  <template>
    <nav>
      <div class="nav-mobile">
        <a id="nav-toggle" href="#!"><span>X</span></a>
      </div>
      <ul class="nav-list">
        <li v-if="!isLoggedIn"><a href="#!">Register</a></li>
        <li v-if="!isLoggedIn" @click="show = !show"><a href="#!">Login</a></li>
          <ul class="nav-dropdown" v-if="show">
            <li>
              <label>Username: </label>
              <input type="text" v-model="username">
            </li>
            <li>
              <label>Password: </label>
              <input type="password" v-model="password">
            </li>
            <li>
              <button @click="login">Login</button>
            </li>
          </ul>
        <li><a href="#!">Home</a></li>
        <li v-if="isLoggedIn"><router-link to="/myteam">My Team</router-link></li>
        <li><a href="#!">Rules</a></li>
        <li>Hello {{$store.state.user.username}}</li>
      </ul>
    </nav>
  </template>
  <script>
    import axios from 'axios';
    export default {
      data() {
        return  {
          username: '',
          password: '',
          show: false,
          isLoggedIn: false
        }
      },
      computed() {
        return {

        }
      },
      methods: {
        login: function() {
          axios.post('/login', {
            username: this.username,
            password: this.password
          }).then(data => {
            console.log("Login Success")
            if (data.status == 200) {
              this.show = !this.show;
              this.isLoggedIn = true;
            }
          })
        }
      }
    }
  </script>
  <style>
    li {
      display: inline-block;
    }
    .nav-dropdown {
      position: absolute;
      padding: 0;
    }
  </style>
})
