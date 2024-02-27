<template>
  <v-row class="ma-md-2 d-flex" style="align-items: center">
    <v-col class="pa-0" cols="12">
      <!-- Название товара -->
      <v-card-title>{{ prod_view.title }}</v-card-title>
      <v-card-subtitle class="text-caption py-0">
        Создано
        {{ prod_view.created_at }}
      </v-card-subtitle>
    </v-col>
    <v-col md="4" v-if="prod_view && prod_view.images[0] != null">
      <v-card @click="viewImages()">
        <v-carousel
          cycle
          height="250"
          data-fancybox
          show-arrows-on-hover
          hide-delimiters
        >
          <v-carousel-item
            v-for="(img, i) in prod_view.images"
            :key="i"
            :src="
              img != null
                ? `${url_api}/${img.path}`
                : `${url_api}/static/images/default.png`
            "
            cover
          />
        </v-carousel>
      </v-card>
    </v-col>
    <v-col>
      <!-- Детали товара -->
      <v-simple-table>
        <template class="hhh">
          <tbody>
            <tr class="text-caption">
              <td class="text-h6">Цена</td>
              <td class="text-h6 font-weight-bold">
                {{ prod_view.price }} сом
              </td>
            </tr>
            <tr class="text-caption">
              <td class="grey--text">Количество</td>
              <td>{{ prod_view.total }} шт</td>
            </tr>
            <tr class="text-caption">
              <td class="grey--text">Артикул</td>
              <td>{{ prod_view.vendor_code }}</td>
            </tr>
            <tr class="text-caption">
              <td class="grey--text">Описание</td>
              <td>{{ prod_view.description }}</td>
            </tr>
            <v-col class="mt-5">
              <v-btn dark color="#78C3CC" @click="dialog = !dialog">
                Купить
              </v-btn>

              <v-dialog v-model="dialog" width="60%">
                <v-card>
                  <v-card-title>
                    {{ prod_view.title }}
                  </v-card-title>
                  <v-card-text>
                    <div>
                      <a
                        href="https://wa.me/+996551311484"
                        style="height: 28px"
                        target="_blank"
                      >
                        Whatsapp: +996 551 311 484
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://telegram.me/+996551311484"
                        style="height: 28px"
                        target="_blank"
                      >
                        Telegram: +996 551 311 484
                      </a>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn text small @click="dialog = false">Закрыть</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
    <div class="text-center">
      <v-dialog v-model="dialogImage" width="80%">
        <v-card>
          <v-carousel
            cycle
            height="700px"
            data-fancybox
            show-arrows-on-hover
            hide-delimiters
          >
            <v-carousel-item
              v-for="(img, i) in prod_view.images"
              :key="i"
              :src="
                img != null
                  ? `${url_api}/${img.path}`
                  : `${url_api}/static/images/default.png`
              "
              cover
            />
          </v-carousel>
        </v-card>
      </v-dialog>
    </div>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    url_api: process.env.VUE_APP_BACK_API,
    dialog: false,
    dialogImage: false,
  }),
  methods: {
    viewImages() {
      if (this.prod_view && this.prod_view.images[0] != null) {
        this.dialogImage = !this.dialogImage;
      }
    },
  },
  computed: {
    ...mapState("showcases", ["prod_view"]),
  },
};
</script>

<style>
</style>