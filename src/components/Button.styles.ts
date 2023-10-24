import styled, { css } from 'styled-components'

export type ButtonVariantColor = 'primary' | 'secondary' | 'danger' | 'sucess'

interface ButtonContainerProps {
    variant: ButtonVariantColor
}

const buttonVariants = {
    primary: 'purple',
    secondary: 'orange',
    danger: 'red',
    sucess: 'green'
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;

  ${props => css`background-color: ${buttonVariants[props.variant]}`}
`