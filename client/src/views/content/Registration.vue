<template>
  <v-container>
    <div>
      <div class="text-h5">Регистрация аккаунта</div>
      <div>
        <v-radio-group v-model="type" row>
          <v-radio
            v-for="user in user_type"
            :key="user.type"
            :value="user.type"
            :label="user.title"
          >
          </v-radio>
        </v-radio-group>
      </div>
    </div>
    <v-form ref="registration" v-model="valid" lazy-validation>
      <v-card v-for="group in template" :key="group.id" class="my-3">
        <v-card-title>
          {{ group.title }}
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="px-2"
              v-for="item in group.items"
              :key="item.field"
            >
              <template v-if="item.type == 'input'">
                <v-text-field
                  v-model="item.value"
                  :label="item.title"
                  outlined
                  :rules="item.required && [rules.isEmpty]"
                  dense
                ></v-text-field>
              </template>
              <template v-if="item.type == 'date'">
                <v-text-field
                  v-model="item.value"
                  :label="item.title"
                  type="date"
                  outlined
                  dense
                  :rules="item.required && [rules.isEmpty]"
                ></v-text-field>
              </template>
              <template v-if="item.type == 'select'">
                <v-select
                  v-model="item.value"
                  :items="item.options"
                  :label="item.title"
                  dense
                  outlined
                  :rules="item.required && [rules.isSelecet]"
                ></v-select>
              </template>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
    <v-card elevation="0">
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn dark dense color="#78C3CC" @click="send">Отправить</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({
    valid: false,
    type: 1,
    rules: {
      isEmpty: (v) => !!v.trim() || "Поле не может быть пустым.",
      isSelecet: (v) => !!v || "Выберите значение",
    },
  }),
  computed: {
    ...mapState("user", ["template", "user_type", "test"]),
    openDateManu(v) {
      return v;
    },
  },
  methods: {
    ...mapActions("user", ["GET_USER_REGISTER_TEMPLATE", "USER_REGISTER"]),
    send() {
      let user = {
        user_type: this.type,
        data: null,
      };
      user.data = JSON.stringify(
        this.template.reduce((prev, { title, id, items }) => {
          return [
            ...prev,
            {
              title,
              id,
              items: [
                ...items.map(
                  ({ field, title, value, required, type, options }) => {
                    if (required && value.trim() == "") {
                      this.valid = false;
                      return this.$refs.registration.validate();
                    }
                    return {
                      field,
                      title,
                      value,
                      type,
                      options,
                    };
                  }
                ),
              ],
            },
          ];
        }, [])
      );
      this.valid && this.USER_REGISTER(user);
    },
  },
  mounted() {
    this.GET_USER_REGISTER_TEMPLATE(1);
  },
  watch: {
    type(v) {
      this.GET_USER_REGISTER_TEMPLATE(v);
    },
  },
};
</script>

<style>
</style>