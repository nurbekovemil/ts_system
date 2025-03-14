import Vue from "vue";
import VueRouter from "vue-router";

// admin pages
import {
  Dashboard,
  Users,
  UserView,
  Orders,
  OrderView,
  DealView,
  Deals,
  Offers,
  OfferView,
  AllOrders,
  Profile,
  Settings,
  Catalog,
  TradeList,
  DepoDeals,
  Reports,
  AccountList,
  TransactionList,
  TransactionView,
  Blogs,
  BlogView,
  Tenders,
  TenderView,
  MyTenders,
  ExchangePassports,
  ExchangePassportView,
  RegReportView,
  ShowcaseList,
  ShowcaseView,
  Notification,
} from "../views/admin";

// content pages
import {
  Handbook,
  AllOrdersList,
  About,
  CatalogOrders,
  Documents,
  Home,
  Order,
  Login,
  Registration,
  Categories,
  CategoryOrders,
  Trades,
  TradeView,
  Tariffs,
  BlogContentView,
  ContentBlogs,
  AllTenders,
  TenderContentView,
  ShowcaseHomeList,
  ShowcaseHomeView,
} from "../views/content";

// layouts
import Admin from "../layouts/Admin.vue";
import Content from "../layouts/Content.vue";

import store from "../store";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Content,
    meta: {
      isAuth: false,
    },
    children: [
      {
        path: "/",
        name: "Главная",
        component: Home,
      },
      {
        path: "/about",
        name: "О бирже",
        component: About,
      },
      {
        path: "/catalog",
        name: "Каталог Товаров",
        component: CatalogOrders,
      },
      {
        path: "/tariffs",
        name: "Тарифы",
        component: Tariffs,
      },
      {
        path: "/categories",
        name: "Категории",
        component: Categories,
      },
      {
        path: "/categories/:id",
        name: "category_orders",
        component: CategoryOrders,
        props: true,
      },
      {
        path: "/ksedocuments",
        name: "Документы",
        component: Documents,
      },
      {
        path: "/orders/:type",
        name: "Все заявки",
        component: AllOrdersList,
      },
      {
        path: "/handbooks",
        name: "Справочник",
        component: Handbook,
      },
      {
        path: "/trades",
        name: "Итоги торгоа",
        component: Trades,
      },
      {
        path: "/trade/:id",
        name: "Подробная информация",
        component: TradeView,
      },
      {
        path: "/order/:id",
        name: "Заявка",
        component: Order,
      },
      {
        path: "/login",
        name: "Войти",
        component: Login,
        meta: {
          isAuth: false,
        },
      },
      {
        path: "/registration",
        name: "Регистрация",
        component: Registration,
        meta: {
          isAuth: false,
        },
      },
      {
        path: "/blogs/:id",
        name: "Подробная информация",
        component: BlogContentView,
        meta: {
          isAuth: false,
        },
      },
      {
        path: "/blogs",
        name: "Новости",
        component: ContentBlogs,
        meta: {
          isAuth: false,
        },
      },
      {
        path: "/tenders",
        name: "Объявление",
        component: AllTenders,
        meta: {
          isAuth: false,
        },
      },
      {
        path: "/tenders/:id",
        name: "Подробная информация",
        component: TenderContentView,
        meta: {
          isAuth: false,
        },
      },
      {
        path: "/products",
        name: "Витрина",
        component: ShowcaseHomeList,
        meta: {
          isAuth: false,
        },
      },
      {
        path: "/products/:id",
        name: "Продукт",
        component: ShowcaseHomeView,
        meta: {
          isAuth: false,
        },
      },
    ],
  },
  {
    path: "/dashboard",
    component: Admin,
    meta: {
      isAuth: true,
    },
    children: [
      {
        path: "/",
        name: "Панель управления",
        component: Dashboard,
      },
      {
        path: "/dashboard/users",
        name: "Пользователи",
        component: Users,
      },
      {
        path: "/dashboard/user/:id",
        name: "Пользователь",
        component: UserView,
      },
      {
        path: "/dashboard/catalog",
        name: "Каталог",
        component: Catalog,
      },
      {
        path: "/dashboard/my-orders",
        name: "Мои заявки",
        component: Orders,
      },
      {
        path: "/dashboard/my-deals",
        name: "Мои сделки",
        component: Deals,
      },
      {
        path: "/dashboard/deals",
        name: "Все сделки",
        component: TradeList,
      },
      {
        path: "/dashboard/depos",
        name: "Сделки",
        component: DepoDeals,
      },
      {
        path: "/dashboard/offers",
        name: "Предложения",
        component: Offers,
      },
      {
        path: "/dashboard/all-orders",
        name: "Все заявки",
        component: AllOrders,
      },
      {
        path: "/dashboard/profile",
        name: "Профиль",
        component: Profile,
      },
      {
        path: "/dashboard/settings",
        name: "Настройки",
        component: Settings,
      },
      {
        path: "/dashboard/order/:id",
        name: "Описание товара",
        component: OrderView,
      },
      {
        path: "/dashboard/deal/:id",
        name: "Подробная информация",
        component: DealView,
      },
      {
        path: "/dashboard/offer/:id",
        name: "Подробная информация",
        component: OfferView,
        meta: {
          hideOrderTools: true,
        },
      },
      {
        path: "/dashboard/reports",
        name: "Отчеты",
        component: Reports,
      },
      {
        path: "/dashboard/accounts",
        name: "Клиринг",
        component: AccountList,
      },
      {
        path: "/dashboard/transactions",
        name: "Транзакции",
        component: TransactionList,
      },
      {
        path: "/dashboard/transactions/:id",
        name: "Детали операции",
        component: TransactionView,
      },
      {
        path: "/dashboard/blogs",
        name: "Новости",
        component: Blogs,
      },
      {
        path: "/dashboard/blogs/:id",
        name: "Подробная информация",
        component: BlogView,
      },
      {
        path: "/dashboard/tenders",
        name: "Тендеры, конкурсы, гранты и аукционы",
        component: Tenders,
      },
      {
        path: "/dashboard/tenders/:id",
        name: "Подробная информация",
        component: TenderView,
      },
      {
        path: "/dashboard/mytenders",
        name: "Мои объявление",
        component: MyTenders,
      },
      {
        path: "/dashboard/passports",
        name: "Биржевой паспорты",
        component: ExchangePassports,
      },
      {
        path: "/dashboard/passport/:id",
        name: "Подробная информация",
        component: ExchangePassportView,
      },
      {
        path: "/dashboard/passport/regpays/:id",
        name: "Регистрационные платежи ",
        component: RegReportView,
      },
      {
        path: "/dashboard/products",
        name: "Витрина",
        component: ShowcaseList,
      },
      {
        path: "/dashboard/products/:id",
        name: "Продукт",
        component: ShowcaseView,
      },
      {
        path: "/dashboard/notifications",
        name: "Уведомления",
        component: Notification,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

const allowedRouters = (path) => {
  return store.state.user.userMenus.some(({ route }) => route == path);
};

router.beforeEach((to, from, next) => {
  if (
    to.matched.some((record) => record.meta.isAuth) &&
    !store.state.user.isAuth
  ) {
    next("/login");
    return;
  }
  if (to.path == "/login" && store.state.user.isAuth) {
    next("/dashboard");
    return;
  }
  // console.log(store.state.user.userMenus);
  // if (
  //   allowedRouters(to.path) &&
  //   to.matched.some((record) => record.meta.isAuth)
  // ) {
  //   console.log(to.path);
  //   console.log("1 allowedRouters", allowedRouters(to.path));
  //   next();
  // } else if (
  //   !allowedRouters(to.path) &&
  //   to.matched.some((record) => record.meta.isAuth)
  // ) {
  //   console.log(to.path);
  //   console.log("2 allowedRouters", allowedRouters(to.path));
  //   next("/not-found");
  //   return;
  // } else if (
  //   !allowedRouters(to.path) &&
  //   !to.matched.some((record) => record.meta.isAuth && store.state.user.isAuth)
  // ) {
  //   console.log(to.path);

  //   console.log("3 allowedRouters", allowedRouters(to.path));
  //   next();
  // }
  next();
});

export default router;
