<template>
    <div id="database-aa">
        <div class="row">
            <div class="col">
                <b-form inline>
                    <!-- <b-form-group> -->
                        <label label-for="i-sample">
                            Please select the concerned sample: 
                            <i class="fa  fa-question-circle" v-b-tooltip
                            title="The concerned sample."></i>
                        </label>
                        <b-form-select v-model="sample" :options="samples"
                            id="i-sample" />
                    <!-- </b-form-group> -->
                </b-form>
            </div>
            <!-- <div class="col">
                <b-form inline>
                    <label label-for="i-population">
                        Please select the concerned population:         
                        <i class="fa fa-question-circle" v-b-tooltip
                            title="The concerned population."></i>
                    </label>
                    <b-form-select v-model="population" :options="populations"
                        id="i-population" />
                </b-form>
            </div> -->
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="text-center">
                    <b-img :src="image_url" fluid alt="Responsive image"></b-img>
                    <figcaption class="figure-caption text-center" style="font-size:20px;">The distributions of antibiotic abilities of salivary microbiome in different populations.</figcaption>
                </div>
            </div>
            <div class="col-md-6">
                <div class="text-center">
                    <b-img :src="image_url2" fluid alt="Responsive image"></b-img>
                    <figcaption class="figure-caption text-center" style="font-size:20px;">Main antibiotic abilities of salivary microbiome and the corresponding species. </figcaption>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

export default {
    props: {
        // Must be one of 'module' or 'pipeline'
        type: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            sample: 'Salivary',
            samples: ['Salivary'],
            population: 'Chinese',
            populations: ['Chinese'],
            images: {
                'Chinese': '/images/4.KEGG.png',
                // 'Japanese': '/images/2.2JPN_sample_bacteria.png',
                // 'Philippines': '/images/2.3PH_sample_bacteria.png',
                // 'American': '/images/2.4USA_sample_bacteria.png'
            },
            image_url: '/images/5.CARD.png',
            image_url2: '/images/6.CARD-Species.png',
        };
    },
    watch: {
        population() {
            this.update();
        },
    },
    methods: {
        update() {
            this.image_url = this.images[this.population];
        },
    },
};
</script>

<style scoped lang="scss">
</style>
