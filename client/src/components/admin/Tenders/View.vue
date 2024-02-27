<template>
  <v-card>
    <v-card-title>
      {{ tender.title }}
    </v-card-title>
    <v-card-subtitle>
      {{ tender.info[0].items[0].value }}
    </v-card-subtitle>
    <v-card-text class="pb-0">
      <v-row>
        <v-col>
          Крайний срок:
          {{ tender.deadline }}</v-col
        >
        <v-col>Город / область: {{ tender.city_title }}</v-col>
        <v-col>Категория объявления: {{ tender.category_title }}</v-col>
        <v-col
          >Прикрепленные файлы:
          <template v-if="tender && tender.tender_files[0] != null">
            <span
              v-for="(file, i) in tender.tender_files"
              :key="file.id"
              class="mr-2"
            >
              <a
                v-if="file != null"
                :href="`${url_api}/${file.path}`"
                :key="i"
                target="_blank"
                >Файл-{{ i + 1 }}
              </a>
            </span>
          </template>
          <template v-else> Нет </template>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-html="tender.description" />
    <v-card-text class="grey--text d-flex justify-space-between">
      <span> Опубликовано: {{ tender.created_at }} </span>
      <span>
        email:
        <a :href="`mailto:${tender.info[0].items[2].value}`" target="_blank">{{
          tender.info[0].items[2].value
        }}</a
        >, тел:
        <a :href="`tel:${tender.info[0].items[3].value}`" target="_blank">{{
          tender.info[0].items[3].value
        }}</a>
      </span>
    </v-card-text>
    <template v-if="user.role === 'ADMIN'">
      <v-card-actions>
        <v-spacer />
        <template v-if="tender.status === 1">
          <v-btn
            text
            small
            color="orange darken-1"
            class="mr-2"
            @click="confirmOrReject(tender.id, 3)"
          >
            <v-icon left>mdi-close</v-icon>

            Отклонить
          </v-btn>
          <v-btn
            color="#78C3CC"
            dark
            elevation="0"
            small
            @click="confirmOrReject(tender.id, 2)"
          >
            <v-icon left>mdi-check</v-icon>
            Принять
          </v-btn>
        </template>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props: ["tender"],
  data: () => ({
    url_api: process.env.VUE_APP_BACK_API,
  }),
  computed: {
    ...mapState("user", ["user"]),
  },
  methods: {
    ...mapActions("tender", ["UPDATE_TENDER_STATUS"]),
    confirmOrReject(id, status) {
      this.UPDATE_TENDER_STATUS({ id, status });
    },
  },
};
</script>

<style>
</style>