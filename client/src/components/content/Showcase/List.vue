<template>
  <v-container class="bg-surface-variant">
    <v-row>
      <v-col cols="12" class="pt-4">
        <h2 style="color: #868d94">Продажа имущества</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="prod in products" :key="prod.id" cols="12" sm="3" md="3">
        <v-card class="mx-auto">
          <v-card-title class="text-subtitle-2">
            <span
              style="
                max-height: 22px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
              >{{
                prod.title.length > 17
                  ? prod.title.slice(0, 17) + "..."
                  : prod.title
              }}</span
            >
          </v-card-title>

          <v-img
            :src="
              prod.images[0] != null
                ? `${url_api}/${prod.images[0].path}`
                : `${url_api}/static/images/default.png`
            "
            height="200px"
            cover
          ></v-img>

          <v-card-actions>
            <div class="ml-2">{{ prod.price }} сом</div>
            <v-spacer></v-spacer>

            <v-btn color="#78C3CC" small text @click="viewProd(prod.id)">
              Посмотреть
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    url_api: process.env.VUE_APP_BACK_API,
  }),
  computed: {
    ...mapState("showcases", ["products"]),
  },
  methods: {
    viewProd(id) {
      this.$router.push(`/products/${id}`);
    },
  },
};
</script>

<style>
</style>