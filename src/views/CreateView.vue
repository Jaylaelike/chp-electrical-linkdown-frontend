<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-from @submit="onSubmit" class="q-gutter-md">
      <q-select filled v-model="station" label="สถานี" bg-color="blue-2"
        :options="['ชุมพร', 'ระนอง', 'ประจวบคีรีขันธ์', 'หัวหิน', 'ทับสะแก', 'ปากน้ำปราณ', 'เพชรบุรี', 'หลังสวน', 'สวี', 'กระบุรี', 'กะเปอร์', 'พะโต๊ะ', 'คุระบุรี', 'ท่าแซะ']" />
      <q-select filled v-model="typestaion" label="ประเภทสถานี" bg-color="green-2" :options="['หลัก', 'เสริม']" />
      <q-select filled v-model="facility" label="Facility" bg-color="yellow-2"
        :options="['ส.ส.ท.', 'ททบ', 'กปส', 'อสมท']" />


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
        :options="['ออกอากาศปกติ', 'ออกอากาศไม่ได้']" />
      <q-select filled v-model="users" label="ชื่อผู้บันทึก" bg-color="orange-2"
        :options="['นายประเสริฐ นามเวช', 'นายศิริพงษ์ ศิริวัฒน์', 'นายนาคินทร์ ชูมณี', 'นายสิทธิชัย มากวิสัย', 'นายสิทธิชัย สังข์แก้ว', 'นายกิตติพงษ์ นาคสังข์', 'ธนฤทธิ์ ทิพรัตน์', 'นายพงศกร อุ่นแก้ว']" />

      <q-btn @click="onSubmit" label="ส่งข้อมูล" type="submit" color="positive" icon="check_circle_outline"
        direction="right" />

    </q-from>

  </div>
</template>




<script setup>

import { ref } from 'vue';
import router from '../router';
import { useQuasar, date } from 'quasar'



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
  }).onOk(
    () => {
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

      fetch(import.meta.env.VITE_API_URL + "/api/electrics/create", requestOptions)
        .then(response => response.json())
        .then(result => {
          // alert(result.message)
          if (result.status === "ok") {
            router.push('/')
          }
        })
        .catch(error => console.log('error', error));

        requestDatasendLineNotify()   
    }

  ).onOk(() => {
    // console.log('>>>> second OK catcher')
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })

}

// const sendLineNotify = () => {
//   const token = "zgwJIFv85dtuK6FctwuqPzVsd3p93fk2tteLnPMWiUH";
//   const message = "ชื่อสถานี";

//   fetch("https://notify-api.line.me/api/notify", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       Authorization: `Bearer ${token}`,
//     },
//     body: `message=${message}`,
//   })
//     .then((response) => {
//       console.log("Line Notify Sent!");
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

const requestDatasendLineNotify = () => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch("https://linenotifysubmitthaipbs.sittichaimarkwi.repl.co/electric", requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

}
//requestDatasendLineNotify()



</script>



