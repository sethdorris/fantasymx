
  <template>
    <nav>
      <div class="nav-mobile">
        <a id="nav-toggle" href="#!"><span>X</span></a>
      </div>
      <ul class="nav-list">
        <li><a href="#!">Register</a></li>
        <li @click="show = !show"><a href="#!">Login</a>
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
              <button>Login</button>
            </li>
          </ul>
        </li>
        <li><a href="#!">Home</a></li>
        <li v-if="isLoggedIn"><a href="#!">My Team</a></li>
        <li><a href="#!">Rules</a></li>
      </ul>
    </nav>
  </template>
  <script>
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
