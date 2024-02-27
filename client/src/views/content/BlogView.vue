<template>
  <v-container>
    <blog-view />
  </v-container>
</template>

<script>
import BlogView from "../../components/admin/Blogs/View.vue";
import { mapActions } from "vuex";

export default {
  components: { BlogView },
  methods: {
    ...mapActions("blog", ["GET_BLOG_BY_ID"]),
  },
  mounted() {
    this.GET_BLOG_BY_ID(this.$route.params.id);
  },
};
</script>

<style>
</style>