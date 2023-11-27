
<template>
  <div>


    <img src="https://www.swiftoneiot.com/wp-content/uploads/2020/02/01-1.png" 
    alt="lineNotify" 
    width="200" 
    height="200">

    <h2>LineNotify setup</h2>

    <!-- <div id="app">
      My name is <input v-model="name">


    </div> -->

    <div class="q-pa-md q-gutter-y-sm column">


      <q-toggle :false-value="true"
        :label="lineNotifyValues ? 'การแจ้งเตือนผ่านLine ยกเลิกใช้งาน' : 'การแจ้งเตือนผ่านLineถูกใช้งาน'"
        :true-value="false" color="green" icon="mail" v-model="lineNotifyValues" />




      <q-from @submit="onSubmit" class="q-gutter-md">

        <q-btn @click="onSubmit" label="บันทึก" type="submit" color="positive" icon="check_circle_outline"
          direction="right" />

      </q-from>




    </div>





  </div>
</template>


<script>

import router from '../router';
import { useQuasar } from 'quasar'

import { defineStore } from 'pinia'

export const useLineNotifyStore = defineStore({
  id: 'lineNotify',
  state: () => ({
    lineNotifyValue: false, // Initialize your state

  }),
  actions: {
    async fetchData() {
      const response = await fetch('https://chp-electrical-linkdown-server.vercel.app/api/get/notify');


      // get data.state structure 
      //       {
      //     "message": "GET data successfully.",
      //     "status": "ok",
      //     "time": "2023-11-27 10:59:02",
      //     "state": true
      // }

      const data = await response.json();
      console.log(data.state);


      // set value to lineNotifyValue
      this.lineNotifyValue = data.state;


    },




    // async updateData() {
    //   const response = await fetch('http://localhost:4000/api/update/notify', {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       state: this.lineNotifyValue
    //     })
    //   });

    //   const data = await response.json();
    //   console.log(data);
    // }
    async updateData() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "state": this.lineNotifyValue
      });

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("https://chp-electrical-linkdown-server.vercel.app/api/update/notify", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }





  },
});

export default {
  data() {
    const lineNotifyStore = useLineNotifyStore();
    return {
      name: localStorage.name || '',

      lineNotifyValues: lineNotifyStore.lineNotifyValue,

    };






  },

  //update and watch data form state of lineNotifyStore on mounted
  async mounted() {
    const lineNotifyStore = useLineNotifyStore();
    await lineNotifyStore.fetchData();
    this.lineNotifyValues = lineNotifyStore.lineNotifyValue;
  },

  watch: {
    lineNotifyValues(newLineNotifyValues) {
      const lineNotifyStore = useLineNotifyStore();
      lineNotifyStore.lineNotifyValue = newLineNotifyValues;
      lineNotifyStore.updateData();
    }
  },

  methods: {
    onSubmit() {
      const $q = useQuasar()
      $q.dialog({
        title: 'ยืนยันการบันทึกค่าการแจ้งเตือนผ่าน Line',
        message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่',
        cancel: false,
        persistent: false

      }).onOk(() => {

        // check if lineNotifyValue is true or false and save to updateData

        this.updateData();

        router.push('/LineNotify');



      }
      )


    }



  }





}















</script>

// import { ref, onMounted, watch } from 'vue';
// import router from '../router';
// import { useQuasar } from 'quasar'



// const $q = useQuasar()


// const name = ref('');

// const lineNotifyValue = ref(JSON.parse(localStorage.getItem('lineNotify')));


// onMounted(() => {
//     if (localStorage.name) name.value = localStorage.name;
//     // if (localStorage.lineNotify) lineNotifyValue.value = JSON.parse(localStorage.lineNotify);

// })


// watch(name, (newName) => {

//     localStorage.name = newName;

// })


// const onSubmit = () => {

//     $q.dialog({
//         title: 'ยืนยันการบันทึกค่าการแจ้งเตือนผ่าน Line',
//         message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่',
//         cancel: false,
//         persistent: false

//     }).onOk(() => {

//         // check if lineNotifyValue is true or false and save to localStorage
        

//         localStorage.setItem('lineNotify', JSON.stringify(lineNotifyValue.value));


//         router.push('/LineNotify');

//     })


// }






// export const useLineNotifyStore = defineStore({
//     id: 'lineNotify',
//     state: () => ({
//       lineNotifyValue: true, // Initialize your state
//     }),
//     actions: {
//       setLineNotifyValue(value) {
//         this.lineNotifyValue = value;
//       },
//     },
//   });