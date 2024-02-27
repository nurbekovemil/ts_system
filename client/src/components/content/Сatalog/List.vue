<template>
  <div>
    <div class="body-1 mb-3">Категории</div>
    <v-row>
      <v-col cols="12" md="3" v-for="category in categories" :key="category.id">
        <v-card
          router
          :to="{
            name: 'category_orders',
            params: { id: category.id, title: category.title },
          }"
        >
          <v-card-title class="body-1">
            {{
              category.title.length > 23
                ? category.title.slice(0, 23) + "..."
                : category.title
            }}
          </v-card-title>
          <v-card-subtitle> Заявок {{ category.orders }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  computed: {
    ...mapState("catalog", ["categories"]),
  },
  methods: {
    ...mapActions("catalog", ["GET_CATEGORIES"]),
  },
  mounted() {
    this.GET_CATEGORIES();
  },
};
</script>

<style>
</style>