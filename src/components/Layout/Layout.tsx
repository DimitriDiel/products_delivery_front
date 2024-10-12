import {
  Footer,
  CompanyInfoContainer,
  LayoutWrapper,
  Logo,
  Main,
  NavigationContainer,
  CompanyInfo,
  NavLinkStyled,
  FooterLogoContainer,
  HeaderLogoContainer,
  HeaderMainPaige,
  HeaderSimplePage,
} from "./styles"
import logoWhite from "assets/logo-white.png"
import userWhite from "assets/user-white.png"
import cartWhite from "assets/shopping-cart-white.png"
import userGreen from "assets/user-green.png"
import cartGreen from "assets/shopping-cart-green.png"
import { LayoutProps } from "./types"
import LinkHeaderCustomized from "components/LinkHeaderIcon/LinkHeaderCustomized"
import { useMatch } from "react-router-dom"

import Badge, { BadgeProps } from "@mui/material/Badge"
import { styled } from "@mui/material/styles"
import { useAppDispatch, useAppSelector } from "store/hooks"
import { cartActions, cartSelectors } from "store/redux/cart/cartSlice"
import { useEffect } from "react"
import { productsAction } from "store/redux/allProducts/allProductsSlice"
import { userAuthSelectors } from "store/redux/users/userAuthSlice"
import CarouselMui from "components/Carousel/Carousel"

function Layout({ children }: LayoutProps) {
  const match = useMatch("/")

  const { allProductsFromCart } = useAppSelector(cartSelectors.cartState)
  const { currentUser } = useAppSelector(userAuthSelectors.userAuthState)

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: -20,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }))

  // вынести в useEffect
  // или сделать отдельное свойство в стейте корзины
  let totalQuantity: number = 0

  if (currentUser) {
    for (let i = 0; i <= allProductsFromCart.length - 1; i++) {
      totalQuantity = totalQuantity + allProductsFromCart[i].productQuantity
    }
  }

  const header = () => {
    return (
      <>
        <HeaderLogoContainer>
          <NavLinkStyled to="/">
            <Logo src={logoWhite} />
          </NavLinkStyled>
        </HeaderLogoContainer>
        <NavigationContainer>
          <LinkHeaderCustomized to="/add-product" linkText="add Product" />
          <LinkHeaderCustomized to="/all-users" linkText="all Users" />
          <LinkHeaderCustomized to="/all-products-admin" linkText="all products" />
          <LinkHeaderCustomized to="/orders" linkText="orders" />
          <LinkHeaderCustomized to="/order-form" linkText="order form" />
          <LinkHeaderCustomized
            to="/user-profile"
            whiteImg={userWhite}
            greenImg={userGreen}
          />
          <LinkHeaderCustomized
            to="/cart"
            whiteImg={cartWhite}
            greenImg={cartGreen}
          >
            <StyledBadge
              badgeContent={totalQuantity}
              color="error"
            ></StyledBadge>
          </LinkHeaderCustomized>
        </NavigationContainer>
        {/* <CarouselMui /> */}
      </>
    )
  }

  return (
    <LayoutWrapper>
      {match ? (
        <HeaderMainPaige>{header()}</HeaderMainPaige>
      ) : (
        <HeaderSimplePage>{header()}</HeaderSimplePage>
      )}
      <Main>{children}</Main>
      <Footer>
        <CompanyInfoContainer>
          <CompanyInfo>foodNOW GmbH</CompanyInfo>
          <CompanyInfo>foodNOW@gmail.com</CompanyInfo>
          <CompanyInfo>+49 175 456 76 45</CompanyInfo>
          <CompanyInfo>Hauptstr. 1, 10827 Berlin, Deutchland</CompanyInfo>
        </CompanyInfoContainer>

        <NavLinkStyled to="/">
          <FooterLogoContainer>
            <Logo src={logoWhite} />
          </FooterLogoContainer>
        </NavLinkStyled>
      </Footer>
    </LayoutWrapper>
  )
}

export default Layout
