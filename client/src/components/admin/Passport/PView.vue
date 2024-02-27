<template>
  <v-card>
    <v-card-title class="pb-0">
      {{ passport.title }} {{ passport.pid }}
    </v-card-title>

    <div class="d-flex justify-space-between align-center">
      <v-card-subtitle>
        {{ passport.info[0].items[0].value }}
        {{ passport.info[0].items[1].value }} •
        <a
          class="text-decoration-none"
          @click="
            () =>
              this.$router.push(`/dashboard/passport/regpays/${passport.id}`)
          "
        >
          Регистрационные платежи
        </a>
      </v-card-subtitle>
      <v-card-subtitle>
        <a
          class="text-decoration-none"
          @click="
            () => this.$router.push(`/dashboard/deal/${passport.deal_id}`)
          "
        >
          {{ passport.order_title }}
        </a>
      </v-card-subtitle>
    </div>

    <v-card-text class="px-0 pt-0">
      <v-card-subtitle class="pb-0"> Договор </v-card-subtitle>
      <v-simple-table>
        <tbody>
          <template
            v-if="passport && this.passport.passport_files_deal != null"
          >
            <tr
              v-for="(file, i) in this.passport.passport_files_deal"
              :key="file.id"
            >
              <td width="5%">{{ i + 1 }}</td>
              <td class="pl-0">
                <a
                  class="text-decoration-none"
                  :href="`${url_api}/${file.path}`"
                  target="_blank"
                >
                  {{ file.path.split("/")[2] }}
                </a>
              </td>
              <td class="text-right grey--text">
                {{ file.created_at }}
              </td>
              <td v-if="user.role == 'ADMIN'" width="5%">
                <v-btn icon @click="deletePassport(file.id)">
                  <v-icon> mdi-delete </v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td class="text-center grey--text">Загрузите документы!</td>
            </tr>
          </template>
        </tbody>
      </v-simple-table>
    </v-card-text>
    <v-card-text class="px-0 pt-0">
      <v-card-subtitle class="pb-0"> Накладные </v-card-subtitle>
      <v-simple-table>
        <tbody>
          <template
            v-if="passport && this.passport.passport_files_invoice != null"
          >
            <tr
              v-for="(file, i) in this.passport.passport_files_invoice"
              :key="file.id"
            >
              <td width="5%">{{ i + 1 }}</td>
              <td class="pl-0">
                <a
                  class="text-decoration-none"
                  :href="`${url_api}/${file.path}`"
                  target="_blank"
                >
                  {{ file.path.split("/")[2] }}
                </a>
              </td>
              <td class="text-right grey--text">
                {{ file.created_at }}
              </td>
              <td v-if="user.role == 'ADMIN'" width="5%">
                <v-btn icon @click="deletePassport(file.id)">
                  <v-icon> mdi-delete </v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td class="text-center grey--text">Загрузите документы!</td>
            </tr>
          </template>
        </tbody>
      </v-simple-table>
    </v-card-text>
    <v-card-actions
      v-if="passport.own || user.role == 'ADMIN'"
      class="d-block pa-0"
    >
      <v-form ref="passport" v-model="valid">
        <v-row class="mx-1">
          <v-col cols="12" md="9">
            <v-file-input
              v-model="passportFiles"
              label="Выберите документ"
              outlined
              hide-details
              prepend-icon="mdi-file-document-plus-outline"
              dense
            >
            </v-file-input>
          </v-col>
          <v-col cols="12" md="3">
            <v-btn
              block
              color="#78C3CC"
              dark
              @click="uploadPassportFiles(passport.id)"
            >
              <v-icon left dark> mdi-file-upload </v-icon>
              Загрузить документы
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props: ["passport"],
  data: () => ({
    valid: true,
    passportFiles: null,
    url_api: process.env.VUE_APP_BACK_API,
  }),
  computed: {
    ...mapState("user", ["user"]),
  },
  methods: {
    ...mapActions("passport", [
      "UPLOAD_PASSPORT_FILES",
      "DELETE_PASSPORT_FILE",
    ]),
    uploadPassportFiles(id) {
      let formData = new FormData();
      formData.append("passports", this.passportFiles);
      formData.append("passport_id", id);
      formData.append("type", this.user.role == "ADMIN" ? 1 : 2);
      let files = {
        file: formData,
        passport_id: this.passport.id,
      };
      this.passportFiles && this.UPLOAD_PASSPORT_FILES(files);
      this.passportFiles = null;
    },
    deletePassport(id) {
      this.DELETE_PASSPORT_FILE({ pid: this.passport.id, id });
    },
  },
};
</script>

<style>
</style>