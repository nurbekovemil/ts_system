<template>
  <v-card>
    <v-card-title>
      {{ blog_view.title }}
    </v-card-title>
    <v-card-subtitle>
      Опубликовано: {{ blog_view.created_at }}
    </v-card-subtitle>
    <template v-if="blog_view && blog_view.images[0] != null">
      <v-carousel
        cycle
        hide-delimiter-background
        show-arrows-on-hover
        class="d-flex justify-center"
      >
        <v-carousel-item v-for="(slide, i) in blog_view.images" :key="i">
          <v-img
            width="700"
            max-height="1000"
            contain
            :src="slide != null && `${url_api}/${slide.path}`"
          ></v-img>
        </v-carousel-item>
      </v-carousel>
    </template>
    <v-card-text class="blog-content" v-html="blog_view.description">
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    url_api: process.env.VUE_APP_BACK_API,
  }),
  methods: {},
  computed: {
    ...mapState("blog", ["blog_view"]),
  },
};
</script>

<style>
.blog-content table {
  border-collapse: collapse;
}

.blog-content table td,
.blog-content table th {
  border: 1px solid grey;
  padding: 2px;
}
</style>