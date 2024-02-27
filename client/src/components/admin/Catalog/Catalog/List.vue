<template>
  <v-card>
    <v-expansion-panels elevation="0">
      <v-expansion-panel
        v-for="(item, i) in catalog"
        :key="i"
        @click="onLoadCatalog(item)"
      >
        <v-form :ref="item.table">
          <v-expansion-panel-header>
            {{ item.title }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list dense>
              <template v-for="(child, i) in item.items">
                <v-list-item :key="i">
                  <v-list-item-content>
                    <template v-if="item.table == 'order_currencies'">
                      <v-row>
                        <v-col>
                          <v-text-field
                            :label="child.isedit ? 'Редактировать' : ''"
                            v-model="child.title"
                            :readonly="!child.isedit"
                            dense
                            hide-details
                            filled
                            rounded
                            :background-color="
                              child.isedit ? 'cyan lighten-5' : ''
                            "
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                            :label="child.isedit ? 'Редактировать' : ''"
                            v-model="child.code"
                            :readonly="!child.isedit"
                            dense
                            hide-details
                            filled
                            rounded
                            :background-color="
                              child.isedit ? 'cyan lighten-5' : ''
                            "
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                            :label="child.isedit ? 'Редактировать' : ''"
                            v-model="child.symbol"
                            :readonly="!child.isedit"
                            dense
                            hide-details
                            filled
                            rounded
                            :background-color="
                              child.isedit ? 'cyan lighten-5' : ''
                            "
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </template>
                    <template v-else>
                      <v-text-field
                        :label="child.isedit ? 'Редактировать' : ''"
                        v-model="child.title"
                        :readonly="!child.isedit"
                        dense
                        hide-details
                        filled
                        rounded
                        :background-color="child.isedit ? 'cyan lighten-5' : ''"
                      ></v-text-field>
                    </template>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-row>
                      <template v-if="child.isedit">
                        <v-btn
                          color="success"
                          icon
                          @click="updateItem(child, item.table)"
                        >
                          <v-icon>mdi-check-bold</v-icon>
                        </v-btn>
                        <v-btn color="warning" icon @click="closeItem(item)">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </template>
                      <template v-else>
                        <v-btn
                          color="primary"
                          icon
                          @click="child.isedit = !child.isedit"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          color="error"
                          icon
                          @click="deleteItem(item.table, child.id)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                    </v-row>
                  </v-list-item-action>
                </v-list-item>
              </template>
              <v-list-item>
                <v-list-item-content>
                  <template v-if="item.table == 'order_currencies'">
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="titleItem"
                          label="Введите название валюты"
                          background-color="white"
                          dense
                          hide-details
                          outlined
                          rounded
                        ></v-text-field> </v-col
                      ><v-col>
                        <v-text-field
                          v-model="codeItem"
                          label="Введите код валюты"
                          background-color="white"
                          dense
                          hide-details
                          outlined
                          rounded
                        ></v-text-field> </v-col
                      ><v-col>
                        <v-text-field
                          v-model="symbolItem"
                          label="Введите символ валюты"
                          background-color="white"
                          dense
                          hide-details
                          outlined
                          rounded
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-else>
                    <v-text-field
                      v-model="titleItem"
                      :placeholder="`Введите название ${item.title.toLowerCase()}`"
                      background-color="white"
                      dense
                      hide-details
                      outlined
                      rounded
                    ></v-text-field>
                  </template>
                </v-list-item-content>
                <v-list-item-action>
                  <v-row>
                    <v-btn color="success" rounded @click="createItem(item)">
                      Добавить
                    </v-btn>
                  </v-row>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-form>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({
    titleItem: "",
    codeItem: "",
    symbolItem: "",
  }),
  computed: {
    ...mapState("catalog", ["catalog"]),
  },
  methods: {
    ...mapActions("catalog", [
      "GET_CATALOG_BY_TABLE",
      "UPDATE_ITEM_IN_CATALOG",
      "CREATE_CATALOG_ITEM",
      "DELETE_CATALOG_ITEM",
    ]),
    onLoadCatalog(item) {
      item.items.length == 0 && this.GET_CATALOG_BY_TABLE(item.table);
    },
    closeItem(item) {
      this.GET_CATALOG_BY_TABLE(item.table);
    },
    updateItem(child, table) {
      if (child.title.trim() == "") return;
      this.UPDATE_ITEM_IN_CATALOG({ table, data: child });
    },
    createItem(item) {
      if (item.table == "order_currencies") {
        if (
          this.titleItem.trim() == "" ||
          this.codeItem.trim() == "" ||
          this.symbolItem.trim() == ""
        )
          return;
        this.CREATE_CATALOG_ITEM({
          table: item.table,
          data: {
            title: this.titleItem,
            code: this.codeItem,
            symbol: this.symbolItem,
          },
        });
      } else {
        if (this.titleItem.trim() == "") return;
        this.CREATE_CATALOG_ITEM({
          table: item.table,
          data: { title: this.titleItem },
        });
      }
    },
    deleteItem(table, id) {
      this.DELETE_CATALOG_ITEM({ table, id });
    },
  },
};
</script>

<style></style>
