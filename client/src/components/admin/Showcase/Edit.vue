<template>
  <v-row>
    <v-dialog v-model="isEditDialog" persistent max-width="60%">
      <v-form ref="prodEdit" v-model="valid">
        <v-card>
          <v-card-title>Редактировать товар</v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col
                v-for="(field, i) in editedProdTemplate"
                :key="i"
                :cols="field.col"
                class="px-2"
              >
                <template v-if="field.type === 'textarea'">
                  <v-textarea
                    v-model="field.value"
                    auto-grow
                    outlined
                    rows="2"
                    :label="field.title"
                  ></v-textarea>
                </template>
                <template v-if="field.type === 'input'">
                  <v-text-field
                    v-model="field.value"
                    dense
                    :label="field.title"
                    outlined
                    :rules="[isEmpty]"
                  ></v-text-field>
                </template>
                <template v-if="field.type === 'file'">
                  <v-row class="mb-3" v-if="field.value">
                    <v-col
                      v-for="(file, i) in field.value"
                      :key="i"
                      cols="4"
                      class="py-0"
                    >
                      <v-hover v-slot="{ hover }">
                        <v-card>
                          <v-img :src="`${url_api}/${file.path}`" height="150">
                            <v-overlay absolute="absolute" :value="hover">
                              <v-btn @click="deleteProdImage(file.id)" icon>
                                <v-icon> mdi-delete </v-icon>
                              </v-btn>
                            </v-overlay>
                          </v-img>
                        </v-card>
                      </v-hover>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-file-input
                        v-model="field.value"
                        :label="field.title"
                        :rules="field && [isMaxFile]"
                        multiple
                        outlined
                        dense
                      >
                      </v-file-input>
                    </v-col>
                  </v-row>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="error"
              dark
              small
              plain
              elevation="0"
              @click="closeProdDialog"
            >
              Закрыть
            </v-btn>
            <v-spacer />
            <v-btn elevation="0" color="#78C3CC" dark small @click="updateProd"
              >Сохранить</v-btn
            >
          </v-card-actions>
          <div id="blog"></div>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      url_api: process.env.VUE_APP_BACK_API,
      valid: true,
      isEmpty: (v) => {
        if (v == null || v == undefined || v == "" || v.trim() == "") {
          return "Поле не может быть пустым.";
        } else {
          return true;
        }
      },
      isMaxFile: (v) => v.length <= 3 || `Выберите максимум 3 файла`,
    };
  },

  computed: {
    ...mapState("showcases", ["isEditDialog", "prodTemplate", "prod_view"]),
    editedProdTemplate() {
      return this.prodTemplate.map((t) => {
        if (t.field == "products") {
          return { ...t, value: this.prod_view["images"] };
        } else {
          return { ...t, value: this.prod_view[t.field] };
        }
      });
    },
  },
  methods: {
    ...mapMutations("showcases", ["SET_IS_EDIT_DIALOG"]),
    ...mapActions("showcases", ["UPDATE_PROD"]),

    closeProdDialog() {
      this.SET_IS_EDIT_DIALOG();
    },

    deleteProdImage(id) {
      console.log(id);
    },

    fileurl: (furl) => {
      return URL.createObjectURL(furl);
    },

    updateProd() {
      // let formData = new FormData();
      // this.prodTemplate.map(({ field, value, valid }) => {
      //   if (
      //     (valid.required && value == "") ||
      //     (valid.required && value == null)
      //   ) {
      //     this.valid = false;
      //     return this.$refs.prodAdd.validate();
      //   } else if (field == "products") {
      //     value.map((img) => formData.append(field, img));
      //   } else {
      //     formData.append(field, value);
      //   }
      // });
      // this.valid && this.CREATE_PROD(formData);
    },
  },
};
</script>