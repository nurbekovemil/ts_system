<template>
  <v-card class="mt-4">
    <div id="transaction">
      <v-card-subtitle class="d-flex justify-space-between text-title">
        <div class="d-flex align-center">Товарно-сырьевой сектор</div>
        <div class="grey--text">
          Идентификатор перевода: {{ transaction.id }}
        </div>
      </v-card-subtitle>
      <v-card-text class="text-body-1 text-content">
        <div class="d-flex justify-space-between font-weight-black">
          <div>Итого</div>
          <div>{{ transaction.amount }} сом</div>
        </div>
        <v-divider class="my-3" />
        <div class="d-flex justify-space-between">
          <div>Отправитель</div>
          <div>
            {{ transaction.user_from_name }}
          </div>
        </div>
        <div class="d-flex justify-space-between">
          <div>Получатель</div>
          <div>
            {{ transaction.user_to_name }}
          </div>
        </div>
        <v-divider class="my-3" />

        <div class="d-flex justify-space-between">
          <div>Тип перевода</div>
          <div>
            {{ transaction.type_title }}
          </div>
        </div>
        <div class="d-flex justify-space-between">
          <div>Статус перевода</div>
          <div>
            {{ transaction.status_title }}
          </div>
        </div>
        <div class="d-flex justify-space-between mb-5">
          <div>Сумма операции</div>
          <div>
            {{ transaction.amount }}
          </div>
        </div>

        <div class="d-flex justify-space-between">
          <div class="grey--text text-caption">
            {{ transaction.created_at }}
          </div>
        </div>
      </v-card-text>
    </div>
    <v-card-actions v-if="transaction.status == 2 || transaction.status == 3">
      <v-spacer />
      <v-btn elevation="0" color="#78C3CC" dark small @click="print">
        <v-icon left>mdi-printer</v-icon>
        Печать</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["transaction"],
  methods: {
    async print() {
      const cssOptions = {
        styles: ["../../Print.css"],
      };
      await this.$htmlToPaper("transaction", cssOptions);
    },
  },
};
</script>

<style>
</style>