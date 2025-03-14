<template>
  <v-row>
    <v-dialog v-model="isAddDialog" persistent max-width="40%">
        <v-card>
          <v-card-title> Написать </v-card-title>
          <v-form ref="notificationcreate" v-model="valid" lazy-validation>
          <v-card-text>
            <v-row no-gutters>
              <v-col
                class="px-2"
                cols="6"
              >
              <v-select
                v-model="selectAnnex"
                :items="annexesByUser"
                outlined
                dense
                item-text="title"
                item-value="title"
                label="Выберите приложение"
                return-object
                :rules="[isSelecet]"
              ></v-select>
              </v-col>
              <v-col
                class="px-2"
                cols="6"
              >
              <v-select
                v-model="selectedUser"
                :items="usersByRole"
                outlined
                dense
                item-text="user_company_name"
                item-value="username"
                label="Выберите участника"
                return-object
                :rules="[isSelecet]"
              ></v-select>
              </v-col>
              <v-col
                class="px-2"
                cols="12"
              >
                <vue-editor 
                  v-model="selectAnnex.content"
                  :editorToolbar="toolbar"
                  ></vue-editor>
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
          <v-card-actions>
            <v-btn
              color="error"
              dark
              small
              plain
              elevation="0"
              @click="closeNotificationDialog"
            >
              Закрыть
            </v-btn>
            <v-spacer />
            <v-btn elevation="0" color="#78C3CC" dark small @click="createNotification"
              >Отправить</v-btn
            >
          </v-card-actions>
          <div id="blog"></div>
        </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

import { VueEditor } from "vue2-editor";


export default {
  computed: {
    ...mapState("user", ["usersList","user"]),
    ...mapState("notification", ["isAddDialog", "blogTemplate"]),
    annexesByUser() {
      return this.annexes.filter((annex) => annex.role == this.user.role);
    },
    usersByRole() {
      if(this.user.role == 'ADMIN') return this.usersList.users.filter((user) => user.username != this.user.username);
      return this.usersList.users.filter((user) => user.role == "ADMIN");
    },
  },
  data() {
    return {
      valid: true,
      isSelecet: (v) => !!v || "Выберите значение",
      selectAnnex: '',
      selectedUser: '',
      annexes: [
        {
          id: 1,
          title: "О поступлении денежных средств",
          content: `<p class="ql-align-right">Приложение 1</p>
          <p class="ql-align-center"><strong>О поступлении денежных средств</strong></p>
          <p>     ЗАО «Кыргызская фондовая биржа» уведомляет вас о поступлении предварительной оплаты, согласно Договору.</p><p>____________________________________</p>
          <p>Дата</p>`,
          role: "ADMIN"
        },
        {
          id: 2,
          title: "Поручение о перечислении денежных средств",
          content: `<p class="ql-align-right">Приложение 2</p>
          <p class="ql-align-center"><strong>Поручение о перечислении денежных средств</strong></p>
          <p>_________________________________________ просит Вас перечислить находящиеся на нашем субсчете денежные средства, в</p><p>сумме___________________________________ согласно Договору</p><p>№_______________________ , на расчетный счет</p><p>_____________________________________________,</p>
          <p>Реквизиты компании</p>`,
          role: "USER"
        },
        {
          id: 3,
          title: "Уведомление о перечислении денежных средств",
          content: `<p class="ql-align-right">Приложение 3</p>
          <p class="ql-align-center"><strong>Уведомление о перечислении денежных средств</strong></p>
          <p>     ЗАО «Кыргызская фондовая биржа уведомляет вас о перечислении денежных</p><p>средств, согласно Договору _____________________________________________ с</p><p>субсчета __________________________________________________ на расчетный счет</p><p>_____________________________________________________________________.</p>
          <p>Дата</p>`,
          role: "ADMIN"
        },
      ],
      toolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "strike"], // toggled buttons
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" }
        ],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        ["clean"] // remove formatting button
      ],
    };
  },
  components: {
    VueEditor
  },
  methods: {
    ...mapMutations("notification", ["SET_IS_ADD_DIALOG"]),
    ...mapActions("user", ["USERLIST"]),
    ...mapActions("notification", ["CREATE_NOTIFICATION"]),
    closeNotificationDialog() {
      this.SET_IS_ADD_DIALOG();
    },
    createNotification() {
      if(!this.selectAnnex || !this.selectedUser) return this.$refs.notificationcreate.validate();
      const data = {
        title: this.selectAnnex.title,
        content: this.selectAnnex.content,
        user_from: this.user.username,
        user_to: this.selectedUser.username,
      }
      this.CREATE_NOTIFICATION(data);
    },
  },
  mounted() {
    // лимит пока 1000
    this.USERLIST({ limit: 1000, page: 1 });
  },
};
</script>

<style>

</style>