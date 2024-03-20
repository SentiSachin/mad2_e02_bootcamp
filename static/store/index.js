const store = new Vuex.Store({
    state: {
    //   products: [],
    //   categories: [],
    //   notifications: [],
    //   managers: [],
    //   cart: [],
    //   orders: [],
    currentSongId:'',
      isAuthenticated:'',
    },
    getters: {
    //   getProducts: (state) => state.products,
    //   getCategories: (state) => state.categories,
    //   getNotifications: (state) => state.notifications,
    //   getManagers: (state) => state.managers,
    //   getCart: (state) => state.cart,
    //   getOrders: (state) => state.orders,
      getAuthenticatedUser: (state) => state.isAuthenticated,
    //   getTotalAmount: (state) => {
    //     return state.cart.reduce((total, cart) => total + cart.quantity * cart.rpu, 0);
    //   },
    },
    mutations: {
      setCurrentSongId: (state, id) => {
        state.currentSongId = id;
      },
      setAuthenticatedUser: (state, user) => {
        state.isAuthenticated = user;
      }
      // ... Repeat similar mutations for other arrays (cart, orders, notifications, categories)
    },
    actions: {
    async fetchAuthUser({ commit }) {
      try {
        const response = await fetch('http://127.0.0.1:5000/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          console.log(data, "categories fetched")
          commit('setAuthenticatedUser', true);
        } else {
          const data = await response.json();
          commit('setAuthenticatedUser', false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  });
  export default store;