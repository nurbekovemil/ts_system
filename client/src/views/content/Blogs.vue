<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" v-for="blog in blogs" :key="blog.id">
        <v-card @click="viewBlog(blog.id)" height="420">
          <v-img
            :src="
              blog.images[0] != null
                ? `${url_api}/${blog.images[0].path}`
                : `${url_api}/static/images/default.png`
            "
            height="240px"
          ></v-img>
          <v-card-title>
            {{
              blog.title.length > 100 || breakpoint == "xs"
                ? blog.title.slice(0, breakpoint == "xs" ? 25 : 100) + "..."
                : blog.title
            }}
          </v-card-title>

          <template v-if="blog.description.length > 290">
            <v-card-text
              v-html="
                blog.description.slice(0, breakpoint == 'xs' ? 70 : 290) + '...'
              "
              class="pb-0"
            ></v-card-text>
          </template>
          <template v-else>
            <v-card-text class="pb-0" v-html="blog.description"></v-card-text>
          </template>
          <v-card-subtitle class="grey--text">
            Опубликовано: {{ blog.created_at }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data: () => ({
    url_api: process.env.VUE_APP_BACK_API,
  }),
  computed: {
    ...mapState("blog", ["blogs"]),
    breakpoint() {
      return this.$vuetify.breakpoint.name;
    },
  },
  methods: {
    ...mapActions("blog", ["GET_BLOG_LIST"]),
    viewBlog(id) {
      this.$router.push("/blogs/" + id);
    },
  },
  async mounted() {
    this.GET_BLOG_LIST();
  },
};
</script>

<style>
</style>