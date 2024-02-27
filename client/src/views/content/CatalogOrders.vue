<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="2" class="pr-6">
        <p class="subtitle-1 font-weight-bold">Фильтры</p>
        <label for="#group">Категория</label>
        <v-select id="group" item="fdsf" label="Все" outlined dense> </v-select>
        <label for="#group">Категория</label>
        <v-select id="group" item="fdsf" label="Все" outlined dense> </v-select>
        <v-btn color="#78C3CC" class="white--text"> Применить </v-btn>
        <v-btn text small class="px-0 mt-3">
          <v-icon class="ma-0 pa-0">mdi-close</v-icon>
          <span class="caption">Сбросить фильтры</span>
        </v-btn>
      </v-col>

      <v-col cols="12" md="10">
        <v-row>
          <v-col cols="12" md="8" class="text-body-1 text-lg-h5">
            <v-text-field
              style="max-width: 400px; border: 1px solid grey"
              clearable
              flat
              solo
              dense
              color="#78C3CC"
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Введите поисковый запрос"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="d-flex justify-end">
            <v-btn
              @click="requestType = !requestType"
              color="rgb(87,182,192)"
              class="white--text"
            >
              <v-icon left>mdi-ballot-recount-outline</v-icon>
              {{ !requestType ? "Заявки на продажу" : "Заявки на покупку" }}
            </v-btn>
          </v-col>
        </v-row>
        <order-list v-show="requestType" type="1" />
        <order-list v-show="!requestType" type="2" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import OrderList from "../../components/content/Home/newOrderList.vue";
export default {
  data: () => ({
    requestType: true,
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
  }),

  components: {
    OrderList,
  },
};
</script>

<style>
</style>