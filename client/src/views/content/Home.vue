<template>
  <div>
    <v-row>
      <v-col class="">
        <v-img
          src="@/assets/stock-front.jpeg"
          height="450"
          cover
          class="grey darken-4 white--text align-center text-center"
          gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
        >
          <v-container>
            <p
              class="text-md-h4 text-h5 font-weight-bold text-sm-h4 text-md-h3"
            >
              Развивайте свой бизнес с нами!
              <br />
              <span class="text-h6 text-md-h5">
                Находите новые сделки, новых партнёров!
              </span>
            </p>
          </v-container>
        </v-img>
      </v-col>
    </v-row>
    <div style="background: #f5f6f7">
      <v-container>
        <v-row>
          <v-col cols="12" v-if="currensies && currensies.Currency">
            <v-card class="py-2">
              <h3
                :style="breakpoint == 'xs' && 'font-size: 10px;'"
                class="text-md-subtitle-2 mb-2 grey--text d-flex justify-center"
              >
                Официальные курсы валют Национального банка КР на
                {{ currensies["@attributes"].Date }} года
              </h3>
              <div class="d-flex justify-space-around">
                <div v-for="(item, i) in currensies.Currency" :key="i">
                  <h3 style="color: #78c3cc; font-weight: bold">
                    {{ item["@attributes"].ISOCode }}
                  </h3>
                  <p class="mb-0">{{ item.Value }}</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12">
            <order-list type="1" />
          </v-col>
          <v-col cols="12">
            <order-list type="2" />
          </v-col>
        </v-row>
        <!-- <showcase-products /> -->
        <v-row class="mb-15">
          <template v-if="blogs.length > 0">
            <v-col cols="6" class="pt-4">
              <h2 style="color: #868d94">Новости</h2>
            </v-col>
            <v-col cols="6" class="d-flex justify-end align-end pt-4">
              <!-- <h5 style="color: #868d94"></h5> -->
              <v-btn
                color="#78C3CC"
                @click="() => this.$router.push(`/blogs`)"
                text
                small
                >Все</v-btn
              >
            </v-col>

            <v-col cols="12">
              <v-sheet class="mx-auto" elevation="0" max-width="100%">
                <v-slide-group class="pa-4" v-model="modelBlog" show-arrows>
                  <v-slide-item v-for="blog in blogs" :key="blog.id">
                    <v-card
                      class="ma-4"
                      @click="viewBlog(blog.id)"
                      height="250"
                      width="400"
                    >
                      <v-img
                        :src="
                          blog.images[0] != null
                            ? `${url_api}/${blog.images[0].path}`
                            : `${url_api}/static/images/default.png`
                        "
                        height="140px"
                      ></v-img>
                      <v-card-title>
                        {{
                          blog.title.length > 30
                            ? blog.title.slice(0, 30) + "..."
                            : blog.title
                        }}
                      </v-card-title>
                      <v-card-subtitle>
                        Опубликовано: {{ blog.created_at }}
                      </v-card-subtitle>
                    </v-card>
                  </v-slide-item>
                </v-slide-group>
              </v-sheet>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import OrderList from "../../components/content/Home/OrderList.vue";
import ShowcaseProducts from "../../components/content/Home/ShowcaseProducts.vue";
export default {
  data: () => ({
    modelBlog: null,
    url_api: process.env.VUE_APP_BACK_API,
  }),
  components: {
    OrderList,
    ShowcaseProducts,
  },
  computed: {
    ...mapState("blog", ["blogs"]),
    ...mapState("exchangeRates", ["currensies"]),
    breakpoint() {
      return this.$vuetify.breakpoint.name;
    },
  },
  methods: {
    ...mapActions("exchangeRates", ["GET_CURRENT_EXCHANGE"]),
    ...mapActions("blog", ["GET_BLOG_LIST"]),
    viewBlog(id) {
      this.$router.push("/blogs/" + id);
    },
  },
  async mounted() {
    this.GET_CURRENT_EXCHANGE();
    this.GET_BLOG_LIST();
  },
};
</script>
<style scoped>
/* .icon-wrapper {
  border: 1px solid #78c3cc;
  padding: 10px;
}
.wrapper-tskse-info {
  position: relative;
}
.wrap-tskse-info {
  position: absolute;
  top: -50%;
  min-height: 200px;
}
.tskse-info {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.how-start {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  padding: 20px;
}
@media (max-width: 600px) {
  .tskse-info p {
    font-size: 0.7em;
  }
}
@media (max-width: 320px) {
  .info-box {
    min-height: 86px;
  }
} */
</style>
