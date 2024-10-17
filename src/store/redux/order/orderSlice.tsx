import { createAppSlice } from "store/createAppSlice"
import {
  OrderSliceState,
  confirmOrder,
  OrderObject,
  updateOrder,
} from "./types"
import axiosConfig from "../../../../axiosConfig"
import { PayloadAction } from "@reduxjs/toolkit"

const orderInitialState: OrderSliceState = {
  currentOrder: undefined,
  orders: [],
  ordersAdmin: [],
  error: undefined,
  isPending: false,
}

export const orderSlice = createAppSlice({
  name: "ORDERS",
  initialState: orderInitialState,
  reducers: create => ({
    createOrder: create.asyncThunk(
      async () => {
        const response = await axiosConfig.post(`/api/order`)
        return response.data
      },
      {
        pending: (state: OrderSliceState) => {
          state.error = undefined
          state.isPending = true
        },
        fulfilled: (state: OrderSliceState, action) => {
          state.isPending = false
          state.currentOrder = action.payload
          // очищать корзину , вызвать на странице где это происходит через диспатч
        },
        rejected: (state: OrderSliceState, action) => {
          state.error = action.error.message
          state.isPending = false
        },
      },
    ),
    confirmOrder: create.asyncThunk(
      async (payload: confirmOrder) => {
        const response = await axiosConfig.put(`/api/order/confirmed`, {
          id: payload.id,
          address: payload.address,
          deliveryTime: payload.deliveryTime,
          paymentMethod: payload.paymentMethod,
        })
        return response.data
      },
      {
        pending: (state: OrderSliceState) => {
          state.error = undefined
          state.isPending = true
        },
        fulfilled: (state: OrderSliceState, action) => {
          state.isPending = false
          if (state.currentOrder) {
            state.currentOrder.address = action.payload.address
            state.currentOrder.deliveryTime = action.payload.deliveryTime
            state.currentOrder.orderStatus = action.payload.orderStatus
            state.currentOrder.paymentMethod = action.payload.paymentMethod
          }
          if (action.payload.payment_url) {
            window.location.href = action.payload.payment_url
          }
        },
        rejected: (state: OrderSliceState, action) => {
          state.error = action.error.message
          state.isPending = false
        },
      },
    ),
    payForOrder: create.asyncThunk(
      async (payload: any) => {
        const response = await axiosConfig.put(
          `/api/order/paid/${payload.id}`,
          {},
        )
        return response.data
      },
      {
        pending: (state: OrderSliceState) => {
          state.error = undefined
          state.isPending = true
        },
        fulfilled: (state: OrderSliceState, action) => {
          state.isPending = false
          if (state.currentOrder) {
            state.currentOrder.orderStatus = action.payload.orderStatus
          }
          if (action.payload.payment_url) {
            window.location.href = action.payload.payment_url
          }
        },
        rejected: (state: OrderSliceState, action) => {
          state.error = action.error.message
          state.isPending = false
        },
      },
    ),
    getOrders: create.asyncThunk(
      async () => {
        const response = await axiosConfig.get(`/api/order/my`)
        return response.data
      },
      {
        pending: (state: OrderSliceState) => {
          state.error = undefined
          state.isPending = true
        },
        fulfilled: (state: OrderSliceState, action) => {
          state.orders = action.payload
          state.isPending = false
        },
        rejected: (state: OrderSliceState, action) => {
          state.error = action.error.message
          state.isPending = false
        },
      },
    ),
    getOrdersAdmin: create.asyncThunk(
      async () => {
        const response = await axiosConfig.get(`/api/order`)
        return response.data
      },
      {
        pending: (state: OrderSliceState) => {
          state.error = undefined
          state.isPending = true
        },
        fulfilled: (state: OrderSliceState, action) => {
          state.ordersAdmin = action.payload
          state.isPending = false
        },
        rejected: (state: OrderSliceState, action) => {
          state.error = action.error.message
          state.isPending = false
        },
      },
    ),
    putToCurrentOrder: create.reducer((state: OrderSliceState, action: PayloadAction< OrderObject>)=> 
    {state.currentOrder = action.payload }
    ),
    // updateOrder: create.asyncThunk(
    //   async (payload: updateOrder) => {
    //     const response = await axiosConfig.put(
    //       `/api/orders/${payload.orderId}`,
    //       {
    //         orderStatus: payload.orderStatus,
    //       },
    //     )
    //     return response.data
    //   },
    //   {
    //     pending: (state: OrderSliceState) => {
    //       state.error = undefined
    //       state.isPending = true
    //     },
    //     fulfilled: (state: OrderSliceState, action) => {
    //       state.currentOrder = action.payload
    //       state.isPending = false
    //     },
    //     rejected: (state: OrderSliceState, action) => {
    //       state.error = action.error.message
    //       state.isPending = false
    //     },
    //   },
    // ),
    cancelOrder: create.asyncThunk(
      async (orderId: number) => {
        const response = await axiosConfig.post(`/api/order/${orderId}/cancel`)
        return response.data
      },
      {
        pending: (state: OrderSliceState) => {
          state.error = undefined
          state.isPending = true
        },
        fulfilled: (state: OrderSliceState, action) => {
          state.isPending = false
          if (state.orders.some(o => o.id === action.payload.id)) {
            state.orders = state.orders.map(o =>
              o.id === action.payload.productId
                ? action.payload.orderStatus
                : o,
            )
          }
        },
        rejected: (state: OrderSliceState, action) => {
          state.error = action.error.message
          state.isPending = false
        },
      },
    ),
  }),
  selectors: {
    orderState: (state: OrderSliceState) => state,
  },
})

export const orderAction = orderSlice.actions
export const orderSelector = orderSlice.selectors
