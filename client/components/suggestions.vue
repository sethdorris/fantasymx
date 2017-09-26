<template>
  <div class="container">
      <section>
        <div class="field">
          <div class="control">
            <label>Are you a registered user?</label>
            <label class="radio">
              <input type="radio" name="Registered" value="true" v-model="Registered">
              Yes
            </label>
            <label class="radio">
              <input type="radio" name="Registered" value="false" v-model="Registered">
              No
            </label>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label>Is this feedback or a bug report?</label>
            <label class="radio">
              <input type="radio" name="feedback" v-model="ReportType" value="feedback">
              Feedback
            </label>
            <label class="radio">
              <input type="radio" name="feedback" v-model="ReportType" value="bug">
              Bug Report
            </label>
          </div>
        </div>
        <div class="field">
          <label class="label">Username</label>
            <div class="control">
              <input class="input" type="text" placeholder="Username" v-model="Username">
            </div>
        </div>
        <div class="field" v-if="ReportType == 'feedback'">
          <label class="label">Suggest Features</label>
          <div class="control">
            <div class="select">
              <select v-model="feature">
                <option disabled value="">SELECT CATEGORY</option>
                <option>User Interface</option>
                <option>Navigation Content</option>
                <option>My Team</option>
                <option>Scoring</option>
                <option>New Features</option>
                <option>Stat Tracker</option>
                <option>Account</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field" v-if="ReportType == 'feedback'">
          <label class="label">Feedback</label>
          <div class="control">
            <textarea class="textarea" v-model="feedback" placeholder="Describe your suggestions here."></textarea>
          </div>
        </div>
        <div class="field" v-if="ReportType == 'bug'">
          <label class="label">Report Bug</label>
          <div class="control">
            <textarea class="textarea" v-model="bugreport" placeholder="Describe the actions you took, your desired outcome and the actual outcome of those actions. We should be able to replicate the bug based off the steps you provide here."></textarea>
          </div>
        </div>
        <div class="field">
          <button class="button is-primary" v-on:click="submit" type="button">Submit</button>
        </div>
      </section>
  </div>
</template>
<script>
import axios from 'axios';
  export default {
    data() {
      return {
        Username: '',
        ReportType: '',
        Registered: false,
        feature: '',
        bugreport: '',
        feedback: ''
      }
    },
    methods: {
      submit() {
        var data = {
          Username: this.Username,
          ReportType: this.ReportType,
          Registered: this.Registered,
          Feature: this.feature,
          BugReport: this.bugreport,
          Feedback: this.feedback
        }
        axios.post('/feedback', data)
        .then(res => {
          console.log(res)
        })
      }
    }
  }
</script>
<style>
  .container {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
  }
</style>
