<template>
  <v-row>
    <v-dialog v-model="isAddDialog" persistent max-width="60%">
      <v-form ref="prodAdd" v-model="valid">
        <v-card>
          <v-card-title> Добавить товар </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col
                v-for="(field, i) in prodTemplate"
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
                      <v-card>
                        <template
                          v-if="
                            file.type.includes(
                              'image/jpeg',
                              'image/png',
                              'image/jpg'
                            )
                          "
                        >
                          <v-img :src="fileurl(file)" height="150"> </v-img>
                        </template>
                        <template v-else>
                          <v-card height="150">
                            <v-card-title>
                              <v-icon large left> mdi-file-document </v-icon>
                            </v-card-title>
                          </v-card>
                        </template>
                      </v-card>
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
            <v-btn elevation="0" color="#78C3CC" dark small @click="createProd"
              >Добавить</v-btn
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
import CKEditor from "@ckeditor/ckeditor5-vue2";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  data() {
    return {
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
    ...mapState("showcases", ["isAddDialog", "prodTemplate"]),
  },
  components: {
    ckeditor: CKEditor.component,
  },
  methods: {
    ...mapMutations("showcases", ["SET_IS_ADD_DIALOG"]),
    ...mapActions("showcases", ["CREATE_PROD"]),
    closeProdDialog() {
      this.SET_IS_ADD_DIALOG();
    },
    fileurl: (furl) => {
      return URL.createObjectURL(furl);
    },

    createProd() {
      let formData = new FormData();
      this.prodTemplate.map(({ field, value, valid }) => {
        if (
          (valid.required && value == "") ||
          (valid.required && value == null)
        ) {
          this.valid = false;
          return this.$refs.prodAdd.validate();
        } else if (field == "products") {
          value.map((img) => formData.append(field, img));
        } else {
          formData.append(field, value);
        }
      });
      this.valid && this.CREATE_PROD(formData);
    },
  },
};
</script>

<style>
.ck-editor__editable {
  min-height: 200px;
  margin-bottom: 20px;
}
</style>