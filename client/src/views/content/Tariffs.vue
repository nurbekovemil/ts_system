<template>
  <v-container>
    <div class="d-flex justify-space-between">
      <p class="">Вводится в действие с 1 января 2023 года</p>
      <div class="font-weight-light" style="width: 350px">
        <p class="mb-0">УТВЕРЖДЕНО</p>
        <span>
          ​​Решением Совета Директоров ЗАО «Кыргызская фондовая биржа» от 21
          декабря 2022 года
        </span>
      </div>
    </div>

    <h4 class="mt-5">
      Тарифы биржевых сборов со сделок, заключаемых на ЗАО «Кыргызская фондовая
      биржа» в товарно-сырьевом секторе
    </h4>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Тариф</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0,05%, но не менее 200 сом и не более 50 000 сом</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div style="font-size: 14px" class="mt-5">
      <p class="font-weight-light">
        1. Тариф устанавливается исходя из объема каждой конкретной сделки,
        зарегистрированной в торговой системе.
      </p>
      <p class="font-weight-light">
        2. Размер биржевого сбора установлен без учета НДС.
      </p>
      <p class="font-weight-light">
        3. При совершении биржевой сделки в иностранной валюте для целей
        определения размера биржевого сбора ее сумма определяется исходя из
        официального курса, установленного Национальным банком Кыргызской
        Республики на дату совершения биржевой сделки.
      </p>
      <p class="font-weight-light">
        4. Биржевой сбор взимается Биржей в равных долях с каждого Участника
        биржевой торговли, заключившего сделку. В случае, если сделка заключена
        одним Участником биржевой торговли, с него взимается комиссионный сбор в
        полном размере.
      </p>
      <p class="font-weight-light">
        5. Перевод денежных средств со счета участника торгов в уполномоченном
        банке на его расчетный счет в банках Кыргызской Республики оплачивается
        по тарифу банка отдельно от Тарифов биржевых сборов ЗАО «КФБ».
      </p>
      <p class="font-weight-light">
        6. За отмену расчетов через уполномоченный банк взымается с участника
        торгов оплата в размере 2000 сом.
      </p>
    </div>

    <h4 class="mt-10">
      Тарифы биржевых сборов со сделок, заключаемых на ЗАО «Кыргызская фондовая
      биржа» в секторе драгоценных металлов
    </h4>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Размер биржевого сбора</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0,06%, но не менее 50 сом и не более 50 000 сом</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div style="font-size: 14px" class="mt-5">
      <p class="font-weight-light">
        1. Тариф устанавливается исходя из объема каждой конкретной сделки,
        зарегистрированной в торговой системе.
      </p>
      <p class="font-weight-light">
        1. Размер биржевого сбора установлен без учета НДС.
      </p>
      <p class="font-weight-light">
        3. Биржевой сбор взимается Биржей в равных долях с каждого Участника
        биржевой торговли, заключившего сделку. В случае, если сделка заключена
        одним Участником биржевой торговли, с него взимается комиссионный сбор в
        полном размере.
      </p>
      <p class="font-weight-light">
        4. Перевод денежных средств со счета участника торгов в уполномоченном
        банке на его расчетный счет в банках Кыргызской Республики оплачивается
        по тарифу банка отдельно от Тарифов биржевых сборов ЗАО «КФБ».
      </p>
      <p class="font-weight-light">
        5. За отмену расчетов через уполномоченный банк взымается с участника
        торгов оплата в размере 2000 сом.
      </p>
      <p class="font-weight-light">
        6. Биржевой сбор не взымается с участников торгов в лице Национального
        банка КР и Департамента драгоценных металлов при Министерстве финансов
        КР.
      </p>
    </div>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    tariffs: [{ title: "" }],
  }),
};
</script>

<style>
</style>