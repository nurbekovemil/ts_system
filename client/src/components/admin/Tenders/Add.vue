<template>
  <v-row>
    <v-dialog v-model="isAddTender" persistent max-width="60%">
      <v-form ref="tender" v-model="valid">
        <v-card>
          <v-card-title> Добавить новое объявление</v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col
                v-for="(field, i) in tenderAddTemplate"
                :key="i"
                :cols="field.col"
                class="px-2"
              >
                <template v-if="field.type === 'input'">
                  <v-text-field
                    v-model="field.value"
                    dense
                    :label="field.title"
                    outlined
                    :rules="[isEmpty]"
                  ></v-text-field>
                </template>
                <template v-if="field.type === 'textarea'">
                  <ckeditor
                    :editor="editor"
                    v-model="field.value"
                    :config="editorConfig"
                  ></ckeditor>
                </template>
                <template v-if="field.type === 'date'">
                  <v-text-field
                    v-model="field.value"
                    :label="field.title"
                    type="date"
                    outlined
                    dense
                    :rules="[isEmpty]"
                  ></v-text-field>
                </template>
                <template v-if="field.type === 'select'">
                  <v-select
                    :items="options[field.item]"
                    v-model="field.value"
                    item-text="title"
                    item-value="id"
                    :label="field.title"
                    dense
                    outlined
                    :rules="[isSelecet]"
                    @click="GET_OPTIONS(field.item)"
                  >
                  </v-select>
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
                        <template>
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
              @click="closeTenderDialog"
            >
              Закрыть
            </v-btn>
            <v-spacer />
            <v-btn
              elevation="0"
              color="#78C3CC"
              dark
              small
              @click="createTender"
              >Добавить</v-btn
            >
          </v-card-actions>
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
  data: () => ({
    valid: true,
    editor: ClassicEditor,
    editorConfig: {
      toolbar: {
        items: [
          "selectAll",
          "heading",
          "|",
          "fontfamily",
          "fontsize",
          "|",
          "alignment",
          "|",
          "fontColor",
          "fontBackgroundColor",
          "|",
          "bold",
          "italic",
          "strikethrough",
          "underline",
          "subscript",
          "superscript",
          "|",
          "outdent",
          "indent",
          "|",
          "bulletedList",
          "numberedList",
          "todoList",
          "|",
          "code",
          "codeBlock",
          "|",
          "blockQuote",
          "|",
          "undo",
          "redo",
        ],
        shouldNotGroupWhenFull: true,
      },
    },
    isNumber: (v) => (!isNaN(parseFloat(v)) && isFinite(v)) || "Введите число",
    isEmpty: (v) => {
      if (v == null || v == undefined || v == "" || v.trim() == "") {
        return "Поле не может быть пустым.";
      } else {
        return true;
      }
    },
    isMaxFile: (v) => v.length <= 3 || `Выберите максимум 3 файла`,

    isSelecet: (v) => !!v || "Выберите значение",
  }),
  computed: {
    ...mapState("tender", ["tenderAddTemplate", "isAddTender", "options"]),
  },
  components: {
    ckeditor: CKEditor.component,
  },
  methods: {
    ...mapMutations("tender", ["SET_IS_ADD_TENDER"]),
    ...mapActions("tender", ["GET_OPTIONS", "CREATE_TENDER"]),
    closeTenderDialog() {
      this.SET_IS_ADD_TENDER();
    },
    createTender() {
      let formData = new FormData();
      this.tenderAddTemplate.map(({ field, value, valid }) => {
        if (
          (valid.required && value == "") ||
          (valid.required && value == null)
        ) {
          this.valid = false;
          return this.$refs.tender.validate();
        } else if (field == "tenders") {
          value.map((img) => formData.append(field, img));
        } else {
          formData.append(field, value);
        }
      });
      this.valid && this.CREATE_TENDER(formData);
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