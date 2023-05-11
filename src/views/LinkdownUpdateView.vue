<template>
    <div class="q-pa-md" style="max-width: 400px">

        <q-from @submit="onSubmit" class="q-gutter-md">
            <q-input v-model="id" label="ID" readonly />

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


            <q-btn @click="onSubmit" label="UPDATE" type="submit" color="primary" />
        </q-from>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '../router';
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const id = ref(route.params.id)
const station = ref('')
const typestaion = ref('')
const facility = ref('')
const startdate = ref('')
const enddate = ref('')
const detail = ref('')
const users = ref('')
const downtime = ref('')


const fetchData = () => {
    fetch(import.meta.env.VITE_API_URL + "/api/nt/" + id.value)
        .then(res => res.json())
        .then((result) => {
            station.value = result.user.station
            typestaion.value = result.user.typestaion
            facility.value = result.user.facility
            startdate.value = result.user.startdate
            enddate.value = result.user.enddate
            detail.value = result.user.detail
            users.value = result.user.users
            downtime.value = result.user.downtime


        })

}
fetchData()

const onSubmit = () => {

    $q.dialog({
        title: 'อัพเดตข้อมูล',
        message: 'คุณต้องการจะอัพเดตข้อมูล?',
        cancel: true,
        persistent: true
    }).onOk(() => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "id": id.value,
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
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(import.meta.env.VITE_API_URL + "/api/nt/update", requestOptions)
            .then(response => response.json())
            .then(result => {
                //alert(result.message)
                if (result.status === "ok") {
                    router.push('/link')
                }
            })
            .catch(error => console.log('error', error));
    }).onOk(() => {
        // console.log('>>>> second OK catcher')
    }).onCancel(() => {
        // console.log('>>>> Cancel')
    }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
    })




}
</script>