<template>
  <div>
    <deal :deal="deal_view" :comments="deal_comments" />
    <tools :deal="deal_view" />
    <v-card class="mt-2" v-if="user.role == 'ADMIN' || user.role == 'CD'">
      <v-card-text>
        <v-row>
          <v-col cols="9">
            <v-text-field
              v-model="deal_view.deal_number"
              dense
              label="Введите номер договора"
              outlined
              hide-details=""
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-btn color="#78C3CC" dark block @click="addDealNumber">
              Добавить номер договора
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Deal from "@/components/admin/Deals/Deal";
import Tools from "../../components/admin/Deals/Tools.vue";
export default {
  components: {
    Deal,
    Tools,
  },
  computed: {
    ...mapState("deal", ["deal_view", "deal_comments"]),
    ...mapState("user", ["user"]),
  },
  methods: {
    ...mapActions("deal", ["GET_DEAL_BY_ID", "ADD_DEAL_NUMBER"]),
    addDealNumber() {
      this.ADD_DEAL_NUMBER({
        deal_id: this.deal_view.id,
        deal_number: this.deal_view.deal_number,
      });
    },
  },
  mounted() {
    this.GET_DEAL_BY_ID(this.$route.params.id);
  },
};
</script>

<style></style>
