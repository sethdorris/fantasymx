
  <template>
    <nav class="navbar">
      <div class="navbar-brand">
        <div class="navbar-item">
          FANTASYMX
        </div>
        <div class="navbar-burger burger" data-target="navMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div id="navMenu" class="navbar-menu">
        <div class="navbar-start">
          <div class="navbar-item">
            <span class="icon">
              <i class="fa fa-home"></i>
            </span>
            <a href="#!">Home</a>
          </div>
          <div class="navbar-item" v-if="GetAuthStatus">
            <router-link to="/myteam">My Team</router-link>
          </div>
          <div class="navbar-item">
            <a href="#!">Rules</a>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item" v-if="!GetAuthStatus" @click="setRegisterModal({ show: !ShowRegisterModal })">
            <a href="#!">Register</a>
          </div>
          <div class="navbar-item" v-if="!GetAuthStatus" @click="setLoginModal({ show: !ShowLoginModal })">
            <a href="#!">Login</a>
          </div>
          <div class="navbar-item" v-if="GetAuthStatus">
            <a href="#!">Welcome, {{ getUserData.username }}!</a>
          </div>
          <div class="navbar-item" v-if="GetAuthStatus" @click="setLoggedIn({ isLoggedIn: !GetAuthStatus })">
            <a href="#!">Logout</a>
          </div>
        </div>
      </div>
      <register :show="ShowRegisterModal"></register>
      <login v-bind:show="ShowLoginModal"></login>
    </nav>
  </template>
  <script>
    import axios from 'axios';
    import { mapGetters, mapMutations } from 'vuex';
    import register from './register.vue';
    import login from './login.vue';
    export default {
      data() {
        return  {
          username: '',
          password: '',
          showRegisterModal: false,
        }
      },
      computed: mapGetters([
        'ShowLoginModal',
        'ShowRegisterModal',
        'getUserData',
        'GetAuthStatus'
      ]),
      mounted() {
        // Get all "navbar-burger" elements
        var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
        console.log($navbarBurgers);
        // Check if there are any nav burgers
        if ($navbarBurgers.length > 0) {

          // Add a click event on each of them
          $navbarBurgers.forEach(function ($el) {
            $el.addEventListener('click', () => {

              // Get the target from the "data-target" attribute
              var target = $el.dataset.target;
              var $target = document.getElementById(target);

              // Toggle the class on both the "navbar-burger" and the "navbar-menu"
              $el.classList.toggle('is-active');
              $target.classList.toggle('is-active');

            });
          });
        }
      },
      created() {
        axios.get('/loginrefresh').then(data => {
          console.log("data", data);
          if (data.data.username != 'undefined') {
            this.setUserData({ userData: data.data })
            this.setLoggedIn({ loggedIn: true })
          }
        })
      },
      methods: {
        ...mapMutations([
          'setRegisterModal',
          'setLoginModal',
          'setLoggedIn',
          'setUserData'
        ]),
        login: function() {
          console.log("username", this.username)
          // axios.post('/login', {
          //   username: this.username,
          //   password: this.password
          // }).then(data => {
          //   console.log("Login Success")
          //   if (data.status == 200) {
          //     this.isLoggedIn = true;
          //   }
          // })
          // .error(err => {
          //   console.log("Login error: ", err);
          // })
        }
      },
      components: {
        'register': register,
        'login': login
      }
    }
  </script>
  <style>
    .navbar-menu {
      padding: 0 100px 0 50px;
    }
    .icon {
      margin-right: 5px;
      color: #00d1b2;
    }
  </style>
})
