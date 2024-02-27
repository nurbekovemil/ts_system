<template>
  <v-card>
    <v-card-title class="d-flex align-end">
      <v-sheet
        color="#78C3CC"
        class="d-flex justify-center align-center"
        height="40"
        width="40"
        rounded
      >
        <v-icon size="25" dark> mdi-briefcase-variant </v-icon>
      </v-sheet>
      <span class="font-weight-light ml-3">Предложение на сделку</span>
      <span class="font-weight-light ml-auto">
        <v-btn
          small
          rounded
          plain
          color="primary"
          router
          to="/dashboard/offers"
        >
          Ещё
        </v-btn>
      </span>
    </v-card-title>

    <v-card-text>
      <v-simple-table dense height="150px">
        <template v-slot:default>
          <tbody>
            <template v-if="in_processing_offers.length > 0">
              <tr v-for="(item, i) in in_processing_offers" :key="item.id">
                <td width="10%">{{ i + 1 }}</td>
                <td width="50%" class="pl-0">
                  <v-btn
                    rounded
                    plain
                    small
                    color="primary"
                    router
                    class="px-0"
                    :to="`/dashboard/offer/${item.id}`"
                  >
                    {{ item.title }}
                  </v-btn>
                </td>
                <td class="text-right grey--text">
                  {{ item.created_at }}
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td class="text-center grey--text">Предложений нет!</td>
              </tr>
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState("dashboard", ["in_processing_offers"]),
  },
  methods: {
    ...mapActions("dashboard", ["GET_IN_PROCESSING_OFFERS"]),
  },
  mounted() {
    this.GET_IN_PROCESSING_OFFERS();
  },
};
</script>

<style>
</style>