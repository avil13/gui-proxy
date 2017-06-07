<template>
<div class="media-body">
    <div>
        <div class="btn-group pull-right">
                <button type="button" class="btn btn-default" v-on:click="edit">
                    &#9998;
                </button>
                
                <button type="button" class="btn btn-default f-b" v-on:click="remove">
                    &#215;
                </button>
        </div>
        <div class="clearfix"></div>
    </div>

    <div class="title"> 
        <strong>{{ form_data._path }}</strong>
    </div>

    <span v-if="form_data.path">
        <span v-if="is_replace">
            <span class="replace-path">
                {{ form_data.path[0] }}
            </span>
            ⇒
            <span class="replace-path">
                {{ form_data.hostname }}<span class="port">:{{ form_data.port }}</span>{{ get_path }}
            </span>
        </span>
    <!-- -->
        <span v-else>
            ⇒ 
            {{ form_data.hostname }}<span class="port">:{{ form_data.port }}</span><span class="replace-path">{{ get_path }}</span>
        </span>
    </span>
    <span v-else>
        ⇒ 
        *:{{ form_data.port }}/
    </span>
<!-- 
<pre>{{ form_data  }}</pre>
-->
</div>
</template>

<script>
export default {
    name: 'list-item',
    props: ['value'],
    data(){
        return {};
    },
    methods: {
        edit(){
            this.$root.$emit('edit', this.form_data);
        },
        remove(){
            this.$root.$emit('remove', this.form_data);
        }
    },
    computed: {
        form_data() {
            return this._props.value;
        },
        is_replace() {
            return typeof this.form_data.path !== 'string';
        },
        get_path(){
            let str;
            if (this.is_replace) {
                str = this.form_data.path[1];
            }else{
                str = this.form_data.path;
            }

            return str[0] === '/' ? str : '/' + str;
        }
    }
}
</script>

<style lang="scss">
    .media-body{
        position: relative;

        .title{
            text-align: left;
        }
    }
    .btn{
        cursor: pointer;
        & *{
            cursor: pointer;
        }
        &:hover{
            background-image: linear-gradient(to bottom, #dcdada 0%, #dadada 100%);
        }
        &:active{
            background-image: linear-gradient(to bottom, #c3c3c3 0%, #afafaf 100%);
        }
    }
    .f-b{
        font-weight: bold;
    }
    .replace-path{
        color: #0078e7;
    }
</style>
