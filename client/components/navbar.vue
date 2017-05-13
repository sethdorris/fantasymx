
  <template>
    <nav>
      <div class="nav-mobile">
        <a id="nav-toggle" href="#!"><span></span></a>
      </div>
      <ul class="nav-list">
        <li><a href="#!">Register</a></li>
        <li><a href="#!">Login</a>
          <ul class="nav-dropdown">
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
        <li><a href="#!">My Team</a></li>
        <li><a href="#!">Rules</a></li>
      </ul>
    </nav>
  </template>
  <script>
    export default {
      data() {
        return  {
          username: '',
          password: ''  
        }
      }
    }
  </script>
})
