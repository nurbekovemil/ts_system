<template>
  <div>
    <user-view />
    <user-edit />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import UserEdit from "../../components/admin/Users/Edit.vue";
import UserView from "../../components/admin/Users/View.vue";
export default {
  components: {
    UserView,
    UserEdit,
  },
  methods: {
    ...mapActions("user", ["GET_USER_BY_ID"]),
  },
  mounted() {
    this.GET_USER_BY_ID(this.$route.params.id);
  },
};
</script>
<style>
</style>