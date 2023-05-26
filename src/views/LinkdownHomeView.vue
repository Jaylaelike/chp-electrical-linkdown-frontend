<template>
  <div class="q-pa-md">

    <div class="q-py-md">
      <q-btn icon="add" @click="onCreate" label="เพิ่มข้อมูล" color="positive" />
    </div>


    <div class="p-pa-md" align="center">
      <q-scroll-area style="height: 300px; max-width: 1000px;">


        <div class="row no-wrap" align="center">
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="q-py-md">
              <q-card class="my-card">
                <q-img src="https://i.imgur.com/0wbIynx_d.webp?maxwidth=1520&fidelity=grand">
                  <div class="text-h5 absolute-bottom text-right">
                    สถิติLink NT Down : {{ fetchDataCountVal }} ครั้ง
                  </div>
                </q-img>
              </q-card>
            </div>
          </div>


          <div class="col-xs-12 col-sm-6 col-md-4">

            <div class="q-py-md">
              <q-card class="my-card">
                <q-img src="https://i.imgur.com/0wbIynx_d.webp?maxwidth=1520&fidelity=grand">
                  <div class="text-h5 absolute-bottom text-right">
                    ออกอากาศไม่ได้ : {{ fetchDataCountDowntimeVal }} ครั้ง
                  </div>
                </q-img>
              </q-card>
            </div>

          </div>

          <div class="col-xs-12 col-sm-6 col-md-4">

            <div class="q-py-md">
              <q-card class="my-card">
                <q-img src="https://i.imgur.com/0wbIynx_d.webp?maxwidth=1520&fidelity=grand">
                  <div class="text-h5 absolute-bottom text-right">
                    รวมเวลา : {{ fetchDataCountSumVal }} ชั่วโมง
                  </div>
                </q-img>
              </q-card>
            </div>

          </div>

        </div>

      </q-scroll-area>
    </div>
    <div class="q-py-md">
      <link-home-component />
    </div>

  </div>
</template>


<script setup>
import { ref } from 'vue'
import router from '../router';
import { useQuasar } from 'quasar'
import LinkHomeComponent from '../components/LinkHomeComponent.vue';
const $q = useQuasar()





const onCreate = () => {
  router.push('/linkcreate')
}

const fetchDataCountVal = ref('')
const fetchDataCount = () => {
  fetch(import.meta.env.VITE_API_URL + "/api/nt/count")

    .then(res => res.json())
    .then((result) => {
      fetchDataCountVal.value = result[0].counter
    })
}

const fetchDataCountDowntimeVal = ref('')
const fetchDataCountDowntime = () => {
  fetch(import.meta.env.VITE_API_URL + "/api/nt/count/downtime")

    .then(res => res.json())
    .then((result) => {
      fetchDataCountDowntimeVal.value = result[0].counter
    })
}

const fetchDataCountSumVal = ref('')
const fetchDataCountSum = () => {
  fetch(import.meta.env.VITE_API_URL + "/api/nt/count/sumhr")

    .then(res => res.json())
    .then((result) => {
      fetchDataCountSumVal.value = result[0].counter
    })
}

fetchDataCount()
fetchDataCountDowntime()
fetchDataCountSum()
</script>


<style lang="sass" scoped>
.my-card
  width: 90%
  max-width: 350px
</style>
