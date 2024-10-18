import styled from "@emotion/styled"
import { FormikErrors } from "formik"

import { colors } from "styles/colors"

interface StyledInputProps {
  $error: string | undefined | FormikErrors<Date>
}

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const InputLabel = styled.label`
  font-size: 16px;
  color: black;
`

const getStyledInputBorder = (
  disabled: boolean | undefined,
  error: string | undefined | FormikErrors<Date>,
) => {
  if (typeof error === "string") {
    return colors.ERROR
  } else if (disabled) {
    return "grey"
  } else {
    return colors.DISABLED
  }
}

export const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  height: 50px;
  border: 1px solid
    ${({ disabled, $error }) => getStyledInputBorder(disabled, $error)};
  border-radius: 4px;
  padding: 12px;
  outline: none;

  &::placeholder {
    color: ${colors.PLACEHOLDER};
    font-size: 16px;
  }
`

export const ErrorContainer = styled.div`
  color: ${colors.ERROR};
  font-size: 18px;
`
