<template>
  <div id="app" class="window">
    <header class="toolbar toolbar-header">
      <h1 class="title">GUI Proxy</h1>
    </header>
    <div class="window-content">
      <div class="pane-group">
        <div class="pane-sm sidebar">
            <div class="list-group">
              <div v-for="li in list" class="list-group-item">
                  <list-item :value="li"></list-item>
              </div>
            </div>
        </div>

        <div class="pane">
          <edit-request :value="editedPathObj" @save="saveUpdate"></edit-request>
          <server-log></server-log>
        </div>
        
      </div>
    </div>
    <footer class="toolbar toolbar-footer">
      <h1 class="title">Run at: http://localhost:8080</h1>
    </footer>
  </div>
</template>



<script>
import Chat from './chat.js';

import list from './components/list-item.vue';
import req from './components/edit-request.vue';
import serverLog from './components/server-log.vue';

let devList = [
  {
    "_path": "/path",
    "hostname": "google.com",
    "port": 80,
    "path": "api"
  },
  {
    "_path": "/path2",
    "hostname": "google.com",
    "port": 80,
    "path": [
      "service",
      "back"
    ]
  }
];

export default {
  name: 'app',
  components: {
    'list-item': list,
    'edit-request': req,
    'server-log': serverLog
  },
  data () {
    return {
      editedPathObj: {},
      list: [], // devList
      chat: {}
    }
  },
  created(){
    this.chat = new Chat();

    this.chat.get((data) => {
      this.list = data;
    });

    this.chat.getList();
  },
  mounted() {
    this.$root.$on('remove', (item) => {
      this.list.forEach((el, i) => {
        if(el._path === item._path){
          this.list.splice(i, 1);
        }
      });

      this.set_settings();
    });
  },
  methods: {
      saveUpdate(item){
          let do_repalce = false;

          this.list.forEach((el, i) => {
            if(el._path === item._path){
              this.list.splice(i, 1, item);
              do_repalce = true;
            }
          });

          if (!do_repalce) {
            this.list.push(item);
          }

          this.set_settings();
      },

      set_settings(){
        this.chat.set(this.list);
      }
  }
}
</script>


<style lang="scss">
@import './styles/style.scss';
</style>
