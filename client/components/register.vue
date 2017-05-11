  <template>
  <div>
      <div>New Player Registration</div>
      <div>
        <label for="reg-username">Username: </label>
        <input type="text" id="reg-username" v-model="username"/>

        <label for="reg-email">Email: </label>
        <input type="email" id="reg-email" v-model="email"/>

        <label for="reg-password">Password: {{ test }}</label>
        <input type="password" id="reg-password" v-model="password"/>

        <button id="submit-register" v-on:click="submit">SUBMIT</button>
      </div>
  </div>
</template>

<script>

</script>
