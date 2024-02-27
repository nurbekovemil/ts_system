<template lang="">
   <div>
      <!-- тип 1 заявка на продажу -->
      <order-list type="1"/>
      <!-- тип 2 заявка на покупку -->
      <order-list type="2"/>
      <add/>
      <edit/>
   </div>
</template>
<script>


import OrderList from "@/components/admin/Orders/List.vue";
import Add from '@/components/admin/Orders/Add.vue'
import Edit from '@/components/admin/Orders/Edit.vue'
export default {
   components: {
      OrderList,
      Add,
      Edit
   },

};
</script>
<style lang="">
</style>