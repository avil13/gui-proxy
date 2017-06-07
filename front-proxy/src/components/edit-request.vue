<template>
<form @submit.prevent="save" class="form">
    <fieldset>
        <legend>
            Edit request
        </legend>

        <div>
            <button v-on:click="clean" type="button" class="btn btn-negative pull-right">clean</button>
            <div class="clearfix"></div>
        </div>

        <div class="form-group">
            <label for="_path">Path <sup class="red">*</sup></label>
            <input v-model="form_data._path" id="_path" class="form-control" type="text" placeholder="/path" required>
        </div>

        <hr>

        <div class="form-group">
            <label for="hostname">Hostname</label>
            <input v-model="form_data.hostname" id="hostname" class="form-control" type="text" placeholder="google.com">
        </div>

        <div class="form-group">
            <label for="port">port</label>
            <input v-model="form_data.port" id="port" type="number" class="form-control" min="1" max="40000" placeholder="80">
        </div>
        <!-- ++++++ -->

        <div class="checkbox">
            <label>
                <input v-model="form_data.path_replace_part" id="type-replace" type="checkbox"> Replace part
            </label>
        </div>

        <div v-if="!form_data.path_replace_part">
            <div class="form-group">
                <label for="path">path</label>
                <input v-model="form_data.path" id="path" class="form-control" type="text" placeholder="/path">
            </div>
        </div>
        <div v-else>
            <div class="form-group">
                <label for="path_from">Way to replace</label>
                <input v-model="form_data.path_replace[0]" id="path_from" class="form-control" type="text" placeholder="/path/from">
            </div>
            <div class="form-group">
                <label for="path_to">Changeable path</label>
                <input v-model="form_data.path_replace[1]" id="path_to" class="form-control" type="text" placeholder="/path/to">
            </div>
        </div>

        <div class="form-group">
            <button id="submit" type="submit" class="btn btn-large btn-positive pull-right">Save</button>
        </div>
    </fieldset>
</form>
</template>


<script>
export default {
    name: 'edit-request',
    props: ['value'],
    data(){
        return {
            form_data: {
                _path: '/', // request path
                hostname: '',
                port: 80,
                path_replace_part: false,
                path: '/',
                path_replace: ['/', '/']
            },
            default: {
                _path: '/', // request path
                hostname: '',
                port: 80,
                path_replace_part: false,
                path: '/',
                path_replace: ['/', '/']
            }
        };
    },
    created() {
        this.up();
    },
    mounted() {
        this.$root.$on('edit', (item) => {
            this.up(item);
        });
    },
    methods: {
        up(item){
            const obj = item || this._props.value;

            if (Array.isArray(obj.path)) {
                obj['path_replace'] = obj.path;
                obj.path = '';
                obj.path_replace_part = true;
            }
            
            for(let k in this.form_data) {
                if (obj[k] !== undefined) {
                    this.form_data[k] = obj[k]
                }
            }
        },

        clean(){
            this.up(this.default);
        },
        
        save(ev) {
            const _fd = this.form_data;

            let _f = {
                _path: _fd._path,
            };

            if (_fd.hostname) {
                _f.hostname = _fd.hostname;
            }
            
            if (_fd.port) {
                _f.port = _fd.port;
            }

            _f.path = _fd.path_replace_part ? _fd.path_replace : _fd.path ; 

            this.$emit('save', _f);

            Object.assign(this.form_data, this.defaultVal);
        }
    }
}
</script>
