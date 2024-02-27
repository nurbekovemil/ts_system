<template>
  <div>
    <template>
      <v-row justify="center">
        <v-dialog v-model="isEditing" persistent max-width="55%">
          <template> </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Редактировать профиль</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row class="pa-3">
                  <v-col cols="12" sm="6">
                    <v-text-field
                      dense
                      label="Имя компании"
                      outlined
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      dense
                      label="Организационно-правовая форма"
                      outlined
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      dense
                      label="Основной вид деятельности"
                      outlined
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      dense
                      label="Юридический и почтовый адрес"
                      outlined
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field dense label="Телефон" outlined></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field dense label="E-mail" outlined></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      dense
                      label="ФИО руководителя"
                      outlined
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      dense
                      label="ФИО главного бухгалтера"
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container> 
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="closeEditProfileDialog">
                Закрыть
              </v-btn>
              <v-btn color="success" text @click="closeEditProfileDialog"> Сохранить </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </div>
</template>

<script>
export default {
  props: ["isEditing"],

  methods: {
    closeEditProfileDialog() {
      this.$emit("toggleEditProfileDialog");
    },
  },
};
</script>
<style>
</style>
