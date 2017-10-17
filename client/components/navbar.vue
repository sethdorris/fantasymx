
  <template>
    <nav class="navbar">
       <div class="navbar-brand">
        <div class="navbar-item">
          //ALPHA TEST//
        </div>
        <div class="navbar-burger burger" data-target="navMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="navbar-menu" id="navMenu">
        <div class="navbar-start">
          <div class="navbar-item">
            <router-link to="/home" exact>Home</router-link>
          </div>
          <div class="navbar-item" v-if="GetAuthStatus">
            <router-link to="/myteam">My Team</router-link>
          </div>
          <div class="navbar-item" v-if="GetAuthStatus">
            <router-link to="/live">Stat Tracker</router-link>
          </div>
          <div class="navbar-item">
            <router-link to="/rules">Info</router-link>
          </div>
          <div class="navbar-item">
            <router-link to="/suggestions">Suggestions</router-link>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item" v-if="!GetAuthStatus" @click="setRegisterModal({ show: !ShowRegisterModal })">
            <a href="#!">Register</a>
          </div>
          <div class="navbar-item" v-if="!GetAuthStatus" @click="setLoginModal({ show: !ShowLoginModal })">
            <span class="icon">
              <i class="fa fa-sign-in"></i>
            </span>
            <a href="#!">Login</a>
          </div>
          <div class="navbar-item" v-if="GetAuthStatus">
            <router-link to="/myaccount">Welcome, {{ getUserData.username }}!</router-link>
          </div>
          <LeagueDropdown class="navbar-item" v-if="GetAuthStatus" :currentLeague="getUserData.currentleague" :allLeagues="getUserData.leagues">
          </LeagueDropdown>
          <div class="navbar-item" v-if="GetAuthStatus" @click="setLoggedIn({ isLoggedIn: !GetAuthStatus })">
            <span class="icon" v-if="GetAuthStatus">
              <i class="fa fa-sign-out" aria-hidden="true"></i>
            </span>
            <a href="#!" @click="logout">Logout</a>
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
    import LeagueDropdown from './navbarDropdown.vue';
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
          console.log(data.data)
          if (typeof data.data.username != 'undefined') {
            console.log("User Is Authenticated")
            this.setUserData({ userData: data.data })
            this.setLoggedIn({ loggedIn: true })
          }
        }).catch(err => {
          console.log("login refresh error", err);
        })
      },
      methods: {
        ...mapMutations([
          'setRegisterModal',
          'setLoginModal',
          'setLoggedIn',
          'setUserData',
          'logout',
          'setManagedLeague'
        ]),
        logout() {
          axios.get('logout').then(data => {
            this.$router.push("/");
          })
        }
      },
      components: {
        'register': register,
        'login': login,
        'LeagueDropdown': LeagueDropdown
      }
    }
  </script>
  <style>
    .navbar-menu {
      padding: 0 100px 0 50px;
    }
    .navbar {
      background: transparent;
    }
    a {
      color: white;
      font-size: 16pt;
    }
    .router-link-active {
      border-bottom: 1px solid #fffc7f;
    }
  </style>
})
