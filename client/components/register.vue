  <template>
  <div>
      <div>New Player Registration</div>
      <div>
        <label for="reg-username">Username: </label>
        <input type="text" id="reg-username" v-model="username"/>

        <label for="reg-email">Email: </label>
        <input type="email" id="reg-email" v-model="email"/>

        <label for="reg-password">Password: </label>
        <input type="password" id="reg-password" v-model="password"/>

        <button id="submit-register" v-on:click="submit">SUBMIT</button>
      </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: ''
      }
    },
    methods: {
      submit() {
        console.log("fuck")
      }
    }
  }

</script>
