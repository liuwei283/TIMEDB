<template>
<!-- eslint-disable max-len -->
<div id="job-query">
    <alert-center ref="alertCenter" />
    <div>
        <b-card class="text-center">
            <div class="img-icon">
                <i class="fas fa-tasks"></i>
            </div>
            <!-- <h3>Query Task</h3> -->
            <p>Find your submitted job</p>
            <div class="row justify-content-center">
                <b-form-input v-model="job_id"
                                type="text"
                                size="lg"
                                placeholder="Search your job ID"
                                class="col-md-4 text-center"></b-form-input>
            </div>
              <b-button variant="secondary" class="mt-4" size="lg" 
                        @click="searchJob"><i class="fas fa-search"></i> Search</b-button>
        </b-card>
    </div>
</div>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import axios from 'axios';
import objectToFormData from 'object-to-formdata';
import BootstrapVue from 'bootstrap-vue';
import AlertCenter from 'components/alert-center.vue';

Vue.use(BootstrapVue);

export default {
    data() {
        return {
            job_id: '',
        };
    },
    methods: {
        searchJob() {
            const { alertCenter } = this.$refs;
            
            if (this.app_name.length <= 0){
                this.valid_name = false;
            }else {
                axios.post(
                    `/user/apps/`,
                    objectToFormData({'app_name': this.app_name}),
                    {  
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                ).then((response) => {
                    console.log(response);
                    if (response.data.code) {
                        const id = response.data.data.app_id;
                        window.location.href = '/user/apps/' + id + '/edit/';
                    } else {
                        alertCenter.add('danger', response.data.data);
                    }
                }).catch((reason) => {
                    alertCenter.add('danger', `${reason}`);
                }).finally(() => {
                    // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                });
            }
        }
    },
    components: {
        AlertCenter,
    },
};
</script>

<style lang="scss">
#job-query .fas.fa-tasks {
	font-size: 5rem !important;
	margin-right: 0px;
}

#job-query .card {
    margin: 20px;
	padding: 3rem;
}
</style>
