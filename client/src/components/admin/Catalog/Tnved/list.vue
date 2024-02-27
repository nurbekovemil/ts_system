<template>
  <v-card class="mx-0 my-2" min-width="100%">
    <v-sheet class="search-box pa-4">
      <v-text-field
        v-model="search"
        label="Поиск по наименованию"
        placeholder="Поиск по наименованию"
        solo
        flat
        dense
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
        class="white"
      ></v-text-field>
    </v-sheet>
    <v-row>
      <v-col cols="12">
        <v-card-text>
          <v-treeview
            :items="tnved_categories"
            :search="search"
            activatable
            selected-color="grey darken-4"
            open-on-click
            dense
          >
            <template v-slot:prepend="{ item }">
              {{ item.id }}
            </template>
          </v-treeview>
        </v-card-text>
      </v-col>
      <v-col>
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="10"
            app
            elevation="0"
            color="#78C3CC"
          ></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  props: ["tnved_id"],
  data: () => ({
    page: 1,
    search: "",
    selected: [],
  }),
  computed: {
    ...mapState("catalog", ["tnved_categories"]),
  },
  methods: {
    ...mapActions("catalog", ["GET_TNVED_CATEGORIES"]),
  },
  mounted() {
    this.GET_TNVED_CATEGORIES(this.page);
  },
  watch: {
    page(v) {
      this.GET_TNVED_CATEGORIES(v);
      console.log(this.tnved_id);
    },
    selected(v) {
      this.$emit("update:tnved_id", this.selected);
      console.log(this.selected);
    },
  },
};
</script>

<style scoped>
.search-box {
  background: #78c3cc;
}
</style>