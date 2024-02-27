<template>
  <div>
    <user-view />
    <user-edit />
  </div>
</template>


<script>
import UserEdit from "../../components/admin/Users/Edit.vue";
import UserView from "../../components/admin/Users/View.vue";
import { mapActions } from "vuex";
export default {
  data: () => ({}),
  components: {
    UserView,
    UserEdit,
  },
  methods: {
    ...mapActions("user", ["PROFILE"]),
  },
  mounted() {
    this.PROFILE();
  },
};
</script>

<style>
</style>