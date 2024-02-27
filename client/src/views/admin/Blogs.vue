<template>
  <v-card>
    <v-row class="mt-2 ml-0">
      <v-col cols="12" md="12" class="d-flex align-center justify-end">
        <v-btn
          elevation="0"
          color="#78C3CC"
          class="mr-2"
          dark
          small
          @click="openAddBlog"
        >
          <v-icon left>mdi-plus</v-icon>
          Добавить</v-btn
        >
      </v-col>
    </v-row>

    <v-card-text>
      <div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Названия</th>
                <th class="text-left">Пользователь</th>
                <th class="text-left">Дата</th>
                <th class="text-left" width="5%"></th>
              </tr>
            </thead>
            <tbody>
              <template v-if="blogs && blogs.length > 0">
                <tr v-for="blog in blogs" :key="blog.id">
                  <td>{{ blog.id }}</td>
                  <td @click="blogView(blog.id)">
                    <a class="text-decoration-none">{{ blog.title }}</a>
                  </td>
                  <td>{{ blog.username }}</td>
                  <td>{{ blog.created_at }}</td>
                  <td>
                    <v-menu
                      offset-y
                      transition="slide-x-transition"
                      bottom
                      left
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>

                      <v-list nav dense>
                        <!-- <v-hover v-slot="{ hover }">
                          <v-list-item link dense>
                            <v-list-item-icon>
                              <v-icon :color="`${hover && 'cyan'}`"
                                >mdi-pencil</v-icon
                              >
                            </v-list-item-icon>
                            <v-list-item-title>
                              Редактировать
                            </v-list-item-title>
                          </v-list-item>
                        </v-hover> -->
                        <v-hover v-slot="{ hover }">
                          <v-list-item link dense @click="deleteBlog(blog.id)">
                            <v-list-item-icon>
                              <v-icon :color="`${hover && 'red lighten-1'}`"
                                >mdi-delete</v-icon
                              >
                            </v-list-item-icon>
                            <v-list-item-title> Удалить </v-list-item-title>
                          </v-list-item>
                        </v-hover>
                      </v-list>
                    </v-menu>
                  </td>
                </tr>
              </template>
              <template v-else>
                <td colspan="10" class="text-center py-2 text--disabled">
                  Не найдено!
                </td>
              </template>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </v-card-text>
    <v-card-actions class="d-flex justify-center">
      <!-- <v-pagination
        v-model="page"
        :length="transfer_count"
        color="#78C3CC"
      ></v-pagination> -->
    </v-card-actions>
    <add />
  </v-card>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Add from "../../components/admin/Blogs/Add.vue";
export default {
  components: { Add },
  data: () => ({}),
  computed: {
    ...mapState("blog", ["blogs"]),
  },
  methods: {
    ...mapMutations("blog", ["SET_IS_ADD_DIALOG"]),
    ...mapActions("blog", ["GET_BLOG_LIST", "DELETE_BLOG"]),
    openAddBlog() {
      this.SET_IS_ADD_DIALOG();
    },
    blogView(id) {
      this.$router.push(`/dashboard/blogs/${id}`);
    },
    deleteBlog(id) {
      this.DELETE_BLOG(id);
    },
  },
  mounted() {
    this.GET_BLOG_LIST();
  },
};
</script>


<style>
</style>