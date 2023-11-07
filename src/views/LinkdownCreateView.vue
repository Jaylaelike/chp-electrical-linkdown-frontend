<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-from @submit="onSubmit" class="q-gutter-md">
      <q-select filled v-model="station" label="สถานี" bg-color="blue-2"
        :options= StationName />
      <q-select filled v-model="typestaion" label="ประเภทสถานี" bg-color="green-2" :options= StationTypes />
      <q-select filled v-model="facility" label="Facility" bg-color="yellow-2"
        :options= StationFalcility />


      <q-badge color="teal" label="วันที่เวลาเริ่มต้น">
        : {{ startdate }}
      </q-badge>


      <div class="q-gutter-md row items-start">
        <q-date v-model="startdate" mask="YYYY-MM-DD HH:mm" color="teal" />
        <q-time v-model="startdate" format24h mask="YYYY-MM-DD HH:mm" color="teal" />
      </div>

      <q-badge color="red" label="วันที่เวลาสิ้นสุด">
        : {{ enddate }}
      </q-badge>

      <div class="q-gutter-md row items-start">
        <q-date v-model="enddate" mask="YYYY-MM-DD HH:mm" color="red" />
        <q-time v-model="enddate" format24h mask="YYYY-MM-DD HH:mm" color="red" />
      </div>





      <q-input v-model="detail" label="รายละเอียด" />
      <q-select filled v-model="downtime" label="การออกอากาศ" bg-color="red-2"
        :options= OnAirTypes />
      <q-select filled v-model="users" label="ชื่อผู้บันทึก" bg-color="orange-2"
        :options= NamePeoples />

      <q-btn @click="onSubmit" label="ส่งข้อมูล" type="submit" color="positive" icon="check_circle_outline"
        direction="right" />
    </q-from>

  </div>
</template>




<script setup>

import { ref } from 'vue';
import router from '../router';
import { useQuasar, date } from 'quasar'

import { NamePeoples } from './data/Names';
import { StationName } from './data/Station';
import { StationTypes } from './data/StationTypes';
import { StationFalcility } from './data/StationFalcility';
import { OnAirTypes } from './data/OnAirTypes';


const $q = useQuasar()
const timeStamp = Date.now()
const $formattedString = date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm')

const station = ref('')
const typestaion = ref('')
const facility = ref('')
const startdate = ref($formattedString)
const enddate = ref($formattedString)
const detail = ref('ไฟฟ้าดับ ฝนตกหนัก ต้นไม้ล้ม')
const users = ref('')
const downtime = ref('')




const onSubmit = () => {


  $q.dialog({
    title: 'ยืนยันการเพิ่มข้อมูล',
    message: 'คุณต้องการจะเพิ่มข้อมูลหรือไม่?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "station": station.value,
      "typestaion": typestaion.value,
      "facility": facility.value,
      "startdate": startdate.value,
      "enddate": enddate.value,
      "detail": detail.value,
      "users": users.value,
      "downtime": downtime.value
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(import.meta.env.VITE_API_URL + "/api/nt/create", requestOptions)
      .then(response => response.json())
      .then(result => {
        // alert(result.message)
        if (result.status === "ok") {
          router.push('/link')
        }
      })
      .catch(error => console.log('error', error));

      requestDatasendLineNotify()   

  }).onOk(() => {
    // console.log('>>>> second OK catcher')
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })


}

const requestDatasendLineNotify = () => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch("https://linenotifysubmitthaipbs.sittichaimarkwi.repl.co/nt", requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

}


</script>



