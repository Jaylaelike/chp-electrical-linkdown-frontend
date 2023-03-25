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
                <q-img src="https://i.imgur.com/R16iKoj_d.webp?maxwidth=1520&fidelity=grand">
                  <div class="text-h5 absolute-bottom text-right">
                    สถิติไฟฟ้าดับ : {{ fetchDataCountVal }} ครั้ง
                  </div>
                </q-img>
              </q-card>
            </div>
          </div>


          <div class="col-xs-12 col-sm-6 col-md-4">

            <div class="q-py-md">
              <q-card class="my-card">
                <q-img src="https://i.imgur.com/R16iKoj_d.webp?maxwidth=1520&fidelity=grand">
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
                <q-img src="https://i.imgur.com/R16iKoj_d.webp?maxwidth=1520&fidelity=grand">
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

    <q-table title="ตารางข้อมูลไฟฟ้าดับศูนย์ชุมพร" :rows="rows" :columns="columns" row-key="name" dark color="primary">
      <template v-slot:top-right>
        <q-btn color="primary" icon-right="archive" label="Export to csv" no-caps @click="exportTable" />
      </template>

      <!-- virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]" -->

      <template v-slot:body-cell-avatar="props">
        <q-td :props="props">
          <q-img :src="props.row.avatar" />

        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="q-pa-md q-gutter-sm">
            <q-btn icon="mode_edit" color="positive" @click="onEdit(props.row.id)" />
            <q-btn icon="delete" color="negative" @click="onDelete(props.row.id)" />
          </div>

        </q-td>
      </template>

    </q-table>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import router from '../router';
import { useQuasar, exportFile } from 'quasar'

const $q  = useQuasar()

const columns = ref([
  {
    name: 'id', align: 'left', label: 'id', field: 'id', sortable: true, sort: (b, a) => b - a
  },
  { name: 'station', align: 'left', label: 'สถานี', field: 'station', sortable: true },
  { name: 'typestaion', align: 'typestaion', label: 'ประเภทสถานี', field: 'typestaion', sortable: true },
  { name: 'facility', align: 'left', label: 'facility', field: 'facility', sortable: true },
  { name: 'startdate', align: 'left', label: 'วันที่เวลาเริ่มต้น', field: 'startdate', sortable: true },
  { name: 'enddate', align: 'left', label: 'วันที่เวลาสิ้นสุด', field: 'enddate', sortable: true },
  { name: 'duration', align: 'left', label: 'ระยะเวลา', field: 'duration', sortable: true },
  { name: 'detail', align: 'left', label: 'รายละเอียด', field: 'detail', sortable: true },
  { name: 'downtime', align: 'left', label: 'การออกอากาศ', field: 'downtime', sortable: true },
  { name: 'users', align: 'left', label: 'ชื่อผู้บันทึก', field: 'users', sortable: true },
  { name: 'actions', align: 'center', label: 'แก้ไขและลบ', field: 'id', sortable: true }


])


// const rows = ref([])

const rows = ref([])



const onEdit = (id) => {
  router.push('/update/' + id)

}

const onDelete = (id) => {

  $q.dialog({
    title: 'ยืนยันการลบข้อมูล',
    message: 'คุณต้องการจะลบข้อมูลหรือไม่?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "id": id
    });

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(import.meta.env.VITE_API_URL + "/api/electrics/delete", requestOptions)
      .then(response => response.json())
      .then(result => {
        // alert(result.message)
        fetchData()
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

const onCreate = () => {
  router.push('/create')
}

const fetchDataCountVal = ref('')
const fetchDataCount = () => {
  fetch(import.meta.env.VITE_API_URL + "/api/electrics/count")

    .then(res => res.json())
    .then((result) => {
      fetchDataCountVal.value = result[0].counter
    })
}

const fetchDataCountDowntimeVal = ref('')
const fetchDataCountDowntime = () => {
  fetch(import.meta.env.VITE_API_URL + "/api/electrics/count/downtime")

    .then(res => res.json())
    .then((result) => {
      fetchDataCountDowntimeVal.value = result[0].counter
    })
}

const fetchDataCountSumVal = ref('')
const fetchDataCountSum = () => {
  fetch(import.meta.env.VITE_API_URL + "/api/electrics/count/sumhr")

    .then(res => res.json())
    .then((result) => {
      fetchDataCountSumVal.value = result[0].counter
    })
}

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

const fetchData = () => {
  fetch(import.meta.env.VITE_API_URL + "/api/electrics")
    .then(res => res.json())
    .then((result) => {
      rows.value = result
    })
}


const exportTable = () => {
  // naive encoding to csv format
  const content = [columns.value.map(col => wrapCsvValue(col.label))].concat(
    rows.value.map(row => columns.value.map(col => wrapCsvValue(
      typeof col.field === 'function'
        ? col.field(row)
        : row[col.field === void 0 ? col.id : col.field],
      col.format,
      row
    )).join(','))
  ).join('\r\n')

  const status = exportFile(
    'electrical-export.csv',
    content,
    'text/csv'
  )

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning'
    })
  }
}



fetchData()
fetchDataCount()
fetchDataCountDowntime()
fetchDataCountSum()



</script>


<style lang="sass" scoped>
.my-card
  width: 90%
  max-width: 350px
</style>

