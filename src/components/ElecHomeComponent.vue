<template>
  <div class="row">
    <div>
      <q-input filled label="กรองข้อมูลจากวันที่" label-color="warining">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="selectedDates" mask="YYYY-MM-DD" color="warning" @input="fetchData" range>
                <div class="row items-center justify-end">
                  <div class="row items-center justify-end">
                    <q-btn color="warning" label="Fetchdata" @click="fetchData" />
                  </div>

                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div>
      <div class="q-pa-md" style="max-width: 300px">
        <q-badge color="red" label="วันที่เวลาเริ่มต้น">
          : {{ selectedDates.from }}
        </q-badge>
        <q-badge color="red" label="วันที่เวลาสิ้นสุด">
          : {{ selectedDates.to }}
        </q-badge>

      </div>
    </div>
    <div>
      <q-btn color="accent" label="เคลียร์กรองข้อมูล" icon-right="my_location" @click="fetchDataAll"></q-btn>
    </div>



  </div>

  <q-item>
    <q-item-section>
     
      </q-item-section>

    <q-item-section class="q-ml-auto">

      <div class="q-ml-auto">
        <q-input rounded outlined borderless dense debounce="300" style="max-width: 500px" v-model="filter"
          placeholder="ค้นหาข้อมูล" bg-color="teal-3">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

      </div>

    </q-item-section>
  </q-item>



  <div class="q-pb-md">
    <q-table title="ตารางข้อมูลไฟฟ้าดับศูนย์ชุมพร" :rows="rows" :columns="columns" row-key="name" :filter="filter" dark
      color="primary">
      <template v-slot:top-right>
        <q-btn color="primary" icon-right="archive" label="Export to csv" no-caps @click="exportTable" />
      </template>



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
import { useQuasar, date, exportFile } from 'quasar'
import router from '../router';

const selectedDates = ref([])

const timeStamp = Date.now()
const $formattedString = date.formatDate(timeStamp, 'YYYY-MM-DD')
// const startdate = ref($formattedString)
// const enddate = ref($formattedString)

const filter = ref('')
const $q = useQuasar()

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
        fetchDataAll()
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


const fetchData = () => {
  const startDate = selectedDates.value.from
  const endDate = selectedDates.value.to
  console.log("เวลาเริ่มต้น", startDate);
  console.log("เวลาสิ้นสุด", endDate);

  // Use the startDate and endDate to fetch data from the API
  // Replace the API_URL with your actual API endpoint
  const apiUrl = import.meta.env.VITE_API_URL + "/api/electrics/" + `${startDate}` + "/" + `${endDate}`

  // Fetch data from the API using the apiUrl
  fetch(apiUrl)
    .then(res => res.json())
    .then((result) => {
      rows.value = result
      console.log(result);
    })
    .catch(error => {
      // Handle errors
      console.error(error)
    })
  return {
    selectedDates,
    fetchData
  }
}

const fetchDataAll = () => {
  fetch(import.meta.env.VITE_API_URL + "/api/electrics")
    .then(res => res.json())
    .then((result) => {
      rows.value = result
    })
}



fetchDataAll()



</script>


