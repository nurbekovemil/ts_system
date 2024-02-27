<template>
  <blog-view />
</template>

<script>
import BlogView from "../../components/admin/Blogs/View.vue";
import { mapState, mapMutations, mapActions } from "vuex";

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