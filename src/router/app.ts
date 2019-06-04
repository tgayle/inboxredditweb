import { RouteConfig } from 'vue-router';

const appRoutes: RouteConfig[] = [
  {
    path: ':where',
    name: 'messageswhere',
    components: {
      masterView: () => import('../components/app/NoConversation.vue'),
    },
  },
  {
    path: ':where/:conversation',
    name: 'viewconversation',
  },
];

export default appRoutes;
