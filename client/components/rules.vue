<template>
  <div class="container">
    <div class="">
      <p>Rules</p>
      <div class="tab">
        <input id="tab-one" type="checkbox" name="tabs">
        <label for="tab-one">How does scoring work?</label>
        <div class="tab-content">
          <p>Right now, scoring is set by racer finish. If a selected racer for that week finishes in first, that racer is awarded 1 point. If a racer finishes in fourth, that racer is awarded 4 points. The lower the point total the better score.</p>
        </div>
      </div>
      <div class="tab">
        <input id="tab-two" type="checkbox" name="tabs">
        <label for="tab-two">How does team selection work?</label>
        <div class="tab-content">
          <p>As of now, each user is REQUIRED to select 4 racers for each week. The deadline for making racer selection is 3am Mountain Time on the day of the scheduled race.</p>
          <p>Users may only SAVE a roster if ALL 4 roster slots have a racer chosen. The SAVE button is disabled if an OPEN SLOT still exists for a weekly lineup.</p>
          <p>Each user begins each week with $8 credits to spend on filling out their weekly lineup, and that credit is used to select racers for their week's lineup from the available racers pool.
            The selected racer's cost, once selected, will be deducted from the current week's available credits. You are NOT REQUIRED to spend all $8 credits each week.</p>
        </div>
      </div>
      <div class="tab">
        <input id="tab-three" type="checkbox" name="tabs">
        <label for="tab-three">Live Stat Tracker & Custom Leagues</label>
        <div class="tab-content">
          <p>Right now the application is configured where every registered user competes against each other in an open Main League. The live stat tracker (to see the standings update with live position changes) is not available for the ALPHA test.
          This feature will be testable during the BETA version of the application.</p>
          <p>Currently, the application does not support custom / private leagues, however, this feature will be available for testing in the BETA version of the application.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
h1 {
  text-align: center;
}
/* Acordeon styles */
.tab {
  position: relative;
  margin-bottom: 1px;
  width: 100%;
  color: #fff;
  overflow: hidden;
}
input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}
label {
  position: relative;
  display: block;
  padding: 0 0 0 1em;
  background: #00d1b2;
  font-weight: bold;
  line-height: 3;
  cursor: pointer;
  color: white;
}
.tab-content {
  max-height: 0;
  overflow: hidden;
  background: transparent;
  -webkit-transition: max-height .35s;
  -o-transition: max-height .35s;
  transition: max-height .35s;
  color: #716d6d;
}
.tab-content p {
  margin: 1em;
}
/* :checked */
input:checked ~ .tab-content {
  max-height: 10em;
}
/* Icon */
label::after {
  position: absolute;
  right: 0;
  top: 0;
  display: block;
  width: 3em;
  height: 3em;
  line-height: 3;
  text-align: center;
  -webkit-transition: all .35s;
  -o-transition: all .35s;
  transition: all .35s;
}
input[type=checkbox] + label::after {
  content: "+";
}
input[type=radio] + label::after {
  content: "\25BC";
}
input[type=checkbox]:checked + label::after {
  transform: rotate(315deg);
}
input[type=radio]:checked + label::after {
  transform: rotateX(180deg);
}
</style>
