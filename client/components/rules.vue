<template>
  <div class="container">
    <div class="">
      <p class="rules-title">FAQ</p>
      <div class="tab">
        <input id="tab-one" type="checkbox" name="tabs">
        <label for="tab-one">How does scoring work?</label>
        <div class="tab-content">
          <p>Right now, scoring is set by the 2018 Supercross Points Revision. If a selected racer for that week finishes in first, that racer is awarded 26 points. If a racer finishes in fourth, that racer is awarded 19 points. The greater the point total the better score. The 2018 Points table can be found here https://www.supercrosslive.com/2018-points. </p>
        </div>
      </div>
      <div class="tab">
        <input id="tab-two" type="checkbox" name="tabs">
        <label for="tab-two">How does team selection work?</label>
        <div class="tab-content">
          <p>As of now, each user is REQUIRED to select 4 racers for each week. The deadline for making racer selection is 3am Mountain Time on the day of the scheduled race. After that time
            users will no longer be able to select racers for that week's race; the team selection for the next week will be available for selection</p>
          <p>Users may only SAVE a roster if ALL 4 roster slots have a racer chosen. The SAVE button is disabled if an OPEN SLOT still exists for a weekly lineup.</p>
          <p>Each user begins each week with $10,000 salary cap to spend on filling out their weekly lineup, and that cap room is used to select racers for their week's lineup from the available racers pool.
            The selected racer's cost, once selected, will be deducted from the current week's available salary cap. You are NOT REQUIRED to utilize your entire cap space each week.</p>
        </div>
      </div>
      <div class="tab">
        <input id="tab-four" type="checkbox" name="tabs">
        <label for="tab-four">When do rosters lock?</label>
        <div class="tab-content">
          <p>Rosters will currently "lock" 5 minutes before the scheduled televised event. This is NOT 5 minutes before the 450 main, this is before the entire event begins. At that time, MyTeam will be loaded for the following week's race.</p>
        </div>
      </div>
      <div class="tab">
        <input id="tab-three" type="checkbox" name="tabs">
        <label for="tab-three">Custom Leagues</label>
        <div class="tab-content">
          <p>Currently, the application does not support custom / private leagues; We are looking into how best to incorporate this feature with the UI. If you have suggestions please let us know
          by dropping a suggestion.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
h1 {
  text-align: center;
}
.rules-title {
  font-size:18pt;
  color: white;
  font-weight:800;
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
  background: rgba(255, 255, 255, 0.3);
  font-weight: bold;
  line-height: 3;
  cursor: pointer;
  color: #fffc7f;
}
.tab-content {
  max-height: 0;
  overflow: hidden;
  background: transparent;
  -webkit-transition: max-height .35s;
  -o-transition: max-height .35s;
  transition: max-height .35s;
  color: #fff;
}
.tab-content p {
  margin: 1em;
}
/* :checked */
input:checked ~ .tab-content {
  max-height: 20em;
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
