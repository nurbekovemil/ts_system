<template>
  <v-row>
    <v-dialog v-model="isAddDialog" persistent max-width="60%">
      <v-form ref="blogAdd" v-model="valid">
        <v-card>
          <v-card-title> Добавить новости </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col
                v-for="(field, i) in blogTemplate"
                :key="i"
                :cols="field.col"
                class="px-2"
              >
                <template v-if="field.type === 'textarea'">
                  <vue-editor
                  v-model="field.value"
                  :editorToolbar="toolbar"
                  >
                  </vue-editor>
                  <!-- <ckeditor
                    :editor="editor"
                    v-model="field.value"
                    :config="editorConfig"
                  ></ckeditor> -->
                </template>
                <!-- <template v-if="field.type === 'date'">
                  <v-text-field
                    v-model="field.value"
                    :label="field.title"
                    type="date"
                    outlined
                    dense
                    :hint="field.hint"
                    persistent-hint
                  ></v-text-field>
                </template>
                <template v-if="field.type === 'time'">
                  <v-text-field
                    v-model="field.value"
                    :label="field.title"
                    type="time"
                    outlined
                    dense
                    :hint="field.hint"
                    persistent-hint
                  ></v-text-field>
                </template> -->
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
              @click="closeBlogDialog"
            >
              Закрыть
            </v-btn>
            <v-spacer />
            <v-btn elevation="0" color="#78C3CC" dark small @click="createBlog"
              >Опубликовать</v-btn
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
import { VueEditor } from "vue2-editor";

export default {
  data() {
    return {
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
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        ["link"],
        ["clean"] // remove formatting button
      ],
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
    ...mapState("blog", ["isAddDialog", "blogTemplate"]),
  },
  components: {
    VueEditor
  },
  methods: {
    ...mapMutations("blog", ["SET_IS_ADD_DIALOG"]),
    ...mapActions("blog", ["CREATE_BLOG"]),
    closeBlogDialog() {
      this.SET_IS_ADD_DIALOG();
    },
    fileurl: (furl) => {
      return URL.createObjectURL(furl);
    },

    createBlog() {
      let formData = new FormData();
      this.blogTemplate.map(({ field, value, valid }) => {
        if (
          (valid.required && value == "") ||
          (valid.required && value == null)
        ) {
          this.valid = false;
          return this.$refs.blogAdd.validate();
        } else if (field == "blogs") {
          value.map((img) => formData.append(field, img));
        } else if (field == "blogs") {
          value.map((img) => formData.append(field, img));
        } else {
          formData.append(field, value);
        }
      });
      this.valid && this.CREATE_BLOG(formData);
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