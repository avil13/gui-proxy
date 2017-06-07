<template>
<fieldset class="log-container">
    <legend>Log:</legend>
    <div class="log-body">
        <div class="log-list">
            <div v-for="log in logList">{{ log }}</div>
        </div>
    </div>
</fieldset>
</template>

<script>
import Chat from './../chat.js';

export default {
    name: 'serverLog',
    // props: ['value'],
    data(){
        return {
            logList: []
        };
    },
    created(){
        this.chat = new Chat();

        this.chat.log((data) => {
            if(Array.isArray(data)){
                this.logList = data;
            }else{
                this.logList.push(data);
            }

            if(this.logList.length > 50){
                this.logList.splice(0, 5);
            }
            // this.scroll();
        });
    },
    methods: {
        scroll(){
            let container = this.$el.getElementsByClassName('log-list');
            let c = container && container[0];

            if(c && c.scrollTop === 0){
                c.scrollTop = c.scrollHeight;
            }
        }
    },
    computed: {
    }
}
</script>

<style lang="scss">
.log-container{
    min-width: 396px;
    max-width: 496px;

    .log-list{
        overflow: auto;
        height: 300px;
    }
    .log-body{
        padding: 2px;
        background-color: rgba(51, 51, 51, 0.71);
        color: #5bd46d;
        -webkit-box-shadow:inset 0 1px 2px 1px #333;
        box-shadow:inset 0 1px 2px 1px #333;
    }
    *{
        white-space: pre;
    }
}
</style>
