<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-warning text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img
              src="https://org.thaipbs.or.th/media/EHJqPKtQaacHoXeQwPUe0kxFvZdz5abbe8FKGy.png">
          </q-avatar>
          {{ $route.meta.title }}
        </q-toolbar-title>

        <q-tabs>
          <q-route-tab to="/" label="Electrical" />
          <q-route-tab to="/link" label="Link NT" />
          <q-route-tab to="/linenotify" label="Line Notify" />

        </q-tabs>
      </q-toolbar>


    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
