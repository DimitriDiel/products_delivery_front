import { useDispatch } from "react-redux"
import { useState, useRef } from "react"
import { AppDispatch } from "store/store"
import { ToastContainer, toast } from "react-toastify"

import { useFormik } from "formik"
import * as Yup from "yup"

import ButtonMain from "components/ButtonMain/ButtonMain"
import Input from "components/Input/Input"
import InputHidden from "components/InputHidden/InputHidden"
import GoBackArrowButton from "components/GoBackArrowButton/GoBackArrowButton"
import ProgressCircle from "components/ProgressCircle/ProgressCircle"

import {
  InputContainer,
  ButtonContainer,
  PageWrapper,
  AddProductContainer,
  PageName,
  ImgUploadButtonContainer,
  ImgCodeContainer,
  UploadedImg,
  GoBackButtonWrapper,
  NameAndFormWrapper,
} from "./styles"
import {
  oneProductAction,
  oneProductSelectors,
} from "store/redux/oneProduct/oneProductSlice"
import { useAppSelector } from "store/hooks"


function AddProductAdmin() {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedImg, setSelectedImg] = useState<never | null | any>(null) // выбранная картинка на фронтэнде
  const [imgId, setImgId] = useState<string>() // ID картинки для создания карточки
  const { error, isPending } = useAppSelector(oneProductSelectors.productState)
  const notifyRejected = () =>
    toast.error(error, {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    })
  const notifyFulfilled = () =>
    toast.success("Product was successfully added to data base", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    })
  const notifyImgNotSelected = () =>
    toast.warn("Image was not selected", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    })
  const quanityRegExp = /^[0-9.]+(\s?(g|kg|ml|l))$/

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(2, "Title should contain minimum 2 symbols")
      .max(64, "Title should contain maximum 64 symbols"),
    price: Yup.number()
      .required("Price field is required")
      .min(0.1, "Price cant be less then 0,1€"),
    productCode: Yup.string()
      .required("Product code field is required")
      .min(2, "Product code should contain minimum 2 symbols")
      .max(32, "Product code should contain maximum 32 symbols"),
    minQuantity: Yup.string()
      .required("Quantity field is required")
      .matches(
        quanityRegExp,
        "Quantity field must contain a number followed by a valid unit (g, kg, ml, l).",
      ),
    description: Yup.string()
      .required("Description is required")
      .max(255, "Description should contain maximum 255 symbols"),
  })

  const formik = useFormik({
    initialValues: {
      title: "",
      price: 0,
      productCode: "",
      minQuantity: "",
      description: "",
    },
    validationSchema,
    validateOnChange: false,

    onSubmit: async (values, helpers) => {
      const dispatchResult = await dispatch(
        oneProductAction.addProductToDB({
          title: values.title,
          price: values.price,
          productCode: values.productCode,
          minQuantity: values.minQuantity,
          description: values.description,
          photoLink: imgId,
        }),
      )

      if (oneProductAction.addProductToDB.fulfilled.match(dispatchResult)) {
        helpers.resetForm()
        setImgId("")
        notifyFulfilled()
      }

      if (oneProductAction.addProductToDB.rejected.match(dispatchResult)) {
        notifyRejected()
      }
    },
  })

  // НИЖЕ ЛОГИКА ДЛЯ ЗАГРУЗКИ ФОТО НА СЕРВЕР
  const photoLink: string = `/api/files/download/${imgId}`

  //! вместо any было ChangeEvent<HTMLInputElement>
  const handleChangeImg = (event: any) => {
    setSelectedImg(event.target.files[0])
  }

  // для того чтобы при клике на кнопку открывался инпут для файла сразу
  const filePicker = useRef<HTMLInputElement>(null)
  const handlePick = () => {
    {
      filePicker.current && filePicker.current.click()
    }
  }

  const handleImgUpload = async () => {
    // если картинка не выбрана, то выйдет алерт
    if (!selectedImg) {
      notifyImgNotSelected()
      return
    }

    // способ как загружаются картинки на сайт (вроде не работает с axios)
    const formData = new FormData()
    formData.append("file", selectedImg)

    try {
      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`)
      }

      // для получения кода картинки
      const imgNumber: string = await res.text() // тут лежит верный код картнки
      setImgId(imgNumber)
    } catch (error: any) {
      console.error(error)
    }
    setSelectedImg(null)
  }

  return (
    <PageWrapper>
     
      <GoBackButtonWrapper>
        <GoBackArrowButton />
      </GoBackButtonWrapper>
      <NameAndFormWrapper>
         <ToastContainer />
        <PageName>Add NEW product</PageName>

        {isPending ? (
          <ProgressCircle />
        ) : (
          <>
            <AddProductContainer onSubmit={formik.handleSubmit}>
              <InputContainer>
                <Input
                  id="title-id"
                  name="title"
                  type="text"
                  label="Title*"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.errors.title}
                />
                <Input
                  id="price-id"
                  name="price"
                  type="number"
                  label="Price*"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.errors.price}
                />
                <Input
                  id="product-code-id"
                  name="productCode"
                  type="text"
                  label="Product code*"
                  value={formik.values.productCode}
                  onChange={formik.handleChange}
                  error={formik.errors.productCode}
                />
                <Input
                  id="min-quantity-id"
                  name="minQuantity"
                  type="text"
                  label="Quantity*"
                  value={formik.values.minQuantity}
                  onChange={formik.handleChange}
                  error={formik.errors.minQuantity}
                />
                <Input
                  id="description-id"
                  name="description"
                  type="text"
                  label="Description*"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.errors.description}
                />
                <ImgUploadButtonContainer>
                  <ButtonMain
                    onClick={handlePick}
                    buttonName=" 1 - Choose img"
                  ></ButtonMain>
                  <InputHidden
                    type="file"
                    onChange={handleChangeImg}
                    accept="image/*,.png,.jpg,.bmp,.gif"
                    $ref={filePicker}
                  />
                  <ButtonMain
                    onClick={handleImgUpload}
                    buttonName="2 - Upload img"
                  ></ButtonMain>
                </ImgUploadButtonContainer>
                <ImgCodeContainer>
                  {selectedImg && <p>{selectedImg.name}</p>}
                  {imgId && <p>Изображение успешно загружено!</p>}
                  {imgId && <UploadedImg alt="" src={photoLink} />}
                </ImgCodeContainer>
              </InputContainer>
              <ButtonContainer>
                <ButtonMain
                  disabled={!formik.dirty || formik.isSubmitting}
                  buttonName="Add product to DB"
                  type="submit"
                />
              </ButtonContainer>
            </AddProductContainer>
          </>
        )}
      </NameAndFormWrapper>
      <div></div>
    </PageWrapper>
  )
}

export default AddProductAdmin
