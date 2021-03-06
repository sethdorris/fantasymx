import Vue from 'vue';
import Router from 'vue-router';
import home from './client/components/leaderboard.vue';
import register from './client/components/register.vue';
import myteam from './client/components/myteam.vue';
import rules from './client/components/rules.vue';
import stattracker from './client/components/stattracker.vue';
import suggestions from './client/components/suggestions.vue';
import myaccount from './client/components/myaccount.vue';
import createleague from './client/components/CreateLeague.vue';
import joinleague from './client/components/joinleague.vue';
import deleteaccount from './client/components/deleteaccount.vue';
import viewuser from './client/components/viewuser.vue';

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: "/", component: home },
      { path: "/register", component: register },
      { path: "/myteam", component: myteam },
      { path: "/rules", component: rules },
      { path: "/live", component: stattracker },
      { path: "/suggestions", component: suggestions },
      { path: "/home", component: home },
      { path: "/user/:id", component: viewuser },
      { path: "/myaccount", component: myaccount,
        children: [
          { path: 'createleague', component: createleague },
          { path: 'joinleague', component: joinleague },
          { path: 'deleteaccount', component: deleteaccount }
        ]}
    ]
  })
}
