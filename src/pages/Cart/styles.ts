import styled from "@emotion/styled"
import { globalPageStyles } from "styles/GlobalStyles"

export const PageWrapper = styled.div`
  ${globalPageStyles}
  padding: 30px 0px 40px 80px;
  justify-content: center;
  gap: 40px;
`

export const CartItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const TotalAmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 0;
  justify-content: center;
  gap: 30px;
  padding: 20px ;
  margin-top: 60px;
  width: 300px;
  height: 200px;
  background-color: white;
  border-radius: 30px;
`
export const Amount = styled.h3``
export const Text = styled.p``
export const PriceContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 10px;
`
export const LoginMistakeContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
gap: 20px;
`
export const GoBackButtonWrapper = styled.div`
  display: flex;
 flex-direction: column;
 justify-content: flex-end;
`